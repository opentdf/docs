# Repository Guidelines

## Project Structure & Module Organization

- `docs/`: Documentation content in Markdown/MDX (for example `docs/getting-started/index.mdx`).
- `src/`: Docusaurus site code (React/TypeScript), including OpenAPI tooling in `src/openapi/`.
- `specs/`: Vendored OpenAPI YAML files (inputs to generated API docs).
- `static/`: Images and other static assets served as-is.
- `blog/`, `code_samples/`: Blog posts and reusable examples/snippets.

## Build, Test, and Development Commands

- `nvm use`: Use the Node version from `.nvmrc` (CI uses Node 22).
- `npm ci`: Install dependencies from `package-lock.json`.
- `npm run start`: Run the local Docusaurus dev server.
- `npm run build`: Full build (runs `check-vendored-yaml`, generates OpenAPI docs, then builds to `build/`).
- `npm run gen-api-docs-all`: Generate OpenAPI docs (writes under `docs/OpenAPI-clients/` when present/needed).
- `npm run check-vendored-yaml`: Verify vendored OpenAPI YAML matches upstream.
- `npm run update-vendored-yaml`: Refresh vendored specs in `specs/` from upstream.

Preview deployment:
- Deploy to preview using pattern: `surge build opentdf-docs-preview-<ticket>.surge.sh`
- Extract ticket number from branch name (e.g., branch `feat/dspx-2416` → `opentdf-docs-preview-dspx-2416.surge.sh`)

Docs-only checks:
- `vale sync`: Install Vale styles configured in `.vale.ini`.
- `git diff --name-only | xargs vale --glob='!blog/*'`: Lint changed docs (matches CI's "added lines" behavior closely).

## Coding Style & Naming Conventions

- Indentation: 2 spaces; newlines: LF (see `.editorconfig`).
- Docs: prefer `.mdx`; name new pages `kebab-case.mdx`, and use `index.mdx` for section landing pages.
- Keep long examples in `code_samples/` and reference them from docs instead of duplicating.

## Testing Guidelines

CI runs the following tests:

- **BATS tests**: Shell script tests in `tests/quickstart.bats` validate quickstart scripts on Ubuntu, macOS, and Windows
- **Shellcheck**: Lints shell scripts in `static/quickstart/` (check.sh, install.sh)
- **Docker Compose stack test**: Verifies the platform starts successfully on Ubuntu (triggered by changes to `docs/getting-started/`, `static/quickstart/`, or `tests/`)
- **Build validation**: `npm run build` must complete successfully
- **Vale linting**: Documentation prose style checks (run locally with `git diff --name-only | xargs vale --glob='!blog/*'`)

If you modify quickstart scripts or Docker Compose instructions:
- Run shellcheck locally: `shellcheck static/quickstart/check.sh static/quickstart/install.sh`
- Run BATS tests if available: `bats tests/quickstart.bats`
- Test the Docker Compose stack if feasible: Follow steps in `docs/getting-started/quickstart.mdx`

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits as seen in history: `feat(docs): …`, `fix(docs): …`, `chore(deps): …`.
- PRs should include: a clear summary, linked issue/ticket when applicable, and screenshots for layout/theme changes.
- Generated content: treat `docs/OpenAPI-clients/` as derived output; prefer updating `specs/` via `npm run update-vendored-yaml`.
- CODEOWNERS: changes to `package.json` / `package-lock.json` require review from `@opentdf/security` in addition to maintainers.
