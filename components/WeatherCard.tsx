'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type Weather = { city: string; temp: number; feelsLike: number; humidity: number; wind: number; description: string };

async function fetchWeather(delay: number): Promise<{ data: Weather; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh'
  );
  const raw = await res.json();
  const c = raw.current;
  const descriptions: Record<number, string> = {
    0: 'Ciel dégagé', 1: 'Principalement dégagé', 2: 'Partiellement nuageux',
    3: 'Couvert', 45: 'Brouillard', 51: 'Bruine légère',
    61: 'Pluie légère', 63: 'Pluie modérée', 71: 'Neige légère',
    80: 'Averses légères', 95: 'Orage',
  };
  return {
    data: {
      city: 'Paris', temp: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m, wind: Math.round(c.wind_speed_10m),
      description: descriptions[c.weather_code] ?? 'Inconnu',
    },
    loadTime: Date.now() - t0,
  };
}

function WeatherCardBase({ data }: { data: Weather }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 13, color: '#71717a', marginBottom: 4, width: 'fit-content' }}>{data.city}</p>
      <p style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, marginBottom: 4, width: 'fit-content' }}>{data.temp}°</p>
      <p style={{ fontSize: 15, color: '#a1a1aa', marginBottom: 20, width: 'fit-content' }}>{data.description}</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Ressenti</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.feelsLike}°</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Humidité</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.humidity}%</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Vent</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.wind} km/h</p>
        </div>
      </div>
    </div>
  );
}

const WeatherCard = withSkeleton(WeatherCardBase);

const PLACEHOLDER: Weather = { city: 'Paris', temp: 18, feelsLike: 16, humidity: 72, wind: 14, description: 'Partiellement nuageux' };

export default function Weather({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['weather', delay],
    queryFn: () => fetchWeather(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="wave" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <WeatherCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}

export const WEATHER_CODE = `import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton'
import { useQuery } from '@tanstack/react-query'

// Votre composant — inchangé
function WeatherCardBase({ data }) {
  return (
    <div>
      <p>{data.city}</p>
      <p>{data.temp}°</p>
      <p>{data.description}</p>
    </div>
  )
}

// Une ligne. C'est tout.
const WeatherCard = withSkeleton(WeatherCardBase)

export default function Weather({ delay }) {
  const { data, isLoading } = useQuery({
    queryKey: ['weather', delay],
    queryFn: () => fetchWeather(delay), // open-meteo.com
  })
  return (
    <SkeletonTheme animation="wave" color="#27272a">
      <WeatherCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  )
}`;
