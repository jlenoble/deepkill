import gulp from "gulp";
import ts from "gulp-typescript";

const srcDir = "src";
const libDir = "lib";
const libGlob = ["src/**/*.ts", "src/**/*.js"];
const tsProject = ts.createProject("tsconfig.json");

const handleTypes = () => {
  const tsResult = gulp
    .src(libGlob, {
      base: srcDir,
      since: gulp.lastRun(handleTypes)
    })
    .pipe(tsProject());

  return tsResult.dts.pipe(gulp.dest(libDir));
};

gulp.task("types", handleTypes);
