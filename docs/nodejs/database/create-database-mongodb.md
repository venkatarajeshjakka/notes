---
sidebar_position: 2
---

# Create a Database & MongoDB

MongoDB is a **NoSQL, document-oriented database** widely used for building scalable applications. There are two main ways to use MongoDB:

---

## Ways to Use MongoDB

1. **Install MongoDB Locally**

   - Download and install MongoDB Community Edition on your system.
   - You can run it directly in your local environment for development or testing.
   - [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)

2. **Use MongoDB Managed Services (MongoDB Atlas)**
   - A fully managed cloud service for hosting MongoDB.
   - Atlas handles scaling, backups, monitoring, and security for you.
   - Recommended for production deployments.
   - [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## Using Code to Insert Data (Node.js Example)

You can interact with MongoDB programmatically using **Node.js**.

### Step 1: Install the MongoDB Driver

Run the following command to install the official MongoDB Node.js driver:

```sh
npm install mongodb
```

### Step 2: Code Example ()`database.js`)

```javascript
const { MongoClient } = require("mongodb");

// Replace with your actual MongoDB connection string
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "HelloWorld";

async function main() {
  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("User");

    // Insert document
    const data = {
      firstname: "Ranveer",
      lastname: "Singh",
      city: "Mumbai",
      phoneNumber: "987543210",
    };
    const insertResult = await collection.insertOne(data);
    console.log("📥 Inserted document =>", insertResult);

    // Find all documents
    const findResult = await collection.find({}).toArray();
    console.log("🔍 Found documents =>", findResult);

    // Count documents
    const countResult = await collection.countDocuments({});
    console.log("📊 Count of documents in User collection =>", countResult);

    // Query with filter
    const filteredResult = await collection.countDocuments({ firstname: "Deepika" });
    console.log("🔎 Count of documents with firstname 'Deepika' =>", filteredResult);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

main();

}
```

## Using Mongoose for MongoDB

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
It provides schemas, validation, and middleware for managing data more effectively.

### Steps to Connect Using Mongoose

1. Install Mongoose:
   First, you need to install the Mongoose library. Run the following command in
   your terminal:

```sh
npm install mongoose
```

2. Connect to MongoDB with Mongoose:
   In your `database.js` file, you can use the following code to connect to your MongoDB cluster using Mongoose.
   Code Example for `database.js` :

```javascript
const mongoose = require("mongoose");

// Replace <username>, <password>, and <cluster-url> with actual values
const mongoURI =
  "mongodb+srv://<username>:<password>@<cluster-url>/testdb?retryWrites=true&w=majority";

// Function to connect MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
```

#### Advantages of Using Mongoose:

- Schema Definitions : Define schemas for your collections, enforcing structure in your documents.

- Built-in Validation : Validate data at the schema level, ensuring consistency and accuracy.

- Middleware (Hooks): Pre and post hooks allow you to run logic before or after certain operations (e.g., save, update).

- Query Helpers : Simplify complex queries with built-in query methods.

- Model-based Approach: Provides a clear separation between business logic and database operations.
