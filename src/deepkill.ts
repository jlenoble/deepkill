import psTree, { PS } from "ps-tree";

export default async function deepKill(
  pid: number,
  signal: NodeJS.Signals = "SIGKILL"
): Promise<void> {
  const children = (await new Promise(
    (resolve, reject): void => {
      psTree(
        pid,
        (err, children): void => {
          if (err) {
            return reject(err);
          }

          resolve(children);
        }
      );
    }
  )) as PS[];

  process.kill(pid, signal);

  for (const tpid of children.map(
    ({ PID }): number => Number.parseInt(PID, 10)
  )) {
    process.kill(tpid, signal);
  }
}
