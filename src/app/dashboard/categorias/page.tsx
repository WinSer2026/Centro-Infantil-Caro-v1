'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2,
  Edit2,
  Briefcase,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function CategoriasPage() {
  const [staffCategories, setStaffCategories] = useState<any[]>([]);
  const [studentLevels, setStudentLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubStaff = firestoreService.subscribe('categorias_staff', (data) => {
      setStaffCategories(data);
    });
    
    const unsubLevels = firestoreService.subscribe('niveis_escolares', (data) => {
      setStudentLevels(data);
      setLoading(false);
    });

    return () => {
      unsubStaff();
      unsubLevels();
    };
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Configurações de Categorias</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Defina as categorias de funcionários e níveis escolares.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Staff Categories */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--primary)" />
              Categorias de Staff
            </h3>
            <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Nova
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}><Loader2 className="animate-spin" size={20} /></div>
            ) : staffCategories.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Nenhuma categoria definida.</p>
            ) : (
                staffCategories.map((cat) => (
                    <div key={cat.id} style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{cat.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.count || 0} funcionários nesta categoria</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '0.4rem', color: 'var(--text-muted)', background: 'transparent' }}><Edit2 size={16} /></button>
                        <button style={{ padding: '0.4rem', color: 'var(--danger)', background: 'transparent' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
            )}
          </div>
        </div>

        {/* Student Levels */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} color="var(--secondary)" />
              Níveis Escolares
            </h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Novo
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}><Loader2 className="animate-spin" size={20} /></div>
            ) : studentLevels.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Nenhum nível definido.</p>
            ) : (
                studentLevels.map((lvl) => (
                    <div key={lvl.id} style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{lvl.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Idade: {lvl.ageRange} • {lvl.count || 0} alunos</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '0.4rem', color: 'var(--text-muted)', background: 'transparent' }}><Edit2 size={16} /></button>
                        <button style={{ padding: '0.4rem', color: 'var(--danger)', background: 'transparent' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
