---
sidebar_position: 2
---

# JavaScript on Server

JavaScript is traditionally known as a client-side language, but with the advent of server-side technologies like **Node.js**, it has grown into a full-fledged backend language as well. This section explores how JavaScript works on the server, its runtime, engines, and core features.

---

## JavaScript Engine

JavaScript engines are responsible for executing JavaScript code. Modern engines not only interpret but also optimize the execution using Just-In-Time (JIT) compilation.

### V8 Engine

- **Developed by**: Google
- **Used in**: Google Chrome and Node.js
- **Written in**: C++
- **Functionality**: Converts JavaScript code directly to machine code before execution using JIT compilation for faster performance.

V8 is one of the fastest JavaScript engines in the world and serves as the core execution engine in Node.js, making JavaScript viable for server-side applications.

#### ECMAScript

- **ECMAScript** is the standard specification that JavaScript engines like V8 implement.
- It defines:
  - Syntax
  - Types
  - Statements
  - Keywords
  - Reserved words
  - Operators
  - Global objects

ECMAScript evolves regularly with new versions (ES6, ES7, etc.), introducing powerful features such as `let/const`, arrow functions, async/await, modules, etc.

## Core Features of Node.js

Node.js enables JavaScript to be used on the server-side with the following key features:

- **Asynchronous and Event-Driven**  
  Non-blocking I/O helps handle thousands of requests simultaneously.

- **Single-threaded but Scalable**  
  Uses an event loop and callbacks to perform non-blocking operations.

- **Fast Execution**  
  Thanks to the V8 engine, Node.js executes JavaScript code very quickly.

- **NPM (Node Package Manager)**  
  Access to thousands of reusable packages and modules.

- **Cross-Platform**  
  Runs on Windows, macOS, and Linux.

- **Built-in Libraries**  
  Supports core modules like `http`, `fs`, `path`, `events`, and more.

## JavaScript Runtime

A JavaScript Runtime is the environment where JavaScript code is executed. It includes:

- **JavaScript Engine** (like V8)
- **APIs** provided by the host environment (browser or Node.js)
- **Event Loop**
- **Callback Queue**

### Node.js Runtime Architecture

1. **V8 Engine** – Executes JavaScript code.
2. **libuv** – A multi-platform support library with a focus on asynchronous I/O.
3. **Event Loop** – Handles concurrency via callbacks.
4. **C++ bindings** – Allows Node.js to interact with OS-level features.

> ✅ **Summary**:  
> With the help of powerful engines like V8 and runtime environments like Node.js, JavaScript has evolved into a robust language not just for the browser, but for scalable and high-performance backend applications as well.
