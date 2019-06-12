# deepkill

Small helper to kill a process and all its children

  * [Background](#background)
  * [Usage](#usage)
  * [License](#license)


## Background

Say you're practicing TDD devotely. All your files are watched and `Mocha` does its thing while you keep improving your code.

Say you're working on a library that spawns a subprocess. Now the latter has a bug. Your unit tests fail as expected: You haven't received the right signal, or captured the right message, or whatever.

You fix, you hope, the bug but nothing happens. Your files are still watched, but `Mocha` doesn't react. Duh?

Is `Mocha` still waiting for your unit tests to complete? Shouldn't it have timed out by now?

The problem is that the buggy subprocess is hanging, and make the test runner itself hang. The unit tests *are* complete, but *not* the test runner. You kill it by hand, restart it and everything goes back to normal, once! Your watcher will remain unusable as long as your subprocess has bugs.

Of course, your child processes should recover from exceptions, or they should send the right messages and their parents clean up the mess, but that's when everything works and the library is published. For now the watcher process is broken and may remain so for a while.

Using `deepKill` is a **hack**. You call it after each test that spawns a buggy subprocess that makes your watcher hang and the run will complete as expected, whether the child process returned naturally or not.

## Usage

`deepKill` has the following signature:

`function deepKill(pid: number, signal?: NodeJS.Signals): Promise<void>`

where:

* `pid` is the *PID* of the child process you need to kill with all its children.
* `signal` defaults to `"SIGKILL"` and is sent to the child process you need to kill and to all its children.

In the following example, we kill a child process that prevents our code from completing without relying on its killing properly its own children, that is we use `deepKill(pid)` and not `process.kill(pid)`.

```js
import deepKill from "deepkill";
import { spawn } from "child_process";

// We create several child processes that will prevent this very process from ever completing.
const   p = spawn("node", ["./fork1.js"]);

// Now we do stuff while the children are running...

// By killing the spawned process explicitly with deepKill, we also kill all the processes
// it has ever created and that have not closed yet, thus allowing this very process to return
deepKill(p.pid).then(
  () => {
    // We do more cleanup stuff after the children have closed...
  },
  () => {
    // We could not somehow terminate all the child processes.
    console.warn(`
Some helpful message telling the user how to:
  - abort
  - find and kill the surviving child processes by hand
  - track and report the exposed bug
`);
  }
);
```

First we spawn `"fork1.js"`:

```js
// File "./fork1.js"
import { fork } from "child_process";

// fork1.js launches fork2.js which launches hang.js. The latter (an infinite loop)
// won't close, so neither fork2.js nor fork1.js will complete unless killed explicitly.
fork("./fork2.js");
```

which in turn forks `"fork2.js"`:

```js
// File "./fork2.js"
import { fork } from "child_process";

// fork2.js launches hang.js, which cannot complete by itself, therefore
// this process cannot complete either
fork("./hang.js");
```

which forks `"hang.js"`, an infinite loop:

```js
// File "./hang.js"
// hang.js will never complete unless killed explicitly
while (1) {}
```

Now our code will hang forever, unless we kill it, or kill `"node hang.js"`.

If we kill `"node fork2.js"`, then `"node fork1.js"` will return, but not `"node hang.js"`, nor our code.

Until we write properly our subprocesses, `deepKill` keeps our development process from hanging.

## License

deepkill is [MIT licensed](./LICENSE).

© 2017-2019 [Jason Lenoble](mailto:jason.lenoble@gmail.com)

