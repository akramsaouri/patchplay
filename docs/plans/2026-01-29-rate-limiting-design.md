# Rate Limiting Design for /api/analyze

## Summary

Add IP-based rate limiting: 5 requests per day per IP, resetting at midnight UTC.

## Storage

- **Provider**: Upstash Redis (Vercel KV is deprecated)
- **Key format**: `ratelimit:analyze:{ip}`
- **Value**: request count (number)
- **TTL**: seconds until midnight UTC (auto-expires)

## Implementation

1. Add `@upstash/redis` dependency
2. Modify `api/analyze.ts`:
   - Extract IP from `x-forwarded-for` header
   - Check count in KV before processing
   - Return 429 if count >= 5
   - Increment count with TTL on success

## Response Headers

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: {remaining}
X-RateLimit-Reset: {unix timestamp}
```

## Error Response (429)

```json
{
  "error": "Rate limit exceeded. You can generate 5 videos per day.",
  "resetAt": "2026-01-30T00:00:00Z"
}
```

## Environment Variables

- `UPSTASH_REDIS_REST_URL` - From Upstash console
- `UPSTASH_REDIS_REST_TOKEN` - From Upstash console

## Setup

1. Create Redis database at https://console.upstash.com/
2. Copy REST URL and token to Vercel environment variables
3. Run `vercel env pull` for local development
