'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type AirQuality = { aqi: number; pm25: number; pm10: number; label: string; color: string };

async function fetchAirQuality(delay: number): Promise<{ data: AirQuality; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch(
    'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=48.85&longitude=2.35&current=pm2_5,pm10,european_aqi'
  );
  const raw = await res.json();
  const aqi = raw.current.european_aqi;
  const levels = [
    { max: 20, label: 'Good', color: '#22c55e' },
    { max: 40, label: 'Fair', color: '#84cc16' },
    { max: 60, label: 'Moderate', color: '#eab308' },
    { max: 80, label: 'Poor', color: '#f97316' },
    { max: Infinity, label: 'Very poor', color: '#ef4444' },
  ];
  const { label, color } = levels.find(l => aqi <= l.max)!;
  return {
    data: { aqi, pm25: raw.current.pm2_5, pm10: raw.current.pm10, label, color },
    loadTime: Date.now() - t0,
  };
}

function AirQualityCardBase({ data }: { data: AirQuality }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
        Air quality: Paris
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <p style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: data.color, width: 'fit-content' }}>{data.aqi}</p>
        <p style={{ fontSize: 13, color: '#71717a', width: 'fit-content' }}>European AQI</p>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: data.color, marginBottom: 20, width: 'fit-content' }}>{data.label}</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>PM2.5</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.pm25.toFixed(1)} µg/m³</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>PM10</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.pm10.toFixed(1)} µg/m³</p>
        </div>
      </div>
    </div>
  );
}

const AirQualityCard = withSkeleton(AirQualityCardBase);

const PLACEHOLDER: AirQuality = { aqi: 28, pm25: 8.4, pm10: 14.2, label: 'Fair', color: '#84cc16' };

export default function AirQuality({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['air', delay],
    queryFn: () => fetchAirQuality(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="shiver" exit="fadeDown" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <AirQualityCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}

export const AIR_CODE = `import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton'
import { useQuery } from '@tanstack/react-query'

function AirQualityCardBase({ data }) {
  return (
    <div>
      <p style={{ color: data.color }}>{data.aqi}</p>
      <p style={{ color: data.color }}>{data.label}</p>
      <p>PM2.5 : {data.pm25} µg/m³</p>
      <p>PM10  : {data.pm10} µg/m³</p>
    </div>
  )
}

const AirQualityCard = withSkeleton(AirQualityCardBase)

export default function AirQuality({ delay }) {
  const { data, isLoading } = useQuery({
    queryKey: ['air', delay],
    queryFn: () => fetchAirQuality(delay), // open-meteo.com
  })
  return (
    <SkeletonTheme animation="shiver" color="#27272a">
      <AirQualityCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  )
}`;
