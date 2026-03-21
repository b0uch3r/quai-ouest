import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const isUpstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

// Rate limiter distribué — fonctionne sur Vercel serverless (multi-instances)
// Requiert UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN dans .env
const upstashRatelimit = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requêtes par heure par IP
      analytics: true,
      prefix: 'quai-ouest:ratelimit',
    })
  : null

// Fallback in-memory pour le dev local (sans Upstash)
const memoryMap = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(ip: string): Promise<{ success: boolean }> {
  if (upstashRatelimit) {
    return upstashRatelimit.limit(ip)
  }

  // Fallback in-memory
  const now = Date.now()
  const entry = memoryMap.get(ip)
  if (!entry || now > entry.resetAt) {
    memoryMap.set(ip, { count: 1, resetAt: now + 3600000 })
    return { success: true }
  }
  entry.count++
  return { success: entry.count <= 5 }
}
