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

```
                    0/2^32
                      ●
                   ╱     ╲
                ╱           ╲
              ╱               ╲
        2^30 ●                 ● 2^31
             │                 │
             │                 │
             │                 │
        2^29 ●                 ● 2^33
              ╲               ╱
                ╲           ╱
                   ╲     ╱
                      ●
                    2^28

         Hash Ring (0 to 2^32)
```

**Step 1: Place Servers on Ring**

Hash each server name and place it on the ring:

```
                    0
                    ●
                 ╱     ╲
              ╱           ╲
     Server A ●             ● Server B
             │               │
             │               │
             │               │
             ●               ●
              ╲             ╱
                ╲         ╱
                    ●
                Server C

hash("Server A") → Position on ring
hash("Server B") → Position on ring
hash("Server C") → Position on ring
```

**Step 2: Place Keys on Ring**

Hash each key and find the next server clockwise:

```
                    0
                    ●
                 ╱     ╲
      Key1 →  ╱           ╲  ← Key2
     Server A ●             ● Server B
             │               │
             │  Key3 →       │
             │               │
             ●               ●
              ╲             ╱
                ╲         ╱
                    ●
                Server C

Key1 → goes to Server A (next clockwise)
Key2 → goes to Server B (next clockwise)
Key3 → goes to Server C (next clockwise)
```

---

## Hashing Requests

### How It Works

1. **Hash the request key** (user ID, session ID, URL, etc.)
2. **Find position on ring**
3. **Move clockwise** to find the first server
4. **Route request** to that server

```
Request Flow:

Client Request (key: "user123")
         │
         ▼
  hash("user123") = 4567
         │
         ▼
  Find position on ring
         │
         ▼
  Move clockwise to next server
         │
         ▼
  Route to Server B
```

---

## How to Avoid Skewed Load

**Problem:** With few servers, one server might get most of the keys.

```
Bad Distribution:

                    ●
                 ╱     ╲
              ╱           ╲
   Server A ●               ● Server B
      │   Many keys here    │
      │                     │
      │    Few keys         │
      ●                     ●
       ╲                   ╱
         ╲               ╱
             ●
           Server C
```

### Solution: Virtual Nodes (Vnodes)

Create multiple "virtual" positions for each physical server.

### Visual with Virtual Nodes

```
              0
              ●
           ╱     ╲
        ╱           ╲
    A1 ●             ● B1
       │               │
    C2 ●               ● A2
       │               │
    B2 ●               ● C1
        ╲             ╱
          ╲         ╱
              ●
             A3, B3, C3

9 virtual nodes for 3 physical servers
Better distribution of keys!
```

### Benefits of Virtual Nodes

1. **Even Distribution**

   - Keys spread more uniformly across servers
   - Reduces hotspots

2. **Smooth Scaling**

   - When adding server, load redistributed gradually
   - Multiple small chunks move, not one large chunk

3. **Flexibility**
   - More powerful servers can have more virtual nodes
   - Example: Server A (16 vnodes), Server B (8 vnodes)

#

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-20
