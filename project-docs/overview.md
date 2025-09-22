# Project Overview

- **Project**: Mifty Admin Template / Dashboard
- **Date**: 2025-09-22

## What is this?

Mifty is a ready-made website for managing data and tools (a dashboard). It includes many sample pages (charts, tables, forms, maps, calendar, chat) that you can use and customize.

## Who is it for?

Anyone who needs an admin dashboard: small businesses, students, or developers who want a quick start.

## What can it do now?

- Show charts with ApexCharts, Chart.js, ECharts, and more
- Display tables, including searchable and editable tables
- Work with forms, uploads, wizards, validation, and editors (Quill)
- Show maps (Google Maps, Leaflet, Vector maps)
- Use a calendar and kanban board
- Include login/register/forgot password pages
- Integrate with Firebase (auth, db) and Stripe (payments)

## How is it built?

- HTML files in `src/` for each page
- SCSS styles compiled to CSS
- JavaScript for pages and services in `src/assets/js/`
- Gulp build system outputs files into `dist/`

## Why Gulp?

Gulp compiles SCSS, minifies CSS/JS, copies assets, builds HTML from partials, and runs a local server with live reload.

## What problems does it solve?

- Saves time by providing many ready-made pages
- Ensures consistent design and structure
- Includes examples of modern libraries ready to use

## What’s next?

- Confirm deployment method (static hosting)
- Add clearer docs for running build and customizing pages
- Validate CSS pipeline (autoprefixer + minification already enabled)
