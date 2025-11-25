---
sidebar_position: 3
---

# REST API Design Principles

Essential principles for designing clean, maintainable, and user-friendly REST APIs.

## 1. Use HTTP Methods Correctly

Each HTTP method has a specific purpose. Use them correctly for predictable behavior.

**Common Mistakes**:

- ❌ `GET /deleteUser?id=123`
- ✅ `DELETE /users/123`
- ❌ `POST /getUser`
- ✅ `GET /users/123`

## 2. Use Nouns for Resources

Focus on resources (things), not actions (verbs).

**Good Examples**:

```
✅ GET    /users
✅ GET    /users/123
✅ POST   /users
✅ DELETE /products/456
```

**Bad Examples**:

```
❌ GET  /getUsers
❌ POST /createUser
❌ POST /deleteProduct
```

**Hierarchical URIs**:

```
/users/123/orders          → User's orders
/users/123/orders/456      → Specific order
/departments/5/employees   → Department's employees
```

**Best Practices**:

- Use plural nouns (`/users` not `/user`)
- Use lowercase letters
- Use hyphens for multi-word resources (`/order-items`)
- Keep URIs short and intuitive

## 3. Use Appropriate HTTP Status Codes

Return meaningful status codes to indicate the result of the request.

**Success Codes (2xx)**:

| Code | When to Use                             |
| ---- | --------------------------------------- |
| 200  | Successful GET, PUT, PATCH              |
| 201  | Resource created (POST)                 |
| 204  | Successful DELETE, no content to return |

**Client Error Codes (4xx)**:

| Code | When to Use                            |
| ---- | -------------------------------------- |
| 400  | Invalid request data                   |
| 401  | Authentication required/failed         |
| 403  | Authenticated but not authorized       |
| 404  | Resource not found                     |
| 409  | Conflict (duplicate, version mismatch) |
| 422  | Validation failed                      |
| 429  | Too many requests (rate limit)         |

**Server Error Codes (5xx)**:

| Code | When to Use                  |
| ---- | ---------------------------- |
| 500  | Internal server error        |
| 502  | Bad gateway (upstream error) |
| 503  | Service unavailable          |

## 4. Error Handling

Provide clear, consistent error responses to help clients understand and fix issues.

**Error Response Elements**:

- **code**: Machine-readable error identifier
- **message**: Human-readable description
- **details**: Specific field-level errors (for validation)
- **timestamp**: When the error occurred (optional)
- **path**: Request path that caused error (optional)

**Best Practices**:

- Be consistent across all endpoints
- Don't expose sensitive information
- Include helpful error codes
- Provide actionable messages

## 5. Validate Requests

Validate input data before processing to ensure data quality and security.

**Validation Layers**:

1. **Schema Validation**: Data types, required fields
2. **Format Validation**: Email, phone, URL patterns
3. **Business Rules**: Age limits, price ranges, uniqueness
4. **Authorization**: User has permission to perform action

**Best Practices**:

- Validate early, fail fast
- Return all validation errors together
- Use consistent validation rules
- Sanitize input to prevent injection attacks

## 6. Versioning

Version your API to manage changes without breaking existing clients.

**URI Versioning** (Most Common):

```
✅ /v1/users
✅ /v2/users
✅ /api/v1/products
```

**Pros**: Clear, easy to use, visible in URL
**Cons**: Multiple URIs for same resource

**Header Versioning**:

```
GET /users
Accept: application/vnd.myapi.v1+json
```

**Pros**: Clean URIs, flexible
**Cons**: Less visible, harder to test

**Query Parameter**:

```
GET /users?version=1
```

**Pros**: Simple
**Cons**: Not RESTful, easily overlooked

**Best Practices**:

- Version from day one
- Use major versions only (v1, v2)
- Support old versions for reasonable time
- Communicate deprecation clearly
- Document differences between versions

## 7. HATEOAS

**Hypermedia as the Engine of Application State** - Include links to related resources in responses.

**Concept**: Clients discover available actions through links in responses, not hardcoded URLs.

**Example Without HATEOAS**:

```json
{
  "id": 123,
  "name": "John Doe"
}
```

**Example With HATEOAS**:

```json
{
  "id": 123,
  "name": "John Doe",
  "links": [
    { "rel": "self", "href": "/users/123" },
    { "rel": "orders", "href": "/users/123/orders" },
    { "rel": "update", "href": "/users/123", "method": "PUT" }
  ]
}
```

**Benefits**:

- Clients don't hardcode URLs
- API is self-documenting
- Easier to change URL structure

**When to Use**:

- Public APIs with many clients
- Long-lived APIs that may change
- When discoverability is important

## 8. Security

Protect your API from unauthorized access and attacks.

**Essential Security Practices**:

**1. Always Use HTTPS**:

```
✅ https://api.example.com/users
❌ http://api.example.com/users
```

**2. Authentication**:

```
GET /users
Authorization: Bearer <token>
```

**3. Input Validation**:

- Sanitize all input
- Validate data types and formats
- Prevent SQL injection, XSS attacks
- Limit request size

**4. Rate Limiting**:

```
Response Headers:
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

**5. CORS Configuration**:

```
Access-Control-Allow-Origin: https://trusted-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

**6. Sensitive Data**:

- Never log passwords or tokens
- Don't return sensitive data in errors
- Use field-level encryption when needed
- Mask sensitive fields in responses

**Best Practices**:

- Use HTTPS everywhere
- Implement proper authentication
- Rate limit all endpoints
- Validate and sanitize all input
- Keep dependencies updated
- Log security events
