'use client';

import { FiSend } from 'react-icons/fi';

export default function TemplatesTab() {
  const copyMsg = (txt) => navigator.clipboard.writeText(txt);

  const templates = [
    { t: 'Recruiter Cold Message', c: "Hi [Name], I noticed you recruit for [Company] — I'm a React.js developer with 2.4 years of experience building production features at avua.com... Would love to share my portfolio. Thanks!" },
    { t: 'Alumni / Referral Request', c: "Hey [Name], I see you work at [Company] — I noticed we're both from Kurukshetra University! I'm currently exploring React roles. Would you be open to a referral? Thanks!" },
    { t: 'Direct Founder Outreach', c: "Hi [Name], I noticed [Company] is building incredible things... I'm a React.js developer with 2.4 years experience and would love to chat about your frontend team." }
  ];

  return (
    <div className="page active">
      <div className="page-header">
        <h1><FiSend style={{ color: 'var(--success)' }} /> Outreach Templates</h1>
        <p>Skip the small talk. Use these tested templates to get direct responses.</p>
      </div>

      <div className="neet-layout">
        <div className="neet-main-col">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {templates.map((tpl, i) => (
              <div key={i} className="msg-card">
                <span className="msg-label">{tpl.t}</span>
                <div className="msg-content">
                  <button className="copy-btn-abs" onClick={() => copyMsg(tpl.c)}>Copy</button>
                  {tpl.c}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neet-side-col">
          <div className="card">
            <div className="card-title">Success Rate</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>LinkedIn:</strong> 15% response</div>
              <div><strong>Referrals:</strong> 40% response</div>
              <div style={{ marginTop: '8px', padding: '10px', background: 'var(--primary-soft)', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600 }}>Success Tip: Send voice notes on LinkedIn.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
