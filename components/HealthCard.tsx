'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type HealthProfile = {
  name: string;
  age: number;
  photo: string;
  location: string;
  heartRate: number;
  steps: number;
  sleep: number;
  calories: number;
};

async function fetchHealthProfile(delay: number): Promise<{ data: HealthProfile; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch('https://randomuser.me/api/?inc=name,picture,dob,location&nat=fr,gb,us,au');
  const { results: [u] } = await res.json();
  const age: number = u.dob.age;
  return {
    data: {
      name: `${u.name.first} ${u.name.last}`,
      age,
      photo: u.picture.large,
      location: `${u.location.city}, ${u.location.country}`,
      heartRate: Math.max(55, 72 - Math.floor(age / 12)) + Math.floor(Math.random() * 18),
      steps: 3800 + Math.floor(Math.random() * 7200),
      sleep: Math.round((5.5 + Math.random() * 3) * 10) / 10,
      calories: 1500 + Math.floor(Math.random() * 1000),
    },
    loadTime: Date.now() - t0,
  };
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={{
      flex: 1, background: '#18181b', borderRadius: 10, padding: '10px 12px',
      display: 'flex', flexDirection: 'column',
    }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 4, width: 'fit-content' }}>{icon} {label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5', width: 'fit-content' }}>{value}</p>
    </div>
  );
}

function HealthCardBase({ data }: { data: HealthProfile }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.photo}
          alt={data.name}
          width={72}
          height={72}
          style={{ borderRadius: '50%', flexShrink: 0, objectFit: 'cover', display: 'block' }}
        />
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', width: 'fit-content', marginBottom: 3 }}>
            {data.name}
          </p>
          <p style={{ fontSize: 12, color: '#71717a', width: 'fit-content', marginBottom: 3 }}>
            {data.age} years old
          </p>
          <p style={{ fontSize: 12, color: '#52525b', width: 'fit-content' }}>
            {data.location}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Stat icon="♥" label="Heart rate" value={`${data.heartRate} bpm`} />
        <Stat icon="⚡" label="Steps"      value={data.steps.toLocaleString()} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Stat icon="◑" label="Sleep"      value={`${data.sleep}h`} />
        <Stat icon="◈" label="Calories"   value={`${data.calories} kcal`} />
      </div>
    </div>
  );
}

const HealthCard = withSkeleton(HealthCardBase);

const PLACEHOLDER: HealthProfile = {
  name: 'Sophie Martin',
  age: 28,
  photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  location: 'Lyon, France',
  heartRate: 68,
  steps: 8432,
  sleep: 7.2,
  calories: 1840,
};

export default function Health({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['health', delay],
    queryFn: () => fetchHealthProfile(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="beat" exit="fadeDown" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={8}>
      <HealthCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}
