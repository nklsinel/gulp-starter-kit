const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const scss = require('gulp-sass');
const gulpIf = require('gulp-if');
const sourcemap = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync');
const argv = require('yargs').argv;

const isDevelopment = (argv.production === undefined) ? true : false;

// HTML
const html = () => {
    return gulp.src('src/*.html')
    .pipe(htmlmin({
      useShortDoctype: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      quoteCharacter: '"'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
};

// Scss preprocessor
const styles = () => {
  return gulp.src('src/scss/**/*.scss')
  .pipe(gulpIf(isDevelopment, sourcemap.init()))
  .pipe(gulpIf(!isDevelopment, autoprefixer()))
  .pipe(scss({ outputStyle: 'compressed' }).on('error', scss.logError))
  .pipe(gulpIf(isDevelopment, sourcemap.write()))
  .pipe(gulp.dest('dist'))
  .pipe(sync.stream());
};

// File watch
const watcher = () => {
  gulp.watch('src/*.html', gulp.series(html));
  gulp.watch('src/scss/**/*.scss', gulp.series(styles));
};

// BrowserSync
const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  })
};

// exports
exports.default = gulp.series(
  html,
  styles,
  gulp.parallel(
    watcher,
    server
  )
);
