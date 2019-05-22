import { src, task, series } from "gulp";
import mocha from "gulp-mocha";

import "./dist-build";

const testGlob = ["docs/examples/**/*.js"];

export const handleDistTest = () => {
  return src(testGlob, { read: false }).pipe(
    mocha({
      reporter: "mochawesome"
    })
  );
};

task("dist-test", series("dist-build", handleDistTest));
