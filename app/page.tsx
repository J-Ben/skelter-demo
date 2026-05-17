'use client';
import { useState } from 'react';
import Weather, { WEATHER_CODE } from '@/components/WeatherCard';
import Currency, { CURRENCY_CODE } from '@/components/CurrencyCard';
import AirQuality, { AIR_CODE } from '@/components/AirQualityCard';
import Holiday, { HOLIDAY_CODE } from '@/components/HolidayCard';
import DemoCard from '@/components/DemoCard';

const CARDS = [
  { key: 'weather',  offset: 0    },
  { key: 'currency', offset: 600  },
  { key: 'air',      offset: 1200 },
  { key: 'holiday',  offset: 1800 },
] as const;

export default function Home() {
  const [baseDelay, setBaseDelay] = useState(2000);
  const [loadTimes, setLoadTimes] = useState<Record<string, number | null>>({
    weather: null, currency: null, air: null, holiday: null,
  });

  const onLoaded = (key: string) => (ms: number) =>
    setLoadTimes(prev => ({ ...prev, [key]: ms }));

  return (
    <main style={{ minHeight: '100vh', padding: '48px 24px 80px', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 14px', borderRadius: 20, marginBottom: 20,
          background: '#27272a', border: '1px solid #3f3f46',
          fontSize: 12, color: '#71717a',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          react-zero-skeleton
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, color: '#f4f4f5' }}>
          Zéro skeleton écrit à la main.
        </h1>
        <p style={{ fontSize: 16, color: '#71717a', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Chaque carte ci-dessous utilise{' '}
          <code style={{ background: '#27272a', padding: '1px 6px', borderRadius: 4, fontSize: 13, color: '#a1a1aa' }}>withSkeleton</code>
          {' '}— un HOC qui mesure le vrai composant et génère les bones automatiquement.
          Aucun skeleton manuel.
        </p>

        {/* Delay slider */}
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          padding: '20px 32px', background: '#18181b', border: '1px solid #27272a', borderRadius: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Délai simulé
            </span>
            <span style={{
              fontSize: 20, fontWeight: 700, color: '#f4f4f5',
              fontFamily: 'monospace', minWidth: 72, textAlign: 'right',
            }}>
              {baseDelay}<span style={{ fontSize: 12, color: '#71717a', marginLeft: 3 }}>ms</span>
            </span>
          </div>
          <input
            type="range" min={0} max={6000} step={100}
            value={baseDelay}
            onChange={e => {
              setBaseDelay(Number(e.target.value));
              setLoadTimes({ weather: null, currency: null, air: null, holiday: null });
            }}
            style={{ width: 240, accentColor: '#f97316', cursor: 'pointer' }}
          />
          <p style={{ fontSize: 11, color: '#3f3f46', margin: 0 }}>
            Chaque carte a un décalage différent (+0 / +600 / +1200 / +1800 ms)
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        <DemoCard title="Météo" api="open-meteo.com" animation="wave" code={WEATHER_CODE} loadTime={loadTimes.weather}>
          <Weather delay={baseDelay + CARDS[0].offset} onLoaded={onLoaded('weather')} />
        </DemoCard>

        <DemoCard title="Taux de change" api="frankfurter.app" animation="pulse" code={CURRENCY_CODE} loadTime={loadTimes.currency}>
          <Currency delay={baseDelay + CARDS[1].offset} onLoaded={onLoaded('currency')} />
        </DemoCard>

        <DemoCard title="Qualité de l'air" api="open-meteo.com" animation="shiver" code={AIR_CODE} loadTime={loadTimes.air}>
          <AirQuality delay={baseDelay + CARDS[2].offset} onLoaded={onLoaded('air')} />
        </DemoCard>

        <DemoCard title="Jours fériés" api="date.nager.at" animation="shatter" code={HOLIDAY_CODE} loadTime={loadTimes.holiday}>
          <Holiday delay={baseDelay + CARDS[3].offset} onLoaded={onLoaded('holiday')} />
        </DemoCard>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 64, color: '#3f3f46', fontSize: 12 }}>
        Construit avec{' '}
        <a href="https://www.npmjs.com/package/react-zero-skeleton" style={{ color: '#52525b', textDecoration: 'underline' }}>
          react-zero-skeleton
        </a>
        {' '}· données open source
      </div>
    </main>
  );
}
