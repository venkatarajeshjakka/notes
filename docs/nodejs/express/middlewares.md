---
author: Venkata Rajesh Jakka
date: 2025-09-13
sidebar_position: 3
title: Middlewares
---

# Middlewares in Express.js

Middleware functions are at the core of **Express.js** applications. They allow you to handle requests, responses, and errors in a structured way.

A **middleware** is essentially a function that has access to the request (`req`), the response (`res`), and the `next()` function in the application’s request-response cycle.

---

## Key Features of Middleware

- Can execute **multiple request handlers** sequentially.
- Uses the **`next()` function** to pass control to the next middleware.
- Can modify `req` and `res` objects before sending the response.
- Can handle **errors** by passing them to the `next(err)` function.
- Provides flexibility to implement **logging, authentication, validation, error handling, and more**.

---

## Basic Middleware Usage

### Example 1: Multiple Request Handlers

```javascript
app.get(
  "/",
  (req, res, next) => {
    console.log("First middleware executed");
    next(); // Passes control to the next function
  },
  (req, res) => {
    res.contentType("application/json");
    res.send("Hello to my server!");
  }
);
```

➡️ Here:

- The **first middleware** logs a message.
- The **second handler** sends the response.

---

### Example 2: Application-Level Middleware

```javascript
app.use((req, res, next) => {
  console.log("This is my Default middleware");
  console.log(
    `Request URL: ${req.url}, Request Type: ${req.method}, Time: ${new Date()}`
  );
  next();
});
```

➡️ This middleware:

- Runs **for every incoming request**.
- Logs request details before passing control to the next handler.

---

## Types of Middleware

1. **Application-level middleware** – Defined using `app.use()` or route methods.
2. **Router-level middleware** – Scoped to an instance of `express.Router()`.
3. **Built-in middleware** – e.g., `express.json()`, `express.urlencoded()`.
4. **Error-handling middleware** – Defined with **four parameters** `(err, req, res, next)`.
5. **Third-party middleware** – Libraries like `morgan`, `cors`, `body-parser`.

---

## Error Handling with Middleware

Middleware can also handle errors in Express:

```javascript
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});
```

➡️ Whenever `next(err)` is called, Express forwards the error to this handler.

---

## Why Do We Need Middleware?

- To **separate concerns** and keep code modular.
- For **logging and monitoring** requests.
- To implement **authentication and authorization**.
- For **parsing request bodies** (JSON, form data, etc.).
- To handle **errors gracefully**.
- To **enhance responses** before sending to the client.

---

📌 **Author:** Venkata Rajesh Jakka  
📅 **Date:** 2025-09-25
