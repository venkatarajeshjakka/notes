---
sidebar_position: 5
---

# Database Per Service

Each microservice owns its database. This isolation allows services to be developed, deployed, and scaled independently.

## The Concept

```mermaid
graph TD
    subgraph "Database Per Service"
        A1[Order Service] --> DB1[(Order DB)]
        B1[User Service] --> DB2[(User DB)]
        C1[Product Service] --> DB3[(Product DB)]
    end

    subgraph "Shared Database (Anti-pattern)"
        A2[Order Service] --> DB4[(Shared DB)]
        B2[User Service] --> DB4
        C2[Product Service] --> DB4
    end

    style DB1 fill:#9f9,stroke:#333
    style DB2 fill:#9f9,stroke:#333
    style DB3 fill:#9f9,stroke:#333
    style DB4 fill:#f99,stroke:#333
```

## Why Database Per Service?

- **Independence**: Services don't break when others change their schema
- **Technology Choice**: Use the best database for each service's needs
- **Scalability**: Scale databases based on individual service requirements
- **Fault Isolation**: Database failure affects only one service
- **Clear Ownership**: One team owns service and its data

## Implementation Approaches

### 1. Private Tables Per Service

Each service owns specific tables in a shared database instance:

```mermaid
graph TD
    subgraph "Shared Database Instance"
        subgraph "Order Service Tables"
            T1[orders]
            T2[order_items]
        end

        subgraph "User Service Tables"
            T3[users]
            T4[user_profiles]
        end

        subgraph "Product Service Tables"
            T5[products]
            T6[inventory]
        end
    end

    A[Order Service] -.->|Only Access| T1
    A -.->|Only Access| T2
    B[User Service] -.->|Only Access| T3
    B -.->|Only Access| T4
    C[Product Service] -.->|Only Access| T5
    C -.->|Only Access| T6
```

**Pros**:

- Simple to set up
- Cost-effective

**Cons**:

- Temptation to access other tables
- Shared database resources
- Cannot use different database types

### 2. Schema Per Service

Each service has its own schema in a shared database instance:

```mermaid
graph TD
    subgraph "Database Instance"
        subgraph "order_schema"
            T1[orders]
            T2[order_items]
        end

        subgraph "user_schema"
            T3[users]
            T4[profiles]
        end

        subgraph "product_schema"
            T5[products]
            T6[inventory]
        end
    end

    A[Order Service] --> T1
    B[User Service] --> T3
    C[Product Service] --> T5
```

**Pros**:

- Better logical separation
- Access control via schema permissions
- Easier backup/restore per service

**Cons**:

- Still shares database resources
- Limited technology choice

### 3. Database Server Per Service

Each service has its own database server:

```mermaid
graph TD
    A[Order Service] --> DB1[(PostgreSQL)]
    B[User Service] --> DB2[(MongoDB)]
    C[Product Service] --> DB3[(MySQL)]
    D[Search Service] --> DB4[(Elasticsearch)]

    style DB1 fill:#9f9,stroke:#333
    style DB2 fill:#9f9,stroke:#333
    style DB3 fill:#9f9,stroke:#333
    style DB4 fill:#9f9,stroke:#333
```

**Pros**:

- Complete isolation
- Choose best database for each service
- Independent scaling
- True service autonomy

**Cons**:

- Higher operational complexity
- More infrastructure costs
- Need expertise in multiple databases

## Data Access Pattern

Services communicate via APIs, not direct database access:

```mermaid
sequenceDiagram
    participant OS as Order Service
    participant ODB as Order DB
    participant US as User Service
    participant UDB as User DB

    OS->>ODB: Get Order
    ODB->>OS: Order Data

    Note over OS: Needs user info

    OS->>US: GET /users/{id}
    US->>UDB: Query User
    UDB->>US: User Data
    US->>OS: Return User

    OS->>OS: Combine Data
```

**Key Rule**: Never access another service's database directly.

## Challenges and Solutions

### 1. Distributed Transactions

**Problem**: Cannot use ACID transactions across multiple databases.

**Solution**: Use Saga Pattern - break into steps with undo actions:

### 2. Data Duplication

**Problem**: Services need copies of data from other services.

**Solution**: Use events to sync data when it changes:

### 3. Cross-Service Queries

**Problem**: Cannot JOIN data across databases.

**Solution - Option 1**: Call APIs to combine data:

**Solution - Option 2**: Build a read-only database (CQRS):

## When to Use

✅ **Good Fit**:

- True microservices architecture
- Services with different data requirements
- Need for independent scaling
- Multiple teams working in parallel

❌ **Not Ideal**:

- Small applications
- Highly interconnected data
- Need for complex queries across entities
- Limited operational expertise
