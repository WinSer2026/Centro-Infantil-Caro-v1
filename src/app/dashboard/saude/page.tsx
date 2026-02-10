'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  Plus, 
  Search,
  ClipboardList,
  Thermometer,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function SaudePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribe('saude', (data) => {
      setRecords(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredRecords = records.filter(record => 
    record.student?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalAlerts = records.filter(r => r.status === 'Crítico');

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
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Módulo de Saúde</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Monitoramento de saúde, alergias e medicação dos alunos.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Novo Registo
        </button>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div style={{ 
            background: '#FEF2F2', 
            border: '1px solid #FEE2E2', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{ background: '#FECACA', color: 'var(--danger)', padding: '0.5rem', borderRadius: '8px' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 style={{ color: '#991B1B', marginBottom: '0.25rem' }}>Atenção: Alertas Críticos</h4>
              <p style={{ color: '#B91C1C', fontSize: '0.875rem' }}>
                Existem {criticalAlerts.length} casos críticos que requerem atenção imediata.
              </p>
            </div>
          </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '1.5rem' 
      }}>
        {/* Recent Health Records */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={20} color="var(--primary)" />
              Registos de Saúde
            </h3>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Pesquisar aluno..." 
                className="input-field" 
                style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', fontSize: '0.8125rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
             <div style={{ padding: '3rem', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                Carregando histórico de saúde...
             </div>
          ) : filteredRecords.length === 0 ? (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Nenhum registo de saúde encontrado.
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredRecords.map((record) => (
                <div key={record.id} style={{ 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: record.type === 'Alergia' ? '#FEE2E2' : record.type === 'Medicação' ? '#E0F2FE' : '#F0FDF4',
                        color: record.type === 'Alergia' ? 'var(--danger)' : record.type === 'Medicação' ? 'var(--primary)' : 'var(--success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {record.type === 'Alergia' ? <AlertTriangle size={18} /> : record.type === 'Medicação' ? <Activity size={18} /> : <Heart size={18} />}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{record.student}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <strong>{record.type}:</strong> {record.description}
                        </div>
                    </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        background: record.status === 'Crítico' ? 'var(--danger)' : record.status === 'Em curso' ? 'var(--primary)' : 'var(--success)',
                        color: 'white'
                    }}>
                        {record.status}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{record.date}</div>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>

        {/* Health Tips/Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={20} />
              Triagem Diária
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1.25rem' }}>
              Inicie a verificação de temperatura matinal para todas as turmas.
            </p>
            <button className="btn-secondary" style={{ width: '100%', background: 'white', color: 'var(--primary)' }}>
              Começar Triagem
            </button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '0.9375rem' }}>Resumo de Medicamentos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Administrados hoje</span>
                <span style={{ fontWeight: 700 }}>
                    {records.filter(r => r.type === 'Medicação' && r.status === 'Concluído').length} / {records.filter(r => r.type === 'Medicação').length}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--background)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                    width: `${(records.filter(r => r.type === 'Medicação' && r.status === 'Concluído').length / (records.filter(r => r.type === 'Medicação').length || 1)) * 100}%`, 
                    height: '100%', 
                    background: 'var(--success)' 
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
