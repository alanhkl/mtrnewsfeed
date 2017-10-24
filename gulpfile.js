// REQUIRE
var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var ssi = require('browsersync-ssi');
var runSequence = require('run-sequence');
var fs = require('fs');
// var watchify = require('watchify');
// var browserify = require('browserify');
var path = require('path');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

const dir_vendor = "mtr_inapp/lib/vendor/";
const dir_plugin = "mtr_inapp/lib/plugin/";

gulp.task('serve', ['sass', 'js', 'html'], function() {
    browserSync({
        server: {
            baseDir: './',
            middleware: [ssi({
                baseDir: __dirname + '/',
                ext: '.html'
            })]
        },
        socket: {
            domain: 'localhost:3000'
        },
        open: true,
        startPath: '',
        notify: false,
        watchTask: true,
        timestamps: true,
        debugInfo: true,
        ghostMode: {

            scroll: true
        }
    });
    gulp.watch("src/**/*.json", ['watch:js']);
    gulp.watch("src/**/js/**/*.js", ['watch:js']);
    gulp.watch("src/**/css/**/*.scss", ['watch:sass']);
    gulp.watch("src/**/*.html", ['watch:html']);
});

gulp.task('watch', ['watch:sass', 'watch:js', 'watch:html']);

gulp.task('watch:js', ['js', 'data'], function(done) {

    browserSync.reload();
    done();
});

gulp.task('watch:html', ['html'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('images', function() {
    gulp.src('src/mtr_inapp/images/**/*.{png,jpg,jpeg,svg,gif,JPG}')

        .pipe(gulp.dest('./mtr_inapp/images'));
    browserSync.reload();
});

gulp.task('bootstrap', function() {
    gulp.src('src/mtr_inapp/images/**/*.{png,jpg,jpeg,gif}')

        .pipe(gulp.dest('./mtr_inapp/images'));
    browserSync.reload();
});
gulp.task('css', function() {
    return gulp.src('src/mtr_inapp/css/**/*')
        .pipe(gulp.dest('./mtr_inapp/css'));
});
gulp.task('sass', function() {
    return gulp.src('src/mtr_inapp/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }).on(
            'error', sass.logError
        ))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                '> 5%',
                'Android 2.3',
                'Android >= 4',
                'Chrome >= 20',
                'Explorer >= 8',
                'Firefox >= 17',
                'iOS >= 6',
                'Opera >= 12',
                'Safari >= 5'
            ]
        }))
        .pipe(sourcemaps.write('../css'))
        .pipe(gulp.dest('./mtr_inapp/css'))

});
gulp.task('watch:sass', ['sass'], function(done) {

    browserSync.reload();
    done();
});

gulp.task('fonts', function() {
    return gulp.src('src/mtr_inapp/fonts/**/*')
        .pipe(gulp.dest('./mtr_inapp/fonts'));
});

gulp.task('media', function() {
    return gulp.src('src/mtr_inapp/media/**/*')
        .pipe(gulp.dest('./mtr_inapp/media'));
});

gulp.task('vendor', function() {
    return gulp.src(['src/mtr_inapp/lib/vendor/**/*'])
        .pipe(gulp.dest(dir_vendor));
});

gulp.task('plugin', function() {
    return gulp.src(['src/mtr_inapp/lib/plugin/**/*'])
        .pipe(gulp.dest(dir_plugin));
});

gulp.task('app', function() {

    return gulp.src('src/mtr_inapp/js/**/*')
        .pipe(gulp.dest('./mtr_inapp/js'));
});
gulp.task('data', function() {

    return gulp.src(['src/**/*.json'])
        .pipe(gulp.dest('./'));
});
gulp.task('js', function() {
    return runSequence('data', 'vendor', 'plugin', 'app');

});

gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./'));
});

// DEFAULT
gulp.task('default', ['watch']);