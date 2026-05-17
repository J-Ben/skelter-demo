'use client';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/* ─── Types ───────────────────────────────────────────────── */
export type VirtualFile = {
  name: string;
  lang: 'tsx' | 'ts';
  code: string;
};

export type DrawerCard = {
  title: string;
  animation: string;
  folder: string;
  files: VirtualFile[];
  component: React.ReactNode;
};

/* ─── Constants ───────────────────────────────────────────── */
const ANIM_COLOR: Record<string, string> = {
  wave: '#60a5fa', pulse: '#a78bfa', shiver: '#34d399', shatter: '#f97316',
};
export const DRAWER_W = 860;

const VS = {
  bg:         '#1e1e1e',
  sidebar:    '#252526',
  tabBar:     '#2d2d2d',
  tabActive:  '#1e1e1e',
  tabInactive:'#2d2d2d',
  accent:     '#007acc',
  text:       '#cccccc',
  muted:      '#858585',
  selected:   '#094771',
  border:     '#333333',
};

/* ─── File icon ───────────────────────────────────────────── */
function FileIcon({ lang }: { lang: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '0 4px',
      borderRadius: 3, marginRight: 6, flexShrink: 0,
      background: lang === 'ts' ? '#3178c6' : '#007acc',
      color: '#fff',
    }}>
      {lang === 'ts' ? 'TS' : 'TSX'}
    </span>
  );
}

/* ─── CodeDrawer ──────────────────────────────────────────── */
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

  const [openTabs, setOpenTabs] = useState<string[]>(['index.tsx']);
  const [activeTab, setActiveTab] = useState('index.tsx');

  // Reset tabs when card changes
  useEffect(() => {
    setOpenTabs(['index.tsx']);
    setActiveTab('index.tsx');
  }, [activeIndex]);

  const openFile = (name: string) => {
    setOpenTabs(prev => prev.includes(name) ? prev : [...prev, name]);
    setActiveTab(name);
  };

  const closeTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = openTabs.filter(t => t !== name);
    setOpenTabs(next);
    if (activeTab === name) setActiveTab(next[next.length - 1] ?? '');
  };

  const currentFile = card?.files.find(f => f.name === activeTab);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && e.altKey) onNavigate((activeIndex! + 1) % cards.length);
      if (e.key === 'ArrowLeft' && e.altKey) onNavigate((activeIndex! - 1 + cards.length) % cards.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, activeIndex, cards.length]);

  return (
    <>
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: DRAWER_W,
        background: VS.bg,
        borderLeft: `1px solid #111`,
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        transform: open ? 'translateX(0)' : `translateX(${DRAWER_W}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: open ? '-24px 0 80px rgba(0,0,0,0.8)' : 'none',
        fontFamily: "'Menlo', 'Consolas', 'SF Mono', monospace",
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px',
          background: '#323233',
          borderBottom: `1px solid #111`,
          flexShrink: 0, minHeight: 38,
        }}>
          <span style={{ fontSize: 12, color: VS.text, flex: 1, fontFamily: 'system-ui, sans-serif' }}>
            {card?.title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: color + '20', color, border: `1px solid ${color}40`,
            textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'system-ui',
          }}>
            {card?.animation}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <button onClick={() => open && onNavigate((activeIndex! - 1 + cards.length) % cards.length)} style={titleBtn}>←</button>
            <span style={{ fontSize: 11, color: VS.muted, minWidth: 32, textAlign: 'center', fontFamily: 'system-ui' }}>
              {open ? activeIndex! + 1 : '-'}/{cards.length}
            </span>
            <button onClick={() => open && onNavigate((activeIndex! + 1) % cards.length)} style={titleBtn}>→</button>
            <button onClick={onClose} style={{ ...titleBtn, marginLeft: 6, fontSize: 16 }}>×</button>
          </div>
        </div>

        {/* VS Code body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Sidebar: file explorer */}
          <div style={{
            width: 180, flexShrink: 0,
            background: VS.sidebar,
            borderRight: `1px solid ${VS.border}`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: VS.muted,
              padding: '12px 12px 6px', letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'system-ui',
            }}>
              Explorer
            </div>

            {/* Folder */}
            <div style={{ padding: '0 0 4px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 12px', fontSize: 12, color: VS.text,
              }}>
                <span style={{ fontSize: 9, color: VS.muted }}>▾</span>
                <span style={{ fontSize: 13 }}>📁</span>
                <span style={{ fontFamily: 'system-ui' }}>{card?.folder ?? 'src'}</span>
              </div>
              {card?.files.map(file => (
                <div
                  key={file.name}
                  onClick={() => openFile(file.name)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    padding: '3px 12px 3px 28px',
                    cursor: 'pointer', fontSize: 12,
                    background: activeTab === file.name ? VS.selected : 'transparent',
                    color: activeTab === file.name ? '#fff' : VS.text,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => {
                    if (activeTab !== file.name)
                      e.currentTarget.style.background = '#2a2d2e';
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== file.name)
                      e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <FileIcon lang={file.lang} />
                  <span style={{ fontFamily: 'system-ui' }}>{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Editor + preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {/* Tab bar */}
            <div style={{
              display: 'flex', background: VS.tabBar,
              borderBottom: `1px solid ${VS.border}`,
              overflowX: 'auto', flexShrink: 0,
            }}>
              {openTabs.map(tab => {
                const f = card?.files.find(f => f.name === tab);
                const isActive = tab === activeTab;
                return (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px',
                      background: isActive ? VS.tabActive : VS.tabInactive,
                      borderRight: `1px solid ${VS.border}`,
                      borderBottom: isActive ? `2px solid ${VS.accent}` : '2px solid transparent',
                      cursor: 'pointer', fontSize: 12, color: isActive ? VS.text : VS.muted,
                      flexShrink: 0, whiteSpace: 'nowrap',
                    }}
                  >
                    {f && <FileIcon lang={f.lang} />}
                    <span style={{ fontFamily: 'system-ui' }}>{tab}</span>
                    <span
                      onClick={e => closeTab(tab, e)}
                      style={{
                        fontSize: 14, color: VS.muted, lineHeight: 1,
                        marginLeft: 2, borderRadius: 3, padding: '0 2px',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = VS.text)}
                      onMouseLeave={e => (e.currentTarget.style.color = VS.muted)}
                    >×</span>
                  </div>
                );
              })}
            </div>

            {/* Code + preview */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Code editor */}
              <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
                {currentFile ? (
                  <SyntaxHighlighter
                    language={currentFile.lang === 'ts' ? 'typescript' : 'tsx'}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0, borderRadius: 0,
                      background: VS.bg,
                      fontSize: 12, lineHeight: 1.75,
                      minHeight: '100%', padding: '16px 0',
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                      color: '#3f3f46', fontSize: 11,
                      paddingRight: 16, userSelect: 'none', minWidth: 40,
                    }}
                  >
                    {currentFile.code}
                  </SyntaxHighlighter>
                ) : (
                  <div style={{ padding: 24, color: VS.muted, fontSize: 13, fontFamily: 'system-ui' }}>
                    Sélectionnez un fichier
                  </div>
                )}
              </div>

              {/* Preview panel */}
              <div style={{
                width: 260, flexShrink: 0,
                background: '#0d0d0f',
                borderLeft: `1px solid ${VS.border}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 16, gap: 12,
              }}>
                <p style={{
                  fontSize: 10, color: '#3f3f46', textTransform: 'uppercase',
                  letterSpacing: '0.1em', margin: 0, fontFamily: 'system-ui',
                }}>Aperçu</p>
                <div style={{
                  background: '#18181b', border: '1px solid #27272a',
                  borderRadius: 14, width: '100%', overflow: 'hidden',
                }}>
                  {card?.component}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '3px 14px',
          background: VS.accent,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: '#fff', fontFamily: 'system-ui' }}>
            react-zero-skeleton · demo
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginLeft: 'auto', fontFamily: 'system-ui' }}>
            {currentFile?.lang === 'ts' ? 'TypeScript' : 'TypeScript React'} · Alt+← Alt+→ pour naviguer
          </span>
        </div>
      </div>

      {/* Flex spacer — pushes main content */}
      <div style={{
        flexShrink: 0,
        width: open ? DRAWER_W : 0,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }} />
    </>
  );
}

const titleBtn: React.CSSProperties = {
  background: 'transparent', border: 'none',
  color: '#aaa', cursor: 'pointer', fontSize: 14,
  width: 26, height: 26, borderRadius: 4,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
