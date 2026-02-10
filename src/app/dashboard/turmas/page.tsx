'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search,
  MoreVertical,
  BookOpen,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function TurmasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribe('turmas', (data) => {
      setTurmas(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredTurmas = turmas.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.teacher?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Gestão de Turmas</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Organize os alunos em turmas e atribua professores.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Nova Turma
        </button>
      </div>

      {/* Stats Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Total de Turmas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{turmas.length.toString().padStart(2, '0')}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Profs. Atribuídos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {new Set(turmas.map(t => t.teacher).filter(Boolean)).size}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>Matriculados</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
             {turmas.reduce((acc, t) => acc + (t.studentsCount || 0), 0)}
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Pesquisar por nome da turma ou professor..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Turmas Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
            Sincronizando turmas...
        </div>
      ) : (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredTurmas.map((turma) => (
              <div key={turma.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--accent)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <button style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{turma.name}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {turma.level} • {turma.shift}
                </div>
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Users size={16} color="var(--text-muted)" />
                    <span><strong>{turma.studentsCount || 0}</strong> alunos matriculados</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Users size={16} color="var(--text-muted)" />
                    <span>Prof: <strong>{turma.teacher || 'Não atribuído'}</strong></span>
                  </div>
                </div>
    
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}>
                    Ver Alunos
                  </button>
                  <button style={{ 
                    flex: 1, 
                    padding: '0.5rem', 
                    fontSize: '0.875rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    fontWeight: 600
                  }}>
                    Editar
                  </button>
                </div>
              </div>
            ))}
    
            <div style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: 'transparent',
              color: 'var(--text-muted)',
              minHeight: '200px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)', e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)', e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'var(--background)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Plus size={24} />
              </div>
              <span style={{ fontWeight: 600 }}>Adicionar Turma</span>
            </div>
          </div>
      )}
    </div>
  );
}
