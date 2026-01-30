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

Docs-only checks:
- `vale sync`: Install Vale styles configured in `.vale.ini`.
- `git diff --name-only | xargs vale --glob='!blog/*'`: Lint changed docs (matches CI’s “added lines” behavior closely).

## Coding Style & Naming Conventions

- Indentation: 2 spaces; newlines: LF (see `.editorconfig`).
- Docs: prefer `.mdx`; name new pages `kebab-case.mdx`, and use `index.mdx` for section landing pages.
- Keep long examples in `code_samples/` and reference them from docs instead of duplicating.

## Testing Guidelines

- There is no dedicated unit test runner; CI primarily validates `npm run build` and Vale.
- If you touch `docs/getting-started/` Docker Compose instructions, sanity-check them locally when feasible.

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits as seen in history: `feat(docs): …`, `fix(docs): …`, `chore(deps): …`.
- PRs should include: a clear summary, linked issue/ticket when applicable, and screenshots for layout/theme changes.
- Generated content: treat `docs/OpenAPI-clients/` as derived output; prefer updating `specs/` via `npm run update-vendored-yaml`.
- CODEOWNERS: changes to `package.json` / `package-lock.json` require review from `@opentdf/security` in addition to maintainers.
