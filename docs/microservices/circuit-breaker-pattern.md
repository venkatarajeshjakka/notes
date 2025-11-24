---
sidebar_position: 2
---

# Circuit Breaker Pattern

A resilience pattern that prevents cascading failures by stopping requests to a failing service and allowing it time to recover.

## The Problem

When a service fails, continuous retries can:

- Waste resources on requests that will fail
- Overload the failing service, preventing recovery
- Create cascading failures across dependent services
- Increase response times for users

**How It Works?**

Like an electrical circuit breaker, it monitors failures and "trips" to prevent further damage.

## Circuit States

### Closed (Normal)

```mermaid
sequenceDiagram
    participant C as Client
    participant CB as Circuit Breaker
    participant S as Service

    C->>CB: Request
    CB->>S: Forward Request
    S->>CB: Response
    CB->>C: Return Response

    Note over CB: Counter: 0 failures
```

- Requests flow normally to the service
- Counts failures and successes
- Moves to **Open** when failure threshold is reached

**Example**: Allow requests until 5 failures in 10 seconds

### Open (Blocking)

```mermaid
sequenceDiagram
    participant C as Client
    participant CB as Circuit Breaker
    participant S as Service

    C->>CB: Request
    CB->>C: Fail Fast (Error)

    Note over S: Service not called
    Note over CB: Waiting for timeout
```

- Immediately rejects all requests without calling service
- Returns error or fallback response
- Moves to **Half-Open** after timeout period

**Example**: Wait 30 seconds before retrying

### Half-Open (Testing)

```mermaid
sequenceDiagram
    participant C as Client
    participant CB as Circuit Breaker
    participant S as Service

    C->>CB: Request 1
    CB->>S: Test Request
    S->>CB: Success
    CB->>C: Response

    Note over CB: Success → Close

    C->>CB: Request 2
    CB->>S: Forward
    Note over CB: Back to normal
```

- Allows limited requests to test if service recovered
- **Success** → Back to Closed state
- **Failure** → Back to Open state

**Example**: Allow 3 test requests

## Real-World Example

E-commerce checkout calling payment service:

```mermaid
sequenceDiagram
    participant U as User
    participant CO as Checkout Service
    participant CB as Circuit Breaker
    participant PS as Payment Service

    Note over CB: State: Closed

    U->>CO: Checkout
    CO->>CB: Process Payment
    CB->>PS: Request
    PS--xCB: Timeout (5x)
    CB->>CO: Error

    Note over CB: State: Open

    U->>CO: Checkout
    CO->>CB: Process Payment
    CB->>CO: Fail Fast
    CO->>U: Use saved payment later

    Note over CB: Wait 30s...
    Note over CB: State: Half-Open

    U->>CO: Checkout
    CO->>CB: Process Payment
    CB->>PS: Test Request
    PS->>CB: Success
    CB->>CO: Success

    Note over CB: State: Closed
```

## Configuration Parameters

| Parameter             | Description                                   | Example               |
| --------------------- | --------------------------------------------- | --------------------- |
| **Failure Threshold** | Number/percentage of failures to open circuit | 5 failures or 50%     |
| **Timeout**           | How long to wait in Open state                | 30 seconds            |
| **Success Threshold** | Successes needed in Half-Open to close        | 3 successful requests |
| **Time Window**       | Period to measure failures                    | Last 10 seconds       |

## Benefits

- **Prevents Cascading Failures**: Stops failure from spreading
- **Fast Failure**: No waiting for timeouts
- **Automatic Recovery**: Self-healing when service recovers
- **Resource Protection**: Saves CPU, memory, connections
- **Better User Experience**: Quick fallback responses
