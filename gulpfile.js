'use strice';

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var hogan = require('browserify-hogan');
var notify = require('gulp-notify');
var del = require('del');
// var hash = require('gulp-hash');

// 常用变量
var JS_PATH = 'src/scripts/**/index.js';
var JS_OUT_PATH = 'src/scripts/release/*.js';

var CSS_PATH = 'src/styles/**/*.css';
var CSS_OUT_PATH = 'src/styles/release/*.css';

// Add Space for log
gulp.task('space', function() {
    console.log('\n');
    console.log(
        '=============================================================='
    );
});

// Lint Task
gulp.task('lint', function() {
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

    del(['dev/scripts/*', 'prd/scripts/*'], function() {
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
            .pipe(notify('scripts 文件处理完毕!'));
    })
});

var importCss = require('gulp-import-css');
var minifyCss = require('gulp-minify-css');
gulp.task('styles', function() {
    del(['dev/styles/*', 'prd/styles/*'], function() {
        gulp.src(CSS_OUT_PATH)
            .pipe(importCss())
            .pipe(gulp.dest('dev/styles'))
            .pipe(minifyCss({
                compatibility: 'ie8'
            }))
            .pipe(notify('styles 文件处理完毕!'));
    })
});

var RevAll = require('gulp-rev-all');
gulp.task('version', function() {
    var revAll = new RevAll({
        transformFilename: function(file, hash) {
            var path = require('path')
            var ext = path.extname(file.path);
            return path.basename(file.path, ext) + '_' +
                hash + ext;
        }
    });
    gulp.src(['dev/**/*.js','dev/**/*.css'], {'base': 'dev'})
        .pipe(revAll.revision())
        .pipe(gulp.dest('prd'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('ver'));

});

var revReplace = require("gulp-rev-replace");
gulp.task("revreplace", function() {
    var manifest = gulp.src("ver/rev-manifest.json");

    return gulp.src("src/**/*.html")
        .pipe(revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest('prd'));
});

var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');
//使用connect启动一个Web服务器
gulp.task('connect', function() {
    connect.server({
        root: './',
        //livereload: false,
        middleware: function() {
            return [
                modRewrite([
                    // 将prd的中带版本号的文件指向dev
                    '^/prd/(.*)(_\\w+)\\.(js|css)$ /prd/$1$2.$3 [L]',
                    '^/prd/(.*)\\.(js|css)$ /dev/$1.$2 [L]',
                    //'/prd/(.*)(_\w+)\.(js|css)$ /dev/$1.$3 [L]',
                    //'^/prd/(.*)\.(js|css)$ /dev/$1.$2 [L]',
                    '^/todos/api/(.*)$ /src/data/$1.json [L]'
                ])
            ];
        }
    });
});

// gulp.task('html', function () {
//     gulp.src('./src/**/*.html')
//         .pipe(connect.reload());
// });

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch([
        //"src/scripts/**/*.js",
        //"src/styles/**/*.css"
        "src/**/*"
    ], [
        'space',
        //'lint',
        'scripts',
        'styles',
        //'version',
        //'revreplace'
        //'html'
    ]);
});

// Default Task
gulp.task('default', [
    // 'space',
    //'lint',
    //'connect',
    'scripts',
    'styles',
    'watch',
    //'version',
    //'revreplace'
    //'html'
]);

gulp.task('release', [
    'version',
    'revreplace'
])

// function errorHandel(err){
//     console.log('error ...', err.message);
//     err.stream.pipe(notify(err.message))
// }
