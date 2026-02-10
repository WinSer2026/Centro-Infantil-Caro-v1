'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { firestoreService } from '@/lib/services/firestore';

export default function EventosPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestoreService.subscribe('eventos', (data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Agenda de Eventos</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Planeie e acompanhe todas as actividades e eventos do Centro.
          </p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          Criar Evento
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr', 
        gap: '2rem' 
      }}>
        {/* Calendar View Placeholder */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Fevereiro 2026</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent' }}>
                <ChevronLeft size={18} />
              </button>
              <button style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent' }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)'
          }}>
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => <div key={day}>{day}</div>)}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '1px',
            background: 'var(--border)',
            marginTop: '1px'
          }}>
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1;
              const dayEvents = events.filter(e => {
                const eventDay = parseInt(e.date?.split('/')[0]);
                return eventDay === day;
              });

              return (
                <div key={i} style={{ 
                  background: 'var(--surface)', 
                  height: '100px', 
                  padding: '0.5rem', 
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'inherit' }}>{day}</span>
                  {dayEvents.map((e, idx) => (
                    <div key={idx} style={{ 
                      marginTop: '0.4rem', 
                      background: e.color || 'var(--accent)', 
                      color: 'white',
                      fontSize: '0.65rem',
                      padding: '0.2rem',
                      borderRadius: '4px',
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {e.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Próximos Eventos</h3>
          {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: 'var(--primary)' }} />
             </div>
          ) : events.length === 0 ? (
             <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nenhum evento agendado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.map((event) => (
                <div key={event.id} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${event.color || 'var(--primary)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        color: event.color || 'var(--primary)',
                        letterSpacing: '0.05em'
                    }}>
                        {event.type}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <Calendar size={12} />
                        {event.date}
                    </div>
                    </div>
                    
                    <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{event.title}</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} />
                        <span>{event.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} />
                        <span>{event.location}</span>
                    </div>
                    </div>

                    <div style={{ 
                    marginTop: '1.25rem', 
                    paddingTop: '1rem', 
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                    }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.attendees || 0} inscritos</span>
                    <button style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '6px', 
                        background: 'var(--accent)', 
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                    }}>
                        Gerir
                    </button>
                    </div>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
