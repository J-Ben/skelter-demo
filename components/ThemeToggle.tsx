'use client';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const toggle = () => {
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('skelter-demo-theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('skelter-demo-theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: 8, width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 15, transition: 'background 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-2)')}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
