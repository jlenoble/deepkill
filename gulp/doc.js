import gulp from "gulp";
import md from "markdown-include";
import replace from "gulp-replace";
import rename from "gulp-rename";
import wrap from "gulp-wrap";
import babel from "gulp-babel";

const docConf = "markdown.json";
const examplesGlob = ["docs/examples/**/*.ts", "docs/examples/**/*.js"];
const buildDir = "build";

md.includePattern = /^#include\s"\/?((\w|-)+\/)*(\w|-)+(\.test)?\.md"/gm;

md.reset = function() {
  md.tableOfContents = "";
  md.build = {};
};

md.buildLink = function(title, _anchor) {
  const anchor = _anchor
    .replace(/\W+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-/, "")
    .replace(/-$/, "")
    .toLowerCase();

  return "[" + title + "](#" + anchor + ")\n";
};

export const compileDocs = () => {
  md.reset();
  return md.compileFiles(docConf);
};

export const jsToDocs = () => {
  return gulp
    .src(examplesGlob, {
      base: process.cwd(),
      since: gulp.lastRun(jsToDocs)
    })
    .pipe(
      wrap("```js\n<%- contents %>```", {}, { parse: false, engine: "ejs" })
    )
    .pipe(replace(/\/\*[\s\S]*?\*\/\n/gm, ""))
    .pipe(
      rename({
        extname: ".md"
      })
    )
    .pipe(gulp.dest(buildDir));
};

export const jsToTests = () => {
  return gulp
    .src(examplesGlob, {
      base: process.cwd(),
      since: gulp.lastRun(jsToTests)
    })
    .pipe(
      wrap(
        `
import { expect } from "chai";
<\%- contents %\>
`,
        {},
        { parse: false, engine: "ejs" }
      )
    )
    .pipe(replace(/\/\*([\s\S]*?)\*\//gm, "$1"))
    .pipe(replace(/(?=((import[\s\S]+?)(deepkill)))\1/m, "$2../../../lib/$3"))
    .pipe(babel())
    .pipe(gulp.dest(buildDir));
};

gulp.task("doc", gulp.series(gulp.parallel(jsToDocs, jsToTests), compileDocs));
