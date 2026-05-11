'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (session) router.push('/'); }, [session, router]);

  if (status === 'loading' || !mounted) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <style jsx>{`
          .auth-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
          .auth-spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #667eea; border-radius: 50%; animation: spin 0.8s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return; }
      }
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) { setError(result.error); setLoading(false); }
      else router.push('/');
    } catch { setError('Something went wrong.'); setLoading(false); }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float1 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(30px, -30px) rotate(120deg); } 66% { transform: translate(-20px, 20px) rotate(240deg); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-40px, -20px) scale(1.1); } }
        @keyframes float3 { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(20px, 30px) rotate(180deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-ring { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes count-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .auth-page * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-page { min-height: 100vh; display: flex; font-family: 'Inter', -apple-system, sans-serif; background: #f8fafc; }
        
        .auth-left {
          flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%);
          background-size: 300% 300%; animation: gradient-shift 8s ease infinite;
          position: relative; overflow: hidden;
        }

        .auth-orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .auth-orb-1 { width: 500px; height: 500px; top: -150px; right: -100px; background: rgba(255,255,255,0.08); animation: float1 20s ease-in-out infinite; }
        .auth-orb-2 { width: 300px; height: 300px; bottom: -80px; left: -60px; background: rgba(255,255,255,0.06); animation: float2 15s ease-in-out infinite; }
        .auth-orb-3 { width: 150px; height: 150px; top: 40%; right: 20%; background: rgba(255,255,255,0.04); animation: float3 12s ease-in-out infinite; }
        .auth-orb-4 { width: 80px; height: 80px; top: 20%; left: 30%; background: rgba(255,255,255,0.03); animation: float1 18s ease-in-out infinite reverse; }
        
        .auth-grid-line { position: absolute; background: rgba(255,255,255,0.03); }
        .auth-grid-h { width: 100%; height: 1px; }
        .auth-grid-v { width: 1px; height: 100%; }

        .auth-left-content { position: relative; z-index: 1; max-width: 480px; }
        .auth-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 3.5rem; animation: slideRight 0.8s ease; }
        .auth-logo-icon { 
          width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.2);
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .auth-logo-text { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.03em; font-family: 'Outfit', sans-serif; }
        .auth-logo-text span { font-weight: 400; opacity: 0.8; }

        .auth-headline { font-size: 46px; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif; letter-spacing: -0.04em; animation: slideUp 0.8s ease 0.15s both; }
        .auth-subtitle { font-size: 17px; color: rgba(255,255,255,0.7); line-height: 1.7; max-width: 400px; animation: slideUp 0.8s ease 0.3s both; }

        .auth-stats { display: flex; gap: 2.5rem; margin-top: 3.5rem; animation: slideUp 0.8s ease 0.45s both; }
        .auth-stat-num { font-size: 30px; font-weight: 800; color: #fff; font-family: 'Outfit', sans-serif; animation: count-up 1s ease 0.8s both; }
        .auth-stat-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; }

        .auth-features { margin-top: 3rem; display: flex; flex-direction: column; gap: 14px; animation: slideUp 0.8s ease 0.6s both; }
        .auth-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.75); }
        .auth-feature-icon { 
          width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.12); backdrop-filter: blur(4px); flex-shrink: 0; font-size: 13px; color: #fff;
        }

        .auth-right { width: 520px; display: flex; flex-direction: column; justify-content: center; padding: 4rem; background: #fff; animation: fadeIn 0.6s ease; }
        .auth-form-wrap { max-width: 380px; width: 100%; margin: 0 auto; }
        
        .auth-form-title { font-size: 26px; font-weight: 700; color: #1e293b; margin-bottom: 8px; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; animation: slideUp 0.5s ease; }
        .auth-form-sub { font-size: 14px; color: #94a3b8; margin-bottom: 2rem; animation: slideUp 0.5s ease 0.1s both; }

        .auth-google-btn {
          width: 100%; padding: 13px; background: #fff; color: #374151;
          border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 14px;
          font-weight: 600; cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit; animation: slideUp 0.5s ease 0.2s both;
        }
        .auth-google-btn:hover { border-color: #667eea; background: #f8fafc; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

        .auth-divider { display: flex; align-items: center; gap: 16px; margin: 1.75rem 0; animation: fadeIn 0.5s ease 0.3s both; }
        .auth-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .auth-divider-text { font-size: 12px; color: #94a3b8; font-weight: 500; }

        .auth-error {
          padding: 12px 16px; border-radius: 12px; margin-bottom: 1rem;
          background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
          font-size: 13px; font-weight: 500; animation: slideUp 0.3s ease;
        }

        .auth-form { display: flex; flex-direction: column; gap: 14px; animation: slideUp 0.5s ease 0.35s both; }
        
        .auth-input-wrap { position: relative; }
        .auth-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px; transition: color 0.3s; pointer-events: none; z-index: 1; }
        .auth-input {
          width: 100%; padding: 14px 14px 14px 44px; border: 1.5px solid #e2e8f0;
          border-radius: 12px; font-size: 14px; color: #1e293b; background: #fff;
          outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-family: inherit;
        }
        .auth-input:focus { border-color: #667eea; box-shadow: 0 0 0 4px rgba(102,126,234,0.08); }
        .auth-input:focus + .auth-input-icon, .auth-input-wrap:focus-within .auth-input-icon { color: #667eea; }
        .auth-input::placeholder { color: #cbd5e1; }

        .auth-submit-btn {
          width: 100%; padding: 15px; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          background: linear-gradient(135deg, #667eea, #764ba2);
          background-size: 200% 200%; animation: gradient-shift 4s ease infinite;
          color: #fff; transition: all 0.3s; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 15px rgba(102,126,234,0.35);
          margin-top: 6px; position: relative; overflow: hidden;
        }
        .auth-submit-btn::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }
        .auth-submit-btn:hover::after { left: 100%; }
        .auth-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.45); }
        .auth-submit-btn:active { transform: translateY(0); }
        .auth-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .auth-toggle { text-align: center; margin-top: 2rem; font-size: 14px; color: #64748b; animation: fadeIn 0.5s ease 0.5s both; }
        .auth-toggle-btn { background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer; font-size: 14px; font-family: inherit; transition: color 0.2s; }
        .auth-toggle-btn:hover { color: #764ba2; }

        .auth-trust { display: flex; justify-content: center; gap: 20px; margin-top: 2.5rem; animation: fadeIn 0.5s ease 0.6s both; }
        .auth-trust-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #94a3b8; }
        .auth-trust-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

        @media (max-width: 900px) {
          .auth-page { flex-direction: column; }
          .auth-left { padding: 2.5rem; min-height: 40vh; }
          .auth-right { width: 100%; padding: 2.5rem; }
          .auth-headline { font-size: 32px; }
          .auth-stats { gap: 1.5rem; }
          .auth-features { display: none; }
        }
      `}</style>

      <div className="auth-page">
        {/* Left Side — Branding */}
        <div className="auth-left">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
          <div className="auth-orb auth-orb-3" />
          <div className="auth-orb auth-orb-4" />
          
          {/* Subtle grid lines */}
          <div className="auth-grid-line auth-grid-h" style={{ top: '25%' }} />
          <div className="auth-grid-line auth-grid-h" style={{ top: '50%' }} />
          <div className="auth-grid-line auth-grid-h" style={{ top: '75%' }} />
          <div className="auth-grid-line auth-grid-v" style={{ left: '25%' }} />
          <div className="auth-grid-line auth-grid-v" style={{ left: '50%' }} />
          <div className="auth-grid-line auth-grid-v" style={{ left: '75%' }} />

          <div className="auth-left-content">
            <div className="auth-logo">
              <div className="auth-logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="auth-logo-text">Career<span>Pilot</span></div>
            </div>

            <h1 className="auth-headline">Navigate your<br />next career move.</h1>
            <p className="auth-subtitle">
              Track every application, manage recruiter relationships, and leverage AI to accelerate your job search.
            </p>

            <div className="auth-stats">
              {[
                { n: '500+', l: 'Jobs Tracked' },
                { n: '50+', l: 'Companies' },
                { n: 'AI', l: 'Powered' },
              ].map(s => (
                <div key={s.l}>
                  <div className="auth-stat-num">{s.n}</div>
                  <div className="auth-stat-label">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="auth-features">
              {[
                { icon: <FiTrendingUp size={13} />, text: 'Smart application tracking & analytics' },
                { icon: <FiTarget size={13} />, text: 'AI-powered cover letter generation' },
                { icon: <FiAward size={13} />, text: 'Recruiter CRM & follow-up reminders' },
              ].map((f, i) => (
                <div className="auth-feature" key={i}>
                  <div className="auth-feature-icon">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side — Form */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2 className="auth-form-title" key={mode}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="auth-form-sub">
              {mode === 'login' ? 'Sign in to access your dashboard' : 'Get started — it\'s free and takes 30 seconds'}
            </p>

            {/* Google Button */}
            <button className="auth-google-btn" onClick={() => signIn('google', { callbackUrl: '/' })}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or continue with email</span>
              <div className="auth-divider-line" />
            </div>

            {error && <div className="auth-error">{error}</div>}

            {/* Form */}
            <form className="auth-form" onSubmit={handleCredentialsSubmit}>
              {mode === 'signup' && (
                <div className="auth-input-wrap">
                  <input className="auth-input" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
                  <FiUser className="auth-input-icon" />
                </div>
              )}
              <div className="auth-input-wrap">
                <input className="auth-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
                <FiMail className="auth-input-icon" />
              </div>
              <div className="auth-input-wrap">
                <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <FiLock className="auth-input-icon" />
              </div>

              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Please wait...</>
                ) : (
                  <>{mode === 'login' ? 'Sign In' : 'Create Account'}<FiArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="auth-toggle">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button className="auth-toggle-btn" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
                {mode === 'login' ? 'Sign up for free' : 'Sign in'}
              </button>
            </p>

            <div className="auth-trust">
              <div className="auth-trust-item"><div className="auth-trust-dot" /> Secure login</div>
              <div className="auth-trust-item"><div className="auth-trust-dot" /> Data encrypted</div>
              <div className="auth-trust-item"><div className="auth-trust-dot" /> Free forever</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
