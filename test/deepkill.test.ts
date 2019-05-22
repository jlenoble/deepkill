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

describe("Testing deepKill", function(): void {
  this.timeout(5000); // eslint-disable-line no-invalid-this

  let p;

  it(`Cluncky test relying on Un*x env`, async (): Promise<void> => {
    const while1File = path.join(__dirname, "scripts/while1.js");
    p = spawn("node", [while1File]);

    await waitMs(1000);

    const test1 = makeSingleTest({
      childProcess: ["ps", ["-u"]],

      checkResults(res): void {
        const out = res
          .out()
          .split("\n")
          .filter(
            (str): boolean => str.includes("node") && str.includes("while")
          )
          .join("\n");

        expect(out).to.match(new RegExp(`\\s+${p.pid}\\s+.*node .*while1.js`));
        expect(out).to.match(/.*node .*while2.js/);
        expect(out).to.match(/.*node .*while3.js/);
      },

      tearDownTest(): void {
        deepKill(p.pid);

        p = { pid: p.pid, done: true };
      }
    });

    await test1();

    await waitMs(1000);

    const test2 = makeSingleTest({
      childProcess: ["ps", ["-u"]],

      checkResults(res): void {
        const out = res
          .out()
          .split("\n")
          .filter(
            (str): boolean => str.includes("node") && str.includes("while")
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

  afterEach(
    async (): Promise<void> => {
      if (!p.done) {
        console.log(
          chalk.cyan(`
Spawns were not killed for ${chalk.yellow(
            p.pid
          )}, trying to recover with deepKill itself.
If the TDD stops testing anything, then deepKill is broken;
Otherwise, it's the test itself that is broken.
To clean up all the processes, quitting the TDD should be enough (Ctrl-C).
But check ${chalk.yellow(
            p.pid
          )} and the 2 following to be sure you don't need to kill them by hand.
`)
        );

        deepKill(p.pid);
      }
    }
  );
});
