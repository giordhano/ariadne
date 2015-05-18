// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean'); // Deletes the content in specific directories 

var sass = require('gulp-sass');
var jade = require('gulp-jade');


var gif = require('gulp-if'),
    concat = require('gulp-concat'), 
    replace = require('gulp-replace'),
    resources = require('gulp-resources');


// Compilar SASS Y JADE 

gulp.task('sass', function(){
      gulp.src('./app/css/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./app/css/'));

})


gulp.task('jade', function() {

      var YOUR_LOCALS = {};

      gulp.src('./app/**/*.jade')
        .pipe(jade({
          locals: YOUR_LOCALS,
          pretty : true
        }))
        .pipe(gulp.dest('./app/'))
});


gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./production/'))
});


gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./production/'))
});



gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('production/bower_components'));
});


gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('production/'));
});



gulp.task('clean', function() {
    gulp.src('./production/*')
      .pipe(clean({force: true, read: false}));
});


gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});


 
gulp.task('compile_app', function () {
    return gulp.src('./template.html')
        .pipe(resources())
        .pipe(gif('**/*.js', concat('app.js')))
        .pipe(gif('**/*.js', uglify()))
        .pipe(gif('**/*.html', replace(/<!--compile_startjs-->[^]+<!--compile_endjs-->/, '<script src="js/all.js"></script>')))
        .pipe(gulp.dest('./tmp'));
});


gulp.task('default',
  ['sass', 'jade']
);


gulp.task('production',
  ['sass', 'jade', 'clean', 'minify-js', 'minify-css', 'copy-bower-components', 'copy-html-files' ]
);