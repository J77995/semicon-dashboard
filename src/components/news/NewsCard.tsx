'use client';

import { useState } from 'react';
import { NewsArticle } from '@/types/news';

interface NewsCardProps {
  article: NewsArticle;
}

function formatTimeAgo(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
}

export function NewsCard({ article }: NewsCardProps) {
  const [hovered, setHovered] = useState(false);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${hovered ? 'rgba(37,99,235,0.45)' : 'rgba(0,0,0,0.09)'}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    textDecoration: 'none',
    height: '100%',
    boxSizing: 'border-box',
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#111827',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {article.title}
      </h3>

      {/* Summary */}
      <p
        style={{
          margin: 0,
          fontSize: '0.8125rem',
          color: '#64748B',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexGrow: 1,
        }}
      >
        {article.summary}
      </p>

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: '4px',
        }}
      >
        {/* Source + time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#94A3B8',
            }}
          >
            {article.source}
          </span>
          <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: '0.7rem' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Keyword chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {article.keywords.map((kw) => (
            <span
              key={kw}
              style={{
                display: 'inline-block',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#60A5FA',
                backgroundColor: 'rgba(37,99,235,0.12)',
                border: '1px solid rgba(37,99,235,0.25)',
                borderRadius: '9999px',
                paddingLeft: '7px',
                paddingRight: '7px',
                paddingTop: '2px',
                paddingBottom: '2px',
              }}
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
