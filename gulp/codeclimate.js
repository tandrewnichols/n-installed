var gulp = require('gulp');
var codeclimate = require('gulp-codeclimate-reporter');

gulp.task('codeclimate', function() {
  if (process.version.indexOf('v4') > -1) {
    gulp.src('coverage/lcov.info', { read: false })
      .pipe(codeclimate({
        token: '32a912d3bdc82c6bb48c33d484a34005cff0ca1f4e3cde7a5628a066075d5940'
      }));
  }
});

