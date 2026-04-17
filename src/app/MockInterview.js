'use client';
import { useState, useEffect, useRef } from 'react';
import { FiMic, FiSquare, FiPlay, FiChevronRight, FiChevronLeft, FiCheck, FiX, FiRefreshCw, FiZap, FiSearch, FiShuffle } from 'react-icons/fi';
import { interviewCategories } from '../lib/interviewData';

// ─── Utility ──────────────────────────────────────────────────────────────────
const levelColor = {
  Basic: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444',
  'Situation-Based': '#8b5cf6', 'Decision-Based': '#38bdf8',
  STAR: '#f97316', HR: '#ec4899'
};
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ─── Mini Audio Recorder for Mock ────────────────────────────────────────────
function MiniRecorder({ onSave }) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mr = useRef(null); const chunks = useRef([]); const iv = useRef(null);

  useEffect(() => {
    if (recording) { iv.current = setInterval(() => setElapsed(e => e + 1), 1000); }
    else { clearInterval(iv.current); }
    return () => clearInterval(iv.current);
  }, [recording]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mr.current = rec; chunks.current = [];
      rec.ondataavailable = e => chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (onSave) onSave(url);
        stream.getTracks().forEach(t => t.stop());
      };
      rec.start(); setRecording(true); setAudioUrl(null); setElapsed(0);
    } catch { alert('Mic access denied.'); }
  };
  const stop = () => { mr.current?.stop(); setRecording(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {!recording ? (
        <button onClick={start} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiMic /> Record Answer
        </button>
      ) : (
        <button onClick={stop} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', animation: 'pulse 1.5s infinite' }}>
          <FiSquare /> Stop · {fmtTime(elapsed)}
        </button>
      )}
      {audioUrl && (
        <audio controls src={audioUrl} style={{ width: '100%', height: '32px' }} />
      )}
    </div>
  );
}

// ─── Self-Score Checklist ─────────────────────────────────────────────────────
function SelfScore({ question, onComplete }) {
  const [checked, setChecked] = useState({});
  const total = question.points?.length || 0;
  const score = Object.values(checked).filter(Boolean).length;
  const pct = total ? Math.round((score / total) * 100) : 0;

  const getGrade = () => {
    if (pct >= 80) return { label: 'Excellent', color: '#10b981', emoji: '🏆' };
    if (pct >= 60) return { label: 'Good', color: '#f59e0b', emoji: '👍' };
    if (pct >= 40) return { label: 'Needs Work', color: '#f97316', emoji: '📝' };
    return { label: 'Revise Again', color: '#ef4444', emoji: '🔄' };
  };
  const grade = getGrade();

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      {/* Score ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--surf-light)', borderRadius: '12px', border: `1px solid ${grade.color}44` }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `conic-gradient(${grade.color} ${pct * 3.6}deg, var(--bg) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--surf)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: grade.color }}>{pct}%</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '18px' }}>{grade.emoji} <strong style={{ color: grade.color }}>{grade.label}</strong></div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{score} of {total} key points covered</div>
        </div>
      </div>

      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
        Check the points you actually said:
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
        {(question.points || []).map((pt, pi) => (
          <label key={pi} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', padding: '8px 10px', borderRadius: '8px', background: checked[pi] ? '#10b98112' : 'var(--surf-light)', border: `1px solid ${checked[pi] ? '#10b98133' : 'var(--border)'}`, transition: 'all 0.15s' }}>
            <input type="checkbox" checked={!!checked[pi]} onChange={() => setChecked(c => ({ ...c, [pi]: !c[pi] }))} style={{ marginTop: '2px', accentColor: '#10b981', width: '14px', height: '14px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <span style={{ fontWeight: 700, color: 'var(--text)', marginRight: '5px' }}>{pt.label}:</span>
              <span style={{ color: 'var(--muted)' }}>{pt.text}</span>
            </div>
          </label>
        ))}
      </div>

      <button onClick={() => onComplete({ score, total, pct, grade: grade.label })}
        style={{ width: '100%', padding: '12px', background: grade.color, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
        Next Question →
      </button>
    </div>
  );
}

// ─── Main MockInterview Page ──────────────────────────────────────────────────
export default function MockInterviewPage() {
  const [phase, setPhase] = useState('setup'); // setup | interview | result
  const [selectedCats, setSelectedCats] = useState(['react']);
  const [numQs, setNumQs] = useState(5);
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [timerSec, setTimerSec] = useState(120);
  const [timerOn, setTimerOn] = useState(false);
  const [shown, setShown] = useState('question'); // question | answer
  const [scores, setScores] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const iv = useRef(null);

  // Prep global search state
  const [searchQ, setSearchQ] = useState('');
  const [surpriseQ, setSurpriseQ] = useState(null);

  useEffect(() => {
    if (timerOn && timerSec > 0) { iv.current = setInterval(() => setTimerSec(s => s - 1), 1000); }
    else { clearInterval(iv.current); if (timerSec === 0) setTimerOn(false); }
    return () => clearInterval(iv.current);
  }, [timerOn, timerSec]);

  const allQs = interviewCategories.flatMap(cat =>
    cat.questions.map(q => ({ ...q, catId: cat.id, catLabel: cat.label }))
  );

  const startMock = () => {
    const pool = allQs.filter(q => selectedCats.includes(q.catId));
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(numQs, pool.length));
    setQueue(shuffled);
    setQIdx(0);
    setScores([]);
    setShown('question');
    setTimerSec(120);
    setTimerOn(true);
    setPhase('interview');
    setAudioUrl(null);
  };

  const handleReveal = () => { setShown('answer'); setTimerOn(false); };

  const handleScoreComplete = (scoreData) => {
    const newScores = [...scores, { q: queue[qIdx].q, ...scoreData }];
    setScores(newScores);
    if (qIdx + 1 < queue.length) {
      setQIdx(qIdx + 1);
      setShown('question');
      setTimerSec(120);
      setTimerOn(true);
      setAudioUrl(null);
    } else {
      setPhase('result');
    }
  };

  const handleSurprise = () => {
    const r = allQs[Math.floor(Math.random() * allQs.length)];
    setSurpriseQ(r);
  };

  const toggleCat = (id) => {
    setSelectedCats(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  };

  // ── Filtered search results ──────────────────────────────────────
  const searchResults = searchQ.length > 1
    ? allQs.filter(q => q.q.toLowerCase().includes(searchQ.toLowerCase()))
    : [];

  // ── SETUP SCREEN ─────────────────────────────────────────────────
  if (phase === 'setup') {
    const totalPool = allQs.filter(q => selectedCats.includes(q.catId)).length;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🎭 Mock Interview
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Real-time practice — answer out loud, record, then check your key points.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Category picker */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="card-title" style={{ marginBottom: '1rem' }}>1. Choose Topics</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {interviewCategories.map(cat => (
                  <button key={cat.id} onClick={() => toggleCat(cat.id)} style={{
                    padding: '8px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
                    borderColor: selectedCats.includes(cat.id) ? 'var(--primary)' : 'var(--border)',
                    background: selectedCats.includes(cat.id) ? 'var(--primary-soft)' : 'var(--surf-light)',
                    color: selectedCats.includes(cat.id) ? 'var(--primary)' : 'var(--dim)', transition: 'all 0.15s'
                  }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of questions */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div className="card-title" style={{ marginBottom: '1rem' }}>2. Number of Questions ({numQs})</div>
              <input type="range" min={1} max={Math.min(15, totalPool)} value={numQs} onChange={e => setNumQs(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--dim)', marginTop: '6px' }}>
                <span>1</span><span>{Math.min(15, totalPool)} available</span>
              </div>
            </div>

            {/* Start */}
            <button onClick={startMock} disabled={selectedCats.length === 0}
              style={{ padding: '16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: selectedCats.length ? 1 : 0.5 }}>
              <FiZap /> Start Mock Interview · {numQs} Questions
            </button>
          </div>

          {/* Right — search + surprise */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Surprise Me */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div className="card-title" style={{ marginBottom: '10px' }}>🎲 Surprise Me</div>
              <button onClick={handleSurprise} style={{ width: '100%', padding: '10px', background: 'var(--surf-light)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <FiShuffle /> Random Question
              </button>
              {surpriseQ && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--surf-light)', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--dim)', marginBottom: '4px' }}>{surpriseQ.catLabel} · {surpriseQ.level}</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{surpriseQ.q}</div>
                </div>
              )}
            </div>

            {/* Global Search */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div className="card-title" style={{ marginBottom: '10px' }}><FiSearch /> Search All Questions</div>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search across 59+ questions..."
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', background: 'var(--surf-light)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', outline: 'none' }} />
              {searchResults.length > 0 && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                  {searchResults.map((q, i) => (
                    <div key={i} style={{ padding: '8px 10px', background: 'var(--surf-light)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }}>
                      <div style={{ color: 'var(--dim)', marginBottom: '2px', fontSize: '10px' }}>{q.catLabel} · {q.level}</div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{q.q}</div>
                    </div>
                  ))}
                </div>
              )}
              {searchQ.length > 1 && searchResults.length === 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--dim)', textAlign: 'center' }}>No questions found</div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── INTERVIEW SCREEN ─────────────────────────────────────────────
  if (phase === 'interview') {
    const q = queue[qIdx];
    const lvlClr = levelColor[q.level] || 'var(--dim)';
    const progress = ((qIdx) / queue.length) * 100;
    const urgencyColor = timerSec <= 30 ? '#ef4444' : timerSec <= 60 ? '#f59e0b' : 'var(--primary)';

    return (
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Progress bar */}
        <div style={{ height: '4px', background: 'var(--surf-light)', borderRadius: '2px', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.4s', borderRadius: '2px' }} />
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: lvlClr + '22', color: lvlClr }}>{q.level}</span>
            <span style={{ fontSize: '12px', color: 'var(--dim)' }}>{q.catLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: urgencyColor, fontFamily: 'monospace', minWidth: '60px', textAlign: 'right' }}>{fmtTime(timerSec)}</div>
            <button onClick={() => { setTimerSec(120); setTimerOn(true); }} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--dim)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>+2 min</button>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{qIdx + 1} / {queue.length}</span>
            <button onClick={() => setPhase('setup')} style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: '12px' }}>✕ Exit</button>
          </div>
        </div>

        {shown === 'question' ? (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              → {q.structure}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, lineHeight: '1.4', marginBottom: '2rem', color: 'var(--text)' }}>{q.q}</h2>

            <div style={{ background: 'var(--surf-light)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: '12px', color: 'var(--dim)', marginBottom: '8px', fontWeight: 600 }}>💡 Think about your structure before speaking</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>{q.structure}</div>
            </div>

            <MiniRecorder onSave={url => setAudioUrl(url)} />

            <button onClick={handleReveal} style={{ width: '100%', marginTop: '1.25rem', padding: '14px', background: 'var(--surf-light)', border: '2px solid var(--primary)', borderRadius: '12px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Reveal Reference Answer →
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' }}>{q.q}</h3>
            {audioUrl && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '11px', color: 'var(--dim)', marginBottom: '6px', fontWeight: 700 }}>YOUR RECORDING:</div>
                <audio controls src={audioUrl} style={{ width: '100%', height: '32px' }} />
              </div>
            )}
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Self-Score — Check what you covered:
            </div>
            <SelfScore question={q} onComplete={handleScoreComplete} />
          </div>
        )}
      </div>
    );
  }

  // ── RESULTS SCREEN ────────────────────────────────────────────────
  if (phase === 'result') {
    const totalPct = scores.length ? Math.round(scores.reduce((s, r) => s + r.pct, 0) / scores.length) : 0;
    const getOverall = () => {
      if (totalPct >= 80) return { label: 'Interview Ready! 🏆', color: '#10b981', msg: 'You are covering key points well. Focus on delivery speed next.' };
      if (totalPct >= 60) return { label: 'Almost There 👍', color: '#f59e0b', msg: 'Good foundation. Drill the weaker questions 3 more times each.' };
      return { label: 'Needs More Practice 🔄', color: '#ef4444', msg: 'Review the answer structures and record again tomorrow.' };
    };
    const overall = getOverall();
    const weakQs = scores.filter(s => s.pct < 60).sort((a, b) => a.pct - b.pct);

    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', borderTop: `4px solid ${overall.color}` }}>
          <div style={{ fontSize: '56px', marginBottom: '0.5rem' }}>
            {totalPct >= 80 ? '🏆' : totalPct >= 60 ? '👍' : '🔄'}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: overall.color, marginBottom: '6px' }}>{overall.label}</div>
          <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>{totalPct}%</div>
          <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '1.5rem' }}>{overall.msg}</div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setPhase('setup'); setScores([]); }} style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiRefreshCw /> Practice Again
            </button>
            <button onClick={() => setPhase('setup')} style={{ padding: '12px 24px', background: 'var(--surf-light)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
              Change Topics
            </button>
          </div>
        </div>

        {/* Per question breakdown */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div className="card-title" style={{ marginBottom: '1rem' }}>Question Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scores.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--surf-light)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `conic-gradient(${s.pct >= 80 ? '#10b981' : s.pct >= 60 ? '#f59e0b' : '#ef4444'} ${s.pct * 3.6}deg, var(--bg) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--surf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff' }}>{s.pct}%</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.q}</div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)' }}>{s.score}/{s.total} points · {s.grade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {weakQs.length > 0 && (
          <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="card-title" style={{ color: '#ef4444', marginBottom: '0.75rem' }}>⚠️ Revise These First</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {weakQs.map((s, i) => (
                <div key={i} style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)', fontSize: '13px', fontWeight: 600 }}>
                  {s.q} — <span style={{ color: '#ef4444' }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
