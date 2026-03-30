'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { KeywordChip } from '@/components/news/KeywordChip';
import { NewsCard } from '@/components/news/NewsCard';
import { NEWS_KEYWORDS } from '@/lib/constants';
import type { NewsApiResponse, NewsArticle } from '@/types/news';

const LS_KEY = 'fadu_custom_keywords';

const COLORS = {
  bg: '#F5F7FA',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.09)',
  borderFocus: 'rgba(37,99,235,0.6)',
  accent: '#2563EB',
  accentLow: 'rgba(37,99,235,0.12)',
  accentBorder: 'rgba(37,99,235,0.3)',
  textHi: '#111827',
  textMid: '#374151',
  textLow: '#64748B',
  textMute: '#94A3B8',
  pos: '#22C55E',
  neg: '#EF4444',
};

export function NewsPageClient({ initialData }: { initialData: NewsApiResponse }) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialData.articles);
  const [fetchedAt, setFetchedAt] = useState<string | null>(initialData.fetchedAt);
  const [sourceStatuses, setSourceStatuses] = useState(initialData.sourceStatuses);
  const [disabledSources, setDisabledSources] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKeywords, setActiveKeywords] = useState<Set<string>>(new Set());
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const LS_SOURCES_KEY = 'fadu_disabled_sources';
  const PAGE_SIZE = 20;

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const kw = localStorage.getItem(LS_KEY);
      if (kw) setCustomKeywords(JSON.parse(kw));
      const ds = localStorage.getItem(LS_SOURCES_KEY);
      if (ds) setDisabledSources(new Set(JSON.parse(ds)));
    } catch {}
  }, []);

  // Persist custom keywords
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(customKeywords)); } catch {}
  }, [customKeywords]);

  // Persist disabled sources
  useEffect(() => {
    try { localStorage.setItem(LS_SOURCES_KEY, JSON.stringify([...disabledSources])); } catch {}
  }, [disabledSources]);

  // All keywords = built-in defaults + custom
  const allKeywords = useMemo(() => {
    const defaults = [...NEWS_KEYWORDS];
    const extras = customKeywords.filter(k => !defaults.includes(k as typeof NEWS_KEYWORDS[number]));
    return [...defaults, ...extras];
  }, [customKeywords]);

  function toggleKeyword(kw: string) {
    setActiveKeywords(prev => {
      const next = new Set(prev);
      next.has(kw) ? next.delete(kw) : next.add(kw);
      return next;
    });
  }

  function addCustomKeyword() {
    const kw = newKeyword.trim();
    if (!kw || allKeywords.includes(kw)) { setNewKeyword(''); return; }
    setCustomKeywords(prev => [...prev, kw]);
    setNewKeyword('');
  }

  function removeKeyword(kw: string) {
    // Remove from custom list (default keywords can also be hidden but not deleted)
    setCustomKeywords(prev => prev.filter(k => k !== kw));
    setActiveKeywords(prev => { const n = new Set(prev); n.delete(kw); return n; });
  }

  function toggleSource(name: string) {
    setDisabledSources(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  // Manual refresh
  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data: NewsApiResponse = await res.json();
      setArticles(data.articles);
      setFetchedAt(data.fetchedAt);
      setSourceStatuses(data.sourceStatuses);
    } catch {}
    setLoading(false);
  }

  const filteredArticles = useMemo(() => {
    setCurrentPage(1); // reset to page 1 whenever filters change
    let result = [...articles];

    // Exclude disabled sources
    if (disabledSources.size > 0) {
      result = result.filter(a => !disabledSources.has(a.source));
    }

    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (activeKeywords.size > 0) {
      result = result.filter(a => {
        // Tag match (fast — covers auto-tagged default keywords)
        if (a.keywords.some(kw => activeKeywords.has(kw))) return true;
        // Text match fallback (covers custom keywords not in auto-tag list)
        const text = (a.title + ' ' + a.summary).toLowerCase();
        return [...activeKeywords].some(kw => text.includes(kw.toLowerCase()));
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, searchQuery, activeKeywords, disabledSources]);

  const formattedAt = fetchedAt
    ? new Date(fetchedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    : null;

  const okSources = sourceStatuses.filter(s => s.ok).length;

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', color: COLORS.textHi }}>
      <PageHeader title="산업 관련 뉴스" subtitle="반도체·스토리지 업계 최신 동향 (RSS 피드)" backHref="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Source status */}
          {sourceStatuses.length > 0 && (
            <span style={{ fontSize: '0.72rem', color: COLORS.textMute }}>
              출처 {okSources}/{sourceStatuses.length}
            </span>
          )}
          {/* Refresh button */}
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: COLORS.accentLow,
              border: `1px solid ${COLORS.accentBorder}`,
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              color: COLORS.accent,
              fontWeight: 500,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '갱신 중...' : `🔄 ${formattedAt ? `갱신: ${formattedAt}` : '30분마다 갱신'}`}
          </button>
        </div>
      </PageHeader>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="뉴스 검색 (제목, 요약)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px', color: COLORS.textHi,
              fontSize: '0.9rem',
              paddingLeft: '42px', paddingRight: '16px',
              paddingTop: '11px', paddingBottom: '11px',
              outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = COLORS.borderFocus)}
            onBlur={e => (e.currentTarget.style.borderColor = COLORS.border)}
          />
        </div>

        {/* Keyword filter panel */}
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '16px 20px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: COLORS.textLow, fontWeight: 500 }}>키워드 필터</span>
            {activeKeywords.size > 0 && (
              <button onClick={() => setActiveKeywords(new Set())}
                style={{ background: 'none', border: `1px solid ${COLORS.border}`, borderRadius: '6px', color: COLORS.textLow, fontSize: '0.75rem', cursor: 'pointer', padding: '4px 10px' }}>
                전체 해제
              </button>
            )}
          </div>

          {/* Keyword chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {allKeywords.map(kw => {
              const isCustom = customKeywords.includes(kw);
              return (
                <div key={kw} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <KeywordChip keyword={kw} active={activeKeywords.has(kw)} onClick={toggleKeyword} />
                  {isCustom && (
                    <button
                      onClick={() => removeKeyword(kw)}
                      title={`'${kw}' 삭제`}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: COLORS.textMute, fontSize: '0.7rem', padding: '0 2px', lineHeight: 1,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = COLORS.neg)}
                      onMouseLeave={e => (e.currentTarget.style.color = COLORS.textMute)}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add custom keyword */}
          <div style={{ display: 'flex', gap: '8px', borderTop: `1px solid ${COLORS.border}`, paddingTop: '12px' }}>
            <input
              type="text"
              placeholder="키워드 추가 (예: Intel)"
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustomKeyword(); }}
              style={{
                flex: 1,
                backgroundColor: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: '8px', color: COLORS.textHi,
                fontSize: '0.82rem', padding: '7px 12px',
                outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = COLORS.borderFocus)}
              onBlur={e => (e.currentTarget.style.borderColor = COLORS.border)}
            />
            <button
              onClick={addCustomKeyword}
              disabled={!newKeyword.trim()}
              style={{
                backgroundColor: newKeyword.trim() ? COLORS.accent : COLORS.border,
                color: newKeyword.trim() ? '#FFFFFF' : COLORS.textMute,
                border: 'none', borderRadius: '8px',
                fontSize: '0.82rem', fontWeight: 600,
                padding: '7px 16px', cursor: newKeyword.trim() ? 'pointer' : 'default',
                transition: 'background-color 0.15s',
              }}
            >
              + 추가
            </button>
          </div>
        </div>

        {/* Result count + source info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', color: COLORS.textLow }}>
            총 <span style={{ color: COLORS.textHi, fontWeight: 600 }}>{filteredArticles.length}</span>건
            {articles.length > 0 && filteredArticles.length !== articles.length && (
              <span style={{ color: COLORS.textMute }}> / {articles.length}건</span>
            )}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.78rem', color: COLORS.textMute }}>
            {activeKeywords.size > 0 && <span>키워드 {activeKeywords.size}개 선택</span>}
            {activeKeywords.size > 0 && searchQuery.trim() && <span>·</span>}
            {searchQuery.trim() && <span>"{searchQuery.trim()}" 검색 중</span>}
          </div>
        </div>

        {/* Source toggles */}
        {sourceStatuses.length > 0 && (
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: COLORS.textLow, fontWeight: 500 }}>언론사 필터</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setDisabledSources(new Set())}
                  disabled={disabledSources.size === 0}
                  style={{ background: 'none', border: `1px solid ${COLORS.border}`, borderRadius: '6px', color: disabledSources.size === 0 ? COLORS.textMute : COLORS.textLow, fontSize: '0.75rem', cursor: disabledSources.size === 0 ? 'default' : 'pointer', padding: '4px 10px' }}>
                  모두 선택
                </button>
                <button
                  onClick={() => setDisabledSources(new Set(sourceStatuses.map(s => s.name)))}
                  disabled={disabledSources.size === sourceStatuses.length}
                  style={{ background: 'none', border: `1px solid ${COLORS.border}`, borderRadius: '6px', color: disabledSources.size === sourceStatuses.length ? COLORS.textMute : COLORS.textLow, fontSize: '0.75rem', cursor: disabledSources.size === sourceStatuses.length ? 'default' : 'pointer', padding: '4px 10px' }}>
                  모두 해제
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {sourceStatuses.map(s => {
                const disabled = disabledSources.has(s.name);
                return (
                  <button
                    key={s.name}
                    onClick={() => toggleSource(s.name)}
                    title={disabled ? `${s.name} 활성화` : `${s.name} 비활성화`}
                    style={{
                      fontSize: '0.7rem', padding: '3px 10px', borderRadius: '4px',
                      cursor: 'pointer', transition: 'all 0.15s',
                      backgroundColor: disabled
                        ? 'rgba(0,0,0,0.04)'
                        : s.ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      color: disabled
                        ? COLORS.textMute
                        : s.ok ? '#16A34A' : '#DC2626',
                      border: `1px solid ${disabled ? COLORS.border : s.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      textDecoration: disabled ? 'line-through' : 'none',
                    }}
                  >
                    {disabled ? '○' : s.ok ? '✓' : '✗'} {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Articles grid or empty state */}
        {articles.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: COLORS.textMute }}>
            <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '8px' }}>뉴스를 불러올 수 없습니다</p>
            <p style={{ fontSize: '0.82rem' }}>RSS 출처에 접근하지 못했습니다. 잠시 후 새로고침해 주세요.</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', color: COLORS.textMute, gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 500 }}>조건에 맞는 뉴스가 없습니다</p>
            <p style={{ margin: 0, fontSize: '0.8125rem' }}>키워드 또는 검색어를 변경해 보세요</p>
          </div>
        ) : (() => {
          const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
          const pageArticles = filteredArticles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

          // Page number list: always show first, last, current ±2, with ellipsis
          const pageNums: (number | '…')[] = [];
          for (let p = 1; p <= totalPages; p++) {
            if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) {
              pageNums.push(p);
            } else if (pageNums[pageNums.length - 1] !== '…') {
              pageNums.push('…');
            }
          }

          const btnBase: React.CSSProperties = {
            minWidth: '32px', height: '32px', padding: '0 6px',
            border: `1px solid ${COLORS.border}`, borderRadius: '6px',
            fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s',
          };

          return (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '16px' }}>
                {pageArticles.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', paddingTop: '8px', flexWrap: 'wrap' }}>
                  {/* 이전 */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    style={{ ...btnBase, backgroundColor: COLORS.card, color: currentPage === 1 ? COLORS.textMute : COLORS.textMid, cursor: currentPage === 1 ? 'default' : 'pointer' }}
                  >‹ 이전</button>

                  {pageNums.map((p, i) =>
                    p === '…' ? (
                      <span key={`e${i}`} style={{ padding: '0 4px', color: COLORS.textMute, fontSize: '0.8rem' }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p as number)}
                        style={{
                          ...btnBase,
                          backgroundColor: p === currentPage ? COLORS.accent : COLORS.card,
                          color: p === currentPage ? '#FFFFFF' : COLORS.textMid,
                          borderColor: p === currentPage ? COLORS.accent : COLORS.border,
                          fontWeight: p === currentPage ? 600 : 400,
                          cursor: p === currentPage ? 'default' : 'pointer',
                        }}
                      >{p}</button>
                    )
                  )}

                  {/* 다음 */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    style={{ ...btnBase, backgroundColor: COLORS.card, color: currentPage === totalPages ? COLORS.textMute : COLORS.textMid, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                  >다음 ›</button>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
