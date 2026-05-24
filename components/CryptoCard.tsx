'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type Coin = { id: string; symbol: string; price: number; change24h: number };

async function fetchCrypto(delay: number): Promise<{ data: Coin[]; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
  );
  const raw = await res.json();
  return {
    data: [
      { id: 'bitcoin',  symbol: 'BTC', price: raw.bitcoin.usd,  change24h: raw.bitcoin.usd_24h_change },
      { id: 'ethereum', symbol: 'ETH', price: raw.ethereum.usd, change24h: raw.ethereum.usd_24h_change },
      { id: 'solana',   symbol: 'SOL', price: raw.solana.usd,   change24h: raw.solana.usd_24h_change },
    ],
    loadTime: Date.now() - t0,
  };
}

function CryptoCardBase({ data }: { data: Coin[] }) {
  return (
    <div style={{ padding: 24 }}>
      <p style={{ fontSize: 11, color: '#71717a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
        Crypto prices
      </p>
      {data.map(coin => {
        const up = coin.change24h >= 0;
        return (
          <div key={coin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#e4e4e7', width: 'fit-content' }}>{coin.symbol}</p>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#e4e4e7', width: 'fit-content', marginLeft: 'auto', marginBottom: 3 }}>
                ${coin.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <p style={{ fontSize: 11, color: up ? '#22c55e' : '#ef4444', width: 'fit-content', marginLeft: 'auto' }}>
                {up ? '+' : ''}{coin.change24h.toFixed(2)}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CryptoCard = withSkeleton(CryptoCardBase);

const PLACEHOLDER: Coin[] = [
  { id: 'bitcoin',  symbol: 'BTC', price: 67420, change24h: 2.4 },
  { id: 'ethereum', symbol: 'ETH', price: 3512,  change24h: -0.8 },
  { id: 'solana',   symbol: 'SOL', price: 178,   change24h: 5.1 },
];

export default function Crypto({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['crypto', delay],
    queryFn: () => fetchCrypto(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="beat" exit="fadeDown" revealOnExit color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <CryptoCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}

export const CRYPTO_CODE = `import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton'
import { useQuery } from '@tanstack/react-query'

function CryptoCardBase({ data }) {
  return (
    <div>
      {data.map(coin => (
        <div key={coin.id}>
          <p>{coin.symbol}</p>
          <p>\${coin.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

const CryptoCard = withSkeleton(CryptoCardBase)

export default function Crypto({ delay }) {
  const { data, isLoading } = useQuery({
    queryKey: ['crypto', delay],
    queryFn: () => fetchCrypto(delay), // coingecko.com
  })
  return (
    <SkeletonTheme animation="beat" color="#27272a">
      <CryptoCard
        hasSkeleton
        isLoading={isLoading}
        data={data ?? PLACEHOLDER}
      />
    </SkeletonTheme>
  )
}`;
