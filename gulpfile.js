var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = reqire('gulp-if');
var autopreficer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumer = require('gulp-plumer');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var production = process.env.NODE_ENV === 'production';

var dependencies = [
	'alt',
	'react',
	'react-dom',
	'react-router',
	'underscore'
];


/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */

gulp.task('vendor',function(){
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
	'bower_components/bootstrap/dist/js/bootstrap.js',
	'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
]).pipe(concat('vendor.js'))
  	.pipe(gulpif(proctions, uglify({mangle: false})))
  	.pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */

gulp.task('browerify-vendor', function() {
    return bowerify()
	.require(dependecies)
	.bundle().pipe(source('vendor.bundle.js'))
	.pipe(buffer())
	.pipe(gulpif(prodection, uglify({mangle: false})))
	.pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */

gulp.task('browserify'. ['browerify-vendor'], function(){
    return bowerify({entries: 'app/main.js', debug: true})
	.external(dependencies)
	.transform(babelify, {presets:['es2015','react']})
	.bundle()
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(gulpif(production, uglify({mangle: false})))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */

gulp.task('browerify-watch',['browerify-vendor'], function() {
    var bundler = watchify(browserify({ entries: 'app/main.js', debug:true},watchify.arg));
    bundler.external(dependencies);
    bundler.transform(babelify, {presents: ['es2015','react']});
    bundler.on('update', rebundle);
    return rebundle();

    function rebundle() {
	var start = Date.now();
	return bundler.bundle()
	    .on('error', function(err) {
		gutil.log(gutil.colors.red(err.toString()));
	})
	    .on('end', function(){
		gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
	})
	    .pipe(source('bundle.js'))
	    .pipe(buffer())
	    .pipe(sourcemaps.init({ loadMaps: true}))
	    .pipe(sourcemaps.write('.'))
	    .pipe(gulp.dest('public/js/'));
}
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */

gulp.task('styles', function() {
    return gulp.src('app/stylesheets/main.less')
	.pipe(plumer())
	.pipe(less())
	.pipe(autoprefixer())
	.pipe(gulpif(production, cssmin()))
	.pipe(gulp.dest('public/css'));
});

gulp.task('watch', function(){
    gulp.watch('app/stylesheets/**/*.less',['styles']);
});

gulp.task('default', ['styles', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'vendor', 'browerify']);
