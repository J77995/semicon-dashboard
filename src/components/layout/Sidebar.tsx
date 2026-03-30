'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, TrendingUp, Network, Newspaper } from 'lucide-react';

const navItems = [
  { href: '/', label: '대시보드 메인', icon: LayoutDashboard },
  { href: '/company', label: '재무 현황', icon: Building2 },
  { href: '/industry', label: '메모리/스토리지 시장현황', icon: TrendingUp },
  { href: '/valuechain', label: '밸류체인 동향', icon: Network },
  { href: '/news', label: '산업 뉴스', icon: Newspaper },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid rgba(0,0,0,0.09)',
      width: '260px',
      height: '100%',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', padding: '24px 20px 20px', borderBottom: '1px solid rgba(0,0,0,0.09)', display: 'block' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.04em' }}>Semi Valuechain</span>
        <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '2px', letterSpacing: '0.05em' }}>반도체 밸류체인 대시보드</div>
      </Link>
      {/* Nav */}
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', margin: '2px 8px', borderRadius: '8px',
              textDecoration: 'none',
              backgroundColor: isActive ? 'rgba(220,38,38,0.08)' : 'transparent',
              color: isActive ? '#EF4444' : '#64748B',
              fontSize: '0.9rem', fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
              borderLeft: isActive ? '3px solid #DC2626' : '3px solid transparent',
            }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.09)', fontSize: '0.7rem', color: '#94A3B8' }}>
        Junyoung Jeong © 2026
      </div>
    </aside>
  );
}
