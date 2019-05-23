import gulp from "gulp";

import "./test";
import "./lint";
import "./dist-clean";
import "./dist-test";

gulp.task("prepublish", gulp.series("test", "lint", "dist-clean", "dist-test"));
