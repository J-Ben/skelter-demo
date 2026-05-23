'use client';
import { useEffect, useState } from 'react';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';
import Weather from '@/components/WeatherCard';
import Currency from '@/components/CurrencyCard';
import AirQuality from '@/components/AirQualityCard';
import Holiday from '@/components/HolidayCard';
import Github from '@/components/GithubCard';
import Product from '@/components/ProductCard';
import HackerNews from '@/components/HackerNewsCard';
import Health from '@/components/HealthCard';
import DemoCard from '@/components/DemoCard';
import ThemeToggle from '@/components/ThemeToggle';
import { CodeDrawer, type DrawerCard } from '@/components/CodeDrawer';
import { WEATHER_FILES, CURRENCY_FILES, AIR_FILES, HOLIDAY_FILES, GITHUB_FILES, PRODUCT_FILES, HN_FILES, HEALTH_FILES } from '@/lib/cardFiles';

const OFFSETS = [0, 300, 600, 900, 1200, 1500, 1800, 2100];

/* ─── Live scope data ─────────────────────────────────────── */
const WEATHER_DATA  = { city: 'Paris', temp: 18, feelsLike: 16, humidity: 72, wind: 14, description: 'Partly cloudy' };
const CURRENCY_DATA = { USD: 1.0821, GBP: 0.8542, JPY: 161.23, CHF: 0.9731 };
const AIR_DATA      = { aqi: 28, pm25: 8.4, pm10: 14.2, label: 'Fair', color: '#84cc16' };
const HOLIDAY_DATA  = { name: 'Assumption of Mary', localName: 'Assomption', date: '2026-08-15', daysUntil: 42 };
const GITHUB_DATA   = { login: 'gaearon', name: 'Dan Abramov', bio: 'Working on React. Also making egghead courses.', repos: 248, followers: 99400, following: 171 };
const PRODUCT_DATA  = { title: 'iPhone 9', description: 'An apple mobile which is nothing like apple.', price: 549, rating: 4.7, category: 'smartphones' };
const HN_DATA       = { title: 'Building a zero-config skeleton library for React', by: 'j-ben', score: 342, descendants: 87, url: 'https://github.com/J-Ben/skelter', time: Math.floor(Date.now() / 1000) - 7200 };
const HEALTH_DATA = {
  name: 'Sophie Martin', age: 28,
  photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  location: 'Lyon, France',
  heartRate: 68, steps: 8432, sleep: 7.2, calories: 1840,
};

/* ─── Live code snippets ──────────────────────────────────── */
const WEATHER_LIVE = `function WeatherCardBase({ data }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 13, color: '#71717a', marginBottom: 4, width: 'fit-content' }}>{data.city}</p>
      <p style={{ fontSize: 56, fontWeight: 700, lineHeight: 1, marginBottom: 4, width: 'fit-content' }}>{data.temp}°</p>
      <p style={{ fontSize: 15, color: '#a1a1aa', marginBottom: 20, width: 'fit-content' }}>{data.description}</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Feels like</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.feelsLike}°</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Humidity</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.humidity}%</p>
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Wind</p>
          <p style={{ fontSize: 15, fontWeight: 600, width: 'fit-content' }}>{data.wind} km/h</p>
        </div>
      </div>
    </div>
  )
}

const WeatherCard = withSkeleton(WeatherCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="shatter" exit="fadeUp" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <WeatherCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const CURRENCY_LIVE = `function CurrencyCardBase({ data }) {
  const pairs = [
    { label: 'EUR → USD', value: data.USD.toFixed(4) },
    { label: 'EUR → GBP', value: data.GBP.toFixed(4) },
    { label: 'EUR → JPY', value: data.JPY.toFixed(2) },
    { label: 'EUR → CHF', value: data.CHF.toFixed(4) },
  ]
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Exchange rates</p>
      {pairs.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#a1a1aa' }}>{label}</p>
          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{value}</p>
        </div>
      ))}
      <p style={{ fontSize: 11, color: '#3f3f46', marginTop: 8 }}>Source: Frankfurter</p>
    </div>
  )
}

const CurrencyCard = withSkeleton(CurrencyCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="pulse" exit="fade" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <CurrencyCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const AIR_LIVE = `function AirQualityCardBase({ data }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Air quality: Paris</p>
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
  )
}

const AirQualityCard = withSkeleton(AirQualityCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="shiver" exit="fadeDown" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <AirQualityCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const HOLIDAY_LIVE = `function HolidayCardBase({ data }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Next public holiday 🇫🇷</p>
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, width: 'fit-content' }}>{data.localName}</p>
      <p style={{ fontSize: 13, color: '#71717a', marginBottom: 20, width: 'fit-content' }}>{data.name}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 11, color: '#52525b', marginBottom: 2, width: 'fit-content' }}>Date</p>
          <p style={{ fontSize: 13, fontWeight: 600, width: 'fit-content' }}>{data.date}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 36, fontWeight: 700, color: '#f97316', lineHeight: 1, width: 'fit-content', marginLeft: 'auto' }}>{data.daysUntil}</p>
          <p style={{ fontSize: 11, color: '#71717a', width: 'fit-content', marginLeft: 'auto' }}>days</p>
        </div>
      </div>
    </div>
  )
}

const HolidayCard = withSkeleton(HolidayCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="wave" exit="fadeRight" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <HolidayCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const GITHUB_LIVE = `const COLORS = ['#6366f1','#f97316','#22c55e','#a855f7','#14b8a6']
const avatarBg = (login) => COLORS[login.charCodeAt(0) % COLORS.length]

function GithubCardBase({ data }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, background: avatarBg(data.login), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 }}>
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
  )
}

const GithubCard = withSkeleton(GithubCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="shatter" exit="fadeLeft" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <GithubCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const PRODUCT_LIVE = `const CAT_COLORS = { smartphones: '#6366f1', laptops: '#3b82f6', fragrances: '#a855f7', skincare: '#ec4899', groceries: '#22c55e' }
const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

function ProductCardBase({ data }) {
  const color = CAT_COLORS[data.category] ?? '#71717a'
  return (
    <div>
      <div style={{ height: 110, background: 'linear-gradient(135deg, #27272a, #3f3f46)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 36 }}>🛍</span>
      </div>
      <div style={{ padding: '14px 18px 18px' }}>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, marginBottom: 8, background: color + '20', color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {data.category}
        </span>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5', marginBottom: 6, width: 'fit-content' }}>{data.title}</p>
        <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.5, marginBottom: 14, width: 'fit-content' }}>{data.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#f97316', width: 'fit-content' }}>\${data.price}</p>
          <p style={{ fontSize: 13, color: '#fbbf24', letterSpacing: 1 }}>{stars(data.rating)}</p>
        </div>
      </div>
    </div>
  )
}

const ProductCard = withSkeleton(ProductCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="pulse" exit="fade" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <ProductCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const HN_LIVE = `function domain(url) {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return 'news.ycombinator.com' }
}
function timeAgo(unix) {
  const h = Math.floor((Date.now() / 1000 - unix) / 3600)
  if (h < 1) return 'just now'
  if (h < 24) return h + 'h ago'
  return Math.floor(h / 24) + 'd ago'
}

function HNCardBase({ data }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 44 }}>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#f97316', lineHeight: 1, width: 'fit-content' }}>{data.score}</p>
          <p style={{ fontSize: 10, color: '#52525b', width: 'fit-content' }}>pts</p>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', lineHeight: 1.4, marginBottom: 10, width: 'fit-content' }}>{data.title}</p>
          <p style={{ fontSize: 11, color: '#3f3f46', marginBottom: 8, width: 'fit-content' }}>{domain(data.url)}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>by {data.by}</p>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>{timeAgo(data.time)}</p>
            <p style={{ fontSize: 11, color: '#52525b', width: 'fit-content' }}>{data.descendants} comments</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const HNCard = withSkeleton(HNCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="slide" exit="fadeDown" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
        <HNCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

const HEALTH_LIVE = `function Stat({ icon, value, label }) {
  return (
    <div style={{ flex: 1, background: '#18181b', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 4, width: 'fit-content' }}>{icon} {label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f5', width: 'fit-content' }}>{value}</p>
    </div>
  )
}

function HealthCardBase({ data }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <img src={data.photo} width={72} height={72} style={{ borderRadius: '50%', flexShrink: 0, objectFit: 'cover', display: 'block' }} />
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', width: 'fit-content', marginBottom: 3 }}>{data.name}</p>
          <p style={{ fontSize: 12, color: '#71717a', width: 'fit-content', marginBottom: 3 }}>{data.age} years old</p>
          <p style={{ fontSize: 12, color: '#52525b', width: 'fit-content' }}>{data.location}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Stat icon="♥" label="Heart rate" value={\`\${data.heartRate} bpm\`} />
        <Stat icon="⚡" label="Steps" value={data.steps.toLocaleString()} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Stat icon="◑" label="Sleep" value={\`\${data.sleep}h\`} />
        <Stat icon="◈" label="Calories" value={\`\${data.calories} kcal\`} />
      </div>
    </div>
  )
}

const HealthCard = withSkeleton(HealthCardBase)

function App() {
  const [loading, setLoading] = React.useState(false)
  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <SkeletonTheme animation="beat" exit="fadeDown" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={8}>
        <HealthCard hasSkeleton isLoading={loading} data={data} />
      </SkeletonTheme>
      <div style={{ padding: '8px 16px', borderTop: '1px solid #27272a' }}>
        <button onClick={() => setLoading(l => !l)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', cursor: 'pointer' }}>
          {loading ? 'Show data' : 'Show skeleton'}
        </button>
      </div>
    </div>
  )
}

render(<App />)`;

/* ─── Card meta ───────────────────────────────────────────── */
type CardKey = 'weather' | 'currency' | 'air' | 'holiday' | 'github' | 'product' | 'hn' | 'health';

const CARD_META: { key: CardKey; title: string; api: string; animation: string }[] = [
  { key: 'weather',  title: 'Weather',         api: 'open-meteo.com',              animation: 'shatter' },
  { key: 'air',      title: 'Air Quality',      api: 'open-meteo.com',              animation: 'shiver' },
  { key: 'holiday',  title: 'Public Holidays',  api: 'date.nager.at',               animation: 'wave' },
  { key: 'health',   title: 'Health Profile',   api: 'randomuser.me',               animation: 'beat' },
  { key: 'hn',       title: 'HN Top Story',     api: 'hacker-news.firebaseio.com',  animation: 'slide' },
  { key: 'currency', title: 'Exchange Rate',    api: 'frankfurter.app',             animation: 'pulse' },
  { key: 'github',   title: 'GitHub Profile',   api: 'api.github.com',              animation: 'shatter' },
  { key: 'product',  title: 'Product',          api: 'dummyjson.com',               animation: 'pulse' },
];

const QR_SRC =
  'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' +
  encodeURIComponent('https://expo.dev/preview/update?message=initial+publish&updateRuntimeVersion=1.0.0&createdAt=2026-05-18T14%3A17%3A48.948Z&slug=exp&projectId=568dd7ef-a91e-4422-a444-b1c336689b5a&group=a5119375-5914-4119-87f6-6eec4e3948dc');

function MobileQR() {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--subtle)', fontSize: 12, textDecoration: 'underline',
          padding: 0, fontFamily: 'inherit',
        }}
      >
        try on mobile
      </button>
      {open && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
          padding: 16, textAlign: 'center', zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 8, marginBottom: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_SRC} alt="QR Expo Go" width={160} height={160} style={{ display: 'block' }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--subtle)', margin: 0 }}>Scan with Expo Go</p>
        </div>
      )}
    </span>
  );
}

export default function Home() {
  const [version, setVersion] = useState<string | null>(null);
  const [baseDelay, setBaseDelay] = useState(2000);
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const [loadTimes, setLoadTimes] = useState<Record<CardKey, number | null>>({
    weather: null, currency: null, air: null, holiday: null,
    github: null, product: null, hn: null, health: null,
  });

  useEffect(() => {
    fetch('https://registry.npmjs.org/react-zero-skeleton/latest')
      .then(r => r.json())
      .then(d => setVersion(d.version))
      .catch(() => {});
  }, []);

  const onLoaded = (key: CardKey) => (ms: number) =>
    setLoadTimes(prev => ({ ...prev, [key]: ms }));

  const onDelayChange = (val: number) => {
    setBaseDelay(val);
    setLoadTimes({ weather: null, currency: null, air: null, holiday: null, github: null, product: null, hn: null, health: null });
  };

  const cards: DrawerCard[] = [
    {
      title: 'Weather', animation: 'shatter', folder: 'weather',
      files: WEATHER_FILES, component: <Weather delay={baseDelay + OFFSETS[0]} />,
      liveCode: WEATHER_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: WEATHER_DATA },
    },
    {
      title: 'Air Quality', animation: 'shiver', folder: 'air-quality',
      files: AIR_FILES, component: <AirQuality delay={baseDelay + OFFSETS[1]} />,
      liveCode: AIR_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: AIR_DATA },
    },
    {
      title: 'Public Holidays', animation: 'wave', folder: 'holiday',
      files: HOLIDAY_FILES, component: <Holiday delay={baseDelay + OFFSETS[2]} />,
      liveCode: HOLIDAY_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: HOLIDAY_DATA },
    },
    {
      title: 'Health Profile', animation: 'beat', folder: 'health',
      files: HEALTH_FILES, component: <Health delay={baseDelay + OFFSETS[3]} />,
      liveCode: HEALTH_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: HEALTH_DATA },
    },
    {
      title: 'HN Top Story', animation: 'slide', folder: 'hacker-news',
      files: HN_FILES, component: <HackerNews delay={baseDelay + OFFSETS[4]} />,
      liveCode: HN_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: HN_DATA },
    },
    {
      title: 'Exchange Rate', animation: 'pulse', folder: 'currency',
      files: CURRENCY_FILES, component: <Currency delay={baseDelay + OFFSETS[5]} />,
      liveCode: CURRENCY_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: CURRENCY_DATA },
    },
    {
      title: 'GitHub Profile', animation: 'shatter', folder: 'github',
      files: GITHUB_FILES, component: <Github delay={baseDelay + OFFSETS[6]} />,
      liveCode: GITHUB_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: GITHUB_DATA },
    },
    {
      title: 'Product', animation: 'pulse', folder: 'product',
      files: PRODUCT_FILES, component: <Product delay={baseDelay + OFFSETS[7]} />,
      liveCode: PRODUCT_LIVE, liveScope: { withSkeleton, SkeletonTheme, data: PRODUCT_DATA },
    },
  ];

  const gridComponents: Record<CardKey, React.ReactNode> = {
    weather:  <Weather    delay={baseDelay + OFFSETS[0]} onLoaded={onLoaded('weather')} />,
    currency: <Currency   delay={baseDelay + OFFSETS[1]} onLoaded={onLoaded('currency')} />,
    air:      <AirQuality delay={baseDelay + OFFSETS[2]} onLoaded={onLoaded('air')} />,
    holiday:  <Holiday    delay={baseDelay + OFFSETS[3]} onLoaded={onLoaded('holiday')} />,
    github:   <Github     delay={baseDelay + OFFSETS[4]} onLoaded={onLoaded('github')} />,
    product:  <Product    delay={baseDelay + OFFSETS[5]} onLoaded={onLoaded('product')} />,
    hn:       <HackerNews delay={baseDelay + OFFSETS[6]} onLoaded={onLoaded('hn')} />,
    health:   <Health     delay={baseDelay + OFFSETS[7]} onLoaded={onLoaded('health')} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <main style={{
        flex: 1, minWidth: 0,
        padding: '16px 24px 80px',
        transition: 'padding 0.32s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'auto',
      }}>
        {/* Nav bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <a
            href="https://skelter.dev"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--muted)', textDecoration: 'none',
              fontWeight: 500, letterSpacing: '-0.01em',
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>←</span>
            skelter.dev
          </a>
          <ThemeToggle />
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 1400, margin: '0 auto 56px' }}>
          <a
            href="https://www.npmjs.com/package/react-zero-skeleton"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 14px', borderRadius: 20, marginBottom: 20,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              fontSize: 12, color: 'var(--muted)',
              textDecoration: 'none', cursor: 'pointer',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            react-zero-skeleton{version ? ` v${version}` : ''} · demo
          </a>

          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: 'var(--text)' }}>
            Zero skeletons written by hand.
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Each card uses{' '}
            <code style={{ background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 13, color: 'var(--text-soft)' }}>
              withSkeleton
            </code>
            {' '}· the component is measured automatically.
            Click{' '}
            <code style={{ background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 4, fontSize: 12, color: 'var(--text-soft)' }}>
              {'<code />'}
            </code>
            {' '}to view and edit the source live.
          </p>

          {/* Delay slider */}
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            padding: '20px 32px', background: 'var(--surface)', border: '1px solid var(--surface-2)', borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Simulated delay
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace', minWidth: 80, textAlign: 'right' }}>
                {baseDelay}<span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 3 }}>ms</span>
              </span>
            </div>
            <input
              type="range" min={0} max={6000} step={100}
              value={baseDelay}
              onChange={e => onDelayChange(Number(e.target.value))}
              style={{ width: 240, accentColor: '#f97316', cursor: 'pointer' }}
            />
            <p style={{ fontSize: 11, color: 'var(--border)', margin: 0 }}>
              staggered +300 ms per card
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 24,
          justifyContent: 'center', maxWidth: 1400, margin: '0 auto',
        }}>
          {CARD_META.map(({ key, title, api, animation }, i) => (
            <DemoCard
              key={key}
              title={title}
              api={api}
              animation={animation}
              loadTime={loadTimes[key]}
              onOpenCode={() => setDrawerIndex(i)}
            >
              {gridComponents[key]}
            </DemoCard>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 64, color: 'var(--border)', fontSize: 12 }}>
          Built with{' '}
          <a href="https://www.npmjs.com/package/react-zero-skeleton" style={{ color: 'var(--subtle)', textDecoration: 'underline' }}>
            react-zero-skeleton
          </a>
          {' '}· open source data · by{' '}
          <a href="https://skelter.dev" style={{ color: 'var(--subtle)', textDecoration: 'underline' }}>
            J-Ben
          </a>
          {' '}·{' '}
          <a href="https://skelter.dev" style={{ color: 'var(--subtle)', textDecoration: 'underline' }}>
            docs
          </a>
          {' '}·{' '}
          <a href="https://www.npmjs.com/package/react-zero-skeleton" style={{ color: '#f97316', textDecoration: 'underline', fontWeight: 600 }}>
            npm
          </a>
          {' '}·{' '}
          <MobileQR />
        </div>
      </main>

      <CodeDrawer
        cards={cards}
        activeIndex={drawerIndex}
        onClose={() => setDrawerIndex(null)}
        onNavigate={setDrawerIndex}
      />
    </div>
  );
}
