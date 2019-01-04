var gulp = require('gulp');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var paths = {
  files: './src/assets/img/**/*.png',
  filesDest: './src/assets/img/',
};

gulp.task('files', function() {
  'use strict';

  // Minify all images
  return gulp.src(paths.files, {base: './src/assets/img'})
    .pipe(imagemin({
    use: [pngquant({
      quality: '60-70',
      posterize: 128,
      verbose: true
    })]
  }))
  .pipe(gulp.dest(paths.filesDest));
});

gulp.task('default', ['files']);
