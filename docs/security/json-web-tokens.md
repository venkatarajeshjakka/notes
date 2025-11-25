---
sidebar_position: 3
---

# JSON Web Tokens (JWT)

JSON Web Token (JWT) is a compact, URL-safe token format for securely transmitting information between parties as a JSON object. JWTs are digitally signed for verification and trust.

## What is JWT?

JWT is a self-contained token that carries information about a user and can be verified without checking a database.

**Real-World Example**: After logging in, you receive a JWT. Every time you make a request, you send this token to prove who you are, without logging in again.

```mermaid
graph LR
    U[User] -->|1. Login| S[Server]
    S -->|2. JWT Token| U
    U -->|3. Request + JWT| S
    S -->|4. Verify JWT| S
    S -->|5. Response| U

    style U fill:#fcf,stroke:#333
    style S fill:#9cf,stroke:#333
```

## JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Structure**:

```
HEADER.PAYLOAD.SIGNATURE
```

```mermaid
graph TD
    JWT[JWT Token] --> H[Header]
    JWT --> P[Payload]
    JWT --> S[Signature]

    H --> H1[Algorithm: HS256]
    H --> H2[Type: JWT]

    P --> P1[User ID: 123]
    P --> P2[Email: user@example.com]
    P --> P3[Expiration: 1h]

    S --> S1[Signature created using<br/>Header + Payload + Secret]

    style JWT fill:#f96,stroke:#333
    style H fill:#9f9,stroke:#333
    style P fill:#9cf,stroke:#333
    style S fill:#fcf,stroke:#333
```

### 1. Header

Contains metadata about the token.

**Example**:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Fields**:

- `alg`: Algorithm used for signing (HS256, RS256)
- `typ`: Token type (always "JWT")

**Encoded**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

### 2. Payload

Contains the claims (data about the user).

**Example**:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Standard Claims**:

- `sub`: Subject (user ID)
- `iat`: Issued at (timestamp)
- `exp`: Expiration time (timestamp)
- `iss`: Issuer
- `aud`: Audience

**Custom Claims**: Add any data you need (role, permissions, etc.)

**Encoded**: `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`

### 3. Signature

Ensures the token hasn't been tampered with.

**How it's created**:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

**Encoded**: `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

## JWT Signing Algorithms

### Symmetric (HMAC)

Same secret key for signing and verifying.

**Algorithm**: HS256, HS384, HS512

**Example**:

```
Secret: "my-secret-key"
Sign with secret → JWT
Verify with same secret
```

**Pros**:

- Fast
- Simple

**Cons**:

- Must share secret with all parties
- If secret leaks, anyone can create tokens

### Asymmetric (RSA)

Private key for signing, public key for verifying.

**Algorithm**: RS256, RS384, RS512

**Example**:

```
Private key (server only) → Sign JWT
Public key (anyone) → Verify JWT
```

**Pros**:

- Don't need to share private key
- Public key can be distributed safely
- More secure for distributed systems

**Cons**:

- Slower
- More complex

**When to Use**:

- **HMAC**: Single server, simple architecture
- **RSA**: Multiple services, microservices, distributed systems
