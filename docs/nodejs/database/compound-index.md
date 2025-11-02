---
sidebar_position: 4
---

# MongoDB Indexes

## Why Use Indexes?

Without indexes, MongoDB scans every document to find matches. Indexes make queries much faster.

**Benefits:**
- Faster queries (O(log n) vs O(n))
- Efficient sorting
- Enforce unique constraints
- Lower CPU/memory usage

```javascript
// Without index: scans all documents
// With index: uses tree search
db.users.find({ email: "user@example.com" });
```

## Basic Indexes

```javascript
// Create index
db.users.createIndex({ email: 1 });

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// View indexes
db.users.getIndexes();

// Drop index
db.users.dropIndex("email_1");
```

## Compound Index

Indexes on multiple fields. **Order matters** - leftmost fields must be used in queries.

```javascript
// Create compound index
db.users.createIndex({ lastname: 1, firstname: 1 });

// CAN use index (uses leftmost field):
db.users.find({ lastname: "Smith" });
db.users.find({ lastname: "Smith", firstname: "John" });

// CANNOT use index (skips leftmost field):
db.users.find({ firstname: "John" });
```

### Mongoose Example

```javascript
const productSchema = new mongoose.Schema({
  category: String,
  brand: String,
  price: Number,
});

// Add compound index
productSchema.index({ category: 1, brand: 1, price: -1 });
```

## Pros and Cons

### Pros
- Much faster queries
- Efficient sorting
- Enforce uniqueness
- Lower CPU/memory usage

### Cons
- Uses disk space
- Slows down writes (insert/update/delete)
- Uses RAM for index storage
- Needs maintenance

### Best Practices

**Do:**
- Index frequently queried fields
- Use `.explain()` to check performance
- Remove unused indexes

```javascript
db.users.find({ email: "test@example.com" }).explain("executionStats");
```

**Don't:**
- Index every field
- Index small collections (< 1000 docs)
- Index low-cardinality fields (booleans)

### When to Index

**Create index:**
- Field used in frequent queries
- Slow query performance
- Need uniqueness

**Skip index:**
- Small collections
- Rarely queried fields
- Write-heavy applications

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-02
