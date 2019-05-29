## Usage !heading

`deepKill` has the following signature:

`function deepKill(pid: number, signal?: NodeJS.Signals): Promise<void>`

where:

* `pid` is the *PID* of the child process you need to kill with all its children.
* `signal` defaults to `"SIGKILL"` and is sent to the child process you need to kill and to all its children.

In the following example, we kill a child process that prevents our code from completing without relying on its killing properly its own children, that is we use `deepKill(pid)` and not `process.kill(pid)`.

#include "build/docs/examples/usage.test.md"

First we spawn `"fork1.js"`:

#include "build/docs/examples/fork1.md"

which in turn forks `"fork2.js"`:

#include "build/docs/examples/fork2.md"

which forks `"hang.js"`, an infinite loop:

#include "build/docs/examples/hang.md"

Now our code will hang forever, unless we kill it, or kill `"node hang.js"`.

If we kill `"node fork2.js"`, then `"node fork1.js"` will return, but not `"node hang.js"`, nor our code.

Until we write properly our subprocesses, `deepKill` keeps our development process from hanging.
