import gulp from "gulp";

import "./test";
import "./dist-clean";
import "./dist-test";

gulp.task("prepublish", gulp.series("test", "dist-clean", "dist-test"));
