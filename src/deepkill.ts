import psTree from "ps-tree";

export default function deekKill(pid, _signal, _callback) {
  const signal = _signal || "SIGKILL";
  const callback = _callback || function() {};

  psTree(pid, (err, children) => {
    [pid]
      .concat(
        children.map(p => {
          return p.PID;
        })
      )
      .forEach(tpid => {
        try {
          process.kill(tpid, signal);
        } catch (ex) {}
      });
    callback();
  });
}
