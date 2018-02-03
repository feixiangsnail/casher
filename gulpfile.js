var gulp = require("gulp"),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var jsFiles = [
    "src/assets/js/jquery162.js",
    "src/assets/js/vue.js",
    "src/assets/js/axios.js",
    "src/assets/js/pos_cd.js",
    "src/assets/js/routermix.js",
];
gulp.task("packjs", function() {
    gulp.src(jsFiles).
    pipe(uglify()).
    pipe(concat("cashPack2.js")).
    pipe(gulp.dest("./src/assets/js"))
})

gulp.task('default', ['packjs'])