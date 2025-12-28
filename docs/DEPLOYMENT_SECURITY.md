# Deployment Security Configuration

## 1. Supabase Configuration

### Run Migration

Execute the following SQL in **Supabase Dashboard > SQL Editor**:

```sql
-- Add revocation columns to certificates table
ALTER TABLE certificates
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revocation_reason TEXT;

-- Create index for faster revocation lookups
CREATE INDEX IF NOT EXISTS idx_certificates_revoked_at
ON certificates(revoked_at)
WHERE revoked_at IS NOT NULL;

-- Create a view for certificate validation (excludes sensitive data)
CREATE OR REPLACE VIEW public.certificate_validation_view AS
SELECT
  id,
  certificate_number,
  student_name,
  course_name,
  certificate_type,
  issue_date,
  is_active,
  revoked_at,
  revocation_reason,
  created_at
FROM certificates;

-- Grant access to the validation view
GRANT SELECT ON public.certificate_validation_view TO anon;
GRANT SELECT ON public.certificate_validation_view TO authenticated;
```

### Verify RLS Policies

Ensure these policies exist in **Authentication > Policies**:

| Table | Policy | Description |
|-------|--------|-------------|
| certificates | SELECT for anon | Allow public validation |
| certificates | INSERT for authenticated | Allow cert creation |
| certificate_validations | INSERT for anon | Allow logging validations |

---

## 2. Upstash Redis Setup (Rate Limiting)

### Create Upstash Account

1. Go to [https://console.upstash.com/](https://console.upstash.com/)
2. Sign up / Log in
3. Click **Create Database**
4. Select:
   - **Name**: `certigen-ratelimit`
   - **Region**: Choose closest to your Vercel deployment (e.g., `us-east-1`)
   - **Type**: Regional (cheaper) or Global (faster worldwide)
5. Click **Create**

### Get Credentials

After creation, go to your database and copy:
- **UPSTASH_REDIS_REST_URL**: `https://xxxx.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN**: `AXxxxx...`

---

## 3. Vercel Environment Variables

### Required Variables

Go to **Vercel Dashboard > Project > Settings > Environment Variables**

Add these variables for **Production**, **Preview**, and **Development**:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ✅ |
| `NEXT_PUBLIC_APP_URL` | `https://certigen-sandy.vercel.app` | ✅ |
| `NEXT_PUBLIC_BASE_URL` | `https://certigen-sandy.vercel.app` | ✅ |
| `NEXT_PUBLIC_VALIDATION_BASE_URL` | `https://certigen-sandy.vercel.app/validate` | ✅ |
| `CERTIGEN_API_SECRET` | Strong random string (32+ chars) | ✅ |
| `UPSTASH_REDIS_REST_URL` | From Upstash dashboard | ⚠️ Recommended |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash dashboard | ⚠️ Recommended |
| `RESEND_API_KEY` | From Resend dashboard | Optional |
| `FROM_EMAIL` | `CertiGen <noreply@yourdomain.com>` | Optional |

### Generate Secure API Secret

Run this command to generate a secure secret:

```bash
openssl rand -hex 32
```

Or use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4. Verify Deployment

After configuration, verify:

### Rate Limiting
```bash
# Should return 429 after 10 requests in 1 minute
for i in {1..15}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    https://certigen-sandy.vercel.app/api/certificates/validate/CER-20251228-TEST123456
done
```

### Revocation Endpoint
```bash
curl -X POST https://certigen-sandy.vercel.app/api/certificates/revoke \
  -H "Content-Type: application/json" \
  -H "x-api-secret: YOUR_CERTIGEN_API_SECRET" \
  -d '{"certificate_number": "CER-20251228-XXXXXXXXXX", "reason": "Test revocation"}'
```

### Security Headers
```bash
curl -I https://certigen-sandy.vercel.app | grep -E "(Content-Security-Policy|X-Frame|Strict-Transport)"
```

---

## 5. Monitoring

### Upstash Analytics

Monitor rate limiting in Upstash Dashboard:
- Request count per endpoint
- Rate limit hits
- Geographic distribution

### Vercel Analytics

Enable in Vercel Dashboard:
- **Analytics** tab for traffic insights
- **Logs** for error monitoring

---

## Troubleshooting

### Rate Limiting Not Working

1. Verify Upstash credentials in Vercel
2. Check Upstash dashboard for connection errors
3. The app gracefully degrades if Redis is unavailable

### CSP Errors in Console

1. Check for inline scripts without nonce
2. Verify external resources are whitelisted
3. Use browser DevTools to identify blocked resources

### Revocation 401 Error

1. Verify `CERTIGEN_API_SECRET` matches in Vercel
2. Check `x-api-secret` header is being sent correctly
