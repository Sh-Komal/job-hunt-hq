'use client';

import { FiCpu, FiZap } from 'react-icons/fi';
import { useState } from 'react';

export default function AITab() {
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiType, setAiType] = useState('email');

  const copyMsg = (txt) => navigator.clipboard.writeText(txt);

  const generateAI = async () => {
    if (!aiInput) return alert('Paste a job description first');
    setIsGenerating(true);
    setAiOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: aiInput, type: aiType })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiOutput(data.text);
    } catch (e) {
      alert(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <h1><FiCpu style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> AI Cold Email / Cover Letter Generator</h1>
        <p>Powered by Google Gemini — Paste the Job Description below and let AI map it to your exact experience.</p>
      </div>

      <div className="card">
        <div className="card-title">Job Description</div>
        <textarea
          className="search-box"
          style={{ height: '150px', resize: 'vertical', width: '100%', padding: '12px' }}
          placeholder="Paste the LinkedIn or company job description here..."
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', alignItems: 'center' }}>
          <select value={aiType} onChange={e => setAiType(e.target.value)} style={{ background: 'var(--surf)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0 1rem', borderRadius: '12px', outline: 'none', height: '48px', flex: 1, fontWeight: 600 }}>
            <option value="email">Cold Email</option>
            <option value="cover-letter">Cover Letter</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={generateAI}
            disabled={isGenerating}
            style={isGenerating ? { height: '48px', padding: '0 1.5rem', opacity: 0.7, cursor: 'not-allowed', whiteSpace: 'nowrap' } : { height: '48px', padding: '0 1.5rem', whiteSpace: 'nowrap' }}
          >
            <FiZap /> {isGenerating ? 'Generating...' : 'Generate with Gemini'}
          </button>
        </div>
      </div>

      {aiOutput && (
        <div className="card">
          <div className="card-title">Generated {aiType === 'email' ? 'Email' : 'Cover Letter'}</div>
          <div className="msg-template" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            <button className="copy-btn" onClick={() => copyMsg(aiOutput)}>Copy</button>
            {aiOutput}
          </div>
        </div>
      )}
    </div>
  );
}
