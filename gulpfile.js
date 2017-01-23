var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssmin = require('gulp-clean-css');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var bs = require('browser-sync').create();
var seq = require('run-sequence');


// TODO: Implement unCSS, CSSO, and Critical


/* Commands To Use */
// $ gulp ::: runs bsync, scss->css, css->min.css, js->min.js, and gulp watcher
// $ gulp minify-images ::: optimizes various image files
// $ gulp fonts ::: copies and moves fonts from src to public for deployment


// Acts as quasi-main file - simply call $ gulp
// TODO: Choose default implementation
gulp.task('default', ['bsync', 'sass', 'minify-css', 'minify-js', 'watch']);

gulp.task('default', function(callback) {
	seq('bsync', 'sass', ['minify-css', 'minify-js'], 'watch', callback);
});


// Convert Sass/SCSS files to CSS
gulp.task('sass', function(){
	return gulp.src("src/scss/*")
	.pipe(sass()) // Converts Sass to CSS with gulp-sass
	.pipe(gulp.dest("src/css"))
	.pipe(bsync.reload({stream: true}));
});


// Compress .css files to min.css files and move minified files to distribution directory
gulp.task('minify-css', function(){
	return gulp.src("src/css")
	.pipe(cssmin())
	.pip(rename({suffix: ".min"}))
	.pipe(gulp.dest("dist/css")
	.pipe(bsync.reload({stream: true}));
});


// Compress .js files to min.js files and move minified files to distribution directory
gulp.task('minify-jss', function(){
	return gulp.src("src/js")
	.pipe(concat("app.js"))
	.pipe(gulp.dest("dist"))
 	.pipe(uglify())
    	.pipe(rename({suffix: ".min"}))
    	.pipe(gulp.dest("dist/js"));
	.pipe(bsync.reload({stream: true}));
});


// Optimize .png, .jpg, .jpeg, and .gif files
gulp.task('minify-images', function(){
  return gulp.src('public/*.+(png|jpg|jpeg|gif)')
  .pipe(imagemin())
  .pipe(gulp.dest('public/img'))
});


// Sync browser with project
gulp.task('bsync', function() {
  bsync.init({
    server: {
      baseDir: "./"
    },
  })
});


// Copy font files from source to public
gulp.task('fonts', function() {
  return gulp.src("src/fonts/*")
  .pipe(gulp.dest("public/fonts"))
})


// Gulp watcher for realtime changes
gulp.task('watch', function() {
        gulp.watch("src/scss/*", ['sass']);
	gulp.watch("src/css/*", ['minify-css']);
	gulp.watch("src/js/*", ['minify-js']);
        gulp.watch("*.html").on('change', bsync.reload);
});

