---
sidebar_position: 10
---

# API Gateway

A single entry point for all client requests that handles routing, authentication, rate limiting, and other cross-cutting concerns.

## The Problem

Clients directly calling multiple microservices creates complexity:

```mermaid
graph TD
    C[Client] -->|Auth, Security| S1[User Service]
    C -->|Auth, Security| S2[Order Service]
    C -->|Auth, Security| S3[Product Service]
    C -->|Auth, Security| S4[Payment Service]

    Note1[Client must handle:<br/>- Multiple endpoints<br/>- Authentication for each<br/>- Different protocols<br/>- Rate limiting]

    style C fill:#f99,stroke:#333
```

**Challenges**:

- Client knows about all services
- Authentication logic duplicated across services
- Hard to apply consistent policies
- Difficult to monitor and log requests
- Complex client code

## What is API Gateway?

Single entry point that routes requests to appropriate microservices:

```mermaid
graph TD
    C[Client] -->|Single Endpoint| GW[API Gateway]

    GW -->|Route| S1[User Service]
    GW -->|Route| S2[Order Service]
    GW -->|Route| S3[Product Service]
    GW -->|Route| S4[Payment Service]

    style GW fill:#9f9,stroke:#333
```

**Key Idea**: Client calls one endpoint, gateway handles all complexity.

## What Gateway Does

- **Routes**: Directs requests to correct service
- **Authenticates**: Validates user identity
- **Rate Limits**: Prevents API abuse
- **Transforms**: Adapts requests/responses
- **Aggregates**: Combines multiple service calls
- **Logs**: Monitors all traffic
- **Caches**: Stores frequent responses

## Benefits

- **Simplified Client**: One endpoint to call
- **Centralized Security**: Authentication in one place
- **Consistent Policies**: Same rules for all services
- **Easy Monitoring**: Single point to track requests
- **Protocol Translation**: Convert between formats
- **Reduced Latency**: Can cache responses
