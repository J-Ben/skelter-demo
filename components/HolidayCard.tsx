'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type Holiday = { name: string; localName: string; date: string; daysUntil: number };

async function fetchHoliday(delay: number): Promise<{ data: Holiday; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch('https://date.nager.at/api/v3/NextPublicHolidays/FR');
  const raw = await res.json();
  const next = raw[0];
  const daysUntil = Math.ceil((new Date(next.date).getTime() - Date.now()) / 86400000);
  return {
    data: { name: next.name, localName: next.localName, date: next.date, daysUntil },
    loadTime: Date.now() - t0,
  };
}

function HolidayCardBase({ data }: { data: Holiday }) {
  const [year, month, day] = data.date.split('-');
  const formatted = new Date(+year, +month - 1, +day).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
        Next public holiday 🇫🇷
      </p>
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, width: 'fit-content' }}>{data.localName}</p>
      <p style={{ fontSize: 13, color: '#71717a', marginBottom: 20, width: 'fit-content' }}>{data.name}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Date</p>
          <p style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize', width: 'fit-content' }}>{formatted}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 36, fontWeight: 700, color: '#f97316', lineHeight: 1, width: 'fit-content', marginLeft: 'auto' }}>{data.daysUntil}</p>
          <p style={{ fontSize: 11, color: '#71717a', width: 'fit-content', marginLeft: 'auto' }}>days</p>
        </div>
      </div>
    </div>
  );
}

const HolidayCard = withSkeleton(HolidayCardBase);

const PLACEHOLDER: Holiday = { name: 'Assumption of Mary', localName: 'Assomption', date: '2026-08-15', daysUntil: 42 };

export default function Holiday({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['holiday', delay],
    queryFn: () => fetchHoliday(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="wave" exit="fadeRight" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <HolidayCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}

export const HOLIDAY_CODE = `import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton'
import { useQuery } from '@tanstack/react-query'

function HolidayCardBase({ data }) {
  return (
    <div>
      <p>{data.localName}</p>
      <p>{data.name}</p>
      <p>{data.date}</p>
      <p>{data.daysUntil} days</p>
    </div>
  )
}

const HolidayCard = withSkeleton(HolidayCardBase)

export default function Holiday({ delay }) {
  const { data, isLoading } = useQuery({
    queryKey: ['holiday', delay],
    queryFn: () => fetchHoliday(delay), // date.nager.at
  })
  return (
    <SkeletonTheme animation="shatter"
      skeletonConfig={{ shatterConfig: {
        gridSize: 10, fadeStyle: 'random', stagger: 25
      }}}>
      <HolidayCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  )
}`;
