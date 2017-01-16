'use strict';
var gulp = require('gulp');
var autoprefix = require('gulp-autoprefixer');
var browserslist = require('browserslist');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');

var supported_browsers = browserslist('last 4 versions, > 1%, not ie <= 9');

function logBrowserSupport(browsers) {
  console.info('\nVendor prefixes will be applied for the following browsers:\n\n', browsers.join('\n'));
}
var supportedBrowsersWereLogged = false;

gulp.task('styles:demo', function () {
  return gulp.src('demo/sass/*')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('demo'));
});

gulp.task('styles:dist', function () {
  if (!supportedBrowsersWereLogged) {
    logBrowserSupport(supported_browsers);
  }

  return gulp.src('src/flexboxgrid.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    // .pipe(autoprefix(supported_browsers)) // disable during dev
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task("clean", () => {
  return del([
    "./dist"
  ]);
});

gulp.task('watch', ['styles:demo', 'styles:dist'], function () {
  gulp.watch('*.scss', ['styles:dist']);
  gulp.watch('demo/sass/*.scss', ['styles:demo']);
});

gulp.task('default', function () {
  gulp.start('watch');
});
