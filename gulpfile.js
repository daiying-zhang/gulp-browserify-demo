'use strice';

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 常用变量
var JS_PATH = 'src/scripts/**/*.js';
var CSS_PATH = 'src/styles/**/*.scss';

// Lint Task
gulp.task('lint', function(){
    return gulp.src(JS_PATH)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(JS_PATH)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(JS_PATH, ['lint', 'scripts']);
    gulp.watch(CSS_PATH, ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
