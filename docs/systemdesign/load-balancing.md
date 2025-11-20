---
sidebar_position: 3
---

# Load Balancing

## What is Load Balancing?

Load balancing distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed. It improves application availability, reliability, and performance.

```
         ┌─────────┐
         │ Clients │
         └────┬────┘
              │
       ┌──────▼──────┐
       │   Load      │
       │  Balancer   │
       └──────┬──────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Server1│ │Server2│ │Server3│
└───────┘ └───────┘ └───────┘
```

**Benefits:**

- Prevents server overload
- Increases availability (no single point of failure)
- Enables horizontal scaling
- Improves response time

---

## Load Balancing Algorithms

### 1. Round Robin

Distributes requests sequentially to each server in rotation.

```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1  (back to first)
Request 5 → Server 2
```

**Pros:**

- Simple and easy to implement
- Fair distribution
- No server state needed

**Cons:**

- Doesn't consider server load
- Not ideal for long-lived connections
- Assumes all servers have equal capacity

**Use When:** All servers have similar capacity and requests take similar time

---

### 2. Weighted Round Robin

Similar to Round Robin but assigns different weights to servers based on their capacity.

```
Server 1 (weight: 3)
Server 2 (weight: 2)
Server 3 (weight: 1)

Request 1 → Server 1
Request 2 → Server 1
Request 3 → Server 1
Request 4 → Server 2
Request 5 → Server 2
Request 6 → Server 3
```

**Use When:** Servers have different capacities (e.g., different CPU/RAM)

---

### 3. Least Connections

Routes requests to the server with the fewest active connections.

```
Server 1: 5 connections  ←
Server 2: 3 connections  ← New request goes here
Server 3: 7 connections
```

**Pros:**

- Better for long-lived connections
- Adapts to server load dynamically
- Handles variable request processing times

**Cons:**

- More complex than Round Robin
- Requires tracking connection state

**Use When:** Requests have variable processing times or connections are long-lived

---

### 4. Least Response Time

Routes to server with lowest response time and fewest active connections.

**Use When:** Performance is critical and you need fastest response

---

### 5. IP Hash

Uses client IP address to determine which server receives the request.

```
hash(Client IP) % number_of_servers = Server Index

Client A (192.168.1.10) → hash → Server 2
Client B (192.168.1.20) → hash → Server 1
Client A (192.168.1.10) → hash → Server 2 (same)
```

**Pros:**

- Same client always goes to same server
- Good for session persistence
- No need for shared session storage

**Cons:**

- Uneven distribution if clients behind NAT
- Adding/removing servers disrupts mapping

**Use When:** Session persistence is needed without sticky sessions

---

## Hashing Requests

Hashing distributes requests based on a hash of request attributes (IP, URL, headers).

### Consistent Hashing

Minimizes remapping when servers are added or removed.

```
Traditional Hashing Problem:
- 3 servers → add 1 server
- Most keys need to be remapped

Consistent Hashing:
         Server Ring
    S1 ─────●─────── S3
     │              │
     │              │
    S4 ─────●─────── S2

- Only 1/n keys remapped when adding/removing server
```

**Benefits:**

- Minimal disruption when scaling
- Better cache hit rates
- Used by Redis, Memcached clusters

**Use When:**

- Caching layers
- Distributed databases
- Servers frequently added/removed

---

## Sticky Sessions (Session Affinity)

Ensures requests from the same client always go to the same server during a session.

### How It Works

```
         ┌─────────┐
         │Client A │
         └────┬────┘
              │ (sends cookie: server=1)
       ┌──────▼──────┐
       │Load Balancer│ (reads cookie)
       └──────┬──────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼───┐ ┌───────┐ ┌───────┐
│Server1│ │Server2│ │Server3│
│  ★    │ │       │ │       │
└───────┘ └───────┘ └───────┘
  (Client A always here)
```

### Implementation Methods

**1. Cookie-Based**

```
Client → Load Balancer
Load Balancer → Sets cookie: SERVERID=server1
Future requests with cookie → Always to server1
```

**2. IP Hash**

```
Same client IP → Same server (via hashing)
```

### Pros & Cons

**Pros:**

- Preserves session state on specific server
- Simpler than distributed sessions
- No session replication needed

**Cons:**

- Uneven load distribution
- If server fails, sessions are lost
- Harder to scale down
- Can't easily switch servers

---

## Load Balancer Types

### Layer 4 (Transport Layer)

Routes based on IP and TCP/UDP port.

```
Client → Load Balancer (checks IP:Port) → Server
```

**Characteristics:**

- Fast (no packet inspection)
- Works with any protocol
- Can't route based on content

**Examples:** AWS NLB, HAProxy (L4 mode)

---

### Layer 7 (Application Layer)

Routes based on HTTP headers, URL, cookies, etc.

```
Client → Load Balancer (reads HTTP content) → Server

/api/users   → Server Pool A
/api/orders  → Server Pool B
Host: app.com → Server Pool C
```

**Characteristics:**

- Intelligent routing
- SSL termination
- Slower than L4

**Examples:** Nginx, HAProxy (L7 mode), AWS ALB

---

## Health Checks

Load balancers monitor server health and remove unhealthy servers from rotation.

```
┌──────────────┐
│Load Balancer │
└───┬──────┬───┘
    │      │
    │  Health Check (every 10s)
    │      │
┌───▼──┐ ┌─▼────┐ ┌───────┐
│Server│ │Server│ │Server │
│  ✓   │ │  ✗   │ │  ✓    │
└──────┘ └──────┘ └───────┘
         (removed)
```

**Check Types:**

- **Ping:** Simple connectivity check
- **TCP:** Can connect to port
- **HTTP:** GET request returns 200 OK
- **Custom:** Application-specific health endpoint

**Parameters:**

- Interval: How often to check
- Timeout: How long to wait
- Threshold: Failures before marking unhealthy

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-20
