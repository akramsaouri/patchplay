# Rate Limiting Design for /api/analyze

## Summary

Add IP-based rate limiting: 5 requests per day per IP, resetting at midnight UTC.

## Storage

- **Provider**: Vercel KV (Redis)
- **Key format**: `ratelimit:analyze:{ip}`
- **Value**: request count (number)
- **TTL**: seconds until midnight UTC (auto-expires)

## Implementation

1. Add `@vercel/kv` dependency
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

- `KV_REST_API_URL` - Auto-populated by Vercel
- `KV_REST_API_TOKEN` - Auto-populated by Vercel

## Setup

1. Create KV store in Vercel dashboard (Storage → Create → KV)
2. Link to project
3. Run `vercel env pull` for local development
