'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withSkeleton, SkeletonTheme } from 'react-zero-skeleton';

type Product = {
  title: string; description: string;
  price: number; rating: number; category: string;
};

async function fetchProduct(delay: number): Promise<{ data: Product; loadTime: number }> {
  const t0 = Date.now();
  await new Promise(r => setTimeout(r, delay));
  const id = Math.floor(Math.random() * 50) + 1;
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const raw = await res.json();
  return {
    data: {
      title: raw.title,
      description: (raw.description as string).slice(0, 72),
      price: raw.price,
      rating: raw.rating,
      category: raw.category,
    },
    loadTime: Date.now() - t0,
  };
}

const CAT_COLORS: Record<string, string> = {
  smartphones: '#6366f1', laptops: '#3b82f6',
  fragrances: '#a855f7', skincare: '#ec4899',
  groceries: '#22c55e', 'home-decoration': '#f97316',
};
const catColor = (c: string) => CAT_COLORS[c] ?? '#71717a';

const STAR_GLYPHS = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

function ProductCardBase({ data }: { data: Product }) {
  const color = catColor(data.category);
  return (
    <div>
      <div style={{
        height: 110,
        background: 'linear-gradient(135deg, #27272a 0%, #3f3f46 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 36 }}>🛍</span>
      </div>
      <div style={{ padding: '14px 18px 18px' }}>
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 20, marginBottom: 8,
          background: color + '20', color, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {data.category}
        </span>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5', marginBottom: 6, width: 'fit-content' }}>{data.title}</p>
        <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.5, marginBottom: 14, width: 'fit-content' }}>{data.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#f97316', width: 'fit-content' }}>${data.price}</p>
          <p style={{ fontSize: 13, color: '#fbbf24', letterSpacing: 1 }}>{STAR_GLYPHS(data.rating)}</p>
        </div>
      </div>
    </div>
  );
}

const ProductCard = withSkeleton(ProductCardBase);

const PLACEHOLDER: Product = {
  title: 'iPhone 9',
  description: 'An apple mobile which is nothing like apple.',
  price: 549, rating: 4.7, category: 'smartphones',
};

export default function Product({ delay, onLoaded }: { delay: number; onLoaded?: (ms: number) => void }) {
  const { data: result, isLoading } = useQuery({
    queryKey: ['product', delay],
    queryFn: () => fetchProduct(delay),
  });

  useEffect(() => {
    if (result?.loadTime != null) onLoaded?.(result.loadTime);
  }, [result]);

  return (
    <SkeletonTheme animation="wave" exit="fade" color="#27272a" highlightColor="#3f3f46" borderRadius={6}>
      <ProductCard hasSkeleton isLoading={isLoading} data={result?.data ?? PLACEHOLDER} />
    </SkeletonTheme>
  );
}
