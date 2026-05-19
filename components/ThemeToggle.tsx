'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains('light'));
  }, []);

  const toggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
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
        position: 'fixed', top: 14, right: 14, zIndex: 100,
        background: 'var(--surface-2)', border: '1px solid var(--border)',
        borderRadius: 8, width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: 16, transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-2)')}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
