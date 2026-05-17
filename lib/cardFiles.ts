import type { VirtualFile } from '@/components/CodeDrawer';

/* ─── Weather ─────────────────────────────────────────────── */
export const WEATHER_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { WeatherCard } from './WeatherCard';
import { fetchWeather } from './api';
import { PLACEHOLDER } from './types';

export default function Weather({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['weather', delay],
    queryFn: () => fetchWeather(delay),
  });

  return (
    <SkeletonTheme animation="wave" color="#27272a" highlightColor="#3f3f46">
      <WeatherCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'WeatherCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { Weather } from './types';

function WeatherCardBase({ data }: { data: Weather }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 13, color: '#71717a', width: 'fit-content' }}>
        {data.city}
      </p>
      <p style={{ fontSize: 56, fontWeight: 700, width: 'fit-content' }}>
        {data.temp}°
      </p>
      <p style={{ fontSize: 15, color: '#a1a1aa', width: 'fit-content' }}>
        {data.description}
      </p>
      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        <Stat label="Ressenti" value={\`\${data.feelsLike}°\`} />
        <Stat label="Humidité" value={\`\${data.humidity}%\`} />
        <Stat label="Vent"     value={\`\${data.wind} km/h\`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>
        {label}
      </p>
      <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>
        {value}
      </p>
    </div>
  );
}

// Une ligne — skelter mesure le layout et génère les bones.
export const WeatherCard = withSkeleton(WeatherCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { Weather } from './types';

const WEATHER_CODES: Record<number, string> = {
  0: 'Ciel dégagé',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  61: 'Pluie légère',
  63: 'Pluie modérée',
  71: 'Neige légère',
  80: 'Averses légères',
  95: 'Orage',
};

export async function fetchWeather(delay: number): Promise<Weather> {
  await new Promise(r => setTimeout(r, delay));

  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=48.85&longitude=2.35' +
    '&current=temperature_2m,apparent_temperature' +
    ',relative_humidity_2m,wind_speed_10m,weather_code' +
    '&wind_speed_unit=kmh'
  );
  const { current: c } = await res.json();

  return {
    city: 'Paris',
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    wind: Math.round(c.wind_speed_10m),
    description: WEATHER_CODES[c.weather_code] ?? 'Inconnu',
  };
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type Weather = {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  description: string;
};

export const PLACEHOLDER: Weather = {
  city: 'Paris',
  temp: 18,
  feelsLike: 16,
  humidity: 72,
  wind: 14,
  description: 'Partiellement nuageux',
};`,
  },
];

/* ─── Currency ────────────────────────────────────────────── */
export const CURRENCY_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { CurrencyCard } from './CurrencyCard';
import { fetchRates } from './api';
import { PLACEHOLDER } from './types';

export default function Currency({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['currency', delay],
    queryFn: () => fetchRates(delay),
  });

  return (
    <SkeletonTheme animation="pulse" color="#27272a" highlightColor="#3f3f46">
      <CurrencyCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'CurrencyCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { Rates } from './types';

const PAIRS = [
  { label: 'EUR → USD', key: 'USD' as const, decimals: 4 },
  { label: 'EUR → GBP', key: 'GBP' as const, decimals: 4 },
  { label: 'EUR → JPY', key: 'JPY' as const, decimals: 2 },
  { label: 'EUR → CHF', key: 'CHF' as const, decimals: 4 },
];

function CurrencyCardBase({ data }: { data: Rates }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16,
        textTransform: 'uppercase', letterSpacing: 1 }}>
        Taux de change
      </p>
      {PAIRS.map(({ label, key, decimals }) => (
        <div key={key} style={{ display: 'flex',
          justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#a1a1aa' }}>{label}</p>
          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
            {data[key].toFixed(decimals)}
          </p>
        </div>
      ))}
      <p style={{ fontSize: 11, color: '#3f3f46', marginTop: 8 }}>
        Source : Frankfurter
      </p>
    </div>
  );
}

export const CurrencyCard = withSkeleton(CurrencyCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { Rates } from './types';

export async function fetchRates(delay: number): Promise<Rates> {
  await new Promise(r => setTimeout(r, delay));

  const res = await fetch(
    'https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY,CHF'
  );
  const { rates } = await res.json();
  return rates;
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type Rates = {
  USD: number;
  GBP: number;
  JPY: number;
  CHF: number;
};

export const PLACEHOLDER: Rates = {
  USD: 1.0821,
  GBP: 0.8542,
  JPY: 161.23,
  CHF: 0.9731,
};`,
  },
];

/* ─── Air Quality ─────────────────────────────────────────── */
export const AIR_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { AirQualityCard } from './AirQualityCard';
import { fetchAirQuality } from './api';
import { PLACEHOLDER } from './types';

export default function AirQuality({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['air', delay],
    queryFn: () => fetchAirQuality(delay),
  });

  return (
    <SkeletonTheme animation="shiver" color="#27272a" highlightColor="#3f3f46">
      <AirQualityCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'AirQualityCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { AirQuality } from './types';

function AirQualityCardBase({ data }: { data: AirQuality }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 12,
        textTransform: 'uppercase', letterSpacing: 1 }}>
        Qualité de l'air — Paris
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <p style={{ fontSize: 52, fontWeight: 700, lineHeight: 1,
          color: data.color, width: 'fit-content' }}>
          {data.aqi}
        </p>
        <p style={{ fontSize: 13, color: '#71717a', width: 'fit-content' }}>
          IQA européen
        </p>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: data.color,
        marginBottom: 20, width: 'fit-content' }}>
        {data.label}
      </p>
      <div style={{ display: 'flex', gap: 24 }}>
        <Pollutant label="PM2.5" value={\`\${data.pm25.toFixed(1)} µg/m³\`} />
        <Pollutant label="PM10"  value={\`\${data.pm10.toFixed(1)} µg/m³\`} />
      </div>
    </div>
  );
}

function Pollutant({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{value}</p>
    </div>
  );
}

export const AirQualityCard = withSkeleton(AirQualityCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { AirQuality } from './types';

const AQI_LEVELS = [
  { max: 20,       label: 'Bon',          color: '#22c55e' },
  { max: 40,       label: 'Acceptable',   color: '#84cc16' },
  { max: 60,       label: 'Modéré',       color: '#eab308' },
  { max: 80,       label: 'Mauvais',      color: '#f97316' },
  { max: Infinity, label: 'Très mauvais', color: '#ef4444' },
];

export async function fetchAirQuality(delay: number): Promise<AirQuality> {
  await new Promise(r => setTimeout(r, delay));

  const res = await fetch(
    'https://air-quality-api.open-meteo.com/v1/air-quality' +
    '?latitude=48.85&longitude=2.35' +
    '&current=pm2_5,pm10,european_aqi'
  );
  const { current } = await res.json();
  const aqi = current.european_aqi;
  const { label, color } = AQI_LEVELS.find(l => aqi <= l.max)!;

  return { aqi, pm25: current.pm2_5, pm10: current.pm10, label, color };
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type AirQuality = {
  aqi: number;
  pm25: number;
  pm10: number;
  label: string;
  color: string;
};

export const PLACEHOLDER: AirQuality = {
  aqi: 28,
  pm25: 8.4,
  pm10: 14.2,
  label: 'Acceptable',
  color: '#84cc16',
};`,
  },
];

/* ─── Holiday ─────────────────────────────────────────────── */
export const HOLIDAY_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { HolidayCard } from './HolidayCard';
import { fetchHoliday } from './api';
import { PLACEHOLDER } from './types';

export default function Holiday({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['holiday', delay],
    queryFn: () => fetchHoliday(delay),
  });

  return (
    <SkeletonTheme
      animation="shatter"
      color="#27272a"
      highlightColor="#3f3f46"
      shatterConfig={{ gridSize: 10, fadeStyle: 'random', stagger: 25 }}
    >
      <HolidayCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'HolidayCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { Holiday } from './types';

function HolidayCardBase({ data }: { data: Holiday }) {
  const [y, m, d] = data.date.split('-');
  const formatted = new Date(+y, +m - 1, +d).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16,
        textTransform: 'uppercase', letterSpacing: 1 }}>
        Prochain jour férié 🇫🇷
      </p>
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6,
        width: 'fit-content' }}>
        {data.localName}
      </p>
      <p style={{ fontSize: 13, color: '#71717a', marginBottom: 20,
        width: 'fit-content' }}>
        {data.name}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>
            Date
          </p>
          <p style={{ fontSize: 13, fontWeight: 600,
            textTransform: 'capitalize', width: 'fit-content' }}>
            {formatted}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 36, fontWeight: 700, color: '#f97316',
            lineHeight: 1, width: 'fit-content', marginLeft: 'auto' }}>
            {data.daysUntil}
          </p>
          <p style={{ fontSize: 11, color: '#71717a',
            width: 'fit-content', marginLeft: 'auto' }}>
            jours
          </p>
        </div>
      </div>
    </div>
  );
}

export const HolidayCard = withSkeleton(HolidayCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { Holiday } from './types';

export async function fetchHoliday(delay: number): Promise<Holiday> {
  await new Promise(r => setTimeout(r, delay));

  const res = await fetch(
    'https://date.nager.at/api/v3/NextPublicHolidays/FR'
  );
  const [next] = await res.json();
  const daysUntil = Math.ceil(
    (new Date(next.date).getTime() - Date.now()) / 86_400_000
  );

  return {
    name: next.name,
    localName: next.localName,
    date: next.date,
    daysUntil,
  };
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type Holiday = {
  name: string;
  localName: string;
  date: string;
  daysUntil: number;
};

export const PLACEHOLDER: Holiday = {
  name: 'Assumption of Mary',
  localName: 'Assomption',
  date: '2026-08-15',
  daysUntil: 42,
};`,
  },
];
