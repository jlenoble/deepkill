import deepKill from "deepkill";
import { spawn } from "child_process";
/* import path from "path";

describe("Usage examples", function() {
  it("Launching and killing non closing processes", function() {
    let p; */

const /* proc = () => { */
  p = spawn("node", [path.join(__dirname, "fork1.js")]);
/* };

expect(proc).not.to.throw();
expect(p).not.to.be.undefined;
expect(p.pid).to.be.a("number"); */

// Do stuff while children are running...
/* const ret = */

deepKill(p.pid).then(
  () => {
    // Do stuff after children have closed...
  },
  () => {
    // Could not somehow cleanup the mess.
    console.warn(
      "Some helpful message telling the user how to find and kill the processes by hand" +
        " and how to track/report the bug."
    );
  }
);
/* return ret;
  });
}); */
