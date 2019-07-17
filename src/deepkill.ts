/* eslint-disable @typescript-eslint/array-type */
import psTree, { PS } from "ps-tree";

export default async function deepKill(
  pid: number,
  signal: NodeJS.Signals = "SIGKILL"
): Promise<void> {
  const children: ReadonlyArray<PS> = (await new Promise((resolve): void => {
    psTree(pid, (err: Error, children: ReadonlyArray<PS>): void => {
      if (err) {
        console.warn(err);
        return resolve([]);
      }

      resolve(children);
    });
  })) as ReadonlyArray<PS>;

  let err: Error | undefined;

  try {
    process.kill(pid, signal);

    for (const tpid of children.map(({ PID }): number =>
      Number.parseInt(PID, 10)
    )) {
      try {
        process.kill(tpid, signal);
      } catch (e) {
        if (/ESRCH/.test(e.message)) {
          // Drop error: process already killed
        } else if (!err) {
          err = e;
        }
      }
    }
  } catch (e) {
    if (/ESRCH/.test(e.message)) {
      // Drop error: process already killed
    } else if (!err) {
      err = e;
    }
  }

  if (err) {
    throw err;
  }
}
