## Background !heading

Say you're practicing TDD devotely. All your files are watched and `Mocha` does its thing while you keep improving your code.

Say you're working on a library that spawns a subprocess. Now the latter has a bug. Your unit tests fail as expected: You haven't received the right signal, or captured the right message, or whatever.

You fix, you hope, the bug but nothing happens. Your files are still watched, but `Mocha` doesn't react. Duh?

Is `Mocha` still waiting for your unit tests to complete? Shouldn't it have timed out by now?

The problem is that the buggy subprocess is hanging, and make the test runner itself hang. The unit tests *are* complete, but *not* the test runner. You kill it by hand, restart it and everything goes back to normal, once! Your watcher is indeed unusable as long as your subprocess has bugs.

Of course, your child processes should recover from exceptions, or they should send the right messages and their parents clean up the mess, but that's when everything works and the library is published. For now the watcher process is broken and may remain so for a while.

Using `deepKill` is a hack. You call it after each test that spawns a buggy subprocess that makes your watcher hang and the run will complete as expected, whether the child process returned naturally or not.
