"use strict";

import autoprefixer from "autoprefixer";
import { create } from "browser-sync";
import cssnano from "cssnano";
import concat from "gulp-concat";
import gulp from "gulp";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import livereload from "gulp-livereload";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import notify from "gulp-notify";

const sass = gulpSass(dartSass);
const browsersync = create({ online: true });
let reload = browsersync.reload;

// == Browser-sync task
gulp.task("browser-sync", function (done) {
  browsersync.init({
    server: "./",
    startPath: "src/index.html",
    host: "localhost",
    port: 4000,
    open: true,
    tunnel: true,
    online: true,
  });
  gulp.watch(["./**/*.html"]).on("change", reload);
  done();
});

// CSS task
gulp.task("css", () => {
  return gulp
    .src("assets/scss/app.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("public/css"))
    .pipe(
      notify({
        message: "main SCSS processed",
      })
    )
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// JS Task

gulp.task("js", () => {
  return gulp
    .src(["assets/js/index.js"])
    .pipe(plumber())
    .pipe(concat("app.js"))
    .pipe(gulp.dest("public/js"))
    .pipe(browsersync.stream())
    .pipe(livereload());
});

gulp.task(
  "default",
  gulp.series("css", "js", "browser-sync", () => {
    livereload.listen();
    gulp.watch(["assets/scss/**/*"], gulp.series("css"));
    gulp.watch(["assets/js/**/*"], gulp.series("js"));
  })
);
