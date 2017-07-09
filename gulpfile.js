var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
//var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var ts = require('gulp-typescript');

gulp.task('compress', function() {
    var tsPro//jectDts = ts.createProject('tsconfig.json', { sortOutput: true });
     var tsResult = gulp.src(['dev/*.js'])
        // .pipe(sourcemaps.init()) // This means sourcemaps will be generated 
        //.pipe(ts(tsProjectDts));

      return tsResult
         //.pipe(concat('lib/js-library.js')) // You can use other plugins that also support gulp-sourcemaps
         //.pipe(uglify()) 
         .pipe(concat('main.js'))
         .pipe(replace(/define.*function.*/g, ''))
         .pipe(replace(/\s\"use strict\";/g, ''))
         .pipe(replace(/.*defineProperty.*/g, ''))
         .pipe(replace(/.*require\(\".*\"\);/g, ''))
         .pipe(replace(/exports.default.*/g, ''))
         .pipe(replace(/^\}\);$/gm, ''))
         //.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
         .pipe(gulp.dest('release/'));
});