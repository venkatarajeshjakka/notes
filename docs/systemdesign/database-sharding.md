---
sidebar_position: 7
---

# Database Sharding

## What is Database Sharding?

Database sharding is a technique of splitting a large database into smaller, more manageable pieces called shards. Each shard is an independent database that contains a subset of the total data.

---

## Horizontal Partitioning (Sharding)

Splitting database rows across multiple servers. Each server contains same schema but different rows.

### How It Works

```
Users Table (10M records)
         ┌────────────┐
         │ Split by   │
         │  User ID   │
         └─────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│Shard 1│  │Shard 2│  │Shard 3│
│ID:1-3M│  │ID:3-6M│  │ID:6-10M│
└───────┘  └───────┘  └───────┘
```

### Sharding Strategies

**1. Range-Based Sharding**

Divide data by ranges of a key.

**Example:** User IDs 1-1M → Shard 1, 1M-2M → Shard 2

**Pros:** Simple, easy to implement
**Cons:** Uneven distribution, hotspots

**2. Hash-Based Sharding**

Use hash function to determine shard.

**Formula:** `shard = hash(user_id) % number_of_shards`

**Pros:** Even distribution
**Cons:** Hard to add/remove shards (use consistent hashing)

**3. Geographic Sharding**

Split by location.

**Example:** US users → US shard, EU users → EU shard

**Pros:** Low latency, data locality
**Cons:** Uneven load if regions differ in size

**4. Directory-Based Sharding**

Lookup table maps keys to shards.

**Pros:** Flexible, easy to rebalance
**Cons:** Lookup table becomes bottleneck

### Benefits

- **Improved Performance:** Smaller datasets = faster queries
- **Horizontal Scalability:** Add more shards as data grows
- **High Availability:** One shard down doesn't affect others
- **Reduced Cost:** Use commodity hardware instead of expensive single server

### Considerations

#### 1. Consistency

**Challenge:** Distributed transactions across shards are complex.

**Solutions:**

- Avoid cross-shard transactions where possible
- Use eventual consistency
- Implement 2-phase commit or Saga pattern

**Example:** Transfer money between users on different shards requires careful coordination.

#### 2. Availability

**Trade-off:** CAP theorem - can't have perfect consistency and availability during partition.

**Approach:** Replicate each shard for high availability.

```
┌───────┐     ┌───────┐     ┌───────┐
│Shard 1│     │Shard 2│     │Shard 3│
│Primary│     │Primary│     │Primary│
└───┬───┘     └───┬───┘     └───┬───┘
    │             │             │
┌───▼───┐     ┌───▼───┐     ┌───▼───┐
│Shard 1│     │Shard 2│     │Shard 3│
│Replica│     │Replica│     │Replica│
└───────┘     └───────┘     └───────┘
```

### Drawbacks

**1. Increased Complexity**

Managing multiple databases harder than one.

**2. Cross-Shard Queries**

Queries spanning multiple shards are slow and complex.

**Example:** "Find all orders from all users" requires querying all shards and merging results.

**3. Rebalancing**

Adding/removing shards requires data migration.

**4. No Foreign Keys**

Foreign key constraints don't work across shards.

**5. Application Changes**

Application must be shard-aware for routing queries.

**6. Joins Are Difficult**

Joining tables across shards requires application-level logic.

---

## Master-Slave Architecture

Database replication pattern where one server (master) handles writes and multiple servers (slaves) handle reads.

### Architecture

```
         ┌────────┐
         │ Master │ ◄─── Writes
         └───┬────┘
             │
      Replication
             │
    ┌────────┼────────┐
    │        │        │
┌───▼───┐┌───▼───┐┌───▼───┐
│Slave 1││Slave 2││Slave 3│ ◄─── Reads
└───────┘└───────┘└───────┘
```

### How It Works

1. **Write:** All write operations (INSERT, UPDATE, DELETE) go to master
2. **Replicate:** Master copies data to slaves asynchronously or synchronously
3. **Read:** Read operations distributed across slaves

### Benefits

- **Read Scalability:** Add more slaves to handle read traffic
- **High Availability:** If master fails, promote a slave
- **Backup:** Slaves serve as live backups
- **Reduced Load:** Master handles fewer queries

---

## Vertical Partitioning

Splitting table by columns instead of rows. Different columns stored on different servers.

### How It Works

```
Users Table:
┌────┬──────┬───────┬────────┬─────────┐
│ ID │ Name │ Email │ Avatar │ Bio     │
└────┴──────┴───────┴────────┴─────────┘

Split into:

Server 1 (Frequently Accessed):
┌────┬──────┬───────┐
│ ID │ Name │ Email │
└────┴──────┴───────┘

Server 2 (Less Frequently):
┌────┬────────┬─────────┐
│ ID │ Avatar │ Bio     │
└────┴────────┴─────────┘
```

### Benefits

- **Performance:** Keep frequently accessed columns together
- **Reduced I/O:** Fetch only needed columns
- **Security:** Sensitive data on separate server with stricter access
- **Specialized Storage:** Text data on one server, binary data on another

### Use Cases

**1. Separate Hot and Cold Data**

Frequently accessed vs rarely accessed columns.

**2. Security Isolation**

Store sensitive data (SSN, credit cards) separately with encryption.

**3. Optimize Storage**

Store large BLOBs (images, videos) on different storage optimized for files.

### Drawbacks

- **Join Complexity:** Joining split tables requires cross-server queries
- **Limited Scalability:** Doesn't help with large number of rows
- **More Complex Queries:** Application needs to fetch from multiple locations

---

## Horizontal vs Vertical Partitioning

| Aspect          | Horizontal (Sharding)   | Vertical                |
| --------------- | ----------------------- | ----------------------- |
| **Splits**      | Rows                    | Columns                 |
| **Use Case**    | Too many rows           | Too many columns        |
| **Scalability** | High (add more shards)  | Limited                 |
| **Complexity**  | High                    | Medium                  |
| **Queries**     | Same columns, less rows | Less columns, all rows  |
| **Example**     | Split users by ID       | Split user profile data |

---

## Real-World Examples

**Instagram:** Shards user data by user ID using hash-based sharding

**YouTube:** Geographic sharding for video storage (content closer to users)

**Shopify:** Shards merchant data (each shop in separate shard)

**Discord:** Shards by guild (server) ID, master-slave for read replicas

**Amazon:** Vertical partitioning for product catalog (basic info vs detailed specs)

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-22
