'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type Rates = { USD: number; GBP: number; JPY: number; CHF: number };

async function fetchRates(delay: number): Promise<{ data: Rates; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY,CHF');
  const raw = await res.json();
  return { data: raw.rates, loadTime: Date.now() - t0 };
}

function CurrencyCardBase({ data }: { data: Rates }) {
  const pairs = [
    { label: 'EUR → USD', value: data.USD.toFixed(4) },
    { label: 'EUR → GBP', value: data.GBP.toFixed(4) },
    { label: 'EUR → JPY', value: data.JPY.toFixed(2) },
    { label: 'EUR → CHF', value: data.CHF.toFixed(4) },
  ];
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
        Exchange rates
      </p>
      {pairs.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#a1a1aa' }}>{label}</p>
          <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{value}</p>
        </div>
      ))}
      <p style={{ fontSize: 11, color: '#3f3f46', marginTop: 8 }}>Source: Frankfurter</p>
    </div>
  );
}

const CurrencyCard = withSkeleton(CurrencyCardBase);

const PLACEHOLDER: Rates = { USD: 1.0821, GBP: 0.8542, JPY: 161.23, CHF: 0.9731 };

export default function Currency({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['currency', delay],
    queryFn: () => fetchRates(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="pulse" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <CurrencyCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}

export const CURRENCY_CODE = `import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton'
import { useQuery } from '@tanstack/react-query'

function CurrencyCardBase({ data }) {
  return (
    <div>
      {['USD','GBP','JPY','CHF'].map(c => (
        <div key={c} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>EUR → {c}</p>
          <p>{data[c]}</p>
        </div>
      ))}
    </div>
  )
}

const CurrencyCard = withSkeleton(CurrencyCardBase)

export default function Currency({ delay }) {
  const { data, isLoading } = useQuery({
    queryKey: ['currency', delay],
    queryFn: () => fetchRates(delay), // frankfurter.app
  })
  return (
    <SkeletonTheme animation="pulse" color="#27272a">
      <CurrencyCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  )
}`;
