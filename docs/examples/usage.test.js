import deepKill from "deepkill";
import { spawn } from "child_process";
/* import path from "path";

describe("Usage examples", function() {
  it("Launching and killing non closing processes", function() {
    let p; */

// We create several child processes that will prevent this very process from ever completing.
const /* proc = () => { */
  p = spawn("node", [path.join(__dirname, "fork1.js")]);
/* };

expect(proc).not.to.throw();
expect(p).not.to.be.undefined;
expect(p.pid).to.be.a("number"); */

// Now we do stuff while the children are running...

// By killing the spawned process explicitly with deepKill, we also kill all the processes
// it has ever created and that have not closed yet, thus allowing this very process to return
/* const ret = */
deepKill(p.pid).then(
  () => {
    // We do more cleanup stuff after the children have closed...
  },
  () => {
    // We could not somehow terminate all the child processes.
    console.warn(`
Some helpful message telling the user how to:
  - abort
  - find and kill the surviving child processes by hand
  - track and report the exposed bug
`);
  }
);
/* return ret;
  });
}); */
