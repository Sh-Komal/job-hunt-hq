'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  FiPieChart, FiCpu, FiClipboard, FiBriefcase, FiUsers,
  FiMessageSquare, FiShield, FiLogOut
} from 'react-icons/fi';

import DashboardTab from './components/DashboardTab';
import AITab from './components/AITab';
import TrackerTab from './components/TrackerTab';
import CompaniesTab from './components/CompaniesTab';
import RecruitersTab from './components/RecruitersTab';
import TemplatesTab from './components/TemplatesTab';
import GapTab from './components/GapTab';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [vaultLinks, setVaultLinks] = useState({ resume: '', portfolio: '', github: '', linkedin: '' });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load data on mount (only when authenticated)
  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/jobs').then(r => r.json()).then(data => { if (Array.isArray(data)) setJobs(data); });
    fetch('/api/recruiters').then(r => r.json()).then(data => { if (Array.isArray(data)) setRecruiters(data); });
    try {
      const saved = localStorage.getItem('vaultLinks');
      if (saved) setVaultLinks(JSON.parse(saved));
    } catch (e) {}
  }, [status]);

  // Show loading while checking auth
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', color: 'var(--dim)', fontSize: '14px'
      }}>
        Loading...
      </div>
    );
  }

  const user = session?.user;
  const copyMsg = (txt) => navigator.clipboard.writeText(txt);

  const NavItem = ({ id, icon, label, badge }) => (
    <button className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && <span className="nav-badge">{badge}</span>}
    </button>
  );

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div>Job Hunt <span>HQ</span></div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Main Console</div>
          <NavItem id="dashboard" icon={<FiPieChart />} label="Dashboard" />
          <NavItem id="ai" icon={<FiCpu />} label="AI Assistant" />
          <NavItem id="tracker" icon={<FiClipboard />} label="Job Tracker" badge={jobs.length} />

          <div className="nav-label">Recruitment</div>
          <NavItem id="companies" icon={<FiBriefcase />} label="Companies" />
          <NavItem id="recruiters" icon={<FiUsers />} label="Find Recruiters" />

          <div className="nav-label">Archive</div>
          <NavItem id="messages" icon={<FiMessageSquare />} label="Templates" />
          <NavItem id="gap" icon={<FiShield />} label="Gap Handling" />
        </div>

        {/* Quick Links Vault */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div className="nav-label" style={{ padding: '0 0 10px 0' }}>Quick Links</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '6px' }}>
            {[
              { k: 'resume', label: 'CV / RS', icon: '📄' },
              { k: 'portfolio', label: 'Portfolio', icon: '🌐' },
              { k: 'github', label: 'GitHub', icon: '💻' },
              { k: 'linkedin', label: 'LinkedIn', icon: '🔗' }
            ].map(({ k, label, icon }) => {
              const saved = vaultLinks[k];
              return (
                <button
                  key={k}
                  onClick={() => {
                    if (saved) {
                      copyMsg(saved);
                    } else {
                      const url = window.prompt(`Paste your ${label} URL:`);
                      if (url) {
                        const next = { ...vaultLinks, [k]: url };
                        setVaultLinks(next);
                        localStorage.setItem('vaultLinks', JSON.stringify(next));
                      }
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const url = window.prompt(`Update your ${label} URL:`, saved || '');
                    if (url !== null) {
                      const next = { ...vaultLinks, [k]: url };
                      setVaultLinks(next);
                      localStorage.setItem('vaultLinks', JSON.stringify(next));
                    }
                  }}
                  title={saved ? `Click to copy · Right-click to edit` : `Click to add ${label} URL`}
                  style={{
                    padding: '8px 5px', fontSize: '11px', textAlign: 'center',
                    borderRadius: '8px', cursor: 'pointer',
                    border: `1px solid ${saved ? 'var(--success)' : 'var(--border)'}`,
                    background: saved ? 'rgba(16,185,129,0.08)' : 'var(--surf-light)',
                    color: saved ? 'var(--success)' : 'var(--dim)',
                    fontWeight: 600, transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{icon}</span>
                  <span>{label}</span>
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>{saved ? '✓ copy' : '+ add'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User profile + Sign out */}
        {user && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user.image ? (
              <img src={user.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--primary)' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13px' }}>
                {user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign out"
              style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
            >
              <FiLogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="main">
        {activeTab === 'dashboard' && (
          <DashboardTab jobs={jobs} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'ai' && <AITab />}
        {activeTab === 'tracker' && (
          <TrackerTab jobs={jobs} setJobs={setJobs} />
        )}
        {activeTab === 'companies' && <CompaniesTab />}
        {activeTab === 'recruiters' && (
          <RecruitersTab recruiters={recruiters} setRecruiters={setRecruiters} />
        )}
        {activeTab === 'messages' && <TemplatesTab />}
        {activeTab === 'gap' && <GapTab />}
      </div>
    </div>
  );
}
