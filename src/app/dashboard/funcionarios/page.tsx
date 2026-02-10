'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Briefcase, 
  Calendar,
  Wallet,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribe('funcionarios', (data) => {
      setStaff(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredStaff = staff.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalary = staff.reduce((acc, s) => {
    const salary = typeof s.salary === 'string' 
      ? parseFloat(s.salary.replace(/[^0-9.]/g, '')) 
      : (s.salary || 0);
    return acc + salary;
  }, 0);

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
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Gestão de Funcionários</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Controle de categorias, salários e presenças da equipe.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Novo Funcionário
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Briefcase size={20} />
            </div>
            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.75rem' }}>Total</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Total de Staff</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{staff.length} Colaboradores</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: '#F0FDF4', color: 'var(--success)', padding: '0.5rem', borderRadius: '10px' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Presentes Hoje</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {staff.filter(s => s.status === 'Presente').length} / {staff.length}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: '#FFF7ED', color: 'var(--secondary)', padding: '0.5rem', borderRadius: '10px' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Folha Salarial</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalSalary.toLocaleString('pt-MZ')} MT</div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem' }}>Lista de Colaboradores</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Pesquisar..."
              style={{ paddingLeft: '2.25rem', paddingBlock: '0.5rem', fontSize: '0.875rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 1rem' }} />
            Buscando equipe no Firebase...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum colaborador encontrado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--background)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-muted)' }}>Funcionário</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-muted)' }}>Categoria</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-muted)' }}>Salário</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-muted)' }}>Admissão</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((person) => (
                <tr key={person.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{person.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {person.id.substring(0, 8)}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      background: 'var(--background)',
                      fontSize: '0.8125rem',
                      fontWeight: 500
                    }}>
                      {person.category}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{person.salary}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{person.joinDate}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: person.status === 'Presente' ? '#DCFCE7' : '#FEE2E2',
                      color: person.status === 'Presente' ? '#166534' : '#991B1B'
                    }}>
                      {person.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                      <MoreHorizontal size={20} />
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
