var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var bsync = require('browser-sync');

var paths = {
	styles: {
		src: 'src/scss/*.scss',
		dest: 'dist/css/'
	},
	scripts: {
		src: 'src/js/**/*.js',
		dest: 'dist/js/'
	}
};

// Remove previous build
function clean() {
	return del(['dist/']);
}

// Convert Sass/SCSS files to CSS, minify them, and move them to dist
function styles() {
	return gulp.src(paths.styles.src)
	.pipe(sass())
	.pipe(cleanCSS())
	.pipe(rename({basename: 'main',suffix: '.min'}))
	.pipe(gulp.dest(paths.styles.dest));
}

// Compress .js files to min.js files and move minified files to distribution directory
function scripts() {
  return gulp.src(['./src/js/jquery.js', paths.scripts.src], {sourcemaps: true})
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Sync browser with project
gulp.task('server', function(done) {
     bSync({server: {baseDir: ['./']}})
     done();
})

// Gulp watcher for realtime changes
function watch() {
	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.styles.src, styles);
	gulp.watch('./*.html').on('changes', bsync.reload);
}

// Generate tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

var build = gulp.series(clean, gulp.parallel(styles, scripts));

gulp.task('build', build);
gulp.task('default', gulp.series(clean, build, watch));
