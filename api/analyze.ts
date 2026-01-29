import type { VercelRequest, VercelResponse } from '@vercel/node';

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

function parsePrUrl(url: string): { owner: string; repo: string; number: number } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2], number: parseInt(match[3], 10) };
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

  // For now, return just the meta - we'll add OpenAI in the next task
  return res.status(200).json({
    meta: result.meta,
    // Placeholder until OpenAI is added
    summary: {
      headline: result.pr.title,
      vibe: 'feature',
      bullets: ['Placeholder bullet 1', 'Placeholder bullet 2', 'Placeholder bullet 3'],
      emoji: '✨',
    },
    style: {
      accentColor: '#8b5cf6',
      tone: 'celebratory',
    },
  });
}
