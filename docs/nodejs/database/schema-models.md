---
sidebar_position: 3
---

# Create a Schema & Models

## What is a Schema?

A **Schema** in Mongoose defines the structure of documents within a MongoDB collection. It specifies the fields, their types, default values, validators, and other configuration options.

## Basic Schema Creation

```javascript
const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

## Schema Types

Mongoose supports various schema types:

```javascript
const productSchema = new Schema({
  name: String, // String type
  price: Number, // Number type
  inStock: Boolean, // Boolean type
  createdAt: Date, // Date type
  tags: [String], // Array of strings
  metadata: Schema.Types.Mixed, // Mixed/any type
  userId: Schema.Types.ObjectId, // MongoDB ObjectId
  buffer: Buffer, // Buffer type
  nested: {
    // Nested object
    field1: String,
    field2: Number,
  },
});
```

## Schema Options and Validation

Add validation, default values, and other options to fields:

```javascript
const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true, // Remove whitespace
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Create unique index
    lowercase: true, // Convert to lowercase
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // Don't include in queries by default
  },
  age: {
    type: Number,
    min: [18, "Must be at least 18 years old"],
    max: 120,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"], // Allowed values only
    default: "other",
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default value
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
```

## Using the Model

```javascript
const User = require("./models/User");

// Create a new user
const newUser = new User({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "securePassword123",
  age: 25,
  gender: "male",
});

await newUser.save();

// Find users
const users = await User.find({ isActive: true });
const user = await User.findById(userId);
const userByEmail = await User.findByEmail("john@example.com");

// Update user
await User.findByIdAndUpdate(userId, { age: 26 }, { new: true });

// Delete user
await User.findByIdAndDelete(userId);

// Use instance methods
const isValidPassword = await user.comparePassword("password123");
console.log(user.fullName); // Access virtual property
```
