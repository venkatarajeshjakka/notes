---
sidebar_position: 1
title: Create Server
author: Venkata Rajesh Jakka
date: 2025-09-13
---

# Create Server

This guide walks you through setting up a basic Node.js server using **Express.js**, along with development setup using **Nodemon**.

---

## 🚀 Initial Setup

First, initialize a new Node.js project to create a `package.json` file.

```bash
npm init
```

You will be prompted to provide project details such as name, version, description, and entry point.  
You can either customize them or press **Enter** to keep the default values.

---

## 🛠️ Setting Up Express.js

Install **Express.js**, a minimal and flexible Node.js web application framework:

```bash
npm install express --save
```

### Example Server

Create a file named `src/app.js` and add the following code:

```javascript
const express = require("express");
const app = express();
const port = 3040;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

✅ Run the server using:

```bash
node src/app.js
```

Open [http://localhost:3040](http://localhost:3040) in your browser, and you should see:

```
Hello World!
```

---

## 🔄 Install Nodemon (for Development)

Nodemon automatically restarts the server when file changes are detected, making development faster.

Install nodemon globally:

```bash
npm install -g nodemon
```

### Update `package.json`

Modify the `scripts` section to include a `dev` script:

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/app.js"
  },
  "keywords": ["nodejs", "javascript"],
  "author": "Venkata Rajesh Jakka",
  "license": "ISC",
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

Now you can start the development server with:

```bash
npm run dev
```

---

## ✅ Summary

- Initialized a new Node.js project with `npm init`.
- Installed **Express.js** and built a basic server.
- Configured **Nodemon** for automatic restarts during development.

---

📌 **Author:** Venkata Rajesh Jakka  
📅 **Date:** 2025-09-13
