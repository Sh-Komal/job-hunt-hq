'use client';

import { useState } from 'react';
import { FiSearch, FiZap, FiEdit2, FiTrash2, FiTarget } from 'react-icons/fi';

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(month, year) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(month, year) { return new Date(year, month, 1).getDay(); }

function calculateStreak(jobs) {
  if (jobs.length === 0) return { current: 0, best: 0 };
  const dates = [...new Set(jobs.map(j => j.date))].sort((a, b) => new Date(b) - new Date(a));
  let current = 0, best = 0, temp = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
  let checkDate = today;
  if (!dates.includes(today) && dates.includes(yesterday)) checkDate = yesterday;
  if (dates.includes(checkDate)) {
    let d = new Date(checkDate);
    while (dates.includes(d.toISOString().split('T')[0])) { current++; d.setDate(d.getDate() - 1); }
  }
  const sortedAsc = [...dates].sort((a, b) => new Date(a) - new Date(b));
  let lastD = null;
  sortedAsc.forEach(dateStr => {
    const d = new Date(dateStr);
    if (lastD) { const diff = (d - lastD) / (1000 * 60 * 60 * 24); if (diff === 1) temp++; else temp = 1; } else temp = 1;
    if (temp > best) best = temp;
    lastD = d;
  });
  return { current, best };
}

export default function TrackerTab({ jobs, setJobs }) {
  const [jTitle, setJTitle] = useState('');
  const [jRole, setJRole] = useState('Frontend Developer');
  const [jSource, setJSource] = useState('LinkedIn');
  const [editJobId, setEditJobId] = useState(null);
  const [editJobCompany, setEditJobCompany] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [selectedTrackerDate, setSelectedTrackerDate] = useState(new Date().toISOString().split('T')[0]);
  const [calDate, setCalDate] = useState(new Date());

  const { current: currentStreak, best: bestStreak } = calculateStreak(jobs);

  const changeMonth = (offset) => {
    const newDate = new Date(calDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCalDate(newDate);
  };

  const addJob = async () => {
    if (!jTitle || !jRole) return alert('Enter company and role');
    const newJob = { company: jTitle, role: jRole, source: jSource, date: getTodayStr() };
    const res = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newJob) });
    const parsed = await res.json();
    setJobs([parsed, ...jobs]);
    setJTitle(''); setJRole('Frontend Developer');
  };

  const updateJobStatus = async (id, val) => {
    setJobs(jobs.map(j => j._id === id ? { ...j, status: val } : j));
    await fetch(`/api/jobs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: val }) });
  };

  const deleteJob = async (id) => {
    setJobs(jobs.filter(j => j._id !== id));
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
  };

  const updateJobCompany = async (id) => {
    if (!editJobCompany.trim()) return;
    setJobs(jobs.map(j => j._id === id ? { ...j, company: editJobCompany } : j));
    setEditJobId(null);
    await fetch(`/api/jobs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ company: editJobCompany }) });
  };

  const filteredTrackerJobs = jobs.filter(j => {
    const matchesSearch = j.company.toLowerCase().includes(jobSearchQuery.toLowerCase()) || j.status.toLowerCase().includes(jobSearchQuery.toLowerCase());
    const matchesDate = !selectedTrackerDate || j.date === selectedTrackerDate;
    if (jobSearchQuery.trim() !== '') return matchesSearch;
    return matchesDate && matchesSearch;
  });

  return (
    <div className="page active">
      <div className="neet-layout" style={{ alignItems: 'start' }}>
        {/* Main column */}
        <div className="neet-main-col">
          <div className="tag-cloud" style={{ marginBottom: '2rem' }}>
            <button className="tag-btn active">Core Track</button>
            <button className="tag-btn">Advanced Radar</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surf-light)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em' }}>Job Tracker 150</h1>
              <p style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '450px' }}>Tracking your daily applications is the key to consistency. Log at least 5 jobs today.</p>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[
                { label: 'Applied', val: jobs.filter(j => j.status === 'Applied').length, c: 'var(--success)' },
                { label: 'Interviews', val: jobs.filter(j => j.status === 'Interview').length, c: 'var(--warning)' },
                { label: 'Offers', val: jobs.filter(j => j.status === 'Offer').length, c: 'var(--primary)' },
              ].map(({ label, val, c }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: c }}>{val}</div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="neet-search-wrap" style={{ position: 'relative' }}>
            <input className="neet-search-input" placeholder="Search jobs by company, role, or status..." value={jobSearchQuery} onChange={(e) => setJobSearchQuery(e.target.value)} />
            <FiSearch style={{ position: 'absolute', right: '14px', top: '14px', color: 'var(--muted)' }} />
          </div>

          {/* Filter tags */}
          <div className="tag-cloud">
            {['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(tag => (
              <button key={tag} className={`tag-btn ${jobSearchQuery === tag ? 'active' : ''}`} onClick={() => setJobSearchQuery(tag === 'All' ? '' : tag)}>{tag}</button>
            ))}
          </div>

          {/* Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '320px' }}>
            <table className="neet-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrackerJobs.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>{jobSearchQuery ? 'No matching applications found.' : 'No applications found for this date. Go apply or pick another date!'}</td></tr>
                ) : (
                  filteredTrackerJobs.map((j, i) => (
                    <tr key={j._id}>
                      <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>
                        {editJobId === j._id ? (
                          <input value={editJobCompany} onChange={(e) => setEditJobCompany(e.target.value)}
                            style={{ background: 'var(--surf)', border: '1px solid var(--primary)', color: 'var(--text)', padding: '4px 8px', borderRadius: '4px', outline: 'none', fontSize: '14px', width: '100%' }}
                            autoFocus onKeyDown={(e) => e.key === 'Enter' && updateJobCompany(j._id)} />
                        ) : j.company}
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{j.role}</td>
                      <td><span style={{ fontSize: '11px', background: 'var(--surf2)', padding: '2px 6px', borderRadius: '4px' }}>{j.source}</span></td>
                      <td>
                        <select value={j.status} onChange={(e) => updateJobStatus(j._id, e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: j.status === 'Offer' ? 'var(--success)' : j.status === 'Rejected' ? 'var(--danger)' : 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                          {['Applied', 'Screening', 'Interview', 'Rejected', 'Offer', 'Ghosted'].map(s => <option key={s} value={s} style={{ background: 'var(--surf)' }}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {editJobId === j._id ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button onClick={() => updateJobCompany(j._id)} style={{ background: 'var(--success)', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Save</button>
                            <button onClick={() => setEditJobId(null)} style={{ background: 'var(--surf2)', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Cancel</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button onClick={() => { setEditJobId(j._id); setEditJobCompany(j.company); }} style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', padding: '2px' }} title="Edit"><FiEdit2 size={14} /></button>
                            <button onClick={() => deleteJob(j._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px' }} title="Delete"><FiTrash2 size={14} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add job form */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <div className="card-title">Log New Application</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="input-group">
                <div className="input-label">Company Name</div>
                <input placeholder="Uber, Google, etc." value={jTitle} onChange={(e) => setJTitle(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-label">Role</div>
                <input placeholder="Frontend Developer" value={jRole} onChange={(e) => setJRole(e.target.value)} />
              </div>
              <div className="input-group">
                <div className="input-label">Source</div>
                <select value={jSource} onChange={(e) => setJSource(e.target.value)}>
                  {['LinkedIn', 'Indeed', 'Naukri', 'Wellfound', 'Direct'].map(s => <option key={s} value={s} style={{ background: 'var(--surf)' }}>{s}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={addJob} style={{ width: '200px', height: '48px' }}>
              <FiZap /> Add to Trackers
            </button>
          </div>
        </div>

        {/* Side column */}
        <div className="neet-side-col">
          {/* Calendar */}
          <div className="neet-calendar">
            <div className="neet-cal-header">
              <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>←</button>
              <span>{calDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>→</button>
            </div>
            <div className="neet-cal-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={`wd-${i}`} className="neet-cal-weekday">{d}</div>)}
              {Array.from({ length: getFirstDayOfMonth(calDate.getMonth(), calDate.getFullYear()) }).map((_, i) => <div key={`empty-${i}`} className="neet-cal-day other-month" />)}
              {Array.from({ length: getDaysInMonth(calDate.getMonth(), calDate.getFullYear()) }).map((_, i) => {
                const day = i + 1;
                const dObj = new Date(calDate.getFullYear(), calDate.getMonth(), day);
                const dStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
                const now = new Date();
                const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const isToday = dStr === today;
                const isSelected = dStr === selectedTrackerDate;
                const hasApplied = jobs.some(j => j.date === dStr);
                const isMissed = !hasApplied && dStr < today;
                return (
                  <div key={day} className={`neet-cal-day ${isToday ? 'today' : ''} ${isSelected ? 'active' : ''} ${hasApplied ? 'applied' : ''} ${isMissed ? 'missed' : ''}`}
                    onClick={() => setSelectedTrackerDate(dStr)}
                    title={hasApplied ? `${jobs.filter(j => j.date === dStr).length} application(s)` : isMissed ? 'No applications' : ''}>
                    {day}
                    {hasApplied && !isSelected && <span className="cal-icon">✓</span>}
                    {isMissed && !isSelected && <span className="cal-icon">✗</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Streak */}
          <div className="streak-grid-mini">
            <div className="streak-box">
              <div className="streak-label">Current Streak</div>
              <div className="streak-val-wrap">
                <FiZap className="streak-icon" style={{ color: 'var(--warning)' }} />
                <div className="streak-val">{currentStreak} days</div>
              </div>
            </div>
            <div className="streak-box">
              <div className="streak-label">Best Streak</div>
              <div className="streak-val-wrap">
                <FiTarget className="streak-icon" style={{ color: 'var(--primary)' }} />
                <div className="streak-val">{bestStreak} days</div>
              </div>
            </div>
          </div>

          {/* Daily target */}
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--danger)', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', marginTop: '1.5rem', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Daily Activity Target</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--danger)', marginRight: '10px', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>❤</span>
                  {jobs.filter(j => j.date === getTodayStr()).length} / 5 Applied
                </div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dim)', background: 'var(--surf)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                {Math.max(0, 5 - jobs.filter(j => j.date === getTodayStr()).length)} to next heart
              </div>
            </div>
            <div style={{ height: '14px', background: 'var(--surf2)', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (jobs.filter(j => j.date === getTodayStr()).length / 5) * 100)}%`, background: 'var(--danger)', borderRadius: '7px', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--warning)', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <FiZap style={{ fontSize: '14px' }} /> Apply to at least 5 jobs today to maintain your hot streak!
            </div>
          </div>

          {/* Level */}
          <div className="card" style={{ marginTop: '1.25rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏅</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Global Ranking</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Top 12.5% this week</div>
              </div>
            </div>
            <div style={{ height: '40px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '65%', background: 'var(--primary)', opacity: 0.3 }}></div>
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>LEVEL 4 APPLICANT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
