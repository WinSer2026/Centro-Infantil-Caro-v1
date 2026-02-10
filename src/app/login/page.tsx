'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Credenciais solicitadas pelo usuário: CICaro / 0123
    if (username === 'CICaro' && password === '0123') {
      // Simular delay de autenticação
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/dashboard');
      }, 1000);
    } else {
      setError('Credenciais inválidas. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, #005FA0 100%)',
      padding: '1.5rem'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--secondary)',
            borderRadius: '20px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 15px -3px rgba(245, 146, 29, 0.4)'
          }}>
            CIC
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            Centro Infantil Caró
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sistema de Gestão Escolar
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ textAlign: 'left' }}>
            <label className="input-label" htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <label className="input-label" htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: 'var(--danger)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Aceder ao Sistema'}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Precisa de ajuda? Contacte o suporte técnico.
        </div>
      </div>
    </div>
  );
}
