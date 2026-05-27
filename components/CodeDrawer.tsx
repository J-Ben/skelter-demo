'use client';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { useTheme } from '@/hooks/useTheme';

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

/* ─── Types ───────────────────────────────────────────────── */
export type VirtualFile = { name: string; lang: 'tsx' | 'ts'; code: string };
export type DrawerCard = {
  title: string; animation: string; folder: string;
  files: VirtualFile[]; component: React.ReactNode;
  liveCode?: string; liveScope?: Record<string, unknown>;
};

const VS_DARK = {
  bg: '#1e1e1e', sidebar: '#252526', tabBar: '#2d2d2d',
  accent: '#007acc', text: '#cccccc', muted: '#858585',
  selected: '#094771', border: '#333333', previewBg: '#0d0d0f',
  cardBg: '#18181b', cardBorder: '#27272a',
};

const VS_LIGHT = {
  bg: '#ffffff', sidebar: '#f3f3f3', tabBar: '#ececec',
  accent: '#007acc', text: '#333333', muted: '#717171',
  selected: '#d6ebff', border: '#e0e0e0', previewBg: '#f0f0f0',
  cardBg: '#ffffff', cardBorder: '#e0e0e0',
};

const ANIM_COLOR: Record<string, string> = {
  wave: '#60a5fa', pulse: '#a78bfa', shiver: '#34d399', shatter: '#f97316',
};

export const DRAWER_W = 1100;

/* ─── File badge ──────────────────────────────────────────── */
function LangBadge({ lang }: { lang: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 3,
      marginRight: 6, flexShrink: 0,
      background: lang === 'ts' ? '#3178c6' : '#007acc', color: '#fff',
    }}>
      {lang.toUpperCase()}
    </span>
  );
}

/* ─── CodePane ────────────────────────────────────────────── */
type VS = typeof VS_DARK;
function CodePane({ card, openTabs, activeTab, VS, hlStyle, isMobile, setActiveTab, closeTab, openFile, currentFile }: {
  card: DrawerCard | null;
  openTabs: string[];
  activeTab: string;
  VS: VS;
  hlStyle: Record<string, React.CSSProperties>;
  isMobile: boolean;
  setActiveTab: (t: string) => void;
  closeTab: (name: string, e: React.MouseEvent) => void;
  openFile: (name: string) => void;
  currentFile: { name: string; lang: 'tsx' | 'ts'; code: string } | undefined;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', background: VS.tabBar, borderBottom: `1px solid ${VS.border}`, overflowX: 'auto', flexShrink: 0 }}>
        {openTabs.map(tab => {
          const f = card?.files.find(f => f.name === tab);
          const isActive = tab === activeTab;
          return (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: isActive ? VS.bg : VS.tabBar, borderRight: `1px solid ${VS.border}`, borderBottom: isActive ? `2px solid ${VS.accent}` : '2px solid transparent', cursor: 'pointer', fontSize: 12, color: isActive ? VS.text : VS.muted, flexShrink: 0, whiteSpace: 'nowrap' }}>
              {f && <LangBadge lang={f.lang} />}
              <span style={{ fontFamily: 'system-ui' }}>{tab}</span>
              <span onClick={e => closeTab(tab, e)} style={{ fontSize: 14, color: VS.muted, marginLeft: 4, cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = VS.text)} onMouseLeave={e => (e.currentTarget.style.color = VS.muted)}>×</span>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Code */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {currentFile ? (
            <SyntaxHighlighter language={currentFile.lang === 'ts' ? 'typescript' : 'tsx'} style={hlStyle} customStyle={{ margin: 0, borderRadius: 0, background: VS.bg, fontSize: 12, lineHeight: 1.75, minHeight: '100%', padding: '16px 0' }} showLineNumbers lineNumberStyle={{ color: VS.border, fontSize: 11, paddingRight: 16, userSelect: 'none', minWidth: 40 }}>
              {currentFile.code}
            </SyntaxHighlighter>
          ) : (
            <div style={{ padding: 24, color: VS.muted, fontSize: 13, fontFamily: 'system-ui' }}>Select a file →</div>
          )}
        </div>

        {/* File explorer — desktop only */}
        {!isMobile && (
          <div style={{ width: 180, flexShrink: 0, background: VS.sidebar, borderLeft: `1px solid ${VS.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: VS.muted, padding: '12px 12px 6px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>Explorer</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 12px', fontSize: 12, color: VS.text }}>
                <span style={{ fontSize: 9, color: VS.muted }}>▾</span>
                <span>📁</span>
                <span style={{ fontFamily: 'system-ui' }}>{card?.folder ?? 'src'}</span>
              </div>
              {card?.files.map(file => (
                <div key={file.name} onClick={() => openFile(file.name)} style={{ display: 'flex', alignItems: 'center', padding: '3px 12px 3px 28px', cursor: 'pointer', fontSize: 12, background: activeTab === file.name ? VS.selected : 'transparent', color: activeTab === file.name ? '#fff' : VS.text, transition: 'background 0.1s' }} onMouseEnter={e => { if (activeTab !== file.name) e.currentTarget.style.background = '#2a2d2e'; }} onMouseLeave={e => { if (activeTab !== file.name) e.currentTarget.style.background = 'transparent'; }}>
                  <LangBadge lang={file.lang} />
                  <span style={{ fontFamily: 'system-ui' }}>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile file selector */}
      {isMobile && (
        <div style={{ display: 'flex', background: VS.sidebar, borderTop: `1px solid ${VS.border}`, overflowX: 'auto', flexShrink: 0, padding: '4px 8px', gap: 6 }}>
          {card?.files.map(file => (
            <button key={file.name} onClick={() => openFile(file.name)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: `1px solid ${activeTab === file.name ? VS.accent : VS.border}`, background: activeTab === file.name ? VS.selected : 'transparent', color: activeTab === file.name ? '#fff' : VS.muted, cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap', fontFamily: 'system-ui', flexShrink: 0 }}>
              <LangBadge lang={file.lang} />
              {file.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── CodeDrawer ──────────────────────────────────────────── */
export function CodeDrawer({ cards, activeIndex, onClose, onNavigate }: {
  cards: DrawerCard[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const theme = useTheme();
  const VS = theme === 'light' ? VS_LIGHT : VS_DARK;
  const hlStyle = theme === 'light' ? vs : vscDarkPlus;
  const isMobile = useIsMobile();

  const open = activeIndex !== null;
  const card = open ? cards[activeIndex] : null;
  const color = card ? (ANIM_COLOR[card.animation] ?? '#71717a') : '#71717a';

  const [openTabs, setOpenTabs] = useState<string[]>(['index.tsx']);
  const [activeTab, setActiveTab] = useState('index.tsx');
  const [liveMode, setLiveMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileFocus, setMobileFocus] = useState<'split' | 'preview' | 'code'>('split');
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpenTabs(['index.tsx']);
    setActiveTab('index.tsx');
    setLiveMode(false);
    setPreviewLoading(false);
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
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.altKey && e.key === 'ArrowRight') onNavigate((activeIndex! + 1) % cards.length);
      if (e.altKey && e.key === 'ArrowLeft') onNavigate((activeIndex! - 1 + cards.length) % cards.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, activeIndex, cards.length]);

  const showLive = liveMode && mounted && !!card?.liveCode;

  const drawerWidth = isMobile ? '100vw' : DRAWER_W;
  const drawerTransform = open
    ? 'translateX(0)'
    : isMobile ? 'translateY(100%)' : `translateX(${DRAWER_W}px)`;

  return (
    <>
      {/* ── Fixed drawer ─────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        ...(isMobile
          ? { top: 0, left: 0, right: 0, bottom: 0 }
          : { top: 0, right: 0, bottom: 0, width: DRAWER_W }),
        background: VS.bg, borderLeft: isMobile ? 'none' : '1px solid #111',
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        transform: drawerTransform,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: open ? (isMobile ? '0 -8px 40px rgba(0,0,0,0.8)' : '-24px 0 80px rgba(0,0,0,0.8)') : 'none',
        fontFamily: "'Menlo','Consolas','SF Mono',monospace",
      }}>

        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', background: VS.tabBar,
          borderBottom: `1px solid ${VS.border}`, flexShrink: 0, minHeight: 38,
        }}>
          <span style={{ fontSize: 12, color: VS.text, flex: 1, fontFamily: 'system-ui' }}>
            {card?.title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            background: color + '20', color, border: `1px solid ${color}40`,
            textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'system-ui',
          }}>{card?.animation}</span>
          {isMobile && (
            <div style={{ display: 'flex', gap: 2, background: VS.bg, borderRadius: 6, padding: 2 }}>
              {(['preview', 'split', 'code'] as const).map(f => (
                <button key={f} onClick={() => setMobileFocus(f)} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 4, border: 'none',
                  background: mobileFocus === f ? '#f97316' : 'transparent',
                  color: mobileFocus === f ? '#fff' : VS.muted,
                  cursor: 'pointer', fontFamily: 'system-ui',
                }}>
                  {f === 'preview' ? '⊡' : f === 'code' ? '</>' : '⊞'}
                </button>
              ))}
            </div>
          )}
          {card?.liveCode && (
            <button
              onClick={() => setLiveMode(m => !m)}
              style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 4,
                background: liveMode ? '#f97316' : 'transparent',
                border: `1px solid ${liveMode ? '#f97316' : '#555'}`,
                color: liveMode ? '#fff' : '#aaa',
                cursor: 'pointer', fontFamily: 'system-ui',
              }}
            >
              {liveMode ? 'View' : 'Edit ✏'}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            <button onClick={() => open && onNavigate((activeIndex! - 1 + cards.length) % cards.length)} style={titleBtn}>←</button>
            <span style={{ fontSize: 11, color: VS.muted, minWidth: 32, textAlign: 'center', fontFamily: 'system-ui' }}>
              {open ? activeIndex! + 1 : '-'}/{cards.length}
            </span>
            <button onClick={() => open && onNavigate((activeIndex! + 1) % cards.length)} style={titleBtn}>→</button>
            <button onClick={onClose} style={{ ...titleBtn, marginLeft: 6, fontSize: 18 }}>×</button>
          </div>
        </div>

        {/* Body — LiveProvider always wraps when liveCode exists so toggle is always visible */}
        {card?.liveCode && mounted ? (
          <LiveProvider code={card.liveCode} scope={{ ...(card.liveScope ?? {}), previewLoading }} noInline>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>

              {/* Preview pane — always LivePreview (toggle button baked into liveCode) */}
              {(!isMobile || mobileFocus !== 'code') && (
                <div style={{
                  ...(isMobile
                    ? { flexShrink: 0, height: mobileFocus === 'preview' ? '100%' : '42%', borderBottom: mobileFocus !== 'preview' ? `1px solid ${VS.border}` : 'none' }
                    : { width: 310, flexShrink: 0, borderRight: `1px solid ${VS.border}` }),
                  background: VS.previewBg,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: 16, gap: 14, overflow: 'auto',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <p style={{ fontSize: 10, color: VS.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontFamily: 'system-ui' }}>Preview</p>
                    <button
                      onClick={() => setPreviewLoading(l => !l)}
                      style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, border: `1px solid ${previewLoading ? '#f97316' : VS.border}`, background: previewLoading ? 'rgba(249,115,22,0.15)' : 'transparent', color: previewLoading ? '#f97316' : VS.muted, cursor: 'pointer', fontFamily: 'system-ui' }}
                    >
                      {previewLoading ? 'Show data' : 'Show skeleton'}
                    </button>
                  </div>
                  <div style={{ background: VS.cardBg, border: `1px solid ${VS.cardBorder}`, borderRadius: 14, width: '100%', overflow: 'hidden', color: VS.text }}>
                    <LivePreview />
                  </div>
                  <LiveError style={{ fontSize: 11, color: '#f87171', padding: '8px 12px', background: '#1a0000', borderRadius: 6, width: '100%', fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }} />
                </div>
              )}

              {/* Code pane — SyntaxHighlighter in view mode, LiveEditor in edit mode */}
              {(!isMobile || mobileFocus !== 'preview') && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                  {liveMode ? (
                    <>
                      <div style={{ padding: '6px 14px', background: VS.tabBar, borderBottom: `1px solid ${VS.border}`, fontSize: 11, color: VS.muted, fontFamily: 'system-ui', flexShrink: 0 }}>
                        ✏ Edit the component · preview updates live
                      </div>
                      <div style={{ flex: 1, overflow: 'auto', background: VS.bg }}>
                        <LiveEditor style={{ fontFamily: "'Menlo','Consolas','SF Mono',monospace", fontSize: 12, lineHeight: 1.75, background: VS.bg, minHeight: '100%', padding: '16px 0' }} />
                      </div>
                    </>
                  ) : (
                    <CodePane
                      card={card} openTabs={openTabs} activeTab={activeTab}
                      VS={VS} hlStyle={hlStyle} isMobile={isMobile}
                      setActiveTab={setActiveTab} closeTab={closeTab} openFile={openFile}
                      currentFile={currentFile}
                    />
                  )}
                </div>
              )}
            </div>
          </LiveProvider>
        ) : (
          /* ── No liveCode — show component directly ─────── */
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>

            {/* Preview pane */}
            {(!isMobile || mobileFocus !== 'code') && (
              <div style={{
                ...(isMobile
                  ? { flexShrink: 0, height: mobileFocus === 'preview' ? '100%' : '42%', borderBottom: mobileFocus !== 'preview' ? `1px solid ${VS.border}` : 'none' }
                  : { width: 310, flexShrink: 0, borderRight: `1px solid ${VS.border}` }),
                background: VS.previewBg,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 16, gap: 14, overflow: 'auto',
              }}>
                <p style={{ fontSize: 10, color: VS.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontFamily: 'system-ui' }}>Preview</p>
                <div style={{ background: VS.cardBg, border: `1px solid ${VS.cardBorder}`, borderRadius: 14, width: '100%', overflow: 'hidden' }}>
                  {card?.component}
                </div>
              </div>
            )}

            {/* Code pane */}
            {(!isMobile || mobileFocus !== 'preview') && (
              <CodePane card={card} openTabs={openTabs} activeTab={activeTab} VS={VS} hlStyle={hlStyle} isMobile={isMobile} setActiveTab={setActiveTab} closeTab={closeTab} openFile={openFile} currentFile={currentFile} />
            )}
          </div>
        )}

        {/* Status bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '3px 14px', background: VS.accent, flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: '#fff', fontFamily: 'system-ui' }}>
            react-zero-skeleton · demo
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginLeft: 'auto', fontFamily: 'system-ui' }}>
            {liveMode ? 'Live Editor · react-live' : `${currentFile?.lang === 'ts' ? 'TypeScript' : 'TypeScript React'} · Alt+← Alt+→ navigate`}
          </span>
        </div>
      </div>

      {/* Flex spacer :pushes main content left — desktop only */}
      {!isMobile && (
        <div style={{
          flexShrink: 0,
          width: open ? DRAWER_W : 0,
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
        }} />
      )}
    </>
  );
}

const titleBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', color: '#aaa',
  cursor: 'pointer', fontSize: 14, width: 26, height: 26,
  borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
};
