import psTree from "ps-tree";

export default async function deepKill(pid, signal = "SIGKILL"): Promise<void> {
  return new Promise(
    (resolve): void => {
      psTree(
        pid,
        (err, children): void => {
          if (err) {
            console.warn(err.message);
          }

          [pid]
            .concat(
              children.map(
                (p): string => {
                  return p.PID;
                }
              )
            )
            .forEach(
              (tpid): void => {
                try {
                  process.kill(tpid, signal);
                } catch (e) {
                  console.warn(e.message);
                }
              }
            );

          resolve();
        }
      );
    }
  );
}
