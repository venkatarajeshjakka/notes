---
sidebar_position: 9
---

# Aggregator Pattern

A service that collects data from multiple microservices and combines them into a single response for the client.

## The Problem

Client needs data from multiple services:

```mermaid
sequenceDiagram
    participant C as Client
    participant S1 as Service 1
    participant S2 as Service 2
    participant S3 as Service 3

    C->>S1: Request 1
    S1->>C: Response 1
    C->>S2: Request 2
    S2->>C: Response 2
    C->>S3: Request 3
    S3->>C: Response 3
    C->>C: Combine Data

    Note over C: Multiple network calls<br/>Complex client logic
```

**Challenges**:

- Multiple network calls from client
- Client must handle failures separately
- Complex logic in client code
- Slow performance (sequential calls)

## What is Aggregator Pattern?

A single service that fetches data from multiple services and returns combined result:

**Key Idea**: Client makes one call, aggregator handles complexity.

## How It Works

```mermaid
graph TD
    C[Client] -->|1. Single Request| A[Aggregator Service]

    A -->|2. Fetch| S1[User Service]
    A -->|2. Fetch| S2[Order Service]
    A -->|2. Fetch| S3[Product Service]

    S1 -->|3. Return| A
    S2 -->|3. Return| A
    S3 -->|3. Return| A

    A -->|4. Combined Response| C

    style A fill:#9f9,stroke:#333
```

## What Aggregator Does

- **Combines**: Merges data from multiple services
- **Transforms**: Filters and formats data as needed
- **Joins**: Links related data together

## Benefits

- **Fewer Network Calls**: Client makes one request instead of many
- **Parallel Processing**: Aggregator fetches data concurrently
- **Simpler Client**: No complex aggregation logic in client
- **Better Performance**: Faster than sequential calls
- **Centralized Logic**: Aggregation logic in one place

## Challenges

- **Single Point of Failure**: Aggregator becomes critical
- **Increased Latency**: Slowest service determines response time
- **Tight Coupling**: Aggregator depends on multiple services
- **Error Handling**: Must handle failures from multiple services
