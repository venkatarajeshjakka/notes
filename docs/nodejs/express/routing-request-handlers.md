---
author: Venkata Rajesh Jakka
date: 2025-09-13
sidebar_position: 2
title: Routing & Request Handlers
---

# Routing & Request Handlers

## Introduction

In **Express.js**, routing refers to how an application's endpoints
(URIs) respond to client requests.
A **request handler** is a function that executes when a specific route
is matched.

Express provides a robust mechanism to define routes for handling
different HTTP methods such as `GET`, `POST`, `PUT`, `DELETE`, etc.

---

## Basic Routing

The syntax for routing in Express is:

```js
app.METHOD(PATH, HANDLER);
```

- **app** → An instance of `express()`
- **METHOD** → HTTP method (e.g., GET, POST)
- **PATH** → URL path (e.g., "/", "/users")
- **HANDLER** → Callback function executed when the route is matched

### Example

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

---

## Route Parameters

Route parameters allow you to capture values from the URL.

```js
app.get("/users/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

👉 If you visit `/users/101`, the response will be `User ID: 101`.

---

## Query Parameters

Query parameters are accessed via `req.query`.

```js
app.get("/search", (req, res) => {
  const { q } = req.query;
  res.send(`You searched for: ${q}`);
});
```

👉 Visiting `/search?q=books` returns `You searched for: books`.

---

## Handling Different HTTP Methods

You can define different handlers for different HTTP methods on the same
route.

```js
app.post("/submit", (req, res) => {
  res.send("Data submitted successfully!");
});

app.put("/update/:id", (req, res) => {
  res.send(`Updated record with ID: ${req.params.id}`);
});

app.delete("/delete/:id", (req, res) => {
  res.send(`Deleted record with ID: ${req.params.id}`);
});
```

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-09-23
