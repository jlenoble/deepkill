import psTree from "ps-tree";

export default async function deepKill(
  pid: number,
  signal: string = "SIGKILL"
): Promise<void> {
  await new Promise(
    (resolve, reject): void => {
      psTree(
        pid,
        (err, children): void => {
          if (err) {
            return reject(err);
          }

          try {
            process.kill(pid, signal);
          } catch (e) {
            return reject(e);
          }

          for (const tpid of children.map(
            ({ PID }): number => Number.parseInt(PID, 10)
          )) {
            try {
              process.kill(tpid, signal);
            } catch (e) {
              return reject(e);
            }
          }

          resolve();
        }
      );
    }
  );
}
