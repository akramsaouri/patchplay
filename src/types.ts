export interface VideoScript {
  meta: {
    repoName: string;
    prNumber: number;
    prTitle: string;
    author: string;
    authorAvatar: string;
    filesChanged: number;
    additions: number;
    deletions: number;
  };
  summary: {
    headline: string;
    vibe: 'feature' | 'fix' | 'refactor' | 'docs' | 'chore';
    bullets: string[];
    emoji: string;
  };
  style: {
    accentColor: string;
    tone: 'celebratory' | 'relief' | 'technical' | 'minor';
  };
}
