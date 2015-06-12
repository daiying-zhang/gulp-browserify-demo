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

// 常用变量
var JS_PATH = 'src/scripts/**/index.js';
var JS_OUT_PATH = 'src/scripts/release/*.js';
var CSS_PATH = 'src/styles/**/*.scss';

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

    return gulp.src(JS_OUT_PATH)
        // 依赖管理
        .pipe(browserified)
        // 错误处理
        //.on('error', errorHandel)
        // 生成dev版本文件
        .pipe(gulp.dest('dev'))
        //.pipe(notify('dev文件生成完毕!'))
        // 压缩文件
        .pipe(uglify())
        // 添加版本号
        .pipe(md5({
            size: 16
        }))
        // 生成prd版本文件
        .pipe(gulp.dest('prd'))
        //.pipe(notify('prd文件生成完毕!'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch([
        "src/scripts/**/*.js",
        "src/styles/**/*.js"
    ], ['space', 'lint', 'scripts']);
});

// Default Task
gulp.task('default', [
    // 'space',
    'lint',
    'scripts',
    'watch'
]);

// function errorHandel(err){
//     console.log('error ...', err.message);
//     err.stream.pipe(notify(err.message))
// }
