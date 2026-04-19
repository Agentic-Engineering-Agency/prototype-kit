# /prototype-from-docs

Turn product documentation into a running React + shadcn/ui prototype.

## Steps

### 1. Read product docs

Check if a `docs/` directory exists in the current working directory.

- If it exists: read all files inside it (markdown, PDFs, images).
- If it does not exist: ask the user to either (a) create a `docs/` folder with their product documentation, or (b) paste the relevant sections directly into the chat.

Summarize what you found in 2–3 sentences before proceeding.

### 2. Ask targeted clarifying questions

Before touching any code, ask the user these questions (all at once, numbered):

1. **Primary user persona** — Who is the main person using this product? (e.g., "college student submitting assignments", "restaurant owner managing inventory")
2. **Three must-have screens** — Which three views or flows must exist for the prototype to be demonstrable? (e.g., "login, dashboard, and invoice creation")
3. **Brand vibe** — Pick two adjectives that describe the visual tone. (e.g., "minimal and authoritative", "playful and energetic", "dark and technical")
4. **Live data or mocked?** — Does the demo need real API calls, or is hardcoded/mocked data fine?
5. **Any existing assets?** — Are there existing logos, color hex codes, or design files I should match?

Wait for the user's answers before continuing.

### 3. Bootstrap the starter (if needed)

Check whether a `package.json` with a `"dev"` script and `tailwindcss` in dependencies already exists.

If it does **not** exist:
- Copy the contents of `templates/starter/` from this kit into the project root (or into a `prototype/` subdirectory if the project root already has an unrelated package.json).
- Run `npm install` inside that directory.
- Confirm the dev server would start correctly by checking `vite.config.ts` and `src/main.tsx`.

If it does exist, check whether `@shadcn/ui` or equivalent is configured. If not, run `npx shadcn@latest init -y` to initialize.

### 4. Install required components via shadcn MCP

Based on the screens identified in step 2, use the shadcn MCP (tool: `shadcn`) to identify and install the components needed. Typical installs:

```
npx shadcn@latest add button card input label dialog tabs table badge
```

For hero or landing sections, check Magic UI (`@magicui` registry) for animated components.
For data-dense views (tables, filters, forms with many fields), check Origin UI (`@originui` registry).

Install via:
```
npx shadcn@latest add @magicui/<component-name>
npx shadcn@latest add @originui/<component-name>
```

### 5. Generate the screens as routes

Create one React route per must-have screen. Use React Router v7 if not already present (`npm install react-router`).

Route naming convention:
- `src/routes/` directory
- Files named after the screen (e.g., `dashboard.tsx`, `invoice-create.tsx`)
- A root layout at `src/routes/root.tsx` with navigation

Apply the frontend-design skill guidelines:
- Commit to the brand vibe the user specified
- Dark mode first
- Use the shadcn primitives for interactive elements
- Use plausible copy in the user's target language (default: Spanish if working in a Mexican-market context, English otherwise)
- No Lorem ipsum. No center-gradient blobs. No default Tailwind blue buttons.

### 6. Verify render with Playwright MCP

Once routes are in place:
1. Instruct the user to run `npm run dev` in the prototype directory and confirm it starts on `http://localhost:5173` (or the port Vite reports).
2. Use the Playwright MCP to navigate to `http://localhost:5173` and take a screenshot of the main route.
3. Navigate to each of the three must-have screens and take a screenshot.
4. Report any console errors or render failures found.

If the dev server is not running, remind the user to start it and retry step 6.

### 7. Report back

Deliver a checklist the user can use for their demo:

```
Demo Checklist
--------------
[ ] Dev server running: npm run dev (in prototype/)
[ ] Screen 1: [name] — http://localhost:5173/[path]
[ ] Screen 2: [name] — http://localhost:5173/[path]
[ ] Screen 3: [name] — http://localhost:5173/[path]
[ ] Mocked data: [describe what is mocked]
[ ] Known gaps: [list anything not implemented]
```

Also list the installed shadcn/Magic UI/Origin UI components so the user knows what they have available.
