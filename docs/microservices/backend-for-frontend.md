---
sidebar_position: 8
---

# Backend for Frontend (BFF)

A dedicated backend service tailored specifically for each frontend application (web, mobile, desktop), optimizing API responses for each client's needs.

## The Problem

Different frontends have different needs, but share the same API:

```mermaid
graph TD
    W[Web App] --> API[Shared API]
    M[Mobile App] --> API
    D[Desktop App] --> API

    API --> S1[Service 1]
    API --> S2[Service 2]
    API --> S3[Service 3]

    Note1[Web needs full data]
    Note2[Mobile needs minimal data]
    Note3[Desktop needs different format]

    style API fill:#f99,stroke:#333
```

**Challenges**:

- Mobile needs minimal data (bandwidth constraints)
- Web needs rich data (large screen)
- Desktop needs different formats
- One API tries to serve all, becoming complex
- Slow performance due to unnecessary data

## What is BFF?

Create separate backend services for each frontend:

```mermaid
graph TD
    W[Web App] --> BW[Web BFF]
    M[Mobile App] --> BM[Mobile BFF]
    D[Desktop App] --> BD[Desktop BFF]

    BW --> S1[Service 1]
    BW --> S2[Service 2]
    BM --> S1
    BM --> S3[Service 3]
    BD --> S2
    BD --> S3

    style BW fill:#9f9,stroke:#333
    style BM fill:#9f9,stroke:#333
    style BD fill:#9f9,stroke:#333
```

**Key Idea**: Each frontend gets exactly what it needs, nothing more, nothing less.

## Example: E-commerce Dashboard

### Without BFF

All clients use same API:

```mermaid
graph LR
    A[Mobile] --> API[API Gateway]
    B[Web] --> API

    API --> C{Returns Same Data}
    C -->|100KB| A
    C -->|100KB| B

    style C fill:#f99,stroke:#333
```

**Problems**:

- Mobile gets too much data
- Multiple API calls needed
- Complex client-side logic

### With BFF

Each client has tailored API:

```mermaid
graph LR
    M[Mobile] --> BM[Mobile BFF]
    W[Web] --> BW[Web BFF]

    BM --> S[Services]
    BW --> S

    BM -->|20KB Minimal| M
    BW -->|100KB Full| W

    style BM fill:#9f9,stroke:#333
    style BW fill:#9f9,stroke:#333
```

**Benefits**:

- Mobile gets lightweight response
- Web gets rich response
- One call instead of many

## Key Benefits

### 1. Optimized for Each Client

**Mobile BFF** - Minimal data:
```json
{ "product": "Laptop", "price": 999, "image": "small.jpg" }
```

**Web BFF** - Rich data:
```json
{ "product": "Laptop", "price": 999, "images": [...], "reviews": [...] }
```

### 2. Less Network Traffic

```mermaid
graph LR
    A[Without BFF: 100KB] --> M1[Mobile]
    B[With BFF: 20KB] --> M2[Mobile]

    style A fill:#f99,stroke:#333
    style B fill:#9f9,stroke:#333
```

### 3. Simpler Frontend

- **Without BFF**: Frontend makes multiple calls, handles complex logic
- **With BFF**: One simple call, BFF handles complexity

## Implementation Patterns

### Pattern 1: One BFF per Client Type

```mermaid
graph TD
    W[Web App] --> BW[Web BFF]
    M[Mobile App] --> BM[Mobile BFF]
    TV[Smart TV] --> BT[TV BFF]

    BW --> MS[Microservices]
    BM --> MS
    BT --> MS

    style BW fill:#9f9,stroke:#333
    style BM fill:#9f9,stroke:#333
    style BT fill:#9f9,stroke:#333
```

**Best For**: Different platforms with distinct needs

### Pattern 2: One BFF per Team

```mermaid
graph TD
    WT[Web Team] --> BW[Web BFF]
    MT[Mobile Team] --> BM[Mobile BFF]

    BW --> S[Services]
    BM --> S

    style BW fill:#9f9,stroke:#333
    style BM fill:#9f9,stroke:#333
```

**Best For**: Independent teams managing their own stack

### Pattern 3: Hybrid Approach

```mermaid
graph TD
    W[Web] --> BW[Web BFF]
    M[Mobile] --> BM[Mobile BFF]

    BW --> AG[API Gateway]
    BM --> AG

    AG --> S[Services]

    style BW fill:#9f9,stroke:#333
    style BM fill:#9f9,stroke:#333
    style AG fill:#ff9,stroke:#333
```

**Best For**: BFF for transformation, Gateway for routing

## When to Use

✅ **Good Fit**:

- Multiple frontend platforms (web, mobile, desktop)
- Different data needs per platform
- Mobile performance is critical
- Teams own end-to-end (frontend + BFF)
- Need to iterate quickly on UI

❌ **Not Needed**:

- Single frontend application
- All clients need same data
- Simple API requirements
- Small team managing everything
- APIs already optimized
