# Security

This document records the vulnerabilities identified during the backend security
audit and the changes made to address them.

## Vulnerabilities and Fixes

### 1. Unlimited Login Attempts

**Risk:** High

The `/auth/login` endpoint allowed unlimited failed login attempts. An attacker
could repeatedly guess a user's password without being temporarily blocked.

**Fix:**

- Added `express-rate-limit` to the login route.
- Limited each client to five failed login attempts per 15 minutes.
- Successful logins do not consume the failed-attempt limit.
- Requests exceeding the limit receive HTTP `429`.

### 2. Missing Resource Ownership Checks

**Risk:** High

Protected routes authenticated the requester but did not verify that the
requested resource belonged to that user. This could allow an authenticated
user to access another user's data by changing a resource identifier.

**Fix:**

- Added the `requireOwnership` middleware.
- Added the protected `GET /user/:userId` resource route.
- The middleware compares the authenticated token's user ID with the requested
  path user ID.
- Requests for another user's resource receive HTTP `403`.
- User responses explicitly omit password hashes.

### 3. Missing CORS Restrictions

**Risk:** Medium

The API did not define an explicit CORS policy. Browser clients from
unauthorized origins could attempt to make requests to the backend.

**Fix:**

- Added the `cors` middleware.
- Restricted browser access to the origin configured in `CLIENT_ORIGIN`.
- Enabled credentials only for the configured client origin.
- The local default origin is `http://localhost:5173`.

### 4. Missing Security Response Headers

**Risk:** Medium

The API did not send standard defensive HTTP headers, leaving browser-facing
responses without protections against several common web attacks.

**Fix:**

- Added `helmet`.
- Helmet now applies standard security headers to all API responses.

### 5. Sensitive Data Exposure in Logs

**Risk:** High

Request logging can accidentally expose access tokens, refresh tokens,
authorization headers, cookies, and passwords. Anyone with log access could
reuse these credentials.

**Fix:**

- Added structured logging with Pino and `pino-http`.
- Configured redaction for:
  - Authorization headers
  - Cookie and `Set-Cookie` headers
  - Password fields
  - Access tokens
  - Refresh tokens
- Redacted values are replaced with `[Redacted]`.

### 6. Unrestricted AI Routes

**Risk:** Medium

AI endpoints can be computationally expensive or create external API costs.
Without request limits, they are vulnerable to abuse and denial-of-service
attempts.

**Fix:**

- Added a shared rate limiter for all routes mounted below `/ai`.
- Limited each client to 20 AI requests per minute.
- Requests exceeding the limit receive HTTP `429`.

### 7. Missing Centralized Error Handling

**Risk:** Medium

Errors thrown by middleware and controllers were not handled consistently.
Unexpected failures could expose implementation details or produce unreliable
responses.

**Fix:**

- Added centralized Express error-handling middleware.
- Operational errors return their intended status code and safe message.
- Unexpected errors are logged and return a generic HTTP `500` response.

## Environment Configuration

The following environment variables must be configured securely:

```env
ACCESS_TOKEN_SECRET=<strong-random-secret>
REFRESH_TOKEN_SECRET=<different-strong-random-secret>
CLIENT_ORIGIN=https://your-client.example
```
