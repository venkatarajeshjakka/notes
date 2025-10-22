---
sidebar_position: 4
---

# Authentication, JWT & Cookies

## Authentication

Authentication is the process of verifying the identity of a user. In a client-server architecture, authentication typically follows this flow:

### How Authentication Works

1. **User Registration**: User provides credentials (username, email, password) which are stored securely in the database (password should be hashed)
2. **User Login**: User submits credentials to the server
3. **Credential Verification**: Server validates credentials against stored data
4. **Token Generation**: Upon successful validation, server generates a JWT token
5. **Token Storage**: Token is sent to client (usually stored in cookies or localStorage)
6. **Authenticated Requests**: Client includes token in subsequent requests
7. **Token Validation**: Server validates token on protected routes using middleware

### Authentication Flow Diagram

```
Client                          Server
  |                               |
  |  1. POST /register            |
  |------------------------------>|
  |     (username, password)      |
  |                               | Hash password & store in DB
  |  2. 201 Created               |
  |<------------------------------|
  |                               |
  |  3. POST /login               |
  |------------------------------>|
  |     (username, password)      |
  |                               | Verify credentials
  |                               | Generate JWT token
  |  4. 200 OK + JWT (in cookie)  |
  |<------------------------------|
  |                               |
  |  5. GET /protected            |
  |------------------------------>|
  |     (Cookie with JWT)         |
  |                               | Validate JWT
  |                               | Check permissions
  |  6. 200 OK + Protected Data   |
  |<------------------------------|
```

## JWT (JSON Web Token)

JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It's digitally signed, making it verifiable and trustworthy.

### JWT Structure

A JWT consists of three parts separated by dots (.):

```
header.payload.signature
```

1. **Header**: Contains token type (JWT) and signing algorithm (e.g., HS256, RS256)
2. **Payload**: Contains claims (user data, expiration, etc.)
3. **Signature**: Ensures token hasn't been tampered with

### How JWT Token is Created After Successful Login

```javascript
// Example JWT creation process
const jwt = require('jsonwebtoken');

// After validating user credentials
const payload = {
  userId: user._id,
  email: user.email,
  role: user.role
};

const secretKey = process.env.JWT_SECRET; // Store in environment variables
const options = {
  expiresIn: '7d' // Token expires in 7 days
};

const token = jwt.sign(payload, secretKey, options);
```

### Create JWT Using jsonwebtoken Package

**Installation:**
```bash
npm install jsonwebtoken
```

**Complete Implementation:**

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Create JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    // 4. Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.json({ message: 'Login successful', user: { email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
```

### JWT Best Practices

- **Secret Key**: Use a strong, random secret key stored in environment variables
- **Expiration**: Always set an expiration time for tokens
- **Payload Size**: Keep payload small to reduce token size
- **Sensitive Data**: Don't store sensitive information in the payload (it's base64 encoded, not encrypted)
- **Token Refresh**: Implement refresh token mechanism for long-lived sessions

## Cookie

Cookies are small pieces of data stored on the client-side and sent with every HTTP request to the same domain. They are ideal for storing JWT tokens securely.

### How to Attach Cookie in Node.js Using Express

**Installation:**
```bash
npm install cookie-parser
```

**Setup:**

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware to parse cookies
app.use(cookieParser());
```

### Create Cookie in the Login Route

```javascript
// Setting a cookie
app.post('/api/login', async (req, res) => {
  // ... authentication logic ...

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Set cookie with security options
  res.cookie('token', token, {
    httpOnly: true,      // Cookie cannot be accessed via JavaScript
    secure: true,        // Cookie only sent over HTTPS
    sameSite: 'strict',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'            // Cookie available for all routes
  });

  res.json({ message: 'Login successful' });
});
```

### Cookie Options Explained

- **httpOnly**: Prevents client-side JavaScript from accessing the cookie (XSS protection)
- **secure**: Ensures cookie is only sent over HTTPS connections
- **sameSite**: Protects against CSRF attacks
  - `'strict'`: Cookie only sent to same-site requests
  - `'lax'`: Cookie sent on top-level navigation
  - `'none'`: Cookie sent with all requests (requires `secure: true`)
- **maxAge**: Cookie expiration time in milliseconds
- **path**: URL path where cookie is valid
- **domain**: Domain where cookie is valid

### Clearing Cookies (Logout)

```javascript
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logout successful' });
});
```

## Create Auth Middleware

Middleware functions have access to the request and response objects. Authentication middleware validates JWT tokens before allowing access to protected routes.

### Validate the JWT Token from the Cookie

```javascript
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    // 1. Get token from cookie
    const token = req.cookies.token;

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request object
    req.user = decoded;

    // 5. Continue to next middleware/route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Usage on protected routes
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

### Middleware to Read the Cookie

```javascript
const cookieParser = require('cookie-parser');

// Setup cookie parser middleware
app.use(cookieParser());

// Custom middleware to extract and log cookies
const logCookies = (req, res, next) => {
  console.log('Cookies:', req.cookies);
  next();
};

app.use(logCookies);

// Reading specific cookie
app.get('/check-auth', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});
```

### Role-Based Authorization Middleware

```javascript
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }

    next();
  };
};

// Usage
app.delete('/api/users/:id',
  authenticateToken,
  authorize('admin', 'moderator'),
  (req, res) => {
    // Only admins and moderators can access this route
    res.json({ message: 'User deleted' });
  }
);
```

### Complete Authentication Example

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Logout route
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Security Considerations

1. **Password Storage**: Always hash passwords using bcrypt or argon2
2. **HTTPS**: Use HTTPS in production to prevent token interception
3. **Environment Variables**: Store sensitive data (JWT secret) in environment variables
4. **Token Expiration**: Set reasonable expiration times
5. **Refresh Tokens**: Implement refresh token mechanism for better security
6. **Rate Limiting**: Implement rate limiting on login endpoints
7. **Input Validation**: Validate and sanitize all user inputs
8. **CORS**: Configure CORS properly for cross-origin requests

📌 **Author:** Venkata Rajesh Jakka  
📅 **Date:** 2025-10-16
