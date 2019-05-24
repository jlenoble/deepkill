/* import path from "path"; */
import { fork } from "child_process";

// fork1.js launches fork2.js which launches hang.js. The latter (an infinite loop)
// won't close, so neither fork2.js nor fork1.js will complete unless killed explicitly.
fork(path.join(__dirname, "fork2.js"));
