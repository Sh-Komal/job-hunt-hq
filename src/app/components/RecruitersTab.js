'use client';

import { useState } from 'react';
import { FiUsers, FiZap } from 'react-icons/fi';

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function RecruitersTab({ recruiters, setRecruiters }) {
  const [rName, setRName] = useState('');
  const [rCompany, setRCompany] = useState('');
  const [rType, setRType] = useState('Recruiter');

  const addRecruiter = async () => {
    if (!rName || !rCompany) return;
    const newR = { name: rName, company: rCompany, type: rType, date: getTodayStr() };
    const res = await fetch('/api/recruiters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newR) });
    const parsed = await res.json();
    setRecruiters([parsed, ...recruiters]);
    setRName(''); setRCompany('');
  };

  const deleteRecruiter = async (id) => {
    setRecruiters(recruiters.filter(r => r._id !== id));
    await fetch(`/api/recruiters/${id}`, { method: 'DELETE' });
  };

  return (
    <div className="page active">
      <div className="page-header">
        <h1><FiUsers style={{ color: 'var(--primary)' }} /> CRM Outreach</h1>
        <p>Track your conversations with recruiters and hiring managers.</p>
      </div>

      <div className="neet-layout">
        <div className="neet-main-col">
          <div className="card">
            <div className="card-title">Contact Database</div>
            {recruiters.length === 0 ? (
              <div className="empty" style={{ padding: '3rem 0' }}>No connections logged. Start with LinkedIn Outreach.</div>
            ) : (
              <table className="neet-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.company}</td>
                      <td><span className="tag-btn active" style={{ fontSize: '10px', padding: '2px 8px' }}>{r.type}</span></td>
                      <td style={{ color: 'var(--dim)', fontSize: '12px' }}>{r.date}</td>
                      <td style={{ textAlign: 'right' }}><button className="btn-secondary" style={{ padding: '4px 8px', borderRadius: '6px' }} onClick={() => deleteRecruiter(r._id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="neet-side-col">
          <div className="card">
            <div className="card-title">Log New Outreach</div>
            <div className="input-group">
              <div className="input-label">Recruiter Name</div>
              <input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="e.g. Priya Sharma" />
            </div>
            <div className="input-group">
              <div className="input-label">Company</div>
              <input value={rCompany} onChange={(e) => setRCompany(e.target.value)} placeholder="e.g. Razorpay" />
            </div>
            <div className="input-group">
              <div className="input-label">Type</div>
              <select value={rType} onChange={(e) => setRType(e.target.value)}>
                <option>Recruiter</option>
                <option>Alumni Referral</option>
                <option>Direct Connection</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={addRecruiter}>+ Register Log</button>
          </div>
        </div>
      </div>
    </div>
  );
}
