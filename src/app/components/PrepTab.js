'use client';

import { useState, useEffect, useRef } from 'react';
import { FiShield, FiMic, FiSquare, FiPlay, FiTrash2, FiEdit2, FiZap } from 'react-icons/fi';
import { interviewCategories } from '../../lib/interviewData';

function AudioRecorder() {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [recTimer, setRecTimer] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [playingAudio, setPlayingAudio] = useState({});
  const [loadingPlay, setLoadingPlay] = useState({});
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch('/api/recordings').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRecordings(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => setRecTimer(t => t + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      setRecTimer(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          setIsSaving(true);
          const name = recordingName.trim() || `Practice — ${new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
          try {
            const res = await fetch('/api/recordings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, audioData: reader.result, mimeType: 'audio/webm', duration: recTimer })
            });
            const saved = await res.json();
            setRecordings(prev => [saved, ...prev]);
            setRecordingName('');
          } catch (e) { alert('Failed to save recording to database.'); }
          finally { setIsSaving(false); }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true);
    } catch (e) { alert('Microphone access denied. Please allow mic permission in your browser.'); }
  };

  const stopRecording = () => { mediaRef.current?.stop(); setIsRecording(false); };

  const playRecording = async (id) => {
    if (playingAudio[id]) { setPlayingAudio(prev => { const n = { ...prev }; delete n[id]; return n; }); return; }
    setLoadingPlay(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/recordings/${id}`);
      const data = await res.json();
      setPlayingAudio(prev => ({ ...prev, [id]: data.audioData }));
    } catch { alert('Failed to load audio.'); }
    finally { setLoadingPlay(prev => ({ ...prev, [id]: false })); }
  };

  const deleteRec = async (id) => {
    if (!confirm('Delete this recording?')) return;
    try {
      await fetch(`/api/recordings/${id}`, { method: 'DELETE' });
      setRecordings(prev => prev.filter(r => r._id !== id));
      setPlayingAudio(prev => { const n = { ...prev }; delete n[id]; return n; });
    } catch { alert('Failed to delete.'); }
  };

  const renameRec = async (id) => {
    const rec = recordings.find(r => r._id === id);
    const newName = window.prompt('Rename recording:', rec.name);
    if (newName && newName.trim()) {
      try {
        const res = await fetch(`/api/recordings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
        const updated = await res.json();
        setRecordings(prev => prev.map(r => r._id === id ? { ...r, name: updated.name } : r));
      } catch { alert('Failed to rename.'); }
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: 0 }}>
      <div className="card-title" style={{ marginBottom: '1rem' }}><FiMic style={{ marginRight: '6px', color: 'var(--danger)' }} /> Voice Practice Recorder</div>
      <input placeholder="Recording name (optional)..." value={recordingName} onChange={e => setRecordingName(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px 12px', fontSize: '13px', background: 'var(--surf-light)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
      {isSaving ? (
        <button disabled style={{ width: '100%', padding: '10px', background: 'var(--surf-light)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'not-allowed' }}>Saving to database...</button>
      ) : !isRecording ? (
        <button onClick={startRecording} style={{ width: '100%', padding: '10px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><FiMic /> Start Recording</button>
      ) : (
        <button onClick={stopRecording} style={{ width: '100%', padding: '10px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'pulse 1.5s infinite' }}><FiSquare /> Stop · {formatTime(recTimer)}</button>
      )}
      {recordings.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Saved in DB ({recordings.length})</div>
          {recordings.map(rec => (
            <div key={rec._id} style={{ background: 'var(--surf-light)', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '155px' }} title={rec.name}>{rec.name}</div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => renameRec(rec._id)} title="Rename" style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', padding: '2px' }}><FiEdit2 size={12} /></button>
                  <button onClick={() => deleteRec(rec._id)} title="Delete" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px' }}><FiTrash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--dim)', marginBottom: '8px' }}>{new Date(rec.createdAt).toLocaleDateString()} · {rec.duration ? formatTime(rec.duration) : ''}</div>
              {playingAudio[rec._id] ? (
                <audio controls autoPlay src={playingAudio[rec._id]} style={{ width: '100%', height: '28px' }} onEnded={() => setPlayingAudio(prev => { const n = { ...prev }; delete n[rec._id]; return n; })} />
              ) : (
                <button onClick={() => playRecording(rec._id)} disabled={loadingPlay[rec._id]} style={{ width: '100%', padding: '6px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '6px', color: 'var(--primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <FiPlay size={11} /> {loadingPlay[rec._id] ? 'Loading...' : 'Play'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {recordings.length === 0 && !isRecording && !isSaving && (
        <div style={{ fontSize: '12px', color: 'var(--dim)', textAlign: 'center', marginTop: '10px', padding: '8px' }}>Record your answers · saved to your database permanently</div>
      )}
    </div>
  );
}

export default function PrepTab({ prepDone, setPrepDone, prepNotes, setPrepNotes, dsaDone, vaultLinks, syncProgress }) {
  const [prepCategory, setPrepCategory] = useState(interviewCategories[0]?.id || '');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const setPrepStatus = (catId, qi, status) => {
    const key = `${catId}-${qi}`;
    const nextStatus = prepDone[key] === status ? null : status;
    const nextPrep = { ...prepDone, [key]: nextStatus };
    setPrepDone(nextPrep);
    syncProgress(dsaDone, nextPrep, prepNotes, vaultLinks);
  };

  const updatePrepNotes = (catId, qi, note) => {
    const key = `${catId}-${qi}`;
    const nextNotes = { ...prepNotes, [key]: note };
    setPrepNotes(nextNotes);
    syncProgress(dsaDone, prepDone, nextNotes);
  };

  const levelColor = { Basic: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444', 'Situation-Based': '#8b5cf6', 'Decision-Based': '#38bdf8', STAR: '#f97316', HR: '#ec4899' };

  return (
    <div className="page active">
      <div className="page-header">
        <h1><FiShield style={{ color: 'var(--warning)' }} /> Interview Prep</h1>
        <p>Top-rated scripts and structural answers for React &amp; MERN stack interviews.</p>
      </div>

      <div className="neet-layout">
        <div className="neet-main-col">
          {/* Category tabs */}
          <div className="tag-cloud" style={{ marginBottom: '1rem' }}>
            {interviewCategories.map(cat => (
              <button key={cat.id} className={`tag-btn ${prepCategory === cat.id ? 'active' : ''}`} onClick={() => setPrepCategory(cat.id)}>{cat.label}</button>
            ))}
          </div>

          {interviewCategories.filter(c => c.id === prepCategory).map((data) => {
            const doneQs = data.questions.filter((_, qi) => prepDone[`${data.id}-${qi}`] === 'confident').length;
            const pct = (doneQs / Math.max(data.questions.length, 1)) * 100;

            return (
              <div key={data.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{data.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: flashcardMode ? 'var(--primary)' : 'var(--dim)', whiteSpace: 'nowrap' }}>
                      <input type="checkbox" checked={flashcardMode} onChange={(e) => setFlashcardMode(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                      Flashcard Mode
                    </label>
                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>{doneQs}/{data.questions.length} Confident</div>
                      <div className="prog-wrap" style={{ height: '6px' }}><div className="prog-bar" style={{ width: `${pct}%`, background: 'var(--primary)' }}></div></div>
                    </div>
                  </div>
                </div>

                {flashcardMode ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {data.questions.map((q, qi) => {
                      const key = `${data.id}-${qi}`;
                      const isExpanded = expandedAnswers[key];
                      const lvlColor = levelColor[q.level] || 'var(--dim)';
                      const status = prepDone[key];
                      return (
                        <div key={qi} style={{ background: isExpanded ? 'var(--surf)' : 'var(--surf-light)', border: `1px solid ${isExpanded ? lvlColor : 'var(--border)'}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: '180px', boxShadow: isExpanded ? `0 8px 30px ${lvlColor}22` : 'none' }}
                          onClick={() => setExpandedAnswers({ ...expandedAnswers, [key]: !isExpanded })}>
                          {!isExpanded ? (
                            <div style={{ padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                              <div style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '10px', fontWeight: 700, background: lvlColor + '22', color: lvlColor, padding: '2px 8px', borderRadius: '99px' }}>{q.level}</div>
                              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>{q.q}</div>
                              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Click to flip</div>
                            </div>
                          ) : (
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', cursor: 'default' }} onClick={e => e.stopPropagation()}>
                              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}><strong>{q.q}</strong></div>
                              <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: '180px' }}>
                                {(q.points || []).map((pt, pi) => (
                                  <div key={pi} style={{ fontSize: '11px', marginBottom: '6px', lineHeight: '1.5' }}>
                                    <span style={{ color: lvlColor, fontWeight: 700, marginRight: '4px' }}>{pt.label}:</span>
                                    <span style={{ color: 'var(--muted)' }}>{pt.text}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--dim)', marginBottom: '4px', textTransform: 'uppercase' }}>My Notes</div>
                                <textarea placeholder="Personal anchors..." value={prepNotes[key] || ''} onChange={(e) => updatePrepNotes(data.id, qi, e.target.value)}
                                  style={{ width: '100%', height: '50px', background: 'var(--surf2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px', fontSize: '11px', color: 'var(--text)', outline: 'none', resize: 'none' }} />
                              </div>
                              <div style={{ marginTop: '1rem', display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                                <button onClick={() => setPrepStatus(data.id, qi, 'need-work')} className="btn" style={{ flex: 1, padding: '6px', fontSize: '11px', background: status === 'need-work' ? '#ef4444' : 'var(--surf)', color: status === 'need-work' ? '#fff' : 'var(--dim)', border: '1px solid ' + (status === 'need-work' ? '#ef4444' : 'var(--border)') }}>🔴 Work</button>
                                <button onClick={() => setPrepStatus(data.id, qi, 'getting-there')} className="btn" style={{ flex: 1, padding: '6px', fontSize: '11px', background: status === 'getting-there' ? '#f59e0b' : 'var(--surf)', color: status === 'getting-there' ? '#fff' : 'var(--dim)', border: '1px solid ' + (status === 'getting-there' ? '#f59e0b' : 'var(--border)') }}>🟡 Close</button>
                                <button onClick={() => setPrepStatus(data.id, qi, 'confident')} className="btn" style={{ flex: 1, padding: '6px', fontSize: '11px', background: status === 'confident' ? '#10b981' : 'var(--surf)', color: status === 'confident' ? '#fff' : 'var(--dim)', border: '1px solid ' + (status === 'confident' ? '#10b981' : 'var(--border)') }}>🟢 Got it</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.questions.map((q, qi) => {
                      const key = `${data.id}-${qi}`;
                      const isExpanded = expandedAnswers[key];
                      const lvlColor = levelColor[q.level] || 'var(--dim)';
                      const status = prepDone[key];
                      return (
                        <div key={qi} className="qa-card" style={{ margin: 0, paddingLeft: '1rem', borderLeftColor: status === 'confident' ? 'var(--success)' : status === 'need-work' ? '#ef4444' : status === 'getting-there' ? '#f59e0b' : lvlColor }}>
                          <div style={{ padding: '12px 10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedAnswers({ ...expandedAnswers, [key]: !isExpanded })}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '99px', background: lvlColor + '22', color: lvlColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{q.level}</span>
                                {q.structure && <span style={{ fontSize: '10px', color: 'var(--dim)', fontStyle: 'italic' }}>→ {q.structure}</span>}
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: status === 'confident' ? 'var(--dim)' : 'var(--text)' }}>{q.q}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => setPrepStatus(data.id, qi, 'need-work')} title="Need Work" style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: status === 'need-work' ? 'rgba(239,68,68,0.2)' : 'transparent', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: status === 'need-work' ? 1 : 0.3, filter: status === 'need-work' ? '' : 'grayscale(1)' }}>🔴</button>
                              <button onClick={() => setPrepStatus(data.id, qi, 'getting-there')} title="Getting There" style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: status === 'getting-there' ? 'rgba(245,158,11,0.2)' : 'transparent', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: status === 'getting-there' ? 1 : 0.3, filter: status === 'getting-there' ? '' : 'grayscale(1)' }}>🟡</button>
                              <button onClick={() => setPrepStatus(data.id, qi, 'confident')} title="Confident" style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: status === 'confident' ? 'rgba(16,185,129,0.2)' : 'transparent', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: status === 'confident' ? 1 : 0.3, filter: status === 'confident' ? '' : 'grayscale(1)' }}>🟢</button>
                            </div>
                            <div style={{ color: 'var(--dim)', fontSize: '12px', marginLeft: '6px', cursor: 'pointer', padding: '4px' }} onClick={() => setExpandedAnswers({ ...expandedAnswers, [key]: !isExpanded })}>{isExpanded ? '▲' : '▼'}</div>
                          </div>
                          {isExpanded && (
                            <div style={{ padding: '0 10px 15px 30px', animation: 'fadeIn 0.2s' }}>
                              <div style={{ background: 'var(--surf-light)', borderRadius: '10px', borderLeft: `3px solid ${lvlColor}`, overflow: 'hidden' }}>
                                {q.points && q.points.map((pt, pi) => (
                                  <div key={pi} style={{ display: 'flex', gap: '12px', padding: '10px 1.25rem', borderBottom: pi < q.points.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'flex-start' }}>
                                    <div style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: lvlColor + '22', color: lvlColor, fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{pi + 1}</div>
                                    <div style={{ lineHeight: '1.7' }}>
                                      <span style={{ fontSize: '11px', fontWeight: 800, color: lvlColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '6px' }}>{pt.label}:</span>
                                      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{pt.text}</span>
                                    </div>
                                  </div>
                                ))}
                                {!q.points && <div style={{ padding: '1rem', color: 'var(--muted)', fontSize: '13px' }}>{q.a}</div>}
                              </div>
                              <div style={{ marginTop: '1rem' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--dim)', marginBottom: '6px', textTransform: 'uppercase' }}>Personal Anchors &amp; Notes</div>
                                <textarea placeholder="Add your own key phrases or personal experience anchors here..." value={prepNotes[key] || ''} onChange={(e) => updatePrepNotes(data.id, qi, e.target.value)}
                                  style={{ width: '100%', minHeight: '80px', background: 'var(--surf2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '12px', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Side column */}
        <div className="neet-side-col">
          <AudioRecorder />
          <div className="card" style={{ border: '1.5px solid rgba(245,158,11,0.3)', marginTop: 0 }}>
            <div className="card-title" style={{ color: 'var(--warning)' }}>Gap Strategy Script</div>
            <div style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--muted)' }}>
              "Ended in Jan. Since then, intentionally upskilling. Built a high-performance career command center. Ready to contribute."
              <br /><br />
              <strong>Goal:</strong> Zero apologies. Pure forward momentum.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
