'use client';

import { useState } from 'react';
import { FiBriefcase, FiSearch, FiRadio } from 'react-icons/fi';

const companies = [
  { name: 'Razorpay', type: 'Fintech · Startup', logo: 'R', tags: ['React', 'TypeScript', 'Node.js'], search: 'razorpay tech recruiter', jobs: 'razorpay.com/jobs' },
  { name: 'Zepto', type: 'Quick Commerce · Startup', logo: 'Z', tags: ['React', 'Redux', 'Next.js'], search: 'zepto tech recruiter', jobs: 'zepto.in/careers' },
  { name: 'Groww', type: 'Fintech · Startup', logo: 'G', tags: ['React', 'TypeScript'], search: 'groww tech recruiter', jobs: 'groww.in/careers' },
  { name: 'CRED', type: 'Fintech · Startup', logo: 'C', tags: ['React', 'TypeScript', 'Redux'], search: 'cred tech recruiter', jobs: 'careers.cred.club' },
  { name: 'BrowserStack', type: 'DevTools · Mid-size', logo: 'B', tags: ['React', 'JavaScript', 'Testing'], search: 'browserstack recruiter', jobs: 'browserstack.com/careers' },
  { name: 'Postman', type: 'DevTools · Mid-size', logo: 'P', tags: ['React', 'TypeScript', 'APIs'], search: 'postman recruiter', jobs: 'postman.com/careers' },
  { name: 'Freshworks', type: 'SaaS · Large', logo: 'F', tags: ['React', 'JavaScript', 'Node.js'], search: 'freshworks recruiter', jobs: 'freshworks.com/jobs' },
  { name: 'Zoho', type: 'SaaS · Large', logo: 'Z', tags: ['JavaScript', 'React'], search: 'zoho recruiter', jobs: 'careers.zoho.com' },
  { name: 'Meesho', type: 'E-commerce · Startup', logo: 'M', tags: ['React', 'TypeScript', 'Next.js'], search: 'meesho tech recruiter', jobs: 'meesho.io/careers' },
  { name: 'PhonePe', type: 'Fintech · Large', logo: 'P', tags: ['React', 'TypeScript', 'Redux'], search: 'phonepe tech recruiter', jobs: 'phonepe.com/careers' },
  { name: 'Swiggy', type: 'Food Tech · Large', logo: 'S', tags: ['React', 'JavaScript', 'Node.js'], search: 'swiggy tech recruiter', jobs: 'careers.swiggy.com' },
  { name: 'Zomato', type: 'Food Tech · Large', logo: 'Z', tags: ['React', 'TypeScript'], search: 'zomato tech recruiter', jobs: 'zomato.com/careers' },
  { name: 'Flipkart', type: 'E-commerce · Large', logo: 'F', tags: ['React', 'JavaScript'], search: 'flipkart tech recruiter', jobs: 'flipkart.com/careers' },
  { name: 'Atlassian', type: 'DevTools · Large', logo: 'A', tags: ['React', 'TypeScript', 'Node.js'], search: 'atlassian recruiter', jobs: 'atlassian.com/company/careers' },
  { name: 'Notion', type: 'Productivity · Startup', logo: 'N', tags: ['React', 'TypeScript'], search: 'notion recruiter', jobs: 'notion.com/careers' },
  { name: 'Lenskart', type: 'D2C · Startup', logo: 'L', tags: ['React', 'JavaScript'], search: 'lenskart tech recruiter', jobs: 'lenskart.com/jobs' },
  { name: 'Urban Company', type: 'Services · Startup', logo: 'U', tags: ['React', 'TypeScript'], search: 'urbancompany recruiter', jobs: 'urbancompany.com/careers' },
  { name: 'slice', type: 'Fintech · Startup', logo: 'S', tags: ['React', 'JavaScript'], search: 'slice fintech recruiter', jobs: 'sliceit.in/careers' },
  { name: 'Jupiter', type: 'Fintech · Startup', logo: 'J', tags: ['React', 'TypeScript', 'Node.js'], search: 'jupiter money recruiter', jobs: 'jupiter.money/careers' },
  { name: 'Juspay', type: 'Payments · Startup', logo: 'J', tags: ['React', 'JavaScript'], search: 'juspay recruiter', jobs: 'juspay.in/careers' },
];

export default function CompaniesTab() {
  const [coSearch, setCoSearch] = useState('');

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(coSearch.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(coSearch.toLowerCase()))
  );

  return (
    <div className="page active">
      <div className="page-header">
        <h1><FiBriefcase style={{ color: 'var(--primary)' }} /> Target Companies</h1>
        <p>Top companies that hire React devs regularly. Target the high-growth ones first.</p>
      </div>

      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search high-priority companies..." className="neet-search-input" value={coSearch} onChange={(e) => setCoSearch(e.target.value)} />
      </div>

      <div className="comp-grid">
        {filteredCompanies.map((c, i) => (
          <div key={i} className="comp-card">
            <div className="comp-logo">{c.logo}</div>
            <div className="comp-name">{c.name}</div>
            <div className="comp-meta">{c.type}</div>
            <div className="comp-tags">
              {c.tags.map(t => <span key={t} className="comp-tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <a className="tag-btn flex-center" style={{ flex: 1, textDecoration: 'none' }} href={`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.search)}`} target="_blank" rel="noreferrer">Recruiters</a>
              <a className="tag-btn active flex-center" style={{ flex: 1, textDecoration: 'none' }} href={`https://${c.jobs}`} target="_blank" rel="noreferrer">Jobs</a>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', border: '1px solid var(--primary)', maxWidth: '800px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiRadio style={{ color: 'var(--primary)', fontSize: '20px' }} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Execution Strategy</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: '1.6' }}>
            Standard applications fail. Find 3 recruiters from these companies and send them a <strong>LinkedIn Voice Note</strong>. 90% of candidates just click 'Apply' and hope. Be the 10%.
          </div>
        </div>
      </div>
    </div>
  );
}
