import gulp from "gulp";
import { usePlumbedGulpSrc } from "plumb-gulp";
import autoreload from "autoreload-gulp";

import "./gulp/build";
import "./gulp/clean";
import "./gulp/test";
import "./gulp/watch";
import "./gulp/tdd";
import "./gulp/lint";
import "./gulp/dist-build";
import "./gulp/dist-clean";
import "./gulp/dist-test";
import "./gulp/doc";
import "./gulp/prepublish";
import "./gulp/types";

usePlumbedGulpSrc();

gulp.task("default", autoreload("tdd"));
