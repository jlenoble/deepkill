/* import path from "path"; */
import { fork } from "child_process";

// fork2.js launches hang.js, which cannot complete by itself, therefore
// this process cannot complete either
fork(path.join(__dirname, "hang.js"));
