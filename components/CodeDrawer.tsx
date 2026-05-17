'use client';
import { useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ANIM_COLOR: Record<string, string> = {
  wave: '#60a5fa', pulse: '#a78bfa', shiver: '#34d399', shatter: '#f97316',
};

export type DrawerCard = {
  title: string;
  animation: string;
  code: string;
  component: React.ReactNode;
};

export const DRAWER_W = 760;

export function CodeDrawer({
  cards,
  activeIndex,
  onClose,
  onNavigate,
}: {
  cards: DrawerCard[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const open = activeIndex !== null;
  const card = open ? cards[activeIndex] : null;
  const color = card ? (ANIM_COLOR[card.animation] ?? '#71717a') : '#71717a';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((activeIndex! + 1) % cards.length);
      if (e.key === 'ArrowLeft') onNavigate((activeIndex! - 1 + cards.length) % cards.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, activeIndex, cards.length]);

  return (
    <>
      {/* Fixed drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: DRAWER_W,
        background: '#111113',
        borderLeft: '1px solid #27272a',
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        transform: open ? 'translateX(0)' : `translateX(${DRAWER_W}px)`,
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: open ? '-32px 0 80px rgba(0,0,0,0.7)' : 'none',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 20px', borderBottom: '1px solid #1f1f23',
          flexShrink: 0, background: '#0f0f11',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', flex: 1 }}>
            {card?.title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: color + '18', color, border: `1px solid ${color}30`,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {card?.animation}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <button
              onClick={() => open && onNavigate((activeIndex! - 1 + cards.length) % cards.length)}
              style={navBtn}
            >←</button>
            <span style={{ fontSize: 11, color: '#52525b', minWidth: 32, textAlign: 'center' }}>
              {open ? activeIndex! + 1 : '—'}/{cards.length}
            </span>
            <button
              onClick={() => open && onNavigate((activeIndex! + 1) % cards.length)}
              style={navBtn}
            >→</button>
            <button onClick={onClose} style={{ ...navBtn, marginLeft: 6, fontSize: 18, color: '#52525b' }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Component preview */}
          <div style={{
            width: 300, flexShrink: 0,
            background: '#0c0c0d',
            borderRight: '1px solid #1f1f23',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 20, gap: 16,
          }}>
            <p style={{ fontSize: 10, color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Aperçu
            </p>
            <div style={{
              background: '#18181b', border: '1px solid #27272a',
              borderRadius: 16, width: 260, overflow: 'hidden',
            }}>
              {card?.component}
            </div>
          </div>

          {/* Code */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <SyntaxHighlighter
              language="tsx"
              style={vscDarkPlus}
              customStyle={{
                margin: 0, borderRadius: 0,
                background: '#111113',
                fontSize: 11.5,
                lineHeight: 1.75,
                minHeight: '100%',
                padding: '20px 24px',
              }}
              showLineNumbers
              lineNumberStyle={{
                color: '#3f3f46', fontSize: 10.5,
                paddingRight: 20, userSelect: 'none',
                minWidth: 32,
              }}
            >
              {card?.code ?? ''}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Flex spacer — pushes the main content left as drawer opens */}
      <div style={{
        flexShrink: 0,
        width: open ? DRAWER_W : 0,
        transition: 'width 0.32s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }} />
    </>
  );
}

const navBtn: React.CSSProperties = {
  background: '#1c1c1f', border: '1px solid #2a2a2e',
  color: '#71717a', borderRadius: 6, width: 28, height: 28,
  cursor: 'pointer', fontSize: 13,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit',
};
