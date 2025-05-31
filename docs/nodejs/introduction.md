---
sidebar_position: 1
---

# Introduction to Node.js

Node.js is a powerful and popular open-source, cross-platform JavaScript runtime environment that allows developers to build scalable and high-performance applications on the server side using JavaScript. It’s built on Chrome’s V8 JavaScript engine and uses an event-driven, non-blocking I/O model, making it lightweight and efficient — perfect for data-intensive real-time applications.

## Why Node.js?

Node.js has gained immense popularity for several compelling reasons:

- **JavaScript Everywhere**: Use the same language on both client and server sides.
- **High Performance**: Built on the V8 engine, it compiles JavaScript to native machine code.
- **Non-blocking I/O**: Handles many connections simultaneously, making it ideal for real-time applications.
- **Large Ecosystem**: With NPM, it provides access to thousands of reusable packages.
- **Scalability**: Its event-driven architecture is well-suited for building scalable network applications.
- **Community Support**: A vibrant community and strong corporate backing (initially by Joyent, and now broadly supported).

## History / Timeline of Node.js Significant Changes

Node.js has evolved significantly since its inception. Here's a brief timeline of its major milestones:

| Year      | Milestone                                                                                    |
| --------- | -------------------------------------------------------------------------------------------- |
| **2009**  | Node.js was created by **Ryan Dahl** and released with support for Linux.                    |
| **2010**  | Introduction of **NPM (Node Package Manager)**.                                              |
| **2011**  | Windows support was added.                                                                   |
| **2014**  | **io.js** was forked from Node.js due to stagnation; aimed at faster development.            |
| **2015**  | Node.js and io.js merged under the **Node.js Foundation**, forming Node.js v4.0.0.           |
| **2016**  | Node.js v6 released with ES6 support.                                                        |
| **2018**  | Node.js v10 becomes LTS (Long Term Support); performance improvements and stability.         |
| **2020**  | Node.js v14 includes diagnostic tools, optional chaining, nullish coalescing.                |
| **2021**  | Node.js v16 with Apple Silicon support and updated V8 engine.                                |
| **2023+** | Continued improvements, built-in test runner, Fetch API support, and stable Web Streams API. |

---

## Why Node.js Was Created in the First Place

Ryan Dahl created Node.js in 2009 to address the limitations of traditional web server models, especially those built using languages like PHP. He found the Apache HTTP server model inefficient because each connection spawns a new thread, consuming more memory and resources.

His main goals were:

- To build real-time websites with push capability.
- To create a non-blocking, event-driven server for efficient I/O operations.
- To leverage JavaScript — a familiar language — for server-side development.

The result was a lightweight, high-throughput framework that revolutionized how web applications are built.

---

## NPM (Node Package Manager)

NPM is the default package manager for Node.js and was introduced in 2010. It is one of the largest ecosystems of open source libraries in the world.

#### Key Features:

- **Package Installation**: Install libraries and dependencies easily with `npm install <package-name>`.
- **Versioning**: Helps maintain and update project dependencies safely.
- **Script Running**: Use `npm run <script-name>` for common automation tasks.
- **Publishing**: Allows developers to publish their own packages and share with the community.

#### Fun Fact:

As of 2025, NPM hosts over **2 million** packages, making it the largest software registry in the world.

---
