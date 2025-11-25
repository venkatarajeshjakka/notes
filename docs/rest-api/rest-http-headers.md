---
sidebar_position: 5
---

# REST HTTP Headers

HTTP headers provide additional information about requests and responses. Understanding common headers is essential for building secure and efficient REST APIs.

## Request Headers

Headers sent by the client to the server.

### Content-Type

Specifies the format of the request body.

**Common Values**:

```
Content-Type: application/json
Content-Type: application/xml
Content-Type: application/x-www-form-urlencoded
Content-Type: multipart/form-data
```

**When to Use**: Always include when sending data in POST, PUT, PATCH requests.

### Accept

Tells the server what response format the client can handle.

**Example**:

```
Accept: application/json
Accept: application/xml
Accept: application/json, application/xml;q=0.9
```

The `q` parameter indicates preference (0-1, higher is preferred).

### Authorization

Contains credentials to authenticate the client.

**Common Schemes**:

```
Authorization: Bearer <token>
Authorization: Basic <base64-encoded-credentials>
Authorization: ApiKey <api-key>
```

**Best Practices**:

- Always use HTTPS
- Never log or expose tokens
- Use short-lived tokens

### User-Agent

Identifies the client making the request.

**Example**:

```
User-Agent: MyApp/1.0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
```

## Response Headers

Headers sent by the server to the client.

### Content-Type

Specifies the format of the response body.

**Example**:

```
Content-Type: application/json; charset=utf-8
```

### Cache-Control

Controls how responses are cached.

**Common Directives**:

| Directive         | Description                              |
| ----------------- | ---------------------------------------- |
| `no-cache`        | Must revalidate before using cached data |
| `no-store`        | Do not cache at all                      |
| `public`          | Can be cached by any cache               |
| `private`         | Only cache on client (not proxies)       |
| `max-age=N`       | Cache for N seconds                      |
| `must-revalidate` | Must revalidate stale cache              |

**Examples**:

```
Cache-Control: public, max-age=3600        (Cache for 1 hour)
Cache-Control: private, max-age=86400      (Cache on client for 24 hours)
Cache-Control: no-store                    (Never cache - sensitive data)
```

### Set-Cookie

Sets cookies on the client.

**Example**:

```
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

**Cookie Attributes**:

| Attribute  | Purpose                                        |
| ---------- | ---------------------------------------------- |
| `HttpOnly` | Not accessible via JavaScript (XSS protection) |
| `Secure`   | Only transmitted over HTTPS                    |
| `SameSite` | CSRF protection (Strict, Lax, None)            |
| `Max-Age`  | Expiration time in seconds                     |

**Best Practice**: Always use `HttpOnly` and `Secure` for sensitive data.

### Retry-After

Tells client when to retry after rate limit or maintenance.

**Examples**:

```
Retry-After: 120                               (Retry after 120 seconds)
Retry-After: Wed, 21 Oct 2023 07:28:00 GMT    (Retry after specific time)
```

## CORS Headers

Enable cross-origin resource sharing between different domains.

### Access-Control-Allow-Origin

Specifies which origins can access the resource.

**Examples**:

```
Access-Control-Allow-Origin: *                        (Allow all - not recommended)
Access-Control-Allow-Origin: https://app.example.com  (Allow specific origin)
```

### Access-Control-Allow-Methods

Allowed HTTP methods for cross-origin requests.

**Example**:

```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### Access-Control-Allow-Headers

Which headers can be used in the actual request.

**Example**:

```
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### Access-Control-Allow-Credentials

Whether credentials can be included in CORS requests.

**Example**:

```
Access-Control-Allow-Credentials: true
```

**Important**: Cannot use `Access-Control-Allow-Origin: *` with credentials.

**Complete CORS Example**:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

## Security Headers

Protect against common web vulnerabilities.

### X-Frame-Options

Prevents clickjacking attacks by controlling if page can be embedded in frames.

**Values**:

```
X-Frame-Options: DENY          (Never allow framing)
X-Frame-Options: SAMEORIGIN    (Only allow same origin)
```

**Recommended**: `DENY`

### X-Content-Type-Options

Prevents MIME type sniffing.

**Example**:

```
X-Content-Type-Options: nosniff
```

### Strict-Transport-Security (HSTS)

Forces HTTPS connections.

**Example**:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Content-Security-Policy (CSP)

Controls which resources can be loaded.

**Example**:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com
```

**Use Cases**: Prevent XSS attacks, control resource loading, block inline scripts

## Rate Limiting Headers

Inform clients about rate limits.

**Common Headers**:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

**Example Response**:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1640000000
```

**When Exceeded**:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

## Best Practices

**Security**:

- Use `Authorization` header for credentials (not URL params)
- Set `HttpOnly` and `Secure` flags on cookies
- Implement security headers (X-Frame-Options, CSP, HSTS)
- Use CORS headers restrictively

**Performance**:

- Use `Cache-Control` appropriately
- Implement ETags for conditional requests
- Compress responses with `Content-Encoding: gzip`

**Client Communication**:

- Always set correct `Content-Type`
- Return `Location` header with `201 Created`
- Use `Retry-After` for rate limits
- Include rate limit headers for transparency
