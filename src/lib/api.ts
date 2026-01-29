import type { VideoScript } from '../types';

export async function analyzePR(prUrl: string): Promise<VideoScript> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze PR');
  }

  return response.json();
}
