import type { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from 'dotenv';
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

// Load .env.local for local development
config({ path: '.env.local' });

const RATE_LIMIT = 5;

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

function getSecondsUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function getMidnightUTCTimestamp(): number {
  const now = new Date();
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ) / 1000;
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number; resetAt: number } | null> {
  if (process.env.DISABLE_RATE_LIMIT === 'true' || !redis) {
    return null; // Rate limiting disabled
  }

  const key = `ratelimit:analyze:${ip}`;
  const resetAt = getMidnightUTCTimestamp();

  const count = await redis.get<number>(key) ?? 0;

  if (count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt };
  }

  const ttl = getSecondsUntilMidnightUTC();
  await redis.set(key, count + 1, { ex: ttl });

  return { allowed: true, remaining: RATE_LIMIT - count - 1, resetAt };
}

interface GitHubPR {
  title: string;
  user: { login: string; avatar_url: string };
  additions: number;
  deletions: number;
  changed_files: number;
  body: string | null;
}

interface GitHubFile {
  filename: string;
  additions: number;
  deletions: number;
  patch?: string;
}

const summarySchema = z.object({
  headline: z.string().describe('A catchy, short headline (max 10 words) that captures the essence of this PR'),
  vibe: z.enum(['feature', 'fix', 'refactor', 'docs', 'chore']),
  bullets: z.array(z.string()).min(3).max(5).describe('Key points (max 10 words each) explaining what changed'),
  emoji: z.string().describe('A single emoji that represents this PR'),
  accentColor: z.string().describe('A hex color that matches the vibe (bright, playful colors work best)'),
  tone: z.enum(['celebratory', 'relief', 'technical', 'minor']).describe('celebratory for new features, relief for bug fixes, technical for refactors, minor for small changes'),
});

type OpenAISummary = z.infer<typeof summarySchema>;

function parsePrUrl(url: string): { owner: string; repo: string; number: number } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2], number: parseInt(match[3], 10) };
}

async function generateSummary(pr: GitHubPR, files: GitHubFile[]): Promise<OpenAISummary> {
  // Truncate patches to manage tokens
  const truncatedFiles = files.slice(0, 10).map((f) => ({
    filename: f.filename,
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch?.slice(0, 500),
  }));

  const prompt = `Analyze this GitHub PR and generate a social media video summary.

PR Title: ${pr.title}
PR Description: ${pr.body?.slice(0, 1000) || 'No description'}
Files Changed: ${files.length}
Total Additions: ${pr.additions}
Total Deletions: ${pr.deletions}

Changed files:
${truncatedFiles.map((f) => `- ${f.filename} (+${f.additions}/-${f.deletions})`).join('\n')}`;

  const { output } = await generateText({
    model: openai('gpt-5.2'),
    output: Output.object({ schema: summarySchema }),
    prompt,
    temperature: 0.7,
  });

  if (!output) {
    throw new Error('Failed to generate summary');
  }

  return output;
}

async function fetchGitHubPR(owner: string, repo: string, number: number) {
  const [prRes, filesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}/files`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
  ]);

  if (!prRes.ok) {
    if (prRes.status === 404) return { error: 'PR not found or is private', status: 404 };
    return { error: 'Failed to fetch PR', status: prRes.status };
  }

  const pr: GitHubPR = await prRes.json();
  const files: GitHubFile[] = await filesRes.json();

  return {
    pr,
    files,
    meta: {
      repoName: `${owner}/${repo}`,
      prNumber: number,
      prTitle: pr.title,
      author: pr.user.login,
      authorAvatar: pr.user.avatar_url,
      filesChanged: pr.changed_files,
      additions: pr.additions,
      deletions: pr.deletions,
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract client IP
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress ?? 'unknown';

  // Check rate limit (skipped if Redis not configured)
  const rateLimit = await checkRateLimit(ip);

  if (rateLimit) {
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT);
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimit.resetAt);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. You can generate 5 videos per day.',
        resetAt: new Date(rateLimit.resetAt * 1000).toISOString(),
      });
    }
  }

  const { prUrl } = req.body;

  if (!prUrl || typeof prUrl !== 'string') {
    return res.status(400).json({ error: 'prUrl is required' });
  }

  const parsed = parsePrUrl(prUrl);
  if (!parsed) {
    return res.status(400).json({ error: 'Invalid PR URL format' });
  }

  const result = await fetchGitHubPR(parsed.owner, parsed.repo, parsed.number);

  if ('error' in result) {
    return res.status(result.status).json({ error: result.error });
  }

  const { pr, files } = result;

  const meta = {
    repoName: `${parsed.owner}/${parsed.repo}`,
    prNumber: parsed.number,
    prTitle: pr.title,
    author: pr.user.login,
    authorAvatar: pr.user.avatar_url,
    filesChanged: pr.changed_files,
    additions: pr.additions,
    deletions: pr.deletions,
  };

  try {
    const aiSummary = await generateSummary(pr, files);

    return res.status(200).json({
      meta,
      summary: {
        headline: aiSummary.headline,
        vibe: aiSummary.vibe,
        bullets: aiSummary.bullets,
        emoji: aiSummary.emoji,
      },
      style: {
        accentColor: aiSummary.accentColor,
        tone: aiSummary.tone,
      },
    });
  } catch (error) {
    // Return partial data if OpenAI fails
    console.error('OpenAI error:', error);
    return res.status(200).json({
      meta,
      summary: {
        headline: pr.title,
        vibe: 'feature',
        bullets: ['Check out this pull request', 'See the changes for details'],
        emoji: '📝',
      },
      style: {
        accentColor: '#8b5cf6',
        tone: 'technical',
      },
    });
  }
}
