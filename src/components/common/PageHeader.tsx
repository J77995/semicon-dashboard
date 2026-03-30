import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backHref, backLabel = '대시보드 메인', children }: PageHeaderProps) {
  return (
    <div style={{
      padding: '28px 32px 0',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      marginBottom: '0',
    }}>
      {backHref && (
        <Link href={backHref} style={{
          fontSize: '0.78rem',
          color: '#6B7280',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '10px',
        }}>
          ← {backLabel}
        </Link>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '4px 0 0' }}>{subtitle}</p>}
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
