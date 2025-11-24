---
sidebar_position: 6
---

# Service Discovery

A mechanism that allows microservices to automatically locate and communicate with each other in a dynamic environment.

## The Problem

In microservices, service instances change frequently:

```mermaid
graph TD
    A[Service A needs to call Service B] --> B{How to find Service B?}
    B --> C[IP: 192.168.1.10 ❌ Crashed]
    B --> D[IP: 192.168.1.11 ✓ Running]
    B --> E[IP: 192.168.1.12 ✓ Running]
    B --> F[IP: 192.168.1.13 ✓ New Instance]

    style C fill:#f99,stroke:#333
    style D fill:#9f9,stroke:#333
    style E fill:#9f9,stroke:#333
    style F fill:#9f9,stroke:#333
```

**Challenges**:

- Services scale up/down dynamically
- Instances crash and restart with new IPs
- Manual configuration doesn't work
- Hard-coded addresses break easily

## How It Works

Services register themselves in a central registry. Other services query the registry to find them.

```mermaid
sequenceDiagram
    participant S as Service B
    participant R as Service Registry
    participant C as Service A

    Note over S: On startup
    S->>R: Register (name, IP, port)
    R->>S: Registered ✓

    Note over C: Needs to call Service B
    C->>R: Where is Service B?
    R->>C: [IP:Port list]
    C->>S: API Call
```

## Service Discovery Patterns

### Client-Side Discovery

Client queries registry and chooses which instance to call:

```mermaid
sequenceDiagram
    participant C as Client Service
    participant R as Service Registry
    participant S1 as Service B - Instance 1
    participant S2 as Service B - Instance 2

    C->>R: Get Service B locations
    R->>C: [Instance 1, Instance 2]

    C->>C: Choose Instance 1
    C->>S1: Direct API Call
```

**How it works**:

1. Client queries registry for service locations
2. Client gets list of available instances
3. Client picks an instance (load balancing logic in client)
4. Client calls the service directly

**Pros**:

- Client controls load balancing
- One less network hop
- Simple architecture

**Cons**:

- Client must implement discovery logic
- Load balancing code in every service
- Tight coupling to registry

**Tools**: Netflix Eureka, Consul

### Server-Side Discovery

Load balancer queries registry and routes requests:

```mermaid
sequenceDiagram
    participant C as Client Service
    participant LB as Load Balancer
    participant R as Service Registry
    participant S1 as Service B - Instance 1
    participant S2 as Service B - Instance 2

    LB->>R: Get Service B locations
    R->>LB: [Instance 1, Instance 2]

    C->>LB: Call Service B
    LB->>LB: Choose Instance 2
    LB->>S2: Forward Request
    S2->>LB: Response
    LB->>C: Response
```

**How it works**:

1. Client calls a well-known load balancer
2. Load balancer queries registry
3. Load balancer picks an instance
4. Load balancer forwards the request

**Pros**:

- Clients are simpler (no discovery logic)
- Centralized load balancing
- Easy to update routing rules

**Cons**:

- Extra network hop
- Load balancer is a single point of failure
- Additional infrastructure to manage

**Tools**: AWS ELB, Kubernetes Service, NGINX

## Key Components

### 1. Service Registry

Central database storing all service locations:

```mermaid
graph LR
    A[Services] -->|Register| B[(Registry)]
    B -->|Query| C[Clients]

    style B fill:#f9f,stroke:#333
```

**Stores**: Service name, IP address, port, health status

### 2. Health Checks

Registry removes unhealthy services:

```mermaid
sequenceDiagram
    participant S as Service
    participant R as Registry

    R->>S: Are you healthy?
    alt Healthy
        S->>R: ✓ Yes
    else Unhealthy
        S--xR: ✗ No Response
        R->>R: Remove Service
    end
```

**Types**: HTTP endpoint, TCP port check, Heartbeat signals

### 3. Load Balancing

Distribute requests across instances:

- **Round Robin**: Instance 1 → 2 → 3 → 1
- **Random**: Pick any instance
- **Least Connections**: Pick instance with fewest active requests

## When to Use

✅ **Good Fit**:

- Microservices architecture
- Dynamic scaling (auto-scaling)
- Cloud environments
- Multiple service instances
- Frequent deployments

❌ **Not Needed**:

- Monolithic applications
- Static infrastructure
- Single instance per service
- Simple client-server apps
