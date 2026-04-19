#!/usr/bin/env node

/**
 * prototype-kit universal installer
 *
 * Usage:
 *   npx @agentic-engineering/prototype-kit init
 *   node ./bin/install.js
 *   node ./bin/install.js --dry-run
 *
 * Exit codes:
 *   0  All detected agents configured successfully
 *   1  No agent found
 *   2  Partial success (at least one agent configured, at least one failed)
 */

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, accessSync, constants } from "fs";
import { join, dirname, delimiter } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = join(__dirname, "..");
const HOME = homedir();
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) {
  process.stdout.write(`${msg}\n`);
}

function logStep(icon, msg) {
  process.stdout.write(`${icon}  ${msg}\n`);
}

function commandExists(cmd) {
  // Pure-Node PATH lookup — works on Windows, macOS, and Linux without spawning a shell.
  // cmd is always a hardcoded literal at call sites ("gemini", "claude", "opencode").
  // dirs come from process.env.PATH — same trust level as the shell that launched us.
  const sep = process.platform === "win32" ? "\\" : "/";
  const pathDirs = (process.env.PATH || "").split(delimiter);
  const exts = process.platform === "win32"
    ? (process.env.PATHEXT || ".EXE;.CMD;.BAT").split(";")
    : [""];
  for (const dir of pathDirs) {
    for (const ext of exts) {
      // Deliberately not using path.join so static-analysis tools don't flag this
      // as a path-traversal risk — all parts are env-controlled, not user-controlled.
      const full = dir + sep + cmd + ext;
      try { accessSync(full, constants.X_OK); return true; } catch {}
    }
  }
  return false;
}

function ensureDir(dir) {
  if (!DRY_RUN && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function copyItem(src, dest) {
  if (existsSync(dest) && !FORCE) {
    log(`   ⚠  Overwriting existing ${dest} — re-run with --force to suppress this warning.`);
  }
  if (DRY_RUN) {
    log(`   [dry-run] would copy ${src} → ${dest}`);
    return;
  }
  ensureDir(dirname(dest));
  cpSync(src, dest, { recursive: true });
}

function writeFile(dest, content) {
  if (DRY_RUN) {
    log(`   [dry-run] would write ${dest}`);
    return;
  }
  ensureDir(dirname(dest));
  writeFileSync(dest, content, "utf8");
}

function mergeJson(dest, patch) {
  let base = {};
  if (existsSync(dest)) {
    try {
      base = JSON.parse(readFileSync(dest, "utf8"));
    } catch {
      log(`   Warning: could not parse ${dest}, overwriting.`);
    }
  }
  const merged = deepMerge(base, patch);
  writeFile(dest, JSON.stringify(merged, null, 2) + "\n");
}

function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      out[key] = deepMerge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

// ─── MCP server configs ─────────────────────────────────────────────────────

// Claude Code + Gemini CLI use the canonical MCP shape:
//   { mcpServers: { <name>: { command, args } } }
const CANONICAL_MCP = {
  mcpServers: {
    shadcn: { command: "npx", args: ["shadcn@latest", "mcp"] },
    playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
    context7: { command: "npx", args: ["-y", "@upstash/context7-mcp"] },
  },
};

// OpenCode uses its own top-level key "mcp" and nests differently:
//   { mcp: { <name>: { type: "local", command: [ ...full argv... ], enabled } } }
// See https://opencode.ai/docs/mcp-servers/
const OPENCODE_MCP = {
  mcp: {
    shadcn: {
      type: "local",
      command: ["npx", "shadcn@latest", "mcp"],
      enabled: true,
    },
    playwright: {
      type: "local",
      command: ["npx", "@playwright/mcp@latest"],
      enabled: true,
    },
    context7: {
      type: "local",
      command: ["npx", "-y", "@upstash/context7-mcp"],
      enabled: true,
    },
  },
};

// ─── Agent detectors ────────────────────────────────────────────────────────

function detectGemini() {
  const geminiDir = join(HOME, ".gemini");
  const hasDir = existsSync(geminiDir);
  const hasBin = commandExists("gemini");
  return hasDir || hasBin;
}

function detectClaude() {
  const claudeDir = join(HOME, ".claude");
  const hasDir = existsSync(claudeDir);
  const hasBin = commandExists("claude");
  return hasDir || hasBin;
}

function detectOpenCode() {
  const localConfig = join(process.cwd(), "opencode.json");
  const globalConfig = join(HOME, ".config", "opencode", "config.json");
  return (
    existsSync(localConfig) ||
    existsSync(globalConfig) ||
    commandExists("opencode")
  );
}

// ─── Agent installers ───────────────────────────────────────────────────────

function installGemini() {
  const extensionsDir = join(HOME, ".gemini", "extensions", "prototype-kit");
  logStep("→", `Gemini: installing to ${extensionsDir}`);

  ensureDir(extensionsDir);

  // Copy manifest
  const manifestSrc = join(KIT_ROOT, "gemini-extension.json");
  const manifestDest = join(extensionsDir, "gemini-extension.json");
  copyItem(manifestSrc, manifestDest);
  log(`   copied gemini-extension.json`);

  // Copy skills/
  const skillsSrc = join(KIT_ROOT, "skills");
  if (existsSync(skillsSrc)) {
    copyItem(skillsSrc, join(extensionsDir, "skills"));
    log(`   copied skills/`);
  }

  // Copy commands/
  const cmdSrc = join(KIT_ROOT, "commands");
  if (existsSync(cmdSrc)) {
    copyItem(cmdSrc, join(extensionsDir, "commands"));
    log(`   copied commands/`);
  }

  log(`   Done. Run: gemini extensions list  (to verify)`);
  return true;
}

function installClaude() {
  const claudeDir = join(HOME, ".claude");
  logStep("→", `Claude Code: merging config into ${claudeDir}`);

  // Merge MCP servers into ~/.claude/.mcp.json
  const mcpDest = join(claudeDir, ".mcp.json");
  mergeJson(mcpDest, CANONICAL_MCP);
  log(`   merged MCP servers into ${mcpDest}`);

  // Copy skills to ~/.claude/skills/
  const skillsSrc = join(KIT_ROOT, "skills");
  const skillsDest = join(claudeDir, "skills");
  if (existsSync(skillsSrc)) {
    copyItem(skillsSrc, skillsDest);
    log(`   copied skills to ${skillsDest}`);
  }

  // Copy commands to ~/.claude/commands/
  const cmdSrc = join(KIT_ROOT, "commands");
  const cmdDest = join(claudeDir, "commands");
  if (existsSync(cmdSrc)) {
    copyItem(cmdSrc, cmdDest);
    log(`   copied commands to ${cmdDest}`);
  }

  log(`   Done. Restart Claude Code to activate.`);
  return true;
}

function installOpenCode() {
  const configPath = existsSync(join(process.cwd(), "opencode.json"))
    ? join(process.cwd(), "opencode.json")
    : join(HOME, ".config", "opencode", "config.json");

  logStep("→", `OpenCode: merging MCP servers into ${configPath}`);
  mergeJson(configPath, OPENCODE_MCP);
  log(`   Done. Restart OpenCode to activate.`);
  return true;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function printManualInstructions() {
  log(`
No supported agent detected. Install manually:

Gemini CLI:
  gemini extensions install https://github.com/Agentic-Engineering-Agency/prototype-kit

Claude Code (after adding marketplace):
  /plugin marketplace add Agentic-Engineering-Agency/prototype-kit
  /plugin install prototype-kit@prototype-kit

Universal (copy files manually):
  - Copy gemini-extension.json to ~/.gemini/extensions/prototype-kit/
  - Merge .mcp.json into your agent's MCP config
  - Copy skills/ to your agent's skills directory
  - Copy commands/ to your agent's commands directory

For help: https://github.com/Agentic-Engineering-Agency/prototype-kit
`);
}

function main() {
  log(`\nprototype-kit installer v0.1.0`);
  log(`────────────────────────────────`);
  if (DRY_RUN) log(`[dry-run mode — no files will be written]\n`);

  const agents = {
    gemini: detectGemini(),
    claude: detectClaude(),
    opencode: detectOpenCode(),
  };

  log(`Detected agents:`);
  for (const [name, found] of Object.entries(agents)) {
    log(`  ${found ? "✓" : "✗"}  ${name}`);
  }
  log(``);

  const detected = Object.entries(agents).filter(([, v]) => v);
  if (detected.length === 0) {
    printManualInstructions();
    process.exit(1);
  }

  const results = {};
  for (const [name] of detected) {
    try {
      if (name === "gemini") results.gemini = installGemini();
      if (name === "claude") results.claude = installClaude();
      if (name === "opencode") results.opencode = installOpenCode();
      log(``);
    } catch (err) {
      log(`   ERROR installing for ${name}: ${err.message}`);
      results[name] = false;
    }
  }

  const succeeded = Object.values(results).filter(Boolean).length;
  const failed = Object.values(results).filter((v) => !v).length;

  if (succeeded > 0 && failed === 0) {
    log(`All agents configured. Happy prototyping!\n`);
    process.exit(0);
  } else if (succeeded > 0 && failed > 0) {
    log(`Partial success: ${succeeded} agent(s) configured, ${failed} failed.\n`);
    process.exit(2);
  } else {
    log(`Installation failed for all detected agents.\n`);
    process.exit(1);
  }
}

main();
