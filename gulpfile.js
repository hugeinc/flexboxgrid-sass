/*global -$ */
'use strict';
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    jade = require('jade'),
    gulpJade = require('gulp-jade');

jade.filters.code = function( block ) {
    return block
        .replace( /&/g, '&amp;' )
        .replace( /</g, '&lt;' )
        .replace( />/g, '&gt;' )
        .replace( /"/g, '&quot;' );
};

gulp.task('jade', function () {
  return gulp.src('./*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('./demo/'));
});

gulp.task('styles', function () {
  return gulp.src('source/sass/*')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.', 'bower_components'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('demo'));
});

gulp.task('clean', require('del').bind(null, ['demo']));

gulp.task('watch', ['jade', 'styles'], function () {
  // watch for changes
  gulp.watch('*.jade', ['jade']);
  gulp.watch('source/sass/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('source/sass/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('demo'));
});

gulp.task('default', function () {
  gulp.start('watch');
});
