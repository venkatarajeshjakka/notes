---
sidebar_position: 4
---

# Module Pattern in Node.js

Modules in Node.js allow you to encapsulate code, keeping variables and functions private unless explicitly exported. This helps maintain a clean global namespace and improves maintainability.

---

## CommonJS Modules (CJS)

CommonJS is the traditional module system used in Node.js. By default, each file is treated as its own scope, so variables and functions are **not leaked** globally.

### Exporting with `module.exports`

Create a file called `sum.js`:

```js
function calculateSum(a, b) {
  return a + b;
}

module.exports = calculateSum;
```

### Importing with require()

Create a file called `app.js`:

```js
const calculateSum = require("./sum.js");

console.log(`The sum of 5 and 10 is: ${calculateSum(5, 10)}`);
```

## ES Modules (ESM)

ECMAScript Modules are the official standard for JavaScript modules and are supported in Node.js (with some configuration).

### Enable ESM in Node.js

To use ES Modules, set `"type": "module"` in your `package.json`:

```json
{
  "type": "module"
}
```

This allows you to use `import` and `export` syntax in `.js` files.

### Exporting in ESM

Create a file called `sum.js`:

```js
export function calculateSum(a, b) {
  return a + b;
}
```

### Importing in ESM

Create a file called `app.js`:

```js
import { calculateSum } from "./sum.js";

console.log(`The sum of 5 and 10 is: ${calculateSum(5, 10)}`);
```

## Key Differences: CommonJS vs ES Modules

| Feature             | CommonJS (CJS)                 | ES Modules (ESM)                         |
| ------------------- | ------------------------------ | ---------------------------------------- |
| Syntax              | `require()` / `module.exports` | `import` / `export`                      |
| File Extension      | `.js`                          | `.js`, `.mjs` (if no `"type": "module"`) |
| Execution Mode      | Non-strict by default          | Always strict mode                       |
| Load Time           | Synchronous                    | Asynchronous                             |
| Support in Browsers | ❌ Not supported               | ✅ Native support                        |
| Dynamic Imports     | ❌ Not supported               | ✅ Supported via `import()`              |

### Non-Strict Mode vs Strict Mode

- CommonJS Modules do not enforce strict mode by default.
- ES Modules automatically run in strict mode, ensuring better coding practices.

Using ES Modules provides a more modern and flexible approach, especially for frontend and cross-platform JavaScript development.
