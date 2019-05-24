import { expect } from "chai";
import { spawn } from "child_process";
import path from "path";
import { makeSingleTest } from "child-process-data";
import chalk from "chalk";
import deepKill from "../src/deepkill";

const waitMs = (n: number): Promise<void> => {
  return new Promise(
    (resolve): void => {
      setTimeout(resolve, n);
    }
  );
};

describe("Testing deepKill", (): void => {
  let z: { pid: number; done: boolean };

  it(`Cluncky test relying on Un*x env`, async (): Promise<void> => {
    const while1File = path.join(__dirname, "scripts/while1.js");

    // while1.js forks while2.js which forks while3.js which will never return.
    // Therefore 3 related processes are created for the duration of this test
    // as subprocesses of the Mocha process, which is a subprocess of the TDD.
    const p = spawn("node", [while1File]);
    z = { pid: p.pid, done: false };

    // Waiting is necessary for the 3 "while" processes to be properly started.
    await waitMs(1000);

    // Checking that the 3 processes exist, then kill them in one blow with deepKill
    const test1 = makeSingleTest({
      childProcess: ["ps", ["-u"]],

      checkResults(res: { out: () => string }): void {
        const out = res
          .out()
          .split("\n")
          .filter(
            (str: string): boolean =>
              str.includes("node") && str.includes("while")
          )
          .join("\n");

        expect(out).to.match(new RegExp(`\\s+${p.pid}\\s+.*node .*while1.js`));
        expect(out).to.match(/.*node .*while2.js/);
        expect(out).to.match(/.*node .*while3.js/);
      },

      async tearDownTest(): Promise<void> {
        await deepKill(p.pid);

        z.done = true;
      }
    });

    await test1();

    // Checking that the 3 processes have been killed. No need to wait as test1
    // won't return until deepKill has returned.
    const test2 = makeSingleTest({
      childProcess: ["ps", ["-u"]],

      checkResults(res: { out: () => string }): void {
        const out = res
          .out()
          .split("\n")
          .filter(
            (str: string): boolean =>
              str.includes("node") && str.includes("while")
          )
          .join("\n");

        expect(out).not.to.match(
          new RegExp(`\\s+${p.pid}\\s+.*node .*while1.js`)
        );
        expect(out).not.to.match(/.*node .*while2.js/);
        expect(out).not.to.match(/.*node .*while3.js/);
      }
    });

    await test2();
  });

  // The very point of deepKill is to recover from what will happen if the above
  // test fails. If deepKill is broken, then the 3 processes won't die and the test
  // will never complete, thus hanging the TDD. Even Mocha timeout won't work
  // because it's not the test that hangs but the Mocha process itself waiting
  // for the 3 subprocesses to close.
  //
  // Below we attempt to recover from a broken test. But we can't recover from
  // a broken deepKill. Thus the warning inviting the user to take action.
  // Quitting the TDD kills the Mocha process and thus all its spawns. Unless of
  // course if makeSingleTest is broken (sigh!), or spawn/fork! (very unlikely)

  afterEach(
    async (): Promise<void> => {
      if (!z.done) {
        console.log(
          chalk.cyan(`
Forks were not killed for ${chalk.yellow(
            z.pid.toString()
          )}, trying to recover with deepKill itself.
If the TDD stops testing anything, then deepKill is broken;
Otherwise, it's the test itself that is broken.
To clean up all the processes, quitting the TDD should be enough (Ctrl-C).
But check process ${chalk.yellow(
            z.pid.toString()
          )} and the 2 following processes to be sure you don't need
to kill them by hand.
`)
        );

        await deepKill(z.pid);
      }
    }
  );
});
