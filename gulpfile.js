'use strice';

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var transform = require('vinyl-transform');

// 常用变量
var JS_PATH = 'src/scripts/**/index.js';
var CSS_PATH = 'src/styles/**/*.scss';

// Lint Task
gulp.task('lint', function(){
    return gulp.src(JS_PATH)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(JS_PATH)
        // 依赖管理
        .pipe(browserified)
        // 生成dev版本文件
        .pipe(gulp.dest('dev'))
        // 压缩文件
        .pipe(uglify())
        // 生成prd版本文件
        .pipe(gulp.dest('prd'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch(JS_PATH, ['lint', 'scripts']);
    gulp.watch(["src/scripts/**/*.js", "src/styles/**/*.js"], ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
