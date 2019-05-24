# deepkill

Small helper to kill a process and all its forks

  * [Usage](#usage)
  * [License](#license)


## Usage

`deepKill` helps cleanup zombie child processes while for example doing some TDD that creates loads of them and failed to remove them for unobvious reasons.

```js
import deepKill from "deepkill";
import { spawn } from "child_process";

const   p = spawn("node", [path.join(__dirname, "fork1.js")]);

// Do stuff while children are running...

deepKill(p.pid).then(
  () => {
    // Do stuff after children have closed...
  },
  () => {
    // Could not somehow cleanup the mess.
    console.warn(
      "Some helpful message telling the user how to find and kill the processes by hand" +
        " and how to track/report the bug."
    );
  }
);
```


## License

deepkill is [MIT licensed](./LICENSE).

© 2017-2019 [Jason Lenoble](mailto:jason.lenoble@gmail.com)

