'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiBriefcase, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.push('/');
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Loading...</div>
      </div>
    );
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up first
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Signup failed');
          setLoading(false);
          return;
        }
      }

      // Then sign in
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* Left Side — Branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: '120px', height: '120px', borderRadius: '20px', background: 'rgba(255,255,255,0.06)', transform: 'rotate(25deg)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '3rem'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FiBriefcase style={{ fontSize: '26px', color: '#fff' }} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontFamily: "'Outfit', sans-serif" }}>
              Job Hunt <span style={{ fontWeight: 400, opacity: 0.8 }}>HQ</span>
            </div>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.04em' }}>
            Your career<br />command center.
          </h1>

          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '400px' }}>
            Track applications, manage recruiter outreach, and land your dream job — all in one beautiful dashboard.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
            {[
              { n: '500+', l: 'Jobs Tracked' },
              { n: '50+', l: 'Companies' },
              { n: 'AI', l: 'Powered' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>{s.n}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div style={{
        width: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', background: '#fff'
      }}>
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '26px', fontWeight: 700, color: '#1e293b', marginBottom: '8px',
            fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em'
          }}>
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '2rem' }}>
            {mode === 'login' ? 'Sign in to your dashboard' : 'Start tracking your job hunt'}
          </p>

          {/* Google Button */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            style={{
              width: '100%', padding: '13px', background: '#fff', color: '#374151',
              border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px', transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px', margin: '1.75rem 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '1rem',
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              fontSize: '13px', fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }} />
                <input
                  type="text" placeholder="Full name" value={name}
                  onChange={e => setName(e.target.value)} required
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px', border: '1.5px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px', color: '#1e293b', background: '#fff',
                    outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }} />
              <input
                type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)} required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px', border: '1.5px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '14px', color: '#1e293b', background: '#fff',
                  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }} />
              <input
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} required minLength={6}
                style={{
                  width: '100%', padding: '13px 14px 13px 42px', border: '1.5px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '14px', color: '#1e293b', background: '#fff',
                  outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#fff', transition: 'all 0.3s', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(102,126,234,0.35)',
                marginTop: '4px'
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '14px', color: '#64748b' }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{
                background: 'none', border: 'none', color: '#667eea',
                fontWeight: 600, cursor: 'pointer', fontSize: '14px',
                fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px'
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
