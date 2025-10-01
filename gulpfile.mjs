import browsersyncLib from 'browser-sync';
import cached from 'gulp-cached';
import del from 'del';
import fileinclude from 'gulp-file-include';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import npmdist from 'gulp-npm-dist';
import replace from 'gulp-replace';
import uglify from 'gulp-uglify';
import useref from 'gulp-useref-plus';
import rename from 'gulp-rename';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const browsersync = browsersyncLib.create();
const sass = gulpSass(dartSass);

const paths = {
  base: {
    base: { dir: './' },
    node: { dir: './node_modules' },
    packageLock: { files: './package-lock.json' },
  },
  dist: {
    base: { dir: './dist', files: './dist/**/*' },
    libs: { dir: './dist/assets/libs' },
    css: { dir: './dist/assets/css' },
    js: { dir: './dist/assets/js', files: './dist/assets/js/pages' },
  },
  src: {
    base: { dir: './src', files: './src/**/*' },
    css: { dir: './src/assets/css', files: './src/assets/css/**/*' },
    html: { dir: './src', files: './src/**/*.html' },
    img: { dir: './src/assets/images', files: './src/assets/images/**/*' },
    js: { dir: './src/assets/js', pages: './src/assets/js/pages', files: './src/assets/js/pages/*.js', main: './src/assets/js/*.js' },
    partials: { dir: './src/partials', files: './src/partials/**/*' },
    scss: {
      dir: './src/assets/scss',
      files: './src/assets/scss/**/*',
      icons: './src/assets/scss/icons.scss',
      main: './src/assets/scss/app**.scss',
      bootstrap: './src/assets/scss/bootstrap**.scss',
    },
  },
};

export const browsersyncTask = (callback) => {
  browsersync.init({
    server: { baseDir: [paths.dist.base.dir, paths.src.base.dir, paths.base.base.dir] },
  });
  callback();
};

export const browsersyncReload = (callback) => {
  browsersync.reload();
  callback();
};

export const watch = () => {
  gulp.watch(paths.src.js.dir, gulp.series(js, browsersyncReload));
  gulp.watch(paths.src.js.pages, gulp.series(jsPages, browsersyncReload));
  gulp.watch(paths.src.scss.icons, gulp.series(icons, browsersyncReload));
  gulp.watch([paths.src.html.files, paths.src.partials.files], gulp.series(fileincludeTask, browsersyncReload));
  gulp.watch([paths.src.scss.bootstrap, '!' + paths.src.scss.main, '!' + paths.src.scss.icons], gulp.series(bootstrap, browsersyncReload));
  gulp.watch([paths.src.scss.files, '!' + paths.src.scss.bootstrap, '!' + paths.src.scss.icons], gulp.series(scss, bootstrap, browsersyncReload));
};

export const js = () => gulp.src(paths.src.js.main).pipe(uglify()).pipe(gulp.dest(paths.dist.js.dir));

export const jsPages = () => gulp.src(paths.src.js.files).pipe(uglify()).pipe(gulp.dest(paths.dist.js.files));

const postcssPlugins = [autoprefixer(), cssnano({ preset: 'default' })];

export const scss = () =>
  gulp
    .src([paths.src.scss.main, '!' + paths.src.scss.bootstrap, '!' + paths.src.scss.icons])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css.dir));

export const bootstrap = () =>
  gulp
    .src([paths.src.scss.bootstrap, '!' + paths.src.scss.main, '!' + paths.src.scss.icons])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css.dir));

export const icons = () =>
  gulp
    .src(paths.src.scss.icons)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.dist.css.dir));

export const fileincludeTask = () =>
  gulp
    .src([paths.src.html.files, '!' + paths.dist.base.files, '!' + paths.src.partials.files])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true,
      })
    )
    .pipe(cached())
    .pipe(gulp.dest(paths.dist.base.dir));

export const cleanPackageLock = (callback) => {
  del.sync(paths.base.packageLock.files);
  callback();
};

export const cleanDist = (callback) => {
  del.sync(paths.dist.base.dir);
  callback();
};

export const copyAll = () =>
  gulp
    .src([
      paths.src.base.files,
      '!' + paths.src.partials.dir,
      '!' + paths.src.partials.files,
      '!' + paths.src.scss.dir,
      '!' + paths.src.scss.files,
      '!' + paths.src.js.dir,
      '!' + paths.src.js.files,
      '!' + paths.src.js.main,
      '!' + paths.src.html.files,
    ])
    .pipe(gulp.dest(paths.dist.base.dir));

export const copyLibs = () =>
  gulp
    .src(npmdist(), { base: paths.base.node.dir })
    .pipe(
      rename((path) => {
        path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
      })
    )
    .pipe(gulp.dest(paths.dist.libs.dir));

export const html = () =>
  gulp
    .src([paths.src.html.files, '!' + paths.dist.base.files, '!' + paths.src.partials.files])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true,
      })
    )
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1assets/libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1assets/libs'))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', postcss([cssnano({ preset: 'default' }) ])))
    .pipe(gulp.dest(paths.dist.base.dir));

export const dev = gulp.series(
  gulp.parallel(cleanPackageLock, copyAll, copyLibs, fileincludeTask, scss, bootstrap, icons, js, jsPages, html),
  gulp.parallel(browsersyncTask, watch)
);

export const build = gulp.series(
  gulp.parallel(cleanPackageLock, copyAll, copyLibs, fileincludeTask, scss, bootstrap, icons, js, jsPages, html)
);

export default dev; 