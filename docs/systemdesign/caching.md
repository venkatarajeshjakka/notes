---
sidebar_position: 8
---

# Caching in Distributed Systems

## What is Caching?

Caching is a technique to store frequently accessed data in a fast-access layer (cache) to improve performance and reduce load on the primary data source.

### Key Benefits

1. **Reduce network calls** - Data served from nearby cache instead of remote servers
2. **Avoid repeated computations** - Store computation results for reuse
3. **Reduce database load** - Fewer queries to primary database

```mermaid
graph LR
    A[Client] -->|Request| B{Cache?}
    B -->|Hit| C[Return from Cache]
    B -->|Miss| D[Database]
    D -->|Store| B
    D -->|Return| A
    style C fill:#90EE90
    style D fill:#FFB6C1
```

## Cache Placement Strategies

### 1. Client-Side Cache

Browser cache, mobile app cache

```mermaid
graph TD
    A[Browser Cache] --> B[CDN]
    B --> C[Application Server]
    C --> D[Database]
```

### 2. CDN Cache

Content Delivery Network for static assets

### 3. Application Cache

In-memory cache (Redis, Memcached)

### 4. Database Cache

Query result cache, buffer pools

```mermaid
graph TB
    Client[Client]
    CDN[CDN Cache<br/>Static Assets]
    AppCache[App Cache<br/>Redis/Memcached]
    DB[(Database<br/>with Query Cache)]

    Client -->|1. Request| CDN
    CDN -->|2. Miss| AppCache
    AppCache -->|3. Miss| DB

    style CDN fill:#E6F3FF
    style AppCache fill:#FFF4E6
    style DB fill:#F0F0F0
```

## Cache Replacement Policies

When cache is full, these policies determine which data to evict.

### 1. LRU (Least Recently Used)

Evict the least recently accessed item.

```mermaid
graph LR
    A[Cache: A B C D] -->|Access E| B[Evict A<br/>Cache: B C D E]
    style A fill:#FFE6E6
    style B fill:#E6FFE6
```

**Use Case:** General-purpose caching

### 2. LFU (Least Frequently Used)

Evict the least frequently accessed item.

```mermaid
graph TD
    A[Item A: 10 hits]
    B[Item B: 5 hits]
    C[Item C: 2 hits]
    D[Item D: 8 hits]

    C -->|Evicted First| E[Lowest Frequency]

    style C fill:#FFB6C1
```

**Use Case:** When access patterns are consistent over time

### 3. FIFO (First In First Out)

Evict the oldest item in cache.

**Use Case:** Simple queuing scenarios

### 4. TTL (Time To Live)

Items expire after a fixed time period.

```mermaid
gantt
    title Cache TTL Example
    dateFormat mm:ss
    section Item A
    Cached     :00:00, 05:00
    Expired    :05:00, 05:01
    section Item B
    Cached     :01:00, 06:00
```

**Use Case:** Session data, temporary tokens

## Common Caching Use Cases

| Use Case         | Example                | Cache Type        |
| ---------------- | ---------------------- | ----------------- |
| Web Pages        | Product listings       | CDN, App Cache    |
| API Responses    | User profiles          | Redis/Memcached   |
| Session Data     | Login sessions         | In-memory cache   |
| Database Queries | Frequent reports       | Query cache       |
| Static Assets    | Images, CSS, JS        | CDN               |
| Computed Results | Analytics aggregations | Application cache |

## Caching Challenges

### 1. Cache Invalidation

Keeping cache synchronized with source data.

```mermaid
graph TD
    A[Database Updated] -->|Option 1| B[Invalidate Cache]
    A -->|Option 2| C[Update Cache]
    A -->|Option 3| D[Set TTL]

    B --> E[Next read: Cache miss]
    C --> F[Next read: Fresh data]
    D --> G[Auto-expire after time]
```

### 2. Cache Stampede

Multiple requests hit database when popular cache item expires.

```mermaid
sequenceDiagram
    participant C1 as Client 1
    participant C2 as Client 2
    participant C3 as Client 3
    participant Cache
    participant DB

    Note over Cache: Item expires

    C1->>Cache: Request
    C2->>Cache: Request
    C3->>Cache: Request

    Cache-->>C1: Miss
    Cache-->>C2: Miss
    Cache-->>C3: Miss

    C1->>DB: Query
    C2->>DB: Query
    C3->>DB: Query

    Note over DB: Overload!
```

**Solution:** Use cache locking or probabilistic early expiration

### 3. Cold Start Problem

Empty cache after restart leads to database overload.

### 4. Cache Consistency

Ensuring cache reflects latest data across distributed systems.

## Best Practices

1. **Set appropriate TTL** - Balance freshness vs performance
2. **Monitor cache hit ratio** - Target >80% for efficiency
3. **Use cache-aside pattern** - Application manages cache logic
4. **Implement graceful degradation** - System works if cache fails
5. **Cache immutable data** - Reduces invalidation complexity
6. **Use versioned keys** - Easier cache invalidation (`user:123:v2`)

---

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-22
