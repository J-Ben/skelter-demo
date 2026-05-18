'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type GithubProfile = {
  login: string; name: string; bio: string;
  repos: number; followers: number; following: number;
};

async function fetchGithub(delay: number): Promise<{ data: GithubProfile; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch('https://api.github.com/users/gaearon');
  const raw = await res.json();
  return {
    data: {
      login: raw.login,
      name: raw.name ?? raw.login,
      bio: (raw.bio ?? '').slice(0, 72) || 'Open source contributor.',
      repos: raw.public_repos,
      followers: raw.followers,
      following: raw.following,
    },
    loadTime: Date.now() - t0,
  };
}

const AVATAR_COLORS = ['#6366f1', '#f97316', '#22c55e', '#a855f7', '#14b8a6', '#f43f5e', '#3b82f6'];
const avatarBg = (login: string) => AVATAR_COLORS[login.charCodeAt(0) % AVATAR_COLORS.length];

function GithubCardBase({ data }: { data: GithubProfile }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: avatarBg(data.login),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 20,
        }}>
          {data.login[0].toUpperCase()}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 14, color: '#f4f4f5', width: 'fit-content' }}>{data.name}</p>
          <p style={{ fontSize: 12, color: '#52525b', width: 'fit-content' }}>@{data.login}</p>
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6, marginBottom: 18, width: 'fit-content' }}>{data.bio}</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', width: 'fit-content' }}>{data.repos}</p>
          <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>repos</p>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', width: 'fit-content' }}>{data.followers.toLocaleString()}</p>
          <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>followers</p>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', width: 'fit-content' }}>{data.following}</p>
          <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>following</p>
        </div>
      </div>
    </div>
  );
}

const GithubCard = withSkeleton(GithubCardBase);

const PLACEHOLDER: GithubProfile = {
  login: 'gaearon', name: 'Dan Abramov',
  bio: 'Working on React. Also making egghead courses.',
  repos: 248, followers: 99400, following: 171,
};

export default function Github({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['github', delay],
    queryFn: () => fetchGithub(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="shatter" exit="fadeLeft" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <GithubCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}
