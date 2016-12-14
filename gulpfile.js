/***
***Commands***
--gulp watch: to compile code and start the node process with a watch on changes to the code
--gulp: to compile code and get ready for deployment
***/

var gulp = require('gulp'),
ts = require('gulp-typescript'),
merge = require('merge2'),
clean = require('gulp-clean'),
ava = require('gulp-ava'),
runSequence = require('run-sequence'),
tsProject = ts.createProject('tsconfig.json'),
spawn = require('child_process').spawn, node;

gulp.task('clean', function(){
  return gulp.src('release', {read: false})
    .pipe(clean());
});
gulp.task('copy', ['clean'], function(){
  gulp.src('package.json').pipe(gulp.dest('release'));
});
gulp.task('compile', ['copy'], function() {
    var tsResult = gulp.src([
        "./src/**/*.ts",
        "./typings/**/*.d.ts",
        "!./node_modules/**/*.ts"
    ]).pipe(ts(tsProject));

	return merge([ // Merge output streams if nesissary
    tsResult.js.pipe(gulp.dest('release'))
	]);
});

gulp.task('server', ['compile'], function() {
  if (node) node.kill()
  node = spawn('node', ['release/run.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

gulp.task('watch', ['server'], function() {
    gulp.watch('./src/**/*.ts', ['server']);
});

gulp.task('test', () => {
  return gulp.src('tests/*.js').pipe(ava());
});

gulp.task('default', function() {
  //This kind of sucks all tests have to be run after compile because ava does not understand typescript
   runSequence( 'compile', 'test' );
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})
