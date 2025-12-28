# Security Policy

## Overview

CertiGen implements multiple layers of security to protect certificate integrity and prevent abuse. This document describes the security measures in place and how to report vulnerabilities.

## Security Features

### 1. Certificate Identification

**High-Entropy Certificate Numbers**

- Format: `CER-YYYYMMDD-XXXXXXXXXX`
- Uses `crypto.randomBytes(8)` for ~60 bits of entropy
- Makes enumeration attacks computationally infeasible
- Backward compatible with legacy 6-digit format

```typescript
// Example: CER-20251228-A7X9K2M4NP
```

### 2. Rate Limiting

**Upstash Redis-based Rate Limiting**

| Endpoint | Limit | Window |
|----------|-------|--------|
| Validation (`/api/certificates/validate`) | 10 requests | 1 minute |
| PDF Generation (`/api/certificates/generate-pdf`) | 5 requests | 1 minute |
| Admin Operations (`/api/certificates/revoke`) | 20 requests | 1 minute |

Rate limiting uses the sliding window algorithm for smooth enforcement.

**Configuration:**
```bash
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### 3. Content Security Policy (CSP)

**Nonce-based Script Loading**

- Unique cryptographic nonce generated per request
- `strict-dynamic` directive for trusted script chains
- Protection against XSS attacks

```
script-src 'self' 'nonce-{random}' 'strict-dynamic' 'unsafe-inline'
```

**Additional CSP Directives:**
- `default-src 'self'` - Only allow same-origin resources
- `frame-ancestors 'self'` - Prevent clickjacking
- `base-uri 'self'` - Prevent base tag hijacking
- `form-action 'self'` - Restrict form submissions

### 4. Certificate Revocation

**Admin-only Revocation Endpoint**

- Requires `x-api-secret` header authentication
- Protected by rate limiting
- Records revocation timestamp and reason

```bash
curl -X POST /api/certificates/revoke \
  -H "x-api-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"certificate_number": "CER-20251228-XXXXXXXXXX", "reason": "Fraudulent submission"}'
```

### 5. Validation Endpoint Protection

**Privacy Protection:**
- Minimal PII exposure (no email, grade, or hours)
- `X-Robots-Tag: noindex, nofollow` header
- Revocation status checking

**Response Fields (Valid Certificate):**
```json
{
  "is_valid": true,
  "certificate": {
    "certificate_number": "...",
    "student_name": "...",
    "course_name": "...",
    "certificate_type": "...",
    "issue_date": "..."
  },
  "validation_count": 5
}
```

### 6. Additional Security Headers

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

## Environment Variables

### Required for Security Features

```bash
# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Admin Operations
CERTIGEN_API_SECRET=your-secure-secret-key
```

### Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate API secrets** - Change `CERTIGEN_API_SECRET` periodically
3. **Monitor rate limits** - Check Upstash analytics for abuse patterns
4. **Review validation logs** - Monitor for suspicious validation attempts

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to the project maintainers
3. Include detailed steps to reproduce
4. Allow reasonable time for a fix before disclosure

## Database Security

### Required Columns for Revocation

Ensure your `certificates` table has these columns:

```sql
ALTER TABLE certificates
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revocation_reason TEXT;
```

### Row Level Security (RLS)

If using Supabase RLS, ensure policies allow:
- Service role access for revocation operations
- Anon key access for validation (read-only)

## Changelog

### v3.3.0 - Security Hardening Release

- High-entropy certificate IDs (~60 bits)
- Upstash-based rate limiting
- Nonce-based CSP implementation
- Certificate revocation system
- Validation endpoint privacy protection
