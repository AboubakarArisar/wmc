# Requirements & Features

- Date: 2025-10-01

## Functional Requirements
- Build from `src/` to `dist/`
- Process SCSS to CSS with PostCSS (autoprefixer + cssnano)
- Process HTML partials via file-include
- Copy vendor libraries to `dist/assets/libs`
- Minify JS and CSS for production
- Live reload development server

## Non-Functional Requirements
- Gulp 4 tasks using async functions and exports
- ES Modules in the build system
- Prefer arrow functions and readable task composition

## Edge Cases
- Missing `package-lock.json` should not break clean step
- HTML includes must exclude partials and `dist/` files
- SCSS tasks must not re-process icons/bootstrap in main app task 