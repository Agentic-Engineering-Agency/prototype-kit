# prototype-kit

Turn your product docs into a running React + shadcn/ui prototype in one agent command.

*Convierte tus documentos de producto en un prototipo React + shadcn/ui funcional con un solo comando.*

---

## Install

### Gemini CLI (recommended — free 1000 req/day)

```bash
gemini extensions install --consent https://github.com/Agentic-Engineering-Agency/prototype-kit
```

The `--consent` flag skips the interactive confirmation prompt so the command works cleanly in scripts and CI. Drop the flag if you prefer to confirm interactively.

### Claude Code

```
/plugin marketplace add Agentic-Engineering-Agency/prototype-kit
/plugin install prototype-kit@prototype-kit
```

### Any agent (universal npx)

```bash
npx @agentic-engineering/prototype-kit init
```

### Via Smithery (multi-agent registry)

```bash
# Coming after initial release — submission pending
npx @smithery/cli install @agentic-engineering/prototype-kit
```

---

## What it installs

| Component | What it does |
|-----------|-------------|
| **shadcn MCP** (`npx shadcn@latest mcp`) | Lets the agent browse, search, and install shadcn/ui components by name — no manual CLI needed |
| **Playwright MCP** (`npx @playwright/mcp@latest`) | Lets the agent open a browser, navigate your dev server, and screenshot each route to verify render |
| **Context7 MCP** (`npx -y @upstash/context7-mcp`) | Gives the agent up-to-date library documentation for React, Vite, Tailwind, shadcn, and more |
| **`frontend-design` skill** | Embedded design principles: typography pairings, dark-mode-first palettes, anti-slop rules, component sourcing priority |
| **`/prototype-from-docs` command** | End-to-end workflow: reads docs, asks 5 questions, bootstraps the starter, installs components, generates routes, verifies render |

---

## Usage

```bash
cd my-project
mkdir docs && cp my-prd.md docs/
# Inside your agent:
/prototype-from-docs          # Gemini
/prototype-kit:prototype-from-docs  # Claude Code (namespaced)
```

Then:

```bash
cd prototype
npm run dev
# open http://localhost:5173
```

### The 7-step workflow

1. Agent reads everything in `docs/`
2. Agent asks 5 clarifying questions (persona, screens, vibe, data, assets)
3. Bootstraps `templates/starter/` if no React project exists
4. Installs shadcn components via the shadcn MCP; sources Magic UI and Origin UI where appropriate
5. Generates one route per must-have screen
6. Uses Playwright MCP to screenshot each route and report errors
7. Returns a demo checklist

---

## Starter template

`templates/starter/` is a minimal Vite + React 19 + TypeScript + Tailwind v4 + shadcn setup. It includes:

- `components.json` seeded with `@magicui` and `@originui` registries
- Dark-mode-first CSS variables in `src/index.css`
- React Router v7 wired in `src/main.tsx`
- Path alias `@/` pointing to `src/`

---

## License

MIT © Agentic Engineering Agency

---

## Instalación y uso (español)

### Instalar

**Gemini CLI (recomendado):**

```bash
gemini extensions install --consent https://github.com/Agentic-Engineering-Agency/prototype-kit
```

La bandera `--consent` salta la confirmación interactiva para que el comando corra limpio en scripts o CI. Quítala si prefieres confirmar a mano.

**Claude Code:**

```
/plugin marketplace add Agentic-Engineering-Agency/prototype-kit
/plugin install prototype-kit@prototype-kit
```

**Universal (cualquier agente):**

```bash
npx @agentic-engineering/prototype-kit init
```

### Usar

```bash
cd mi-proyecto
mkdir docs && cp mi-prd.md docs/
# Dentro del agente:
/prototype-from-docs
```

El agente leerá tu documentación, hará 5 preguntas de clarificación y generará un prototipo React funcional con las pantallas principales de tu producto.

### Qué incluye

- **shadcn MCP** — instala componentes de UI por nombre sin abrir la terminal
- **Playwright MCP** — toma capturas de cada pantalla para verificar que todo se renderiza
- **Context7 MCP** — docs actualizadas de React, Vite, Tailwind y shadcn dentro del agente
- **Skill `frontend-design`** — principios de diseño: tipografía, paletas dark-mode, reglas anti-slop
- **Comando `/prototype-from-docs`** — flujo completo de docs a prototipo funcional
