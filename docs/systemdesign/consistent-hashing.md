---
sidebar_position: 4
---

# Consistent Hashing

## What Problem Does It Solve?

When you have multiple cache servers or databases and need to distribute data across them, traditional hashing has a major problem: **when you add or remove a server, almost all keys need to be remapped**.

**Impact:**

- Most cache entries become invalid
- Massive cache misses
- Database gets overwhelmed
- Poor user experience

## How Consistent Hashing Solves This

Consistent hashing minimizes the number of keys that need to be remapped when servers are added or removed.

### The Hash Ring Concept

Imagine a circular ring with values from 0 to 2^32 (or any large number).

```mermaid
graph LR
    subgraph "Hash Ring"
    S0[Position 0]
    SA[Server A]
    SB[Server B]
    SC[Server C]

    S0 -.Clockwise.-> SA
    SA -.-> SB
    SB -.-> SC
    SC -.-> S0
    end

    style SA fill:#90EE90
    style SB fill:#87CEEB
    style SC fill:#FFB6C1
```

**How it works:**

1. **Hash servers:** Each server name is hashed to a position on the ring
   - `hash("Server A")` → Position on ring
   - `hash("Server B")` → Position on ring
   - `hash("Server C")` → Position on ring

2. **Hash keys:** Each key is hashed, then assigned to the next server clockwise
   - `hash("Key1")` → Find next server clockwise → Server A
   - `hash("Key2")` → Find next server clockwise → Server B

---

## Hashing Requests

### How It Works

```mermaid
sequenceDiagram
    participant Client
    participant HashFunction
    participant HashRing
    participant ServerB as Server B

    Client->>HashFunction: Request (key: "user123")
    HashFunction->>HashFunction: hash("user123") = 4567
    HashFunction->>HashRing: Find position 4567
    HashRing->>HashRing: Move clockwise
    HashRing->>ServerB: Route to Server B
    ServerB-->>Client: Response
```

**Steps:**
1. Hash the request key (user ID, session ID, URL, etc.)
2. Find position on ring
3. Move clockwise to find the first server
4. Route request to that server

---

## Virtual Nodes (Vnodes)

**Problem:** With few servers, one server might get most of the keys (uneven distribution).

**Solution:** Create multiple "virtual" positions for each physical server.

```mermaid
graph TD
    subgraph "Physical Servers"
    PA[Physical Server A]
    PB[Physical Server B]
    PC[Physical Server C]
    end

    subgraph "Virtual Nodes on Ring"
    A1[A-vnode1]
    A2[A-vnode2]
    A3[A-vnode3]
    B1[B-vnode1]
    B2[B-vnode2]
    B3[B-vnode3]
    C1[C-vnode1]
    C2[C-vnode2]
    C3[C-vnode3]
    end

    PA --> A1
    PA --> A2
    PA --> A3
    PB --> B1
    PB --> B2
    PB --> B3
    PC --> C1
    PC --> C2
    PC --> C3

    style PA fill:#90EE90
    style PB fill:#87CEEB
    style PC fill:#FFB6C1
```

### Benefits of Virtual Nodes

**1. Even Distribution**
- Keys spread more uniformly across servers
- Reduces hotspots

**2. Smooth Scaling**
- When adding a server, load is redistributed gradually
- Multiple small chunks move, not one large chunk

**3. Flexibility**
- More powerful servers can have more virtual nodes
- Example: Server A (16 vnodes), Server B (8 vnodes)
- This ensures load distribution matches server capacity

---

## Key Advantages

**Minimal Remapping:**
- Traditional hashing: Adding/removing 1 server requires remapping most keys
- Consistent hashing: Only affects keys between the new server and its predecessor (~1/n of keys)

**Use Cases:**
- Distributed caching (Redis, Memcached clusters)
- Distributed databases (Cassandra, DynamoDB)
- Load balancers
- CDN routing

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-20
