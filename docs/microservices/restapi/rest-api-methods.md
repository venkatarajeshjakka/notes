---
sidebar_position: 2
---

# REST API Methods

HTTP methods define the action to perform on a resource. Each method has specific characteristics and use cases.

## GET

Retrieve data from the server. Read-only operation.

**Characteristics**:

- **Idempotent**: Multiple identical requests produce same result
- **Safe**: Does not modify data
- **Cacheable**: Responses can be cached

**Examples**:

```
GET /users              → List all users
GET /users/123          → Get specific user
GET /users/123/orders   → Get user's orders
GET /products?category=electronics&sort=price
```

**Response Codes**:

- `200 OK` - Resource found and returned
- `404 Not Found` - Resource doesn't exist
- `400 Bad Request` - Invalid query parameters

**Best Practices**:

- Use clear, hierarchical endpoints
- Never include sensitive data in URL
- Use query parameters for filtering and sorting
- Return appropriate status codes
- Implement pagination for large datasets

## POST

Create a new resource on the server.

**Characteristics**:

- **Not Idempotent**: Multiple requests create multiple resources
- **Not Safe**: Modifies server state
- **Not Cacheable**: Responses should not be cached

**Example**:

```
POST /users
Body:
{
  "name": "John Doe",
  "email": "john@example.com"
}

Response: 201 Created
Location: /users/124
```

**Response Codes**:

- `201 Created` - Resource successfully created
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Resource already exists

**Best Practices**:

- Return `201 Created` with `Location` header
- Validate input data thoroughly
- Return the created resource in response body
- Use descriptive error messages

## PUT

Replace an entire resource or create if it doesn't exist.

**Characteristics**:

- **Idempotent**: Same request produces same result
- **Not Safe**: Modifies server state
- **Not Cacheable**

**Example**:

```
PUT /users/123
Body:
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-0100"
}
```

**Response Codes**:

- `200 OK` - Resource updated
- `201 Created` - Resource created (if didn't exist)
- `204 No Content` - Updated, no body returned

**PUT vs POST**:

| Aspect     | PUT               | POST       |
| ---------- | ----------------- | ---------- |
| Idempotent | ✓ Yes             | ✗ No       |
| Target     | Specific resource | Collection |
| URL        | `/users/123`      | `/users`   |
| Action     | Replace/Create    | Create     |

**Best Practices**:

- Client must provide complete resource representation
- Use when client controls resource ID
- Return updated resource or use `204 No Content`

## PATCH

Partially update a resource by modifying specific fields.

**Characteristics**:

- **Not Idempotent**: Depends on implementation
- **Not Safe**: Modifies server state
- **Not Cacheable**

**Example**:

```
PATCH /users/123
Body:
{
  "email": "newemail@example.com"
}
```

**PATCH vs PUT**:

| Aspect             | PATCH        | PUT            |
| ------------------ | ------------ | -------------- |
| Update Type        | Partial      | Complete       |
| Fields Sent        | Only changed | All fields     |
| Unspecified Fields | Unchanged    | Reset/Required |

**Response Codes**:

- `200 OK` - Resource updated, body returned
- `204 No Content` - Updated, no body returned
- `400 Bad Request` - Invalid patch data

**Best Practices**:

- Only send fields that need updating
- Validate partial data carefully
- Document which fields are patchable
- Consider using JSON Patch format for complex updates

## DELETE

Remove a resource from the server.

**Characteristics**:

- **Idempotent**: Deleting same resource multiple times has same effect
- **Not Safe**: Modifies server state
- **Not Cacheable**

**Examples**:

```
DELETE /users/123           → Delete user
DELETE /users/123/orders/5  → Delete specific order
```

**Response Codes**:

- `204 No Content` - Successfully deleted
- `200 OK` - Deleted, returning deleted resource
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Cannot delete (dependencies exist)

**Best Practices**:

- Return `204 No Content` for successful deletion
- Consider soft delete for important data
- Check for dependencies before deletion
- Subsequent DELETE requests should return `404` or `204`

## HEAD

Retrieve headers without body. Same as GET but without response body.

**Characteristics**:

- **Idempotent**: Yes
- **Safe**: Yes
- **Cacheable**: Yes

**Use Cases**:

- Check if resource exists
- Get resource metadata
- Verify cache validity
- Check content size before downloading

**Example**:

```
HEAD /files/large-video.mp4

Response Headers:
Content-Length: 524288000
Content-Type: video/mp4
Last-Modified: Mon, 01 Jan 2024 12:00:00 GMT
```

**Best Practices**:

- Return same headers as GET
- Use for resource existence checks
- Implement for large resources

## OPTIONS

Discover allowed methods and capabilities for a resource.

**Characteristics**:

- **Idempotent**: Yes
- **Safe**: Yes
- **Not Cacheable**

**Use Cases**:

- CORS preflight requests
- Discover allowed HTTP methods
- API capability detection

**Example**:

```
OPTIONS /users/123

Response Headers:
Allow: GET, PUT, PATCH, DELETE
Access-Control-Allow-Methods: GET, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Best Practices**:

- Return `Allow` header with supported methods
- Use for CORS preflight handling
- Document API capabilities

## Method Comparison

| Method  | Idempotent | Safe | Cacheable | Request Body | Response Body |
| ------- | ---------- | ---- | --------- | ------------ | ------------- |
| GET     | ✓          | ✓    | ✓         | ✗            | ✓             |
| POST    | ✗          | ✗    | ✗         | ✓            | ✓             |
| PUT     | ✓          | ✗    | ✗         | ✓            | Optional      |
| PATCH   | ✗\*        | ✗    | ✗         | ✓            | Optional      |
| DELETE  | ✓          | ✗    | ✗         | Optional     | Optional      |
| HEAD    | ✓          | ✓    | ✓         | ✗            | ✗             |
| OPTIONS | ✓          | ✓    | ✗         | ✗            | ✓             |

\*PATCH can be designed to be idempotent

## Key Concepts

**Idempotent**: Making the same request multiple times produces the same result. Safe to retry.

**Safe**: Does not modify server state. Read-only operations.

**Cacheable**: Response can be stored and reused for future requests.

## Common Patterns

**CRUD Mapping**:

```
Create  → POST   /users
Read    → GET    /users/123
Update  → PUT    /users/123  (full)
        → PATCH  /users/123  (partial)
Delete  → DELETE /users/123
```
