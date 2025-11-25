---
sidebar_position: 1
---

# OAuth 2.0

OAuth 2.0 is an authorization framework that allows third-party applications to access protected resources on behalf of a user without sharing passwords.

## What is OAuth 2.0?

OAuth 2.0 enables secure delegated access. Instead of giving your password to a third-party app, OAuth allows the app to get limited access through tokens.

**Real-World Example**: When you click "Sign in with Google" on a website, that's OAuth 2.0 in action.

```mermaid
graph LR
    U[User] -->|1. Click 'Sign in with Google'| A[Third-Party App]
    A -->|2. Redirect to Google| G[Google]
    G -->|3. User logs in| U
    G -->|4. Access token| A
    A -->|5. Access protected data| G

    style U fill:#fcf,stroke:#333
    style A fill:#9cf,stroke:#333
    style G fill:#9f9,stroke:#333
```

## Key Components

### 1. Resource Owner

The user who owns the data.

**Example**: You (the person with a Google account)

### 2. Client

The third-party application requesting access.

**Example**: A photo printing app that wants to access your Google Photos

### 3. Authorization Server

Server that authenticates the user and issues tokens.

**Example**: Google's login server

### 4. Resource Server

Server that hosts the protected resources.

**Example**: Google Photos API server

### 5. Access Token

A credential used to access protected resources.

**Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Identity Provider (IdP)

An Identity Provider is a service that manages user identities and handles authentication. In OAuth 2.0, the IdP typically acts as the Authorization Server.

**What IdP Does**:

- Stores and manages user credentials
- Authenticates users (verifies who they are)
- Issues tokens after successful authentication
- Manages user profiles and attributes

**Popular Identity Providers**:

```mermaid
graph TD
    IdP[Identity Provider] --> G[Google]
    IdP --> M[Microsoft/Azure AD]
    IdP --> GH[GitHub]
    IdP --> FB[Facebook]
    IdP --> A[Auth0]
    IdP --> O[Okta]

    style IdP fill:#f96,stroke:#333
```

### Authorization Server vs Identity Provider

**Authorization Server**:

- OAuth 2.0 component
- Issues access tokens
- Handles authorization (what you can do)

**Identity Provider**:

- Authentication service
- Verifies user identity
- Handles login/authentication (who you are)

**In Practice**: Many services combine both roles. Google acts as both an Authorization Server and an Identity Provider.

### OAuth 2.0 + OpenID Connect

```mermaid
graph LR
    U[User] --> |Login| IdP[Identity Provider]
    IdP --> |Authentication| AS[Authorization Server]
    AS --> |OAuth 2.0:<br/>Access Token| Client[Client App]
    AS --> |OpenID Connect:<br/>ID Token| Client
    Client --> |Access Token| RS[Resource Server]

    style IdP fill:#fcf,stroke:#333
    style AS fill:#9f9,stroke:#333
    style Client fill:#9cf,stroke:#333
```

**How They Work Together**:

1. **Identity Provider** authenticates the user (login)
2. **Authorization Server** issues tokens (OAuth 2.0)
3. **OpenID Connect** adds identity layer on top of OAuth 2.0
4. **Client App** receives both access token and ID token

**OAuth 2.0 vs OpenID Connect**:

| Aspect      | OAuth 2.0              | OpenID Connect                |
| ----------- | ---------------------- | ----------------------------- |
| Purpose     | Authorization (access) | Authentication (identity)     |
| Primary Use | API access delegation  | User login/Single Sign-On     |
| Token Type  | Access Token           | Access Token + ID Token       |
| User Info   | No standard way        | Standard claims (email, name) |

## OAuth 2.0 Flows

Different flows for different use cases.

### Authorization Code Flow

**Most secure and commonly used flow**. Best for web applications with a backend server.

```mermaid
sequenceDiagram
    participant User
    participant Client as Client App
    participant AuthServer as Authorization Server
    participant ResourceServer as Resource Server

    User->>Client: 1. Click "Sign in"
    Client->>AuthServer: 2. Redirect to login
    AuthServer->>User: 3. Show login page
    User->>AuthServer: 4. Enter credentials
    AuthServer->>Client: 5. Return authorization code
    Client->>AuthServer: 6. Exchange code for token<br/>(with client secret)
    AuthServer->>Client: 7. Access token
    Client->>ResourceServer: 8. Request data with token
    ResourceServer->>Client: 9. Protected data
```

**Steps**:

1. User clicks "Sign in with Google" on your app
2. App redirects user to Google's login page
3. User logs in and approves access
4. Google sends authorization code to app
5. App exchanges code for access token (securely on backend)
6. App uses token to access user's data

**When to Use**:

- Web applications with backend server
- Mobile apps with backend
- Most secure option

### Client Credentials Flow

Used for **server-to-server** communication. No user involved.

```mermaid
sequenceDiagram
    participant Client as Client App
    participant AuthServer as Authorization Server
    participant ResourceServer as Resource Server

    Client->>AuthServer: 1. Request token<br/>(client_id + client_secret)
    AuthServer->>Client: 2. Access token
    Client->>ResourceServer: 3. Request data with token
    ResourceServer->>Client: 4. Protected data
```

**Steps**:

1. App sends credentials (client ID + secret) to auth server
2. Auth server returns access token
3. App uses token to access API

**When to Use**:

- Backend services communicating with each other
- Cron jobs or scheduled tasks
- Microservices authentication
- No user context needed

### Resource Owner Password Flow

User provides username and password **directly** to the client application.

```mermaid
sequenceDiagram
    participant User
    participant Client as Client App
    participant AuthServer as Authorization Server

    User->>Client: 1. Enter username/password
    Client->>AuthServer: 2. Send credentials
    AuthServer->>Client: 3. Access token
    Client->>Client: 4. Store token
```

**When to Use**:

- Only for **highly trusted** first-party apps
- Mobile apps owned by same company as API
- Legacy system migration

**Not Recommended**: Less secure because app handles user passwords.

## Token Types

### Access Token

Short-lived token to access protected resources.

**Lifetime**: 15 minutes to 1 hour (typically)

**Example**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refresh Token

Long-lived token to get new access tokens without re-authentication.

**Lifetime**: Days to months

**Benefits**:

- User stays logged in longer
- Access tokens remain short-lived (more secure)
- Can revoke refresh token to log user out

### ID Token (OpenID Connect)

Contains user identity information. Used with OpenID Connect.

**Contains**: User ID, email, name, etc.

**Format**: JWT (JSON Web Token)

## Scopes

Define what permissions the access token has.

**Common Scopes**:

```
read_profile     - Read user profile
write_posts      - Create posts
read_email       - Access email address
admin           - Full access
```

**Example**:

```
https://auth.example.com/authorize?
  client_id=abc123&
  scope=read_profile read_email
```

**User sees**: "App X wants to access your profile and email"

## Common OAuth Providers

**Popular OAuth 2.0 Providers**:

- Google
- Microsoft (Azure AD)
- GitHub
- Facebook
- Auth0
- Okta

## Flow Selection Guide

**Authorization Code Flow**: Web apps with backend, highest security

**Client Credentials Flow**: Server-to-server, no user involved

**Resource Owner Password Flow**: First-party apps only (not recommended)
