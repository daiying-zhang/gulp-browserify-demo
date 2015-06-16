'use strice';

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var md5 = require('gulp-md5');
var hogan = require('browserify-hogan');
var notify = require('gulp-notify');
var del = require('del');

// 常用变量
var JS_PATH = 'src/scripts/**/index.js';
var JS_OUT_PATH = 'src/scripts/release/*.js';
var CSS_PATH = 'src/styles/**/*.css';
var CSS_OUT_PATH = 'src/styles/release/*.css';

// Add Space for log
gulp.task('space', function(){
    console.log('\n');
    console.log('==============================================================');
});

// Lint Task
gulp.task('lint', function(){
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    var browserified = transform(function(filename) {
        console.log('[log] 正在处理文件:' + filename);
        var b = browserify(filename);
        return b.bundle();
    });

    del(['dev/scripts/*', 'prd/scripts/*'], function(){
        gulp.src(JS_OUT_PATH)
            // 依赖管理
            .pipe(browserified)
            // 错误处理
            //.on('error', errorHandel)
            // 生成dev版本文件
            .pipe(gulp.dest('dev/scripts'))
            //.pipe(notify('dev文件生成完毕!'))
            // 压缩文件
            .pipe(uglify())
            // 添加版本号
            .pipe(md5({
                size: 16
            }))
            // 生成prd版本文件
            .pipe(gulp.dest('prd/scripts'))
            .pipe(notify('scripts 文件处理完毕!'));
    })
});

var importCss = require('gulp-import-css');
var minifyCss = require('gulp-minify-css');
gulp.task('styles', function () {
    del(['dev/styles/*', 'prd/styles/*'], function(){
        gulp.src(CSS_OUT_PATH)
          .pipe(importCss())
          .pipe(gulp.dest('dev/styles'))
          .pipe(minifyCss({compatibility: 'ie8'}))
          .pipe(md5({
              size:16
          }))
          .pipe(gulp.dest('prd/styles'))
          .pipe(notify('styles 文件处理完毕!'));
    })
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch([
        //"src/scripts/**/*.js",
        //"src/styles/**/*.css"
        "src/**/*"
    ], [
        'space',
        'lint',
        'scripts',
        'styles'
    ]);
});

// Default Task
gulp.task('default', [
    // 'space',
    //'lint',
    'scripts',
    'styles',
    'watch'
]);

// function errorHandel(err){
//     console.log('error ...', err.message);
//     err.stream.pipe(notify(err.message))
// }
