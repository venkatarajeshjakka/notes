---
sidebar_position: 7
---

# Database Sharding

## What is Database Sharding?

Database sharding is a technique of splitting a large database into smaller, more manageable pieces called shards. Each shard is an independent database that contains a subset of the total data.

```mermaid
graph TD
    subgraph "Before Sharding"
    BigDB[(Large Database<br/>100M records)]
    end

    subgraph "After Sharding"
    S1[(Shard 1<br/>33M records)]
    S2[(Shard 2<br/>33M records)]
    S3[(Shard 3<br/>34M records)]
    end

    BigDB -.Split.-> S1
    BigDB -.Split.-> S2
    BigDB -.Split.-> S3

    style BigDB fill:#FFB6C1
    style S1 fill:#90EE90
    style S2 fill:#90EE90
    style S3 fill:#90EE90
```

**Benefits:**

- Improved performance (smaller datasets = faster queries)
- Horizontal scalability (add more shards as data grows)
- High availability (one shard down doesn't affect others)
- Reduced cost (use commodity hardware)

---

## Horizontal Partitioning (Sharding)

Splitting database rows across multiple servers. Each server contains same schema but different rows.

```mermaid
graph TD
    App[Application] --> Router[Shard Router]

    Router -->|Users 1-3M| S1[(Shard 1)]
    Router -->|Users 3-6M| S2[(Shard 2)]
    Router -->|Users 6-10M| S3[(Shard 3)]

    style Router fill:#87CEEB
    style S1 fill:#90EE90
    style S2 fill:#E6FFE6
    style S3 fill:#FFF4E6
```

---

## Sharding Strategies

### 1. Range-Based Sharding

Divide data by ranges of a key.

**Example:** User IDs 1-1M → Shard 1, 1M-2M → Shard 2

**Pros:**

- Simple to implement
- Easy to add new shards
- Good for range queries

**Cons:**

- Uneven distribution if data not uniformly distributed
- Hotspots (newer users might all go to last shard)

### 2. Hash-Based Sharding

Use hash function to determine shard.

**Formula:** `shard = hash(user_id) % number_of_shards`

```mermaid
sequenceDiagram
    participant App
    participant HashFunc
    participant Shard

    App->>HashFunc: hash(user_id: 12345)
    HashFunc->>HashFunc: 12345 % 3 = 0
    HashFunc->>Shard: Route to Shard 0

    Note over App,Shard: Even distribution
```

**Pros:**

- Even distribution across shards
- No hotspots
- Simple algorithm

**Cons:**

- Hard to add/remove shards (requires rehashing all data)
- Use consistent hashing to mitigate

### 3. Geographic Sharding

Split by location.

**Example:** US users → US shard, EU users → EU shard

**Pros:**

- Low latency (data near users)
- Data locality/compliance (GDPR)
- Natural partitioning

**Cons:**

- Uneven load if regions differ in size
- Cross-region queries expensive

### 4. Directory-Based Sharding

Lookup table maps keys to shards.

**Pros:**

- Flexible routing logic
- Easy to rebalance (just update directory)
- Can combine strategies

**Cons:**

- Directory lookup adds latency
- Directory becomes single point of failure
- Directory table can grow large

---

## Challenges & Considerations

### 1. Data Consistency

**Challenge:** Distributed transactions across shards are complex.

```mermaid
sequenceDiagram
    participant App
    participant S1 as Shard 1
    participant S2 as Shard 2

    App->>S1: Transfer $100 from User A
    S1-->>App: Success ✓
    App->>S2: Add $100 to User B
    S2--xApp: Fail ✗

    Note over App,S2: Inconsistent state!
```

**Solutions:**

- Avoid cross-shard transactions
- Use eventual consistency
- Implement 2-phase commit or Saga pattern

### 2. Availability

**Trade-off:** CAP theorem - can't have perfect consistency and availability during partition.

**Approach:** Replicate each shard for high availability.

```mermaid
graph TD
    S1P[Shard 1 Primary] -.Replicate.-> S1R[Shard 1 Replica]
    S2P[Shard 2 Primary] -.Replicate.-> S2R[Shard 2 Replica]
    S3P[Shard 3 Primary] -.Replicate.-> S3R[Shard 3 Replica]

    style S1P fill:#90EE90
    style S2P fill:#90EE90
    style S3P fill:#90EE90
```

### 3. Cross-Shard Queries

Queries spanning multiple shards are slow and complex.

**Example:** "Find all orders from all users" requires querying all shards and merging results.

**Solutions:**

- Denormalize data to avoid joins
- Use caching for common queries
- Pre-aggregate data
- Accept eventual consistency

### 4. Rebalancing

Adding/removing shards requires data migration.

**Challenges:**

- Downtime during migration
- Data transfer time
- Maintaining consistency

---

## Master-Slave Architecture

Database replication pattern where one server (master) handles writes and multiple servers (slaves) handle reads.

```mermaid
graph TD
    App[Application]

    App -->|Writes| M[Master Database]
    App -->|Reads| LB[Load Balancer]

    M -.Replicate.-> S1[Slave 1]
    M -.Replicate.-> S2[Slave 2]
    M -.Replicate.-> S3[Slave 3]

    LB --> S1
    LB --> S2
    LB --> S3

    style M fill:#FFB6C1
    style S1 fill:#90EE90
    style S2 fill:#90EE90
    style S3 fill:#90EE90
    style LB fill:#87CEEB
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
