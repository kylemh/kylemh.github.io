var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var bsync = require('browser-sync').create();

var paths = {
	styles: {
		src: './src/scss/**/*.{scss,sass,css}',
		dest: './dist/css/'
	},
	scripts: {
		src: './src/js/**/*.js',
		dest: './dist/js/'
	}
};

// Remove previous build
function clean() {
	return del(['dist/']);
}

// Convert Sass/SCSS files to CSS, minify them, and move them to dist
function styles() {
	return gulp.src(['src/scss/bootstrap.css', paths.styles.src])
	.pipe(sass())
	.pipe(concat('main.min.css'))
	.pipe(cleanCSS())
	.pipe(gulp.dest(paths.styles.dest))
	.pipe(bsync.stream())
	bsync.reload;
}

// Compress .js files to min.js files and move minified files to distribution directory
function scripts() {
	return gulp.src(['./src/js/jquery.js', paths.scripts.src], {sourcemaps: true})
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bsync.stream())
    bsync.reload;
}

// Gulp watcher for realtime changes
function watch() {
	bsync.init({
		server: './'
	})

	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.styles.src, styles);
	gulp.watch('*.html').on('change', bsync.reload);
}

// Generate tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

var build = gulp.series(gulp.parallel(styles, scripts));
gulp.task('build', build);
gulp.task('default', gulp.series(clean, build, watch));
