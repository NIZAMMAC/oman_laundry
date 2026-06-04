"use client";

import { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser, signupUser } from '../actions';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  
  const [role, setRole] = useState<'USER' | 'ADMIN' | null>(null);
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isPending, startTransition] = useTransition();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === 'ADMIN') {
      router.push('/admin');
      return;
    }

    startTransition(async () => {
      if (mode === 'LOGIN') {
        const result = await loginUser(phone);
        if (result.success) {
          router.push(redirect);
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await signupUser(name, phone, address);
        if (result.success) {
          router.push(redirect);
        } else {
          setError(result.error || 'Signup failed');
        }
      }
    });
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
        <h1 className="h2 text-center" style={{ marginBottom: '0.5rem' }}>Welcome</h1>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Select your role to continue</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          
          <div 
            onClick={() => { setRole('USER'); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '1.5rem', 
              textAlign: 'center', 
              border: `2px solid ${role === 'USER' ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: role === 'USER' ? 'var(--primary-glow)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
            <div style={{ fontWeight: 600 }}>Customer</div>
          </div>

          <div 
            onClick={() => { setRole('ADMIN'); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '1.5rem', 
              textAlign: 'center', 
              border: `2px solid ${role === 'ADMIN' ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: role === 'ADMIN' ? 'var(--primary-glow)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
            <div style={{ fontWeight: 600 }}>Admin</div>
          </div>

        </div>

        {role === 'USER' && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => { setMode('LOGIN'); setError(''); }}
              type="button"
              style={{ flex: 1, padding: '0.5rem', borderBottom: `2px solid ${mode === 'LOGIN' ? 'var(--primary)' : 'transparent'}`, background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: mode === 'LOGIN' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
            >
              Login
            </button>
            <button 
              onClick={() => { setMode('SIGNUP'); setError(''); }}
              type="button"
              style={{ flex: 1, padding: '0.5rem', borderBottom: `2px solid ${mode === 'SIGNUP' ? 'var(--primary)' : 'transparent'}`, background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: mode === 'SIGNUP' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>
        )}

        {role && (
          <form onSubmit={handleSubmit} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{error}</div>}
            
            {role === 'ADMIN' ? (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                  <input type="email" defaultValue="admin@laundry360.com" readOnly style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                  <input type="password" defaultValue="password123" readOnly style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                </div>
              </>
            ) : (
              <>
                {mode === 'SIGNUP' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                    <input type="text" required value={name || ''} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                  </div>
                )}
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
                  <input type="text" required value={phone || ''} onChange={e => setPhone(e.target.value)} placeholder="e.g. +968 9123 4567" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                </div>

                {mode === 'SIGNUP' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Address (Optional)</label>
                    <textarea value={address || ''} onChange={e => setAddress(e.target.value)} placeholder="Al Qurum, Muscat" rows={2} style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical' }} />
                  </div>
                )}
              </>
            )}
            
            <button type="submit" disabled={isPending} className="btn-primary" style={{ width: '100%', marginTop: '1rem', opacity: isPending ? 0.5 : 1 }}>
              {isPending ? 'Processing...' : (role === 'ADMIN' ? 'Login as Admin' : (mode === 'LOGIN' ? 'Login' : 'Sign Up'))}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
