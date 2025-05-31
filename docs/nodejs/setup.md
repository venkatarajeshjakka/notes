---
sidebar_position: 3
---

# Installation of Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side. This section will guide you through installing Node.js and managing its versions effectively.

---

## ✅ Check Version of Node.js

To verify if Node.js is already installed on your machine, open a terminal or command prompt and run:

```bash
node -v
```

This command displays the current version of Node.js installed. For example:

```bash
v18.17.1
```

If Node.js is not installed, it will throw a `'node' is not recognized...` error.

## Check Version of npm

`npm` (Node Package Manager) comes bundled with Node.js. To check its version:

```bash
npm -v
```

### Upgrade Version of npm

You can upgrade `npm` to the latest version using the following command:

```bash
npm install -g npm@latest
```

## Create a File and Run Node.js Code

Let's create a basic JavaScript file and run it using Node.js.

Step 1: Create a file named `main.js`

```js
let name = "Rajesh";
let age = 30;

function greet() {
  console.log(`Hello, my name is ${name} and I am ${age} years old.`);
}

greet();
```

Step 2: Run the code
In the terminal or command prompt, run the following command:

```bash
node main
```

Output:

```
Hello, my name is Rajesh and I am 30 years old.
```
