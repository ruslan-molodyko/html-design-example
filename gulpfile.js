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
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    wiredep = require('wiredep').stream,
    serverport = 5000;

//We only configure the server here and start it only when running the watch task
var server = express();
server.use(express.static('./public'));

gulp.task('serve', function() {
    server.listen(serverport);
    livereload.listen();
});

gulp.task('bower', ['jade'], function () {
    gulp.src('./public/**/*.html')
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest('./public'))
        .pipe(livereload());
});

gulp.task('scripts', function() {
    // Path to endpoint javascript file
    return browserify('src/script/index.js')
        .bundle()
        .pipe(source('all.js')).on('error', function (err) {
            console.log(err);
        })
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

gulp.task('jade', function(cb) {
    var YOUR_LOCALS = {};
    gulp.src('./src/jade/pages/**/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }).on('error', function (err) {
            console.log(err);
        }))
        .pipe(gulp.dest('./public/'))
        .on('end', cb);
});

gulp.task('image', function () {
    gulp.src('./src/image/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
        }))
        .pipe(gulp.dest('./public/assets/image'));
});

gulp.task('fonts', function() {
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./src/assets/fonts'));
});

gulp.task('css', function() {
    gulp.src('./src/css/**/*')
        .pipe(gulp.dest('./src/assets/css'))
        .pipe(livereload());
});

gulp.task('default', ['serve', 'scripts', 'styles', 'jade', 'image', 'bower'], function() {
    //gulp.watch('src/fonts/**/**', ['fonts']);
    //gulp.watch('src/css/**/**', ['css']);
    gulp.watch('src/image/**/**', ['image']);
    gulp.watch('src/script/**/**.js', ['scripts']);
    gulp.watch('src/stylus/**/*', ['styles']);
    gulp.watch('src/jade/**/*', ['jade', 'bower']);
});
