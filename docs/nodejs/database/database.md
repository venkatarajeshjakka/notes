---
sidebar_position: 1
---

# Database

A **database** is an organized collection of structured or unstructured data, stored and managed electronically.  
It typically relies on a **Database Management System (DBMS)**, which provides tools and services to efficiently store, retrieve, and manipulate data.

---

## Types of Databases

Databases can be classified into different categories based on how they store, organize, and manage data:

- **Relational Database (RDBMS):**  
  Stores data in tables (rows and columns) with predefined schemas.  
  _Examples:_ MySQL, PostgreSQL, Oracle DB

- **NoSQL Database:**  
  Schema-less databases designed for unstructured, semi-structured, or rapidly changing data.  
  _Examples:_ MongoDB (document-oriented), Cassandra (wide-column), DynamoDB (key-value)

- **In-Memory Database:**  
  Optimized for high performance by keeping data in memory rather than on disk.  
  _Examples:_ Redis, Memcached

- **Distributed SQL Database:**  
  Provides horizontal scalability and high availability while maintaining SQL capabilities.  
  _Examples:_ CockroachDB, YugabyteDB

- **Time-Series Database:**  
  Specialized for handling time-stamped or time-series data, often used in monitoring and IoT applications.  
  _Examples:_ InfluxDB, TimescaleDB

- **Graph Database:**  
  Stores data as nodes and edges to represent and traverse complex relationships.  
  _Examples:_ Neo4j, Amazon Neptune

- **Hierarchical Database:**  
  Organizes data in a tree-like structure with parent-child relationships.  
  _Examples:_ IBM IMS

- **Network Database:**  
  Uses a flexible graph-like model with multiple relationships between entities.  
  _Examples:_ IDMS (Integrated Database Management System)

- **Cloud Database:**  
  Managed databases hosted on cloud platforms, providing scalability and reduced infrastructure management.  
  _Examples:_ Amazon RDS, Google Cloud SQL, Azure SQL Database

---

## RDBMS vs NoSQL (MongoDB)

| Feature             | RDBMS (e.g., MySQL, PostgreSQL) | NoSQL (Document DB – MongoDB)                                  |
| ------------------- | ------------------------------- | -------------------------------------------------------------- |
| **Data Model**      | Tables (rows & columns)         | Documents (JSON/BSON)                                          |
| **Schema**          | Fixed, predefined schema        | Flexible, dynamic schema                                       |
| **Scalability**     | Vertical (scale-up)             | Horizontal (scale-out)                                         |
| **ACID Compliance** | Strong ACID support             | Eventual consistency (with options for ACID in newer versions) |
| **Use Cases**       | Financial systems, ERP, CRM     | Real-time apps, IoT, content management                        |
| **Examples**        | MySQL, PostgreSQL, Oracle       | MongoDB, CouchDB                                               |

---

✅ **Key takeaway:**

- Use **RDBMS** when data is structured, relationships are critical, and transactions require strict consistency.
- Use **NoSQL** when data is unstructured, rapidly changing, and requires flexible schema with massive scalability.
