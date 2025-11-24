---
sidebar_position: 4
---

# Strangler Pattern

A migration strategy to gradually replace a legacy system with a new microservices architecture without causing disruption.

## The Concept

Named after strangler fig trees that grow around host trees and eventually replace them. Similarly, new services gradually "strangle" the old system until it can be retired.

## The Problem

Traditional "big bang" rewrites are risky:

- Long development cycles without business value
- High risk of failure
- Service disruption during cutover
- Difficult to roll back
- Business must wait months/years for benefits

## How It Works

### Three-Step Process

1. **Intercept**: Route traffic through a facade/proxy
2. **Migrate**: Gradually move features to new services
3. **Retire**: Remove old code as new services take over

```mermaid
sequenceDiagram
    participant U as User
    participant F as Facade Layer
    participant L as Legacy System
    participant N as New Service

    U->>F: Request
    F->>F: Routing Decision

    alt Feature migrated
        F->>N: Forward to new service
        N->>F: Response
    else Feature not migrated
        F->>L: Forward to legacy
        L->>F: Response
    end

    F->>U: Response
```

## Migration Phases

### Phase 1: Setup Facade

Add a routing layer in front of the legacy system:

```mermaid
graph LR
    A[Client] --> B[Facade/Proxy]
    B --> C[Legacy Monolith]

    style B fill:#f9f,stroke:#333
```

**Actions**:

- Deploy facade/API gateway
- Route all traffic through it
- No changes to legacy system yet

### Phase 2: Incremental Migration

Migrate features one at a time:

```mermaid
graph LR
    A[Client] --> B[Facade]
    B -->|User Auth| C[Auth Service ✓]
    B -->|Orders| D[Legacy System]
    B -->|Products| D
    B -->|Payments| E[Payment Service ✓]

    style C fill:#9f9,stroke:#333
    style E fill:#9f9,stroke:#333
    style D fill:#ff9,stroke:#333
```

**Actions**:

- Build new service for one feature
- Update facade routing rules
- Test thoroughly
- Repeat for next feature

### Phase 3: Complete Replacement

All features migrated, retire legacy:

```mermaid
graph LR
    A[Client] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Order Service]
    B --> E[Product Service]
    B --> F[Payment Service]
    G[Legacy System - Deleted]

    style C fill:#9f9,stroke:#333
    style D fill:#9f9,stroke:#333
    style E fill:#9f9,stroke:#333
    style F fill:#9f9,stroke:#333
    style G fill:#ccc,stroke:#999
```

## Benefits

- **Low Risk**: Incremental changes, easy to rollback
- **Continuous Value**: Deliver new services as they're ready
- **No Downtime**: System runs throughout migration
- **Team Flexibility**: Multiple teams can work in parallel
- **Learn and Adapt**: Improve approach based on early migrations

## Tools and Techniques

### API Gateway Options

| Tool                | Use Case                      |
| ------------------- | ----------------------------- |
| **NGINX**           | Simple routing, reverse proxy |
| **Kong**            | Advanced routing, plugins     |
| **AWS API Gateway** | Cloud-native, managed service |
| **Envoy**           | Service mesh, complex routing |

### Feature Flags

```mermaid
graph LR
    A[Request] --> B{Feature Flag}
    B -->|Enabled| C[New Service]
    B -->|Disabled| D[Legacy System]

    style B fill:#f9f,stroke:#333
```

Use feature flags to gradually roll out new services:

- A/B testing new implementation
- Canary deployments
- Quick rollback if issues arise

## When to Use

✅ **Good Fit**:

- Large legacy monoliths
- Active development on legacy system
- Cannot afford downtime
- Want to deliver value incrementally
- Team needs to learn microservices gradually

❌ **Not Ideal**:

- Small, simple applications
- Legacy system is barely used
- Can afford a complete rewrite
- Clear cutover date required
