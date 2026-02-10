'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Search,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function SalariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribe('salarios', (data) => {
      setPayroll(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPayroll = payroll.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = payroll.reduce((acc, curr) => {
    const salary = typeof curr.baseSalary === 'number' ? curr.baseSalary : parseFloat(curr.baseSalary || 0);
    acc.total += salary;
    if (curr.status === 'Pago') acc.paid += salary;
    else acc.pending += salary;
    return acc;
  }, { total: 0, paid: 0, pending: 0 });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Folha Salarial</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Controle de pagamentos e salários dos colaboradores.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DollarSign size={18} />
          Processar Salários
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total a Pagar</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total.toLocaleString('pt-MZ')} MT</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Pago</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>{stats.paid.toLocaleString('pt-MZ')} MT</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Pendente</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>{stats.pending.toLocaleString('pt-MZ')} MT</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem' }}>Estado de Pagamentos - {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</h3>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Pesquisar funcionário..." 
              className="input-field" 
              style={{ paddingLeft: '2.25rem', paddingBlock: '0.5rem', fontSize: '0.875rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
             <div style={{ padding: '3rem', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                Carregando folha salarial...
             </div>
        ) : filteredPayroll.length === 0 ? (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhum registo de salário encontrado.
             </div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ background: 'var(--background)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>COLABORADOR</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>BASE</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ESTADO</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>DATA PAGAMENTO</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>ACÇÕES</th>
                </tr>
            </thead>
            <tbody>
                {filteredPayroll.map((payment) => (
                <tr key={payment.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{payment.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.category}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>
                    {typeof payment.baseSalary === 'number' ? payment.baseSalary.toLocaleString('pt-MZ') : payment.baseSalary} MT
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: payment.status === 'Pago' ? '#DCFCE7' : '#FEF3C7',
                        color: payment.status === 'Pago' ? '#166534' : '#92400E'
                    }}>
                        {payment.status === 'Pago' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        {payment.status}
                    </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {payment.date}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                    <button style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        background: payment.status === 'Pago' ? 'var(--background)' : 'var(--primary)',
                        color: payment.status === 'Pago' ? 'var(--text-primary)' : 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid ' + (payment.status === 'Pago' ? 'var(--border)' : 'var(--primary)')
                    }}>
                        {payment.status === 'Pago' ? 'Ver Recibo' : 'Pagar Agora'}
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
}
