---
sidebar_position: 6
---

# Microservice Architecture

## What are Microservices?

Microservices are an architectural approach where an application is built as a collection of small, independent services that communicate over well-defined APIs. Each service is self-contained and focuses on a specific business capability.

---

## Monolith vs Microservices

### Monolithic Architecture

Single unified codebase where all components are tightly integrated.

```
┌─────────────────────────────────┐
│      Monolithic Application     │
│                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ User │  │Order │  │Payment│ │
│  │ Mgmt │  │ Mgmt │  │ Mgmt  │ │
│  └──────┘  └──────┘  └──────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │   Shared Database        │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘

One deployment, one codebase
```

**Characteristics:**

- Single codebase
- Shared database
- Deployed as one unit
- Tight coupling

### Microservices Architecture

Application split into independent services.

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │  Order   │    │ Payment  │
│ Service  │    │ Service  │    │ Service  │
│          │    │          │    │          │
│ ┌──────┐ │    │ ┌──────┐ │    │ ┌──────┐ │
│ │  DB  │ │    │ │  DB  │ │    │ │  DB  │ │
│ └──────┘ │    │ └──────┘ │    │ └──────┘ │
└──────────┘    └──────────┘    └──────────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
              API Gateway/Network

Multiple deployments, multiple codebases
```

**Characteristics:**

- Multiple small services
- Each has own database
- Independently deployable
- Loose coupling

### Comparison

| Aspect             | Monolith         | Microservices             |
| ------------------ | ---------------- | ------------------------- |
| **Structure**      | Single unit      | Multiple services         |
| **Database**       | Shared           | Per service               |
| **Deployment**     | All at once      | Independent               |
| **Scaling**        | Scale entire app | Scale individual services |
| **Technology**     | One stack        | Multiple stacks           |
| **Development**    | Simple initially | Complex from start        |
| **Team**           | Centralized      | Distributed               |
| **Failure Impact** | Entire app down  | Service isolated          |

---

## Microservices Benefits

### 1. Independent Deployment

Deploy services separately without affecting others.

**Example:** Update payment service without touching user or order services.

### 2. Technology Flexibility

Each service can use different tech stack.

**Example:** User Service (Node.js), Order Service (Java), Payment Service (Python).

### 3. Scalability

Scale only the services that need it.

**Example:** During Black Friday, scale Order and Payment services 10x while User service stays at 1x.

### 4. Fault Isolation

If one service fails, others continue working.

**Example:** Payment down → Users can still browse products.

### 5. Team Autonomy

Small teams own specific services end-to-end, faster delivery.

### 6. Easier Maintenance

Smaller codebases easier to understand and modify.

---

## Microservices Challenges

### 1. Distributed Complexity

Managing multiple services harder than one application.

**Issues:** Network failures, service discovery, debugging across services, complex testing.

### 2. Data Consistency

Each service has own database. Keeping data consistent is challenging.

**Example:** Order placed but payment fails → Need distributed transactions or sagas.

### 3. Network Latency

Network calls slower than in-memory calls (50ms vs 0.001ms).

### 4. Deployment Complexity

Need container orchestration (Kubernetes), CI/CD, monitoring tools.

### 5. Testing Difficulty

Unit tests, integration tests, end-to-end tests all required.

---

## Key Concepts

### 1. Service Boundaries

Each service has clear responsibility (User Management, Order Processing, Payment, Inventory, Notifications).

### 2. API Gateway

Single entry point for all client requests. Routes to appropriate services.

```
┌────────┐
│ Client │
└───┬────┘
    │
┌───▼──────────┐
│ API Gateway  │
└───┬──────────┘
    │
    ├──► User Service
    ├──► Order Service
    └──► Payment Service
```

**Handles:** Routing, authentication, rate limiting, load balancing.

### 3. Service Discovery

Services find each other dynamically. Tools: Consul, Eureka, etcd.

### 4. Communication Patterns

**Synchronous:** REST/gRPC - Service A waits for Service B response.

**Asynchronous:** Message Queue - Service A continues without waiting.

### 5. Database Per Service

Each service owns its database. Enables loose coupling, independent scaling.

**Challenge:** Data consistency across services.

### 6. Event-Driven Architecture

Services communicate through events via message bus.

**Example:** OrderCreated event → Payment, Inventory, Email services react.

### 7. Circuit Breaker

Prevent cascading failures. If service fails repeatedly, stop calling it temporarily.

---

## Design Patterns

### 1. API Gateway Pattern

Single entry point for clients. Simplifies client but can become bottleneck.

### 2. Backend for Frontend (BFF)

Separate gateway for each client type (Mobile BFF, Web BFF).

### 3. Saga Pattern

Manage distributed transactions. If step fails, rollback previous steps.

### 4. CQRS

Separate read and write operations for optimization.

### 5. Strangler Fig Pattern

Gradually migrate from monolith by extracting services one at a time.

---

## When to Use Microservices

### Use When:

- Large teams working independently
- Complex domain needing different tech
- High scalability needs
- Frequent deployments required
- Long-term project

**Examples:** Netflix, Amazon, Uber, Airbnb

### Avoid When:

- Small team
- Simple application
- Startup/MVP
- Unclear requirements
- Limited DevOps skills

**Start with:** Monolith → Extract services as needed

📌 **Author:** Venkata Rajesh Jakka
📅 **Date:** 2025-11-22
