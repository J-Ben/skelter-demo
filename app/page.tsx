'use client';
import { useEffect, useState } from 'react';
import Weather from '@/components/WeatherCard';
import Currency from '@/components/CurrencyCard';
import AirQuality from '@/components/AirQualityCard';
import Holiday from '@/components/HolidayCard';
import DemoCard from '@/components/DemoCard';
import { CodeDrawer, type DrawerCard } from '@/components/CodeDrawer';
import { WEATHER_FILES, CURRENCY_FILES, AIR_FILES, HOLIDAY_FILES } from '@/lib/cardFiles';

const OFFSETS = [0, 600, 1200, 1800];

export default function Home() {
  const [version, setVersion] = useState<string | null>(null);
  const [baseDelay, setBaseDelay] = useState(2000);

  useEffect(() => {
    fetch('https://registry.npmjs.org/react-zero-skeleton/latest')
      .then(r => r.json())
      .then(d => setVersion(d.version))
      .catch(() => {});
  }, []);
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const [loadTimes, setLoadTimes] = useState<Record<string, number | null>>({
    weather: null, currency: null, air: null, holiday: null,
  });

  const onLoaded = (key: string) => (ms: number) =>
    setLoadTimes(prev => ({ ...prev, [key]: ms }));

  const onDelayChange = (val: number) => {
    setBaseDelay(val);
    setLoadTimes({ weather: null, currency: null, air: null, holiday: null });
  };

  const cards: DrawerCard[] = [
    {
      title: 'Météo', animation: 'wave', folder: 'weather',
      files: WEATHER_FILES, component: <Weather delay={baseDelay + OFFSETS[0]} />,
    },
    {
      title: 'Taux de change', animation: 'pulse', folder: 'currency',
      files: CURRENCY_FILES, component: <Currency delay={baseDelay + OFFSETS[1]} />,
    },
    {
      title: "Qualité de l'air", animation: 'shiver', folder: 'air-quality',
      files: AIR_FILES, component: <AirQuality delay={baseDelay + OFFSETS[2]} />,
    },
    {
      title: 'Jours fériés', animation: 'shatter', folder: 'holiday',
      files: HOLIDAY_FILES, component: <Holiday delay={baseDelay + OFFSETS[3]} />,
    },
  ];

  return (
    // Flex row so the drawer spacer pushes the main content left
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <main style={{
        flex: 1, minWidth: 0,
        padding: '48px 24px 80px',
        transition: 'padding 0.32s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56, maxWidth: 1400, margin: '0 auto 56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '4px 14px', borderRadius: 20, marginBottom: 20,
            background: '#27272a', border: '1px solid #3f3f46',
            fontSize: 12, color: '#71717a',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            react-zero-skeleton{version ? ` v${version}` : ''} · demo
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: '#f4f4f5' }}>
            Zéro skeleton écrit à la main.
          </h1>
          <p style={{ fontSize: 15, color: '#71717a', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Chaque carte utilise{' '}
            <code style={{ background: '#27272a', padding: '1px 6px', borderRadius: 4, fontSize: 13, color: '#a1a1aa' }}>
              withSkeleton
            </code>
            {' '}— le composant est mesuré automatiquement.
            Cliquez sur{' '}
            <code style={{ background: '#27272a', padding: '1px 6px', borderRadius: 4, fontSize: 12, color: '#a1a1aa' }}>
              {'<code />'}
            </code>
            {' '}pour voir le code.
          </p>

          {/* Delay slider */}
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            padding: '20px 32px', background: '#18181b', border: '1px solid #27272a', borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 11, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Délai simulé
              </span>
              <span style={{
                fontSize: 22, fontWeight: 700, color: '#f4f4f5',
                fontFamily: 'monospace', minWidth: 80, textAlign: 'right',
              }}>
                {baseDelay}<span style={{ fontSize: 12, color: '#71717a', marginLeft: 3 }}>ms</span>
              </span>
            </div>
            <input
              type="range" min={0} max={6000} step={100}
              value={baseDelay}
              onChange={e => onDelayChange(Number(e.target.value))}
              style={{ width: 240, accentColor: '#f97316', cursor: 'pointer' }}
            />
            <p style={{ fontSize: 11, color: '#3f3f46', margin: 0 }}>
              décalage par carte : +0 · +600 · +1200 · +1800 ms
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 24,
          justifyContent: 'center', maxWidth: 1400, margin: '0 auto',
        }}>
          {(['weather', 'currency', 'air', 'holiday'] as const).map((key, i) => {
            const cfg = [
              { title: 'Météo', api: 'open-meteo.com', animation: 'wave' },
              { title: 'Taux de change', api: 'frankfurter.app', animation: 'pulse' },
              { title: "Qualité de l'air", api: 'open-meteo.com', animation: 'shiver' },
              { title: 'Jours fériés', api: 'date.nager.at', animation: 'shatter' },
            ][i];
            const components = [
              <Weather key="w" delay={baseDelay + OFFSETS[0]} onLoaded={onLoaded('weather')} />,
              <Currency key="c" delay={baseDelay + OFFSETS[1]} onLoaded={onLoaded('currency')} />,
              <AirQuality key="a" delay={baseDelay + OFFSETS[2]} onLoaded={onLoaded('air')} />,
              <Holiday key="h" delay={baseDelay + OFFSETS[3]} onLoaded={onLoaded('holiday')} />,
            ];
            return (
              <DemoCard
                key={key}
                title={cfg.title}
                api={cfg.api}
                animation={cfg.animation}
                loadTime={loadTimes[key]}
                onOpenCode={() => setDrawerIndex(i)}
              >
                {components[i]}
              </DemoCard>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 64, color: '#3f3f46', fontSize: 12 }}>
          Construit avec{' '}
          <a href="https://www.npmjs.com/package/react-zero-skeleton" style={{ color: '#52525b', textDecoration: 'underline' }}>
            react-zero-skeleton
          </a>
          {' '}· données open source · par{' '}
          <a href="https://skelter.vercel.app" style={{ color: '#52525b', textDecoration: 'underline' }}>
            J-Ben
          </a>
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
