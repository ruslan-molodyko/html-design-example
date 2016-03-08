/**
 * Created by admin on 04.03.2016.
 */
var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    livereload = require('gulp-livereload'),
    express = require('express'),
    serverport = 5000;

//We only configure the server here and start it only when running the watch task
var server = express();
server.use(express.static('./public'));

gulp.task('serve', function() {
    server.listen(serverport);
    livereload.listen();
});

gulp.task('scripts', function() {
    // Path to endpoint javascript file
    return browserify('src/script/index.js')
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('public/script'))
        .pipe(livereload());
});

gulp.task('styles', function() {
    gulp.src(['src/stylus/build.styl'])
        .pipe(stylus({compress : false}).on('error', function (err) {
            console.log(err);
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(livereload());
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {};
    gulp.src('./src/jade/pages/**/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }).on('error', function (err) {
            console.log(err);
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(livereload());
});

gulp.task('default', ['serve', 'scripts', 'styles', 'jade'], function() {
    gulp.watch('src/script/**/**.js', ['scripts']);
    gulp.watch('src/stylus/**/*', ['styles']);
    gulp.watch('src/jade/**/*', ['jade']);
});
