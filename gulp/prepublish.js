import gulp from "gulp";

import "./test";
import "./lint";
import "./dist-clean";
import "./doc";
import "./dist-test";

gulp.task(
  "prepublish",
  gulp.series("test", gulp.parallel("lint", "dist-clean", "doc"), "dist-test")
);
