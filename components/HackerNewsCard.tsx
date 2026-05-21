'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type HNStory = {
  title: string; by: string; score: number;
  descendants: number; url: string; time: number;
};

async function fetchHNStory(delay: number): Promise<{ data: HNStory; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const ids: number[] = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(r => r.json());
  const raw = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ids[0]}.json`).then(r => r.json());
  return {
    data: {
      title: raw.title,
      by: raw.by,
      score: raw.score,
      descendants: raw.descendants ?? 0,
      url: raw.url ?? `https://news.ycombinator.com/item?id=${raw.id}`,
      time: raw.time,
    },
    loadTime: Date.now() - t0,
  };
}

function timeAgo(unix: number): string {
  const h = Math.floor((Date.now() / 1000 - unix) / 3600);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function domain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return 'news.ycombinator.com'; }
}

function HNCardBase({ data }: { data: HNStory }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 44 }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#f97316', lineHeight: 1, width: 'fit-content' }}>
            {data.score}
          </p>
          <p style={{ fontSize: 10, color: '#52525b', width: 'fit-content' }}>pts</p>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', lineHeight: 1.4, marginBottom: 10, width: 'fit-content' }}>
            {data.title}
          </p>
          <p style={{ fontSize: 11, color: '#3f3f46', marginBottom: 8, width: 'fit-content' }}>
            {domain(data.url)}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>by {data.by}</p>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>{timeAgo(data.time)}</p>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>{data.descendants} comments</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const HNCard = withSkeleton(HNCardBase);

const PLACEHOLDER: HNStory = {
  title: 'Building a zero-config skeleton library for React',
  by: 'j-ben', score: 342, descendants: 87,
  url: 'https://github.com/J-Ben/skelter',
  time: Math.floor(Date.now() / 1000) - 7200,
};

export default function HackerNews({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['hn', delay],
    queryFn: () => fetchHNStory(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="slide" exit="fadeDown" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <HNCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}
