# Technical Specifications

- **Date**: 2025-09-22

## Tech Stack
- HTML5, SCSS, JavaScript (ES5/ES6)
- Build tool: Gulp 4
- Dev server: BrowserSync
- Libraries: Bootstrap 5, ApexCharts, Chart.js, ECharts, Leaflet, Quill, Uppy, etc.

## Project Structure
- Source: `src/`
- Output: `dist/`
- SCSS: `src/assets/scss/` → `dist/assets/css/`
- JS: `src/assets/js/` → `dist/assets/js/`
- HTML pages: `src/*.html` built with includes from `src/partials/`
- Third-party libs: copied from `node_modules/` to `dist/assets/libs/`

## Gulp Tasks (current)
- `scss`: compile app SCSS with sourcemaps, autoprefixer, minify via clean-css
- `bootstrap`: compile Bootstrap SCSS with sourcemaps, autoprefixer, minify via clean-css
- `icons`: compile icon SCSS, minify
- `js`: uglify main JS files
- `jsPages`: uglify per-page JS files
- `fileinclude`/`html`: process HTML includes, replace `node_modules` refs, concatenate, minify CSS/JS in HTML via useref/cssnano/uglify
- `copy:all`: copy non-processed assets to `dist/`
- `copy:libs`: copy 3rd-party libraries to `dist/assets/libs`
- `clean:*`: remove `dist/` and `package-lock.json`
- `browsersync` + `watch`: local server and live reload
- `default`: dev pipeline; `build`: production pipeline

## Workspace Rules Compliance
- **Gulp 4 syntax**: using `gulp.task` with series/parallel (OK for Gulp 4; consider moving to exported functions later)
- **Source in `src/`, output in `dist/`**: satisfied
- **ES modules over CommonJS**: gulpfile uses CommonJS (acceptable for Node build script); app JS currently ES5/ES6 mix
- **CSS autoprefixer + cssnano**: autoprefixer present; minification via clean-css and cssnano in `html` task (OK)
- **Arrow functions over inline anonymous**: could be improved in gulpfile for readability

## How to Run
- Development: `npm run dev`
- Production build: `npm run build`
- Output is in `dist/`; deploy `dist/` to static hosting

## Risks / Gaps
- `gulp.task` API is fine, but migrating to exported async functions could modernize style
- Ensure all pages that reference `node_modules` assets are covered by `html` task replacements
- Maintain library versions in `package.json` to avoid breaking changes 