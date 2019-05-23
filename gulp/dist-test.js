import { src, task, series } from "gulp";
import mocha from "gulp-mocha";

import "./dist-build";

const testGlob = ["build/docs/examples/**/*.test.js"];

export const handleDistTest = () => {
  return src(testGlob, { read: false }).pipe(
    mocha({
      reporter: "mochawesome"
    })
  );
};

task("dist-test", series("dist-build", handleDistTest));
