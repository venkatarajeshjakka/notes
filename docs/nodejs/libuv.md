# Libuv & Async IO

Libuv is a multi-platform C library that provides Node.js with an event-driven, asynchronous I/O model. It powers Node.js's non-blocking architecture, enabling high concurrency with a single-threaded event loop.

---

## What is Libuv?

Libuv handles:

- The event loop
- Asynchronous file and network I/O
- Thread pool for offloading blocking operations
- Timers, child processes, and more

## How the Event Loop Works

The event loop is the core of Node.js's async model. It processes events and executes callbacks. Libuv manages this loop, allowing Node.js to handle many connections efficiently.

### Event Loop Phases

- **Timers**: Executes callbacks scheduled by setTimeout/setInterval
- **I/O Callbacks**: Executes almost all callbacks except close callbacks, timers, and setImmediate
- **Idle, Prepare**: Internal use only
- **Poll**: Retrieves new I/O events; executes I/O related callbacks
- **Check**: Executes setImmediate callbacks
- **Close Callbacks**: Executes close event callbacks

## Example: Asynchronous File Read

```js
const fs = require("fs");

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

- The above code uses libuv under the hood to perform non-blocking file I/O.

## Thread Pool

Some operations (like file system access, DNS, crypto) are offloaded to a thread pool managed by libuv. This prevents blocking the main event loop.

You can control the thread pool size with the `UV_THREADPOOL_SIZE` environment variable (default is 4):

```powershell
$env:UV_THREADPOOL_SIZE=8
node app.js
```

## Further Reading

- [Node.js Event Loop Guide](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [Libuv Official Docs](https://libuv.org/)
