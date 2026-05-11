'use client';

import { FiPieChart, FiLayers, FiActivity, FiTarget, FiZap, FiCheckCircle, FiRadio } from 'react-icons/fi';
import { useSession } from 'next-auth/react';


function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function daysSince(dateStr) {
  const d = new Date(dateStr), now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

export default function DashboardTab({ jobs, setActiveTab }) {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page active">
      <div className="page-header">
        <h1>Welcome, {firstName} 👋</h1>
        <p>You've tracked {jobs.filter(j => j.date === getTodayStr()).length} applications today. Stay consistent, results will follow.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', borderTop: '4px solid var(--primary)', position: 'relative', overflow: 'hidden', marginBottom: 0 }}>
            <FiLayers style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '100px', color: 'var(--primary)', opacity: 0.05 }} />
            <div className="card-title" style={{ marginBottom: '0.75rem' }}>Total Applications</div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--text)' }}>{jobs.length}</div>
            <div style={{ fontSize: '13px', color: 'var(--dim)', marginTop: '6px' }}>Lifetime applications tracked</div>
          </div>
          <div className="card" style={{ padding: '2rem 1.5rem', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', borderTop: '4px solid var(--secondary)', position: 'relative', overflow: 'hidden', marginBottom: 0 }}>
            <FiActivity style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '100px', color: 'var(--secondary)', opacity: 0.05 }} />
            <div className="card-title" style={{ marginBottom: '0.75rem' }}>Today's Progress</div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--text)' }}>{jobs.filter(j => j.date === getTodayStr()).length}</div>
            <div style={{ fontSize: '13px', color: 'var(--dim)', marginTop: '6px' }}>New applications sent today</div>
          </div>
        </div>



        {/* Bottom 3-col row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Col 1: Status + AI CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title"><FiPieChart /> Application Status</div>
              <div style={{ display: 'flex', gap: '4px', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem', background: 'var(--surf-light)' }}>
                <div style={{ width: `${Math.max((jobs.length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--secondary)' }}></div>
                <div style={{ width: `${Math.max((jobs.filter(j => ['Screening', 'Interview', 'Offer'].includes(j.status)).length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--warning)' }}></div>
                <div style={{ width: `${Math.max((jobs.filter(j => j.status === 'Offer').length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--success)' }}></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { l: 'Applied', v: jobs.length, c: 'var(--secondary)' },
                  { l: 'Interview', v: jobs.filter(j => j.status === 'Interview').length, c: 'var(--primary)' },
                  { l: 'Offers', v: jobs.filter(j => j.status === 'Offer').length, c: 'var(--success)' }
                ].map(s => (
                  <div key={s.l} style={{ padding: '10px', background: 'var(--surf-light)', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--dim)', marginBottom: '4px' }}>{s.l}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: s.c }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))', border: 'none', color: '#fff', marginBottom: 0 }}>
              <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Auto-Generate Cover Letter</div>
              <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '1.25rem' }}>Map your resume directly to a job description.</p>
              <button className="btn" style={{ background: '#fff', color: 'var(--secondary)', width: '100%', padding: '12px', fontWeight: '800', borderRadius: '12px', transition: '0.2s', cursor: 'pointer' }} onClick={() => setActiveTab('ai')}>Launch AI Tool</button>
            </div>
          </div>

          {/* Col 2: Daily Goals */}
          <div className="card" style={{ marginBottom: 0, height: '100%' }}>
            <div className="card-title"><FiTarget /> Your Daily Goal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { l: 'LinkedIn Outreach', d: 'DM 10 first-degree recruiters', done: true },
                { l: 'Apply Today', d: 'Apply to at least 15 new roles', done: false },
                { l: 'Follow Up', d: 'Check 3-day & 7-day applications', done: false }
              ].map((obj, i) => (
                <div key={i} style={{ padding: '12px', background: 'var(--surf-light)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '2px solid var(--border)', background: obj.done ? 'var(--primary)' : 'transparent', flexShrink: 0 }} className="flex-center">
                    {obj.done && <FiCheckCircle style={{ fontSize: '12px', color: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: obj.done ? 'var(--dim)' : 'var(--text)', marginBottom: '2px' }}>{obj.l}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{obj.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Follow-up Reminders */}
          <div className="card" style={{ marginBottom: 0, height: '100%' }}>
            <div className="card-title"><FiRadio /> Follow-up Reminders</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {jobs.filter(j => (daysSince(j.date) === 3 || daysSince(j.date) === 7) && j.status === 'Applied').length > 0 ? (
                jobs.filter(j => (daysSince(j.date) === 3 || daysSince(j.date) === 7) && j.status === 'Applied').slice(0, 5).map(j => (
                  <div key={j._id} style={{ padding: '14px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '12px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{j.company}</strong>
                    <span style={{ fontSize: '11px', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '99px', fontWeight: 'bold' }}>Day {daysSince(j.date)}</span>
                  </div>
                ))
              ) : (
                <div className="empty" style={{ padding: '3rem 1rem' }}>No urgent follow-ups today.<br />Keep applying!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
