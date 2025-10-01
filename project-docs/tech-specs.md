# Technical Specifications

- Date: 2025-10-01

## Tech Stack
- Frontend assets in `src/`, output in `dist/`
- Gulp 4 build system using ES Modules (`gulpfile.mjs`)
- Sass (dart-sass) for SCSS
- PostCSS with `autoprefixer` and `cssnano`
- BrowserSync for development server

## Build Commands
- Development: `pnpm dev` (runs `gulp` default: build + serve + watch)
- Production build: `pnpm build` (runs `gulp build`)

## Task Details
- `scss`, `bootstrap`, `icons`: compile SCSS, autoprefix, write non-minified, then cssnano to `.min.css` with sourcemaps
- `js`, `jsPages`: uglify/minify JavaScript into `dist/assets/js`
- `fileincludeTask`, `html`: process HTML includes, replace node_modules asset paths, minify CSS and JS in useref blocks
- `copyLibs`: copy distributable files from `node_modules` to `dist/assets/libs`
- `copyAll`: copy non-processed assets from `src/` to `dist/`
- `serve`: start BrowserSync on `dist/`

## Project Structure
- Source: `src/` (html, partials, assets/js, assets/scss, assets/images)
- Output: `dist/` mirrored structure with compiled assets

## Coding Standards
- Use arrow functions for tasks
- Avoid inline anonymous functions in complex pipes
- Keep tasks composable and small

## Browser Support
- `browserslist` from `package.json`: last 2 versions, >2% 