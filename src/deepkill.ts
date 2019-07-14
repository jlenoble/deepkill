/* eslint-disable @typescript-eslint/array-type */
import psTree, { PS } from "ps-tree";
import processExists from "process-exists";

export default async function deepKill(
  pid: number,
  signal: NodeJS.Signals = "SIGKILL"
): Promise<void> {
  if (!(await processExists(pid))) {
    return;
  }

  const children: ReadonlyArray<PS> = (await new Promise((resolve): void => {
    psTree(pid, (err: Error, children: ReadonlyArray<PS>): void => {
      if (err) {
        console.warn(err);
        return resolve([]);
      }

      resolve(children);
    });
  })) as ReadonlyArray<PS>;

  process.kill(pid, signal);

  for (const tpid of children.map(({ PID }): number =>
    Number.parseInt(PID, 10)
  )) {
    process.kill(tpid, signal);
  }
}
