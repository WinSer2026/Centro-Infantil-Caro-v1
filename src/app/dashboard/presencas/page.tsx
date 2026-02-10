'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search,
  Filter,
  Save,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function PresencasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    // Escutar mudanças em tempo real na coleção 'presencas'
    const unsubscribe = firestoreService.subscribe('presencas', (data) => {
      setAttendance(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    present: attendance.filter(a => a.status === 'Presente').length,
    absent: attendance.filter(a => a.status === 'Ausente').length,
    late: attendance.filter(a => a.status === 'Atrasado').length,
  };

  const filteredAttendance = attendance.filter(person => 
    person.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = async (id: string, newStatus: string) => {
    const time = newStatus === 'Presente' || newStatus === 'Atrasado' 
      ? new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) 
      : '-';
    
    await firestoreService.update('presencas', id, { status: newStatus, time });
  };

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
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Controle de Presenças</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Registo diário de entrada para alunos e funcionários.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'none', border: '1px solid var(--border)' }}>
             <Calendar size={18} color="var(--primary)" />
             <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{today}</span>
           </div>
           <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} />
            Salvar Registo
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#DCFCE7', color: '#166534', padding: '0.5rem', borderRadius: '8px' }}><CheckCircle2 size={20} /></div>
           <div>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presentes</div>
             <div style={{ fontWeight: 700 }}>{stats.present}</div>
           </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '0.5rem', borderRadius: '8px' }}><XCircle size={20} /></div>
           <div>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ausentes</div>
             <div style={{ fontWeight: 700 }}>{stats.absent}</div>
           </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <div style={{ background: '#FFF7ED', color: '#9A3412', padding: '0.5rem', borderRadius: '8px' }}><Clock size={20} /></div>
           <div>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Atrasos</div>
             <div style={{ fontWeight: 700 }}>{stats.late}</div>
           </div>
        </div>
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={24} />
            Sincronizando com Firebase...
          </div>
        ) : (
          <>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  className="input-field" 
                  placeholder="Procurar nome..." 
                  style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="input-field" style={{ width: '150px', fontSize: '0.875rem' }}>
                <option>Todos</option>
                <option>Alunos</option>
                <option>Staff</option>
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>NOME</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>TIPO</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>HORA</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((person) => (
                  <tr key={person.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{person.name}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{person.type}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{person.time}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button 
                          onClick={() => updateStatus(person.id, 'Presente')}
                          style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          background: person.status === 'Presente' ? 'var(--success)' : 'var(--background)',
                          color: person.status === 'Presente' ? 'white' : 'var(--text-secondary)',
                          border: '1px solid ' + (person.status === 'Presente' ? 'var(--success)' : 'var(--border)')
                        }}>P</button>
                        <button 
                          onClick={() => updateStatus(person.id, 'Ausente')}
                          style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          background: person.status === 'Ausente' ? 'var(--danger)' : 'var(--background)',
                          color: person.status === 'Ausente' ? 'white' : 'var(--text-secondary)',
                          border: '1px solid ' + (person.status === 'Ausente' ? 'var(--danger)' : 'var(--border)')
                        }}>F</button>
                        <button 
                          onClick={() => updateStatus(person.id, 'Atrasado')}
                          style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: 600,
                          background: person.status === 'Atrasado' ? 'var(--warning)' : 'var(--background)',
                          color: person.status === 'Atrasado' ? 'white' : 'var(--text-secondary)',
                          border: '1px solid ' + (person.status === 'Atrasado' ? 'var(--warning)' : 'var(--border)')
                        }}>A</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
