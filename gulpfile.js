var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var babel = require('gulp-babel')
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var del = require('del');
var bsync = require('browser-sync').create();

// TODO: Implement unCSS, CSSO, and Critical

/* Commands To Use */
// $ gulp ::: runs bsync, scss->css, css->min.css, js->min.js, and gulp watcher
// $ gulp minify-images ::: optimizes various image files
// $ gulp fonts ::: copies and moves fonts from src to public for deployment

// Remove previous build
function clean() {
	return del(["dist"])
}

// Convert Sass/SCSS files to CSS, minify them, and move them to dist
function minify_css(){
	return gulp.src("src/scss/*")
	.pipe(sass())
	.pipe(cleanCSS())
	.pipe(rename({basename: "main", suffix: ".min"}))
	.pipe(gulp.dest("dist/css"))
	.pipe(bsync.reload({stream: true}))
};

// Compress .js files to min.js files and move minified files to distribution directory
function minify_js(){
	return gulp.src("src/js")
	.pipe(babeL())
	.pipe(uglify())
	.pipe(concat("main.min.js"))
	.pipe(gulp.dest("dist/js"))
	.pipe(bsync.reload({stream: true}))
};

// Optimize .png, .jpg, .jpeg, and .gif files
function minify_images(){
	return gulp.src("public/*.+(png|jpg|jpeg|gif)")
	.pipe(imagemin())
	.pipe(gulp.dest("public/img"))
};

// Sync browser with project
function bsync() {
	bsync.init({server: {baseDir: "./"},})
};

// Copy font files from source to public
function fonts() {
	return gulp.src("src/fonts/*")
	.pipe(gulp.dest("public/fonts"))
}

// Gulp watcher for realtime changes
function watch() {
    gulp.watch("src/scss/*", minify_css)
	gulp.watch("src/js/*", minify_js)
    gulp.watch("*.html").on('change', bsync.reload)
};

// Task declarations
exports.clean = clean;
exports.minify_css = minify_css;
exports.minify_js = minify_js;
exports.minify_images = minify_images;
exports.bsync = bsync;
exports.fonts = fonts;
exports.watch = watch;

var minify = gulp.parallel(minify_css, minify_js);
var build = gulp.series(clean, bsync, minify, watch);
gulp.task('build', build);
gulp.task('default', build);
