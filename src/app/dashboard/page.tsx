'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserSquare2, 
  TrendingUp, 
  AlertCircle,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { label: 'Total de Alunos', value: '0', icon: Users, color: 'var(--primary)' },
    { label: 'Funcionários', value: '0', icon: UserSquare2, color: 'var(--secondary)' },
    { label: 'Mensalidades Pagas', value: '0', icon: TrendingUp, color: 'var(--success)' },
    { label: 'Pendentes', value: '0', icon: AlertCircle, color: 'var(--danger)' },
  ]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escutar Alunos
    const unsubAlunos = firestoreService.subscribe('alunos', (data) => {
      setStats(prev => prev.map(s => s.label === 'Total de Alunos' ? { ...s, value: data.length.toString() } : s));
    });

    // Escutar Funcionários
    const unsubStaff = firestoreService.subscribe('funcionarios', (data) => {
      setStats(prev => prev.map(s => s.label === 'Funcionários' ? { ...s, value: data.length.toString() } : s));
    });

    // Escutar Pagamentos para estatísticas e atividades
    const unsubPagamentos = firestoreService.subscribe('pagamentos', (data) => {
      const paid = data.filter(p => p.status === 'Pago').length;
      const total = data.length || 1;
      const percentage = Math.round((paid / total) * 100);
      const pending = data.filter(p => p.status === 'Pendente').length;

      setStats(prev => prev.map(s => {
        if (s.label === 'Mensalidades Pagas') return { ...s, value: `${percentage}%` };
        if (s.label === 'Pendentes') return { ...s, value: pending.toString() };
        return s;
      }));

      // Atividades recentes (últimos 5 pagamentos)
      setActivities(data.slice(0, 5));
      setLoading(false);
    });

    return () => {
      unsubAlunos();
      unsubStaff();
      unsubPagamentos();
    };
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.25rem',
            padding: '1.75rem'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `${stat.color}15`,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon size={28} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {loading ? '...' : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 2fr 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarDays size={20} color="var(--primary)" />
            Atividades Recentes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={24} /></div>
            ) : activities.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nenhuma atividade recente.</p>
            ) : (
                activities.map((activity, i) => (
                    <div key={activity.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: i === activities.length - 1 ? 'none' : '1px solid var(--border)'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)'
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                          {activity.type === 'Mensalidade' ? 'Pagamento efetuado' : 'Transação registada'}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {activity.student} - {activity.date}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 600, 
                        color: activity.category === 'Entrada' ? 'var(--success)' : 'var(--danger)' 
                      }}>
                        {activity.category === 'Entrada' ? '+' : '-'}{activity.amount}
                      </div>
                    </div>
                  ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Novo Recibo</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1.5rem' }}>
              Gere recibos duplicados instantaneamente para seus clientes.
            </p>
            <button className="btn-secondary" style={{ width: '100%', background: 'white', color: 'var(--primary)' }}>
              Emitir Agora
            </button>
          </div>
          
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Avisos</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', marginTop: '5px', flexShrink: 0 }}></div>
                <span>Sincronização em tempo real ativa com Firebase.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '5px', flexShrink: 0 }}></div>
                <span>Todos os módulos estão operacionais.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
