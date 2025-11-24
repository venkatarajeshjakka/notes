---
sidebar_position: 12
---

# CQRS

Command Query Responsibility Segregation - Separate models for reading and writing data.

## The Problem

Traditional systems use the same model for reads and writes:

```mermaid
graph TD
    R[Read Requests] --> DB[(Single Database)]
    W[Write Requests] --> DB

    DB -->|Same Schema| R
    DB -->|Same Schema| W

    Note[Problems:<br/>- Complex queries slow down writes<br/>- Write model not optimized for reads<br/>- Hard to scale reads and writes independently]

    style DB fill:#f99,stroke:#333
```

**Challenges**:

- Same database handles both reads and writes
- Complex read queries impact write performance
- Cannot optimize for different access patterns
- Difficult to scale independently

## What is CQRS?

Separate the read model from the write model:

```mermaid
graph LR
    W[Write Requests<br/>Commands] --> WM[Write Model]
    WM --> WDB[(Write DB)]

    WDB -.->|Sync| RDB[(Read DB)]

    R[Read Requests<br/>Queries] --> RM[Read Model]
    RM --> RDB

    style WM fill:#9f9,stroke:#333
    style RM fill:#9f9,stroke:#333
```

**Key Idea**: Commands change data, queries retrieve data - use separate models for each.

## Core Concepts

### Commands

Change the system state:

```mermaid
graph LR
    C[Command] -->|Create Order| H[Command Handler]
    H --> DB[(Write DB)]
    H -->|Success/Fail| C

    style H fill:#9f9,stroke:#333
```

- **Creates/Updates/Deletes** data
- **Returns**: Success or failure (not data)
- **Examples**: CreateOrder, UpdateUser, DeleteProduct

### Queries

Read data without changing state:

```mermaid
graph LR
    Q[Query] -->|Get Orders| H[Query Handler]
    H --> DB[(Read DB)]
    H -->|Return Data| Q

    style H fill:#9f9,stroke:#333
```

- **Reads** data only
- **Returns**: Requested data
- **Examples**: GetOrderById, GetUserList, SearchProducts

## Benefits

- **Optimized Models**: Write model for updates, read model for queries
- **Independent Scaling**: Scale reads and writes separately
- **Better Performance**: Optimized databases for each operation
- **Flexibility**: Different storage technologies for reads and writes
- **Simpler Queries**: Read model tailored for specific views

## Challenges

- **Complexity**: Two models to maintain
- **Eventual Consistency**: Read model may lag behind write model
- **Data Synchronization**: Need mechanism to sync data
- **More Infrastructure**: Multiple databases to manage
