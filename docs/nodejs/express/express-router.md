---
sidebar_position: 5
---

# Express Router

Express Router allows you to create modular, mountable route handlers. It helps organize routes into separate files for better code management.

## Why Use Express Router?

- **Modularity**: Separate routes into different files
- **Maintainability**: Easier to manage and update
- **Scalability**: Better structure for large applications
- **Organization**: Group related routes together

## Basic Router Setup

**Create a router file (routes/users.js):**

```javascript
const express = require("express");
const router = express.Router();

// Define routes
router.get("/", (req, res) => {
  res.json({ message: "Get all users" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.json({ message: "Create user" });
});

module.exports = router;
```

**Use the router in your main app (app.js):**

```javascript
const express = require("express");
const app = express();
const userRoutes = require("./routes/users");

app.use("/api/users", userRoutes);

app.listen(3000);
```

Now you can access:

- `GET /api/users` - Get all users
- `GET /api/users/123` - Get user with ID 123
- `POST /api/users` - Create a user

## Organizing Multiple Routers

**Project Structure:**

```
project/
├── app.js
├── routes/
│   ├── users.js
│   └── products.js
└── controllers/
    ├── userController.js
    └── productController.js
```

**app.js:**

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// Mount routers
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));

app.listen(3000, () => console.log("Server running on port 3000"));
```

**routes/users.js:**

```javascript
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
```

## Router Middleware

**Apply middleware to all routes in router:**

```javascript
const router = express.Router();

// This runs for ALL routes in this router
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

router.get("/profile", (req, res) => {
  res.json({ message: "Profile" });
});

module.exports = router;
```

**Apply middleware to specific routes:**

```javascript
const authenticate = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Public route
router.get("/products", (req, res) => {
  res.json({ products: [] });
});

// Protected route
router.post("/products", authenticate, (req, res) => {
  res.json({ message: "Product created" });
});
```

## Best Practices

1. **Organize by Feature**: Create separate router files for each resource (users.js, products.js)

2. **Keep Routes Clean**: Move business logic to controllers

3. **Use RESTful Conventions**:

   ```
   GET    /users       - Get all users
   GET    /users/:id   - Get one user
   POST   /users       - Create user
   PUT    /users/:id   - Update user
   DELETE /users/:id   - Delete user
   ```

4. **Handle Async Errors**: Use try-catch in controller functions

5. **Apply Middleware Wisely**: Use `router.use()` for all routes, or add to specific routes

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-10-22
