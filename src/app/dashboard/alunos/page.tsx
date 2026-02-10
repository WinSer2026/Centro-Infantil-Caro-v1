'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  UserPlus,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function AlunosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escutar mudanças em tempo real na coleção 'alunos'
    const unsubscribe = firestoreService.subscribe('alunos', (data) => {
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.guardian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Lista de Alunos</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Gerencie as informações de todos os alunos matriculados.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={18} />
          Novo Aluno
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
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
              placeholder="Pesquisar por nome, encarregado ou turma..."
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1rem',
            background: 'var(--background)',
            border: '1px solid var(--border)',
            borderLines: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            borderRadius: 'var(--radius-md)'
          }}>
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin" size={24} />
            Carregando dados do Firebase...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum aluno encontrado ou ainda não existem dados no Firebase.
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Aluno</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Idade</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Turma</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Encarregado</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: 'var(--accent)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}>
                          {student.name ? student.name.charAt(0) : '?'}
                        </div>
                        <div style={{ fontWeight: 500 }}>{student.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9375rem' }}>{student.age}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9375rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.625rem', 
                        borderRadius: '20px', 
                        background: 'var(--accent)', 
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {student.class}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9375rem' }}>{student.guardian}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: student.status === 'Ativo' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        <div style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: student.status === 'Ativo' ? 'var(--success)' : 'var(--warning)'
                        }}></div>
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ 
              padding: '1rem 1.5rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'var(--background)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}>
              <div>Mostrando {filteredStudents.length} alunos</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button disabled style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'not-allowed' }}>Anterior</button>
                <button style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface)' }}>Próximo</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
