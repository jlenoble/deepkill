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

  try {
    process.kill(pid, signal);
  } catch (e) {
    console.warn(e);
    return;
  }

  for (const tpid of children.map(({ PID }): number =>
    Number.parseInt(PID, 10)
  )) {
    try {
      process.kill(tpid, signal);
    } catch (e) {
      console.warn(e);
    }
  }
}
