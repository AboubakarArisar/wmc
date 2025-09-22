# Requirements & Features

- **Date**: 2025-09-22

## Goals

- Build and preview the dashboard locally
- Generate production files in `dist/`
- Keep pages modular using partials (header, footer, etc.)

## Functional Features (current)

- Charts: ApexCharts, Chart.js, ECharts, JustGage, TUI Chart
- Tables: Simple-DataTables, editable tables
- Forms: validation, wizard, editors (Quill), uploads (Uppy)
- Maps: Google, Leaflet, Vector maps
- UI: alerts, badges, buttons, cards, modals, tabs, sliders, toasts
- Apps: calendar, chat, kanban/projects, profile, pricing, blogs
- Auth pages: login, register, lock screen, recover password
- Integrations: Firebase, Stripe

## Non-Functional Requirements

- Use Gulp 4 syntax
- Source in `src/`, build to `dist/`
- Use autoprefixer and minification for CSS
- Prefer ES modules for new code going forward

## Build & Run

- Development: `npm run dev` (starts local server + watch)
- Production build: `npm run build` (outputs to `dist/`)

## Business Rules

- Do not edit compiled files in `dist/`; change source in `src/`
- Keep assets under `src/assets/` and reference via relative paths
- Shared HTML belongs in `src/partials/` and included via file-include

## Edge Cases & Notes

- If SCSS fails to compile, check for syntax errors; Gulp will log them
- If live reload doesn’t trigger, ensure files are saved under `src/`
- HTML includes must not be placed inside `src/partials/` themselves when building final pages; include them from `src/*.html`
- CSS autoprefixing and minification are applied during build; dev CSS is unminified with sourcemaps
- Some pages depend on third-party libs; ensure they are installed in `node_modules/` and copied to `dist/assets/libs`
