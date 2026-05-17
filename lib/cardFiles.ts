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
        <Stat label="Feels like" value={\`\${data.feelsLike}°\`} />
        <Stat label="Humidity"   value={\`\${data.humidity}%\`} />
        <Stat label="Wind"       value={\`\${data.wind} km/h\`} />
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

// One line — skelter measures the layout and generates the bones.
export const WeatherCard = withSkeleton(WeatherCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { Weather } from './types';

const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  61: 'Light rain',
  63: 'Moderate rain',
  71: 'Light snow',
  80: 'Light showers',
  95: 'Thunderstorm',
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
    description: WEATHER_CODES[c.weather_code] ?? 'Unknown',
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
  description: 'Partly cloudy',
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
        Exchange rates
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
        Source: Frankfurter
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
        Air quality — Paris
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <p style={{ fontSize: 52, fontWeight: 700, lineHeight: 1,
          color: data.color, width: 'fit-content' }}>
          {data.aqi}
        </p>
        <p style={{ fontSize: 13, color: '#71717a', width: 'fit-content' }}>
          European AQI
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
  { max: 20,       label: 'Good',          color: '#22c55e' },
  { max: 40,       label: 'Fair',   color: '#84cc16' },
  { max: 60,       label: 'Moderate',       color: '#eab308' },
  { max: 80,       label: 'Poor',      color: '#f97316' },
  { max: Infinity, label: 'Very poor', color: '#ef4444' },
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
  label: 'Fair',
  color: '#84cc16',
};`,
  },
];

/* ─── GitHub ──────────────────────────────────────────────── */
export const GITHUB_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { GithubCard } from './GithubCard';
import { fetchGithub } from './api';
import { PLACEHOLDER } from './types';

export default function Github({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['github', delay],
    queryFn: () => fetchGithub(delay),
  });

  return (
    <SkeletonTheme animation="shiver" color="#27272a" highlightColor="#3f3f46">
      <GithubCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'GithubCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { GithubProfile } from './types';

const COLORS = ['#6366f1','#f97316','#22c55e','#a855f7','#14b8a6'];
const avatarBg = (login: string) => COLORS[login.charCodeAt(0) % COLORS.length];

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
          <p style={{ fontWeight: 700, fontSize: 14, color: '#f4f4f5', width: 'fit-content' }}>
            {data.name}
          </p>
          <p style={{ fontSize: 12, color: '#52525b', width: 'fit-content' }}>
            @{data.login}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6,
        marginBottom: 18, width: 'fit-content' }}>
        {data.bio}
      </p>
      <div style={{ display: 'flex', gap: 24 }}>
        <Stat label="repos"     value={String(data.repos)} />
        <Stat label="followers" value={data.followers.toLocaleString()} />
        <Stat label="following" value={String(data.following)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', width: 'fit-content' }}>{value}</p>
      <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>{label}</p>
    </div>
  );
}

export const GithubCard = withSkeleton(GithubCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { GithubProfile } from './types';

export async function fetchGithub(delay: number): Promise<GithubProfile> {
  await new Promise(r => setTimeout(r, delay));

  const res = await fetch('https://api.github.com/users/gaearon');
  const raw = await res.json();
  return {
    login: raw.login,
    name: raw.name ?? raw.login,
    bio: (raw.bio ?? '').slice(0, 72),
    repos: raw.public_repos,
    followers: raw.followers,
    following: raw.following,
  };
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type GithubProfile = {
  login: string;
  name: string;
  bio: string;
  repos: number;
  followers: number;
  following: number;
};

export const PLACEHOLDER: GithubProfile = {
  login: 'gaearon',
  name: 'Dan Abramov',
  bio: 'Working on React. Also making egghead courses.',
  repos: 248,
  followers: 99400,
  following: 171,
};`,
  },
];

/* ─── Product ─────────────────────────────────────────────── */
export const PRODUCT_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { ProductCard } from './ProductCard';
import { fetchProduct } from './api';
import { PLACEHOLDER } from './types';

export default function Product({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['product', delay],
    queryFn: () => fetchProduct(delay),
  });

  return (
    <SkeletonTheme animation="wave" color="#27272a" highlightColor="#3f3f46">
      <ProductCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'ProductCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { Product } from './types';

const CAT_COLORS: Record<string, string> = {
  smartphones: '#6366f1', laptops: '#3b82f6',
  fragrances: '#a855f7', skincare: '#ec4899',
  groceries: '#22c55e', 'home-decoration': '#f97316',
};
const stars = (r: number) =>
  '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

function ProductCardBase({ data }: { data: Product }) {
  const color = CAT_COLORS[data.category] ?? '#71717a';
  return (
    <div>
      <div style={{
        height: 110,
        background: 'linear-gradient(135deg, #27272a, #3f3f46)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 36 }}>🛍</span>
      </div>
      <div style={{ padding: '14px 18px 18px' }}>
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 20, marginBottom: 8,
          background: color + '20', color,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {data.category}
        </span>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5',
          marginBottom: 6, width: 'fit-content' }}>
          {data.title}
        </p>
        <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.5,
          marginBottom: 14, width: 'fit-content' }}>
          {data.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#f97316', width: 'fit-content' }}>
            \${data.price}
          </p>
          <p style={{ fontSize: 13, color: '#fbbf24', letterSpacing: 1 }}>
            {stars(data.rating)}
          </p>
        </div>
      </div>
    </div>
  );
}

export const ProductCard = withSkeleton(ProductCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { Product } from './types';

export async function fetchProduct(delay: number): Promise<Product> {
  await new Promise(r => setTimeout(r, delay));

  const id = Math.floor(Math.random() * 50) + 1;
  const res = await fetch(\`https://dummyjson.com/products/\${id}\`);
  const raw = await res.json();
  return {
    title: raw.title,
    description: (raw.description as string).slice(0, 72),
    price: raw.price,
    rating: raw.rating,
    category: raw.category,
  };
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type Product = {
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
};

export const PLACEHOLDER: Product = {
  title: 'iPhone 9',
  description: 'An apple mobile which is nothing like apple.',
  price: 549,
  rating: 4.7,
  category: 'smartphones',
};`,
  },
];

/* ─── Hacker News ─────────────────────────────────────────── */
export const HN_FILES: VirtualFile[] = [
  {
    name: 'index.tsx',
    lang: 'tsx',
    code: `'use client';
import { useQuery } from '@tanstack/react-query';
import { SkeletonTheme } from 'react-zero-skeleton';
import { HNCard } from './HNCard';
import { fetchHNStory } from './api';
import { PLACEHOLDER } from './types';

export default function HackerNews({ delay }: { delay: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['hn', delay],
    queryFn: () => fetchHNStory(delay),
  });

  return (
    <SkeletonTheme animation="pulse" color="#27272a" highlightColor="#3f3f46">
      <HNCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  );
}`,
  },
  {
    name: 'HNCard.tsx',
    lang: 'tsx',
    code: `import { withSkeleton } from 'react-zero-skeleton';
import type { HNStory } from './types';

function domain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return 'news.ycombinator.com'; }
}
function timeAgo(unix: number) {
  const h = Math.floor((Date.now() / 1000 - unix) / 3600);
  if (h < 1) return 'just now';
  if (h < 24) return \`\${h}h ago\`;
  return \`\${Math.floor(h / 24)}d ago\`;
}

function HNCardBase({ data }: { data: HNStory }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column',
          alignItems: 'center', flexShrink: 0, width: 44 }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#f97316',
            lineHeight: 1, width: 'fit-content' }}>
            {data.score}
          </p>
          <p style={{ fontSize: 10, color: '#52525b', width: 'fit-content' }}>pts</p>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5',
            lineHeight: 1.4, marginBottom: 10, width: 'fit-content' }}>
            {data.title}
          </p>
          <p style={{ fontSize: 11, color: '#3f3f46',
            marginBottom: 8, width: 'fit-content' }}>
            {domain(data.url)}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>
              by {data.by}
            </p>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>
              {timeAgo(data.time)}
            </p>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>
              {data.descendants} comments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const HNCard = withSkeleton(HNCardBase);`,
  },
  {
    name: 'api.ts',
    lang: 'ts',
    code: `import type { HNStory } from './types';

export async function fetchHNStory(delay: number): Promise<HNStory> {
  await new Promise(r => setTimeout(r, delay));

  const ids: number[] = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json'
  ).then(r => r.json());

  const raw = await fetch(
    \`https://hacker-news.firebaseio.com/v0/item/\${ids[0]}.json\`
  ).then(r => r.json());

  return {
    title: raw.title,
    by: raw.by,
    score: raw.score,
    descendants: raw.descendants ?? 0,
    url: raw.url ?? \`https://news.ycombinator.com/item?id=\${raw.id}\`,
    time: raw.time,
  };
}`,
  },
  {
    name: 'types.ts',
    lang: 'ts',
    code: `export type HNStory = {
  title: string;
  by: string;
  score: number;
  descendants: number;
  url: string;
  time: number;
};

export const PLACEHOLDER: HNStory = {
  title: 'Building a zero-config skeleton library for React',
  by: 'j-ben',
  score: 342,
  descendants: 87,
  url: 'https://github.com/J-Ben/skelter',
  time: Math.floor(Date.now() / 1000) - 7200,
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
  const formatted = new Date(+y, +m - 1, +d).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16,
        textTransform: 'uppercase', letterSpacing: 1 }}>
        Next public holiday 🇫🇷
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
            days
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
