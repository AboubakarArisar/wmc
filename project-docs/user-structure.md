# User Flow & Project Structure

- Date: 2025-10-01

## User Flow
1. Developer runs `pnpm dev`
2. Gulp builds assets to `dist/` and starts BrowserSync
3. Developer edits files under `src/`; BrowserSync reloads on changes
4. For production, run `pnpm build` to generate optimized `dist/`

## Project Structure
- `src/`: source HTML pages, partials, SCSS, JS, images
- `dist/`: compiled site served in development and deployable to static hosting
- `gulpfile.mjs`: Gulp tasks in ES Module format
- `package.json`: scripts, dependencies, browserslist
- `project-docs/`: documentation 