'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Wallet, 
  ClipboardCheck, 
  LogOut,
  ChevronRight,
  BookOpen,
  Heart,
  Calendar,
  Utensils,
  DollarSign,
  Settings
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumo', href: '/dashboard' },
  { icon: Users, label: 'Alunos', href: '/dashboard/alunos' },
  { icon: BookOpen, label: 'Turmas', href: '/dashboard/turmas' },
  { icon: UserSquare2, label: 'Funcionários', href: '/dashboard/funcionarios' },
  { icon: ClipboardCheck, label: 'Presenças', href: '/dashboard/presencas' },
  { icon: Wallet, label: 'Financeiro', href: '/dashboard/financeiro' },
  { icon: DollarSign, label: 'Salários', href: '/dashboard/salarios' },
  { icon: Heart, label: 'Saúde', href: '/dashboard/saude' },
  { icon: Calendar, label: 'Eventos', href: '/dashboard/eventos' },
  { icon: Utensils, label: 'Refeições', href: '/dashboard/refeicoes' },
  { icon: Settings, label: 'Categorias', href: '/dashboard/categorias' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside className="glass" style={{
        width: '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        borderRight: '1px solid var(--border)'
      }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            CIC
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '-4px' }}>Centro Infantil</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>GESTÃO CARÓ</span>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 10px 15px -3px rgba(0, 119, 194, 0.3)' : 'none'
                }}
              >
                <Icon size={20} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontWeight: 600,
            background: 'transparent',
            marginTop: 'auto'
          }}
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{
          padding: '1.5rem 2rem',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <h1 style={{ fontSize: '1.5rem' }}>
            {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>CICaro</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrador</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              fontWeight: 700
            }}>
              C
            </div>
          </div>
        </header>
        
        <main className="container">
          {children}
        </main>
      </div>
    </div>
  );
}
