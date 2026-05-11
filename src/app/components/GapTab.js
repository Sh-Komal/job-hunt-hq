'use client';

import { FiZap } from 'react-icons/fi';

export default function GapTab() {
  return (
    <div className="page active">
      <div className="page-header">
        <h1><FiZap style={{ color: 'var(--amber)' }} /> HR Strategy</h1>
        <p>Addressing the gap with confidence and proof-of-work.</p>
      </div>

      <div className="neet-layout">
        <div className="neet-main-col">
          <div className="card">
            <div className="card-title">Verbal Mastery</div>
            <div className="msg-content" style={{ borderLeftColor: 'var(--amber)', color: '#fff', fontStyle: 'italic' }}>
              "Ended in Jan. Since then, intentionally upskilling. Built a high-performance career command center. Ready to contribute."
            </div>
            {[
              { q: 'Why did you leave?', a: '"Natural conclusion. Shipped core features at Avua. Looking for new React challenges."' },
              { q: 'Salary Expectations?', a: '"Based on 2.4yr React exp, looking for market competitive range, but focus is on growth."' },
              { q: 'Tell me about a challenging problem you solved.', a: '"Building the drag-and-drop CV editor at Avua. Users needed to reorder resume sections smoothly. I built a live-preview module using React state and optimized re-renders with useMemo. It drastically reduced user friction."' },
              { q: 'Tell me about a time you improved performance.', a: '"The complex recruiter dashboards were lagging on massive dataloads. I profiled the app, wrapped expensive components in React.memo, and used useCallback for event handlers to prevent deep re-renders. Performance jumped instantly."' },
              { q: 'How do you handle working independently?', a: '"At Avua I owned entire modules end-to-end — from the CV Parser UI to the candidate pipeline structure. I scope my own tasks, build, and ship. I\'m highly comfortable managing my own velocity."' },
            ].map(({ q, a }, i) => (
              <div key={i} className="qa-card" style={{ marginTop: '1.5rem', borderLeftColor: i > 1 ? 'var(--secondary)' : undefined }}>
                <div className="qa-q">{q}</div>
                <div className="qa-a">{a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="neet-side-col">
          <div className="card">
            <div className="card-title">Golden Rules</div>
            <div style={{ fontSize: '13px', color: 'var(--dim)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>1. No Apologies.</strong> Upskilling is a choice.</div>
              <div><strong>2. Show Projects.</strong> Proof &gt; Talk.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
