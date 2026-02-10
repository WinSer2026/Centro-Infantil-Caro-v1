'use client';

import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Coffee, 
  Sun, 
  Apple, 
  Check, 
  Clock,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function RefeicoesPage() {
  const [menuToday, setMenuToday] = useState<any[]>([]);
  const [weeklyMenu, setWeeklyMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscrever à ementa de hoje
    const unsubToday = firestoreService.subscribe('ementa_diaria', (data) => {
      setMenuToday(data);
    });

    // Subscrever à ementa semanal
    const unsubWeekly = firestoreService.subscribe('ementa_semanal', (data) => {
      setWeeklyMenu(data);
      setLoading(false);
    });

    return () => {
      unsubToday();
      unsubWeekly();
    };
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'Pequeno Almoço': return Coffee;
      case 'Lanche Manhã': return Apple;
      case 'Almoço': return UtensilsCrossed;
      case 'Lanche Tarde': return Sun;
      default: return UtensilsCrossed;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'Pequeno Almoço': return '#E0F2FE';
      case 'Lanche Manhã': return '#F0FDF4';
      case 'Almoço': return '#FEF3C7';
      case 'Lanche Tarde': return '#FCE7F3';
      default: return '#F1F5F9';
    }
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
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Ementa das Refeições</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Planeamento nutricional semanal e controlo de consumo diário.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardList size={18} />
          Gerir Ementa Semanal
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Today's Timeline */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary)" />
            Hoje, {new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}
          </h3>

          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            <div style={{ 
              position: 'absolute', 
              left: '7px', 
              top: '0', 
              bottom: '0', 
              width: '2px', 
              background: 'var(--border)',
              zIndex: 0 
            }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {loading ? (
                <Loader2 className="animate-spin" size={24} style={{ margin: '2rem auto', color: 'var(--primary)' }} />
              ) : menuToday.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ementa diária não definida.</p>
              ) : (
                menuToday.sort((a,b) => a.time.localeCompare(b.time)).map((item, index) => {
                  const Icon = getIcon(item.type);
                  return (
                    <div key={index} style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        position: 'absolute', 
                        left: '-2rem', 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%', 
                        background: 'white', 
                        border: `3px solid ${item.completed ? 'var(--success)' : 'var(--border)'}`,
                        marginTop: '4px'
                      }}></div>
                      
                      <div style={{ 
                        background: getColor(item.type), 
                        padding: '1.25rem', 
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        gap: '1rem'
                      }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '12px', 
                          background: 'white', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'var(--text-primary)'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>{item.type}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.time}</span>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{item.menu}</div>
                        </div>
                        <div style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          background: item.completed ? 'var(--success)' : 'transparent',
                          border: item.completed ? 'none' : '2px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          {item.completed && <Check size={14} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Weekly Menu */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Ementa Semanal (Almoço)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
                <Loader2 className="animate-spin" size={24} style={{ margin: '2rem auto', color: 'var(--primary)' }} />
            ) : weeklyMenu.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ementa semanal não definida.</p>
            ) : (
                weeklyMenu.map((item, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{item.dia}</div>
                        <div style={{ fontWeight: 600 }}>{item.prato}</div>
                      </div>
                      <div style={{ color: 'var(--primary)' }}>
                        <UtensilsCrossed size={18} />
                      </div>
                    </div>
                  ))
            )}
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.25rem', 
            background: 'var(--accent)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--primary)'
          }}>
            <h4 style={{ color: 'var(--primary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Restrições Alimentares</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Lembre-se de verificar a lista de alergias no módulo de Saúde antes de servir as refeições. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
