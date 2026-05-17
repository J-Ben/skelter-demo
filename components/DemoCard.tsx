'use client';

const ANIM_COLOR: Record<string, string> = {
  wave: '#60a5fa', pulse: '#a78bfa', shiver: '#34d399', shatter: '#f97316',
};

export default function DemoCard({
  title,
  api,
  animation,
  loadTime,
  onOpenCode,
  children,
}: {
  title: string;
  api: string;
  animation: string;
  loadTime: number | null;
  onOpenCode: () => void;
  children: React.ReactNode;
}) {
  const color = ANIM_COLOR[animation] ?? '#71717a';

  return (
    <div style={{
      background: '#18181b', border: '1px solid #27272a',
      borderRadius: 16, width: 320, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '10px 16px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa' }}>{title}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#3f3f46' }}>{api}</span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: color + '1a', color, border: `1px solid ${color}33`,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>{animation}</span>
        </div>
      </div>

      <div>{children}</div>

      <div style={{
        padding: '8px 16px 12px', borderTop: '1px solid #27272a',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 11 }}>
          {loadTime !== null
            ? <span style={{ color: '#71717a' }}>loaded in <span style={{ color: '#a1a1aa', fontWeight: 700 }}>{loadTime} ms</span></span>
            : <span style={{ color: '#3f3f46' }}>loading…</span>}
        </span>
        <button
          onClick={onOpenCode}
          style={{
            fontSize: 11, color: '#52525b', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'monospace', transition: 'color 0.15s',
            padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = color)}
          onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}
        >
          {'<code />'}
        </button>
      </div>
    </div>
  );
}
