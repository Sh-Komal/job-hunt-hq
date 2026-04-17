'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FiPieChart, FiRadio, FiCpu, FiClipboard, FiBriefcase, FiUsers, 
  FiZap, FiTerminal, FiMessageSquare, FiShield,
  FiTarget, FiInbox, FiSearch, FiDollarSign, FiCalendar, FiSend, FiGlobe, FiMapPin, FiCheckCircle,
  FiLayers, FiActivity, FiMic, FiSquare, FiPlay, FiTrash2, FiEdit2, FiShuffle
} from 'react-icons/fi';
import { interviewCategories } from '../lib/interviewData';
import MockInterviewPage from './MockInterview';

function AudioRecorder() {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [recTimer, setRecTimer] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [playingAudio, setPlayingAudio] = useState({}); // { [id]: base64 }
  const [loadingPlay, setLoadingPlay] = useState({}); // { [id]: bool }
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);

  // Load recordings list from DB on mount
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

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

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
          const name = recordingName.trim() || `Practice — ${new Date().toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}`;
          try {
            const res = await fetch('/api/recordings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, audioData: reader.result, mimeType: 'audio/webm', duration: recTimer })
            });
            const saved = await res.json();
            setRecordings(prev => [saved, ...prev]);
            setRecordingName('');
          } catch(e) { alert('Failed to save recording to database.'); }
          finally { setIsSaving(false); }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setIsRecording(true);
    } catch(e) { alert('Microphone access denied. Please allow mic permission in your browser.'); }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setIsRecording(false);
  };

  const playRecording = async (id) => {
    // If already loaded, toggle (let browser audio player handle it)
    if (playingAudio[id]) {
      setPlayingAudio(prev => { const n = {...prev}; delete n[id]; return n; });
      return;
    }
    setLoadingPlay(prev => ({...prev, [id]: true}));
    try {
      const res = await fetch(`/api/recordings/${id}`);
      const data = await res.json();
      setPlayingAudio(prev => ({...prev, [id]: data.audioData}));
    } catch { alert('Failed to load audio.'); }
    finally { setLoadingPlay(prev => ({...prev, [id]: false})); }
  };

  const deleteRec = async (id) => {
    if (!confirm('Delete this recording?')) return;
    try {
      await fetch(`/api/recordings/${id}`, { method: 'DELETE' });
      setRecordings(prev => prev.filter(r => r._id !== id));
      setPlayingAudio(prev => { const n = {...prev}; delete n[id]; return n; });
    } catch { alert('Failed to delete.'); }
  };

  const renameRec = async (id) => {
    const rec = recordings.find(r => r._id === id);
    const newName = window.prompt('Rename recording:', rec.name);
    if (newName && newName.trim()) {
      try {
        const res = await fetch(`/api/recordings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
        const updated = await res.json();
        setRecordings(prev => prev.map(r => r._id === id ? {...r, name: updated.name} : r));
      } catch { alert('Failed to rename.'); }
    }
  };

  return (
    <div className="card" style={{padding: '1.25rem', marginBottom: 0}}>
      <div className="card-title" style={{marginBottom: '1rem'}}><FiMic style={{marginRight: '6px', color: 'var(--danger)'}}/> Voice Practice Recorder</div>

      <input
        placeholder="Recording name (optional)..."
        value={recordingName}
        onChange={e => setRecordingName(e.target.value)}
        style={{width: '100%', marginBottom: '10px', padding: '8px 12px', fontSize: '13px', background: 'var(--surf-light)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)'}}
      />

      {isSaving ? (
        <button disabled style={{width: '100%', padding: '10px', background: 'var(--surf-light)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'not-allowed'}}>
          Saving to database...
        </button>
      ) : !isRecording ? (
        <button onClick={startRecording} style={{width: '100%', padding: '10px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
          <FiMic/> Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={{width: '100%', padding: '10px', background: 'var(--success)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'pulse 1.5s infinite'}}>
          <FiSquare/> Stop · {formatTime(recTimer)}
        </button>
      )}

      {recordings.length > 0 && (
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <div style={{fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px'}}>
            Saved in DB ({recordings.length})
          </div>
          {recordings.map(rec => (
            <div key={rec._id} style={{background: 'var(--surf-light)', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--border)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px'}}>
                <div style={{fontSize: '12px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '155px'}} title={rec.name}>{rec.name}</div>
                <div style={{display: 'flex', gap: '6px', flexShrink: 0}}>
                  <button onClick={() => renameRec(rec._id)} title="Rename" style={{background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', padding: '2px'}}><FiEdit2 size={12}/></button>
                  <button onClick={() => deleteRec(rec._id)} title="Delete" style={{background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '2px'}}><FiTrash2 size={12}/></button>
                </div>
              </div>
              <div style={{fontSize: '10px', color: 'var(--dim)', marginBottom: '8px'}}>
                {new Date(rec.createdAt).toLocaleDateString()} · {rec.duration ? formatTime(rec.duration) : ''}
              </div>
              {playingAudio[rec._id] ? (
                <audio controls autoPlay src={playingAudio[rec._id]} style={{width: '100%', height: '28px'}} onEnded={() => setPlayingAudio(prev => { const n = {...prev}; delete n[rec._id]; return n; })}/>
              ) : (
                <button onClick={() => playRecording(rec._id)} disabled={loadingPlay[rec._id]} style={{width: '100%', padding: '6px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '6px', color: 'var(--primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
                  <FiPlay size={11}/> {loadingPlay[rec._id] ? 'Loading...' : 'Play'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {recordings.length === 0 && !isRecording && !isSaving && (
        <div style={{fontSize: '12px', color: 'var(--dim)', textAlign: 'center', marginTop: '10px', padding: '8px'}}>
          Record your answers · saved to your database permanently
        </div>
      )}
    </div>
  );
}

const companies = [
  {name:'Razorpay',type:'Fintech · Startup',logo:'R',tags:['React','TypeScript','Node.js'],search:'razorpay tech recruiter',jobs:'razorpay.com/jobs'},
  {name:'Zepto',type:'Quick Commerce · Startup',logo:'Z',tags:['React','Redux','Next.js'],search:'zepto tech recruiter',jobs:'zepto.in/careers'},
  {name:'Groww',type:'Fintech · Startup',logo:'G',tags:['React','TypeScript'],search:'groww tech recruiter',jobs:'groww.in/careers'},
  {name:'CRED',type:'Fintech · Startup',logo:'C',tags:['React','TypeScript','Redux'],search:'cred tech recruiter',jobs:'careers.cred.club'},
  {name:'BrowserStack',type:'DevTools · Mid-size',logo:'B',tags:['React','JavaScript','Testing'],search:'browserstack recruiter',jobs:'browserstack.com/careers'},
  {name:'Postman',type:'DevTools · Mid-size',logo:'P',tags:['React','TypeScript','APIs'],search:'postman recruiter',jobs:'postman.com/careers'},
  {name:'Freshworks',type:'SaaS · Large',logo:'F',tags:['React','JavaScript','Node.js'],search:'freshworks recruiter',jobs:'freshworks.com/jobs'},
  {name:'Zoho',type:'SaaS · Large',logo:'Z',tags:['JavaScript','React'],search:'zoho recruiter',jobs:'careers.zoho.com'},
  {name:'Meesho',type:'E-commerce · Startup',logo:'M',tags:['React','TypeScript','Next.js'],search:'meesho tech recruiter',jobs:'meesho.io/careers'},
  {name:'PhonePe',type:'Fintech · Large',logo:'P',tags:['React','TypeScript','Redux'],search:'phonepe tech recruiter',jobs:'phonepe.com/careers'},
  {name:'Swiggy',type:'Food Tech · Large',logo:'S',tags:['React','JavaScript','Node.js'],search:'swiggy tech recruiter',jobs:'careers.swiggy.com'},
  {name:'Zomato',type:'Food Tech · Large',logo:'Z',tags:['React','TypeScript'],search:'zomato tech recruiter',jobs:'zomato.com/careers'},
  {name:'Flipkart',type:'E-commerce · Large',logo:'F',tags:['React','JavaScript'],search:'flipkart tech recruiter',jobs:'flipkart.com/careers'},
  {name:'Atlassian',type:'DevTools · Large',logo:'A',tags:['React','TypeScript','Node.js'],search:'atlassian recruiter',jobs:'atlassian.com/company/careers'},
  {name:'Notion',type:'Productivity · Startup',logo:'N',tags:['React','TypeScript'],search:'notion recruiter',jobs:'notion.com/careers'},
  {name:'Lenskart',type:'D2C · Startup',logo:'L',tags:['React','JavaScript'],search:'lenskart tech recruiter',jobs:'lenskart.com/jobs'},
  {name:'Urban Company',type:'Services · Startup',logo:'U',tags:['React','TypeScript'],search:'urbancompany recruiter',jobs:'urbancompany.com/careers'},
  {name:'slice',type:'Fintech · Startup',logo:'S',tags:['React','JavaScript'],search:'slice fintech recruiter',jobs:'sliceit.in/careers'},
  {name:'Jupiter',type:'Fintech · Startup',logo:'J',tags:['React','TypeScript','Node.js'],search:'jupiter money recruiter',jobs:'jupiter.money/careers'},
  {name:'Juspay',type:'Payments · Startup',logo:'J',tags:['React','JavaScript'],search:'juspay recruiter',jobs:'juspay.in/careers'},
];

const dsaQuestions=[
  {n:1,name:'Two Sum',diff:'easy'},{n:2,name:'Best Time to Buy/Sell Stock',diff:'easy'},{n:3,name:'Contains Duplicate',diff:'easy'},{n:4,name:'Product of Array Except Self',diff:'med'},{n:5,name:'Maximum Subarray (Kadane\'s)',diff:'med'},{n:6,name:'Longest Substring Without Repeat',diff:'med'},{n:7,name:'Valid Anagram',diff:'easy'},{n:8,name:'Group Anagrams',diff:'med'},{n:9,name:'Trapping Rain Water',diff:'hard'},{n:10,name:'Rotate Array',diff:'med'},{n:11,name:'3Sum',diff:'med'},{n:12,name:'Container With Most Water',diff:'med'},{n:13,name:'Minimum Window Substring',diff:'hard'},{n:14,name:'Sliding Window Maximum',diff:'hard'},{n:15,name:'Permutation in String',diff:'med'},{n:16,name:'Longest Repeating Char Replacement',diff:'med'},{n:17,name:'Valid Parentheses',diff:'easy'},{n:18,name:'Min Stack',diff:'med'},{n:19,name:'Daily Temperatures',diff:'med'},{n:20,name:'Evaluate Reverse Polish Notation',diff:'med'},{n:21,name:'Implement Queue Using Stacks',diff:'easy'},{n:22,name:'Binary Search',diff:'easy'},{n:23,name:'Find Min in Rotated Sorted Array',diff:'med'},{n:24,name:'Search in Rotated Sorted Array',diff:'med'},{n:25,name:'Koko Eating Bananas',diff:'med'},{n:26,name:'Reverse Linked List',diff:'easy'},{n:27,name:'Merge Two Sorted Lists',diff:'easy'},{n:28,name:'Linked List Cycle',diff:'easy'},{n:29,name:'Remove Nth Node From End',diff:'med'},{n:30,name:'LRU Cache',diff:'med'},{n:31,name:'Invert Binary Tree',diff:'easy'},{n:32,name:'Maximum Depth of Binary Tree',diff:'easy'},{n:33,name:'Level Order Traversal (BFS)',diff:'med'},{n:34,name:'Validate BST',diff:'med'},{n:35,name:'Lowest Common Ancestor BST',diff:'med'},{n:36,name:'Binary Tree Right Side View',diff:'med'},{n:37,name:'Climbing Stairs',diff:'easy'},{n:38,name:'House Robber',diff:'med'},{n:39,name:'Coin Change',diff:'med'},{n:40,name:'Longest Common Subsequence',diff:'med'},{n:41,name:'Word Break',diff:'med'},{n:42,name:'Jump Game',diff:'med'},{n:43,name:'Top K Frequent Elements',diff:'med'},{n:44,name:'Find All Duplicates in Array',diff:'med'},{n:45,name:'Subarray Sum Equals K',diff:'med'},{n:46,name:'Merge Intervals',diff:'med'},{n:47,name:'Non-overlapping Intervals',diff:'med'},{n:48,name:'Meeting Rooms II',diff:'med'},{n:49,name:'Number of Islands',diff:'med'},{n:50,name:'Course Schedule (graph cycle)',diff:'med'}
];

const prepTopics=[
  {cat:'React',title:'Hooks deep dive',qs:['useState vs useReducer — when to use each','useEffect — deps array, cleanup, stale closures','useMemo vs useCallback — referential equality','Custom hooks — build useFetch live','useRef — DOM refs vs mutable values']},
  {cat:'React',title:'Architecture & patterns',qs:['Virtual DOM + reconciliation (Fiber)','Component composition vs prop drilling','Context API + performance pitfalls','Error boundaries — where to use them','Lazy loading + React.lazy + Suspense']},
  {cat:'React',title:'State management',qs:['Redux Toolkit — slice, thunk, selector','Context vs Redux — when to pick each','State colocation principle','Optimistic UI updates','Forms — controlled vs uncontrolled']},
  {cat:'JavaScript',title:'Core concepts',qs:['Event loop — call stack, microtasks, macrotasks','Closures — counter example + real use','Prototypal inheritance + prototype chain','var vs let vs const + TDZ + hoisting','The `this` keyword — 4 binding rules']},
  {cat:'JavaScript',title:'Async + performance',qs:['Promises — .then, .catch, .finally','Promise.all vs Promise.race vs allSettled','async/await — error handling patterns','Debounce from scratch','Throttle from scratch']},
  {cat:'JavaScript',title:'Advanced topics',qs:['Deep vs shallow copy — structuredClone','Currying + partial application','Array methods — implement reduce yourself','Memory leaks — event listeners, timers','Module systems — ESM vs CommonJS']},
  {cat:'System Design',title:'Frontend design questions',qs:['Design a news feed (pagination vs virtualization)','Design autocomplete (debounce + caching)','Design a form with validation','Design real-time chat (WebSocket + optimistic UI)','Design a modal system (portals + a11y)','Improve page performance (LCP/CLS/FID)']},
  {cat:'Behavioral',title:'Your Avua stories (STAR)',qs:['Drag-and-drop CV editor — challenge + solution','OAuth integration — technical decisions made','Performance optimization on recruiter pages','Owning a feature end-to-end independently','Handling feedback and iterating on UI']},
];

function daysSince(dateStr) {
  const d = new Date(dateStr), now = new Date();
  return Math.floor((now-d)/(1000*60*60*24));
}

function followUpStatus(dateStr) {
  const d = daysSince(dateStr);
  if(d===3) return {cls:'fu-urgent',label:'Follow up TODAY (day 3)'};
  if(d===7) return {cls:'fu-urgent',label:'Follow up TODAY (day 7)'};
  if(d>7&&d<10) return {cls:'fu-soon',label:`Day ${d} — consider following up`};
  if(d>=10) return {cls:'fu-ok',label:`Day ${d} — move on or one final follow-up`};
  return null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiType, setAiType] = useState('email');
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [dsaDone, setDsaDone] = useState({});
  const [prepDone, setPrepDone] = useState({});
  const [prepNotes, setPrepNotes] = useState({});
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [prepCategory, setPrepCategory] = useState('react');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [vaultLinks, setVaultLinks] = useState({ resume: '', portfolio: '', github: '', linkedin: '' });
  const [timer, setTimer] = useState(1500); // 25 mins in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  
  const [radarJobs, setRadarJobs] = useState([]);
  const [radarSource, setRadarSource] = useState('remotive');
  const [isFetchingRadar, setIsFetchingRadar] = useState(false);
  const [radarError, setRadarError] = useState('');

  const [jTitle, setJTitle] = useState('');
  const [jRole, setJRole] = useState('Frontend Developer');
  const [jSource, setJSource] = useState('LinkedIn');
  
  const [rName, setRName] = useState('');
  const [rCompany, setRCompany] = useState('');
  const [rType, setRType] = useState('Recruiter');
  
  const [coSearch, setCoSearch] = useState('');
  const [pendingJobCheck, setPendingJobCheck] = useState(null);
  
  const [selectedTrackerDate, setSelectedTrackerDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [calDate, setCalDate] = useState(new Date());

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const calculateStreak = () => {
    if (jobs.length === 0) return { current: 0, best: 0 };
    const dates = [...new Set(jobs.map(j => j.date))].sort((a,b) => new Date(b) - new Date(a));
    let current = 0;
    let best = 0;
    let temp = 0;
    
    // Current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    
    let checkDate = today;
    if (!dates.includes(today) && dates.includes(yesterday)) checkDate = yesterday;
    
    if (dates.includes(checkDate)) {
      let d = new Date(checkDate);
      while (dates.includes(d.toISOString().split('T')[0])) {
        current++;
        d.setDate(d.getDate() - 1);
      }
    }

    // Best streak
    const sortedAsc = [...dates].sort((a,b) => new Date(a) - new Date(b));
    let lastD = null;
    sortedAsc.forEach(dateStr => {
      const d = new Date(dateStr);
      if (lastD) {
        const diff = (d - lastD) / (1000 * 60 * 60 * 24);
        if (diff === 1) temp++;
        else temp = 1;
      } else temp = 1;
      if (temp > best) best = temp;
      lastD = d;
    });

    return { current, best };
  };

  const { current: currentStreak, best: bestStreak } = calculateStreak();

  const changeMonth = (offset) => {
    const newDate = new Date(calDate.setMonth(calDate.getMonth() + offset));
    setCalDate(new Date(newDate));
  };

  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setJobs(data);
    });
    fetch('/api/recruiters').then(r => r.json()).then(data => {
      if(Array.isArray(data)) setRecruiters(data);
    });
    fetch('/api/progress').then(r => r.json()).then(data => {
      if(data) {
        setDsaDone(data.dsaDone || {});
        setPrepDone(data.prepDone || {});
        setPrepNotes(data.prepNotes || {});
        if(data.vaultLinks) setVaultLinks(data.vaultLinks);
      }
    });
    // Load vault links from localStorage as fallback
    try {
      const saved = localStorage.getItem('vaultLinks');
      if (saved) setVaultLinks(JSON.parse(saved));
    } catch(e) {}
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    else if (timer === 0) setTimerRunning(false);
    return () => clearInterval(interval);
  }, [timerRunning, timer]);

  const generateAI = async () => {
    if(!aiInput) return alert('Paste a job description first');
    setIsGenerating(true);
    setAiOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: aiInput, type: aiType })
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      setAiOutput(data.text);
    } catch(e) {
      alert(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchRadarJobs = async (source) => {
    setIsFetchingRadar(true);
    setRadarError('');
    try {
      const res = await fetch(`/api/radar?source=${source}`);
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      setRadarJobs(data.jobs || []);
    } catch(err) {
      setRadarError(err.message);
    } finally {
      setIsFetchingRadar(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'radar' && radarJobs.length === 0) {
      fetchRadarJobs(radarSource);
    }
  }, [activeTab]);

  const handleApplyClick = (job) => {
    window.open(job.url, '_blank');
    setPendingJobCheck(job);
  };

  const confirmApplication = async (success) => {
    if (success && pendingJobCheck) {
      const job = pendingJobCheck;
      const newJob = { company: job.company, role: job.title, source: job.source.split(' ')[0], date: new Date().toISOString().split('T')[0], status: 'Applied' };
      const res = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newJob) });
      const parsed = await res.json();
      setJobs([parsed, ...jobs]);
    }
    setPendingJobCheck(null);
  };

  const isJobApplied = (company, title) => {
    if (!company || !title) return false;
    return jobs.some(j => j.company.toLowerCase() === company.toLowerCase() && j.role.toLowerCase() === title.toLowerCase());
  };

  const addJob = async () => {
    if(!jTitle || !jRole) return alert('Enter company and role');
    const newJob = { company: jTitle, role: jRole, source: jSource, date: new Date().toISOString().split('T')[0] };
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob)
    });
    const parsed = await res.json();
    setJobs([parsed, ...jobs]);
    setJTitle(''); setJRole('Frontend Developer');
  };

  const updateJobStatus = async (id, val) => {
    setJobs(jobs.map(j => j._id === id ? { ...j, status: val } : j));
    await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: val })
    });
  };

  const deleteJob = async (id) => {
    setJobs(jobs.filter(j => j._id !== id));
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
  };

  const addRecruiter = async () => {
    if(!rName || !rCompany) return;
    const newR = { name: rName, company: rCompany, type: rType, date: new Date().toISOString().split('T')[0] };
    const res = await fetch('/api/recruiters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newR)
    });
    const parsed = await res.json();
    setRecruiters([parsed, ...recruiters]);
    setRName(''); setRCompany('');
  };

  const deleteRecruiter = async (id) => {
    setRecruiters(recruiters.filter(r => r._id !== id));
    await fetch(`/api/recruiters/${id}`, { method: 'DELETE' });
  };

  const syncProgress = async (newDsa, newPrep, newNotes = prepNotes, newVault = vaultLinks) => {
    await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dsaDone: newDsa, prepDone: newPrep, prepNotes: newNotes, vaultLinks: newVault })
    });
  };

  const updateVault = (key, val) => {
    const updated = { ...vaultLinks, [key]: val };
    setVaultLinks(updated);
    syncProgress(dsaDone, prepDone, updated);
  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60).toString().padStart(2, '0');
    const s = (timer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleDsa = (n) => {
    const nextDsa = { ...dsaDone, [n]: !dsaDone[n] };
    setDsaDone(nextDsa);
    syncProgress(nextDsa, prepDone);
  };

  const setPrepStatus = (ti, qi, status) => {
    const key = `${ti}-${qi}`;
    const nextStatus = prepDone[key] === status ? null : status;
    const nextPrep = { ...prepDone, [key]: nextStatus };
    setPrepDone(nextPrep);
    syncProgress(dsaDone, nextPrep, prepNotes, vaultLinks);
  };

  const updatePrepNotes = (ti, qi, note) => {
    const key = `${ti}-${qi}`;
    const nextNotes = { ...prepNotes, [key]: note };
    setPrepNotes(nextNotes);
    syncProgress(dsaDone, prepDone, nextNotes);
  };

  const copyMsg = (txt) => {
    navigator.clipboard.writeText(txt);
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(coSearch.toLowerCase()) || 
    c.tags.some(t => t.toLowerCase().includes(coSearch.toLowerCase()))
  );

  const doneDsaCount = Object.values(dsaDone).filter(Boolean).length;
  const dsaProgressPercent = (doneDsaCount / 50) * 100;

  const NavItem = ({ id, icon, label, badge }) => (
    <button className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && <span className="nav-badge">{badge}</span>}
    </button>
  );

  return (
    <div className="layout">
      {pendingJobCheck && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="card" style={{width: '420px', maxWidth: '90%', textAlign: 'center', background: 'var(--surf)', padding: '2.5rem'}}>
            <div style={{fontSize: '48px', marginBottom: '1rem', color: 'var(--success)'}}><FiCheckCircle /></div>
            <h2 style={{fontSize: '22px', marginBottom: '0.75rem', fontWeight: 700}}>Job Log Confirmation</h2>
            <p style={{color: 'var(--muted)', marginBottom: '2rem', fontSize: '15px', lineHeight: '1.6'}}>
              You navigated to the application for <strong>{pendingJobCheck.title}</strong> at <strong>{pendingJobCheck.company}</strong>. Should we track this in your log?
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <button className="btn btn-primary" onClick={() => confirmApplication(true)} style={{width: '100%', padding: '14px'}}>
                Log as Applied
              </button>
              <button onClick={() => confirmApplication(false)} style={{background: 'transparent', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: '13px', paddingTop: '8px'}}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="logo">
          <div>Job Hunt <span>HQ</span></div>
        </div>
        
        <div className="nav-section">
          <div className="nav-label">Main Console</div>
          <NavItem id="dashboard" icon={<FiPieChart/>} label="Dashboard" />
          <NavItem id="radar" icon={<FiRadio/>} label="Live Radar" />
          <NavItem id="ai" icon={<FiCpu/>} label="AI Assistant" />
          <NavItem id="tracker" icon={<FiClipboard/>} label="Job Tracker" badge={jobs.length} />
          
          <div className="nav-label">Recruitment</div>
          <NavItem id="companies" icon={<FiBriefcase/>} label="Companies" />
          <NavItem id="recruiters" icon={<FiUsers/>} label="Find Recruiters" />
          
          <div className="nav-label">Training</div>
          <NavItem id="prep" icon={<FiZap/>} label="Interview Prep" />
          <NavItem id="mock" icon={<FiShuffle/>} label="Mock Interview" />
          <NavItem id="dsa" icon={<FiTerminal/>} label="DSA Tracker" />
          
          <div className="nav-label">Archive</div>
          <NavItem id="messages" icon={<FiMessageSquare/>} label="Templates" />
          <NavItem id="gap" icon={<FiShield/>} label="Gap Answers" />
        </div>
        
        <div style={{padding: '1.5rem', borderTop: '1px solid var(--border)'}}>
           <div className="nav-label" style={{padding: '0 0 10px 0'}}>Link Vault</div>
           <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '6px'}}>
              {[
                {k: 'resume', label: 'CV / RS', icon: '📄'},
                {k: 'portfolio', label: 'Portfolio', icon: '🌐'},
                {k: 'github', label: 'GitHub', icon: '💻'},
                {k: 'linkedin', label: 'LinkedIn', icon: '🔗'}
              ].map(({k, label, icon}) => {
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
                          const next = {...vaultLinks, [k]: url};
                          setVaultLinks(next);
                          localStorage.setItem('vaultLinks', JSON.stringify(next));
                        }
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const url = window.prompt(`Update your ${label} URL:`, saved || '');
                      if (url !== null) {
                        const next = {...vaultLinks, [k]: url};
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
                    <span style={{fontSize: '14px'}}>{icon}</span>
                    <span>{label}</span>
                    <span style={{fontSize: '9px', opacity: 0.7}}>{saved ? '✓ copy' : '+ add'}</span>
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      <div className="main">
        {activeTab === 'dashboard' && (
          <div className="page active">
            <div className="page-header">
              <h1>Welcome, Komal 👋</h1>
              <p>You've applied to {jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length} jobs today. Focus on consistency.</p>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {/* Calculations for Mastery */}
              {(() => {
                const totalQs = interviewCategories.reduce((acc, cat) => acc + cat.questions.length, 0);
                const confidentQs = Object.values(prepDone).filter(v => v === 'confident').length;
                const masteryPct = Math.round((confidentQs / Math.max(totalQs, 1)) * 100);
                
                const catStats = interviewCategories.map(cat => {
                  const needsWork = cat.questions.filter((_, qi) => prepDone[`${cat.id}-${qi}`] === 'need-work').length;
                  return { id: cat.id, label: cat.label, needsWork };
                }).sort((a,b) => b.needsWork - a.needsWork);
                const weakSpot = catStats[0]?.needsWork > 0 ? catStats[0] : null;

                return (
                  <>
                    <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem'}}>
                      <div className="card" style={{padding: '2rem 1.5rem', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', borderTop: '4px solid var(--primary)', position: 'relative', overflow: 'hidden', marginBottom: 0}}>
                        <FiLayers style={{position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '100px', color: 'var(--primary)', opacity: 0.05}}/>
                        <div className="card-title" style={{marginBottom: '0.75rem'}}>Total Arsenal</div>
                        <div style={{fontSize: '40px', fontWeight: 800, color: '#fff'}}>{jobs.length}</div>
                        <div style={{fontSize: '13px', color: 'var(--dim)', marginTop: '6px'}}>Lifetime applications tracked</div>
                      </div>
                      <div className="card" style={{padding: '2rem 1.5rem', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', borderTop: '4px solid var(--secondary)', position: 'relative', overflow: 'hidden', marginBottom: 0}}>
                        <FiActivity style={{position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '100px', color: 'var(--secondary)', opacity: 0.05}}/>
                        <div className="card-title" style={{marginBottom: '0.75rem'}}>Daily Velocity</div>
                        <div style={{fontSize: '40px', fontWeight: 800, color: '#fff'}}>{jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length}</div>
                        <div style={{fontSize: '13px', color: 'var(--dim)', marginTop: '6px'}}>Applications fired today</div>
                      </div>
                    </div>

                    <div className="card" style={{
                      padding: '1.5rem 2rem', background: 'linear-gradient(135deg, #10b98115, transparent)', 
                      border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '20px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                        <div style={{width: '64px', height: '64px', borderRadius: '50%', background: `conic-gradient(var(--success) ${masteryPct * 3.6}deg, var(--surf-light) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <div style={{width: '50px', height: '50px', borderRadius: '50%', background: 'var(--surf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'var(--success)'}}>{masteryPct}%</div>
                        </div>
                        <div>
                          <div style={{fontSize: '11px', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px'}}>Interview Prep Readiness</div>
                          <div style={{fontSize: '20px', fontWeight: 800, color: '#fff'}}>{confidentQs} / {totalQs} Topics Mastered</div>
                        </div>
                      </div>
                      
                      <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                        {weakSpot && (
                          <div style={{textAlign: 'right'}}>
                            <div style={{fontSize: '11px', color: 'var(--dim)', marginBottom: '4px'}}>PRIORITY FOCUS</div>
                            <div style={{fontSize: '14px', fontWeight: 700, color: 'var(--warning)'}}>🔴 {weakSpot.label} ({weakSpot.needsWork} weak)</div>
                          </div>
                        )}
                        <button onClick={() => setActiveTab('mock')} className="btn btn-primary" style={{padding: '12px 20px', borderRadius: '12px', fontSize: '13px'}}>
                          Launch Practice Engine
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* BOTTOM ROW: 3 Columns Strict Layout to fill page */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', alignItems: 'start'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className="card" style={{marginBottom: 0}}>
                    <div className="card-title"><FiPieChart/> Conversion Pipeline</div>
                    <div style={{display: 'flex', gap: '4px', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem', background: 'var(--surf-light)'}}>
                      <div style={{width: `${Math.max((jobs.length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--secondary)'}}></div>
                      <div style={{width: `${Math.max((jobs.filter(j=>['Screening','Interview','Offer'].includes(j.status)).length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--warning)'}}></div>
                      <div style={{width: `${Math.max((jobs.filter(j=>j.status==='Offer').length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--success)'}}></div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                      {[
                        { l: 'Applied', v: jobs.length, c: 'var(--secondary)' },
                        { l: 'Interview', v: jobs.filter(j=>j.status==='Interview').length, c: 'var(--primary)' },
                        { l: 'Offers', v: jobs.filter(j=>j.status==='Offer').length, c: 'var(--success)' }
                      ].map(s => (
                        <div key={s.l} style={{padding: '10px', background: 'var(--surf-light)', borderRadius: '10px', textAlign: 'center'}}>
                          <div style={{fontSize: '11px', fontWeight: 600, color: 'var(--dim)', marginBottom: '4px'}}>{s.l}</div>
                          <div style={{fontSize: '18px', fontWeight: 700, color: s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card" style={{background: 'linear-gradient(135deg, var(--secondary), var(--primary))', border: 'none', color: '#fff', marginBottom: 0}}>
                    <div style={{fontSize: '18px', fontWeight: 800, marginBottom: '6px'}}>Auto-Generate Cover Letter</div>
                    <p style={{fontSize: '13px', opacity: 0.9, marginBottom: '1.25rem'}}>Map your resume directly to a job description.</p>
                    <button className="btn" style={{background: '#fff', color: 'var(--secondary)', width: '100%', padding: '12px', fontWeight: '800', borderRadius: '12px', transition: '0.2s', cursor: 'pointer'}} onClick={() => setActiveTab('ai')}>Launch AI Tool</button>
                  </div>
                </div>

                <div className="card" style={{marginBottom: 0, height: '100%'}}>
                  <div className="card-title"><FiTarget/> Daily Heart Target</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                    {[
                      { l: 'Master 3 DSA problems', d: 'Focus on Arrays/Hashing', done: false },
                      { l: 'LinkedIn Outreach', d: 'DM 10 first-degree recruiters', done: true },
                      { l: 'Radar Sprint', d: 'Apply to at least 15 new roles', done: false },
                      { l: 'Tech Interview Prep', d: 'Study React rendering lifecycle', done: false }
                    ].map((obj, i) => (
                      <div key={i} style={{padding: '12px', background: 'var(--surf-light)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                        <div style={{width: '20px', height: '20px', borderRadius: '5px', border: '2px solid var(--border)', background: obj.done ? 'var(--primary)' : 'transparent', flexShrink: 0}} className="flex-center">
                          {obj.done && <FiCheckCircle style={{fontSize: '12px', color: 'var(--bg)'}}/>}
                        </div>
                        <div>
                          <div style={{fontSize: '14px', fontWeight: 600, color: obj.done ? 'var(--dim)' : 'var(--text)', marginBottom: '2px'}}>{obj.l}</div>
                          <div style={{fontSize: '12px', color: 'var(--muted)'}}>{obj.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{marginBottom: 0, height: '100%'}}>
                  <div className="card-title"><FiRadio/> Follow-up Radar</div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {jobs.filter(j => (daysSince(j.date) === 3 || daysSince(j.date) === 7) && j.status === 'Applied').length > 0 ? (
                      jobs.filter(j => (daysSince(j.date) === 3 || daysSince(j.date) === 7) && j.status === 'Applied').slice(0, 5).map(j => (
                        <div key={j._id} style={{padding: '14px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '12px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <strong>{j.company}</strong> 
                          <span style={{fontSize:'11px', background: 'var(--primary)', color: 'var(--bg)', padding: '2px 8px', borderRadius: '99px', fontWeight: 'bold'}}>Day {daysSince(j.date)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty" style={{padding: '3rem 1rem'}}>No urgent follow-ups today.<br />Keep applying!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'radar' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiRadio style={{color: 'var(--danger)'}}/> Job Radar</h1>
              <p>Real-time feed of React & Frontend roles from tech-first startup boards.</p>
            </div>
            
            <div className="neet-layout">
              <div className="neet-main-col">
                <div className="tag-cloud" style={{marginBottom: '1rem'}}>
                  <button className={`tag-btn ${radarSource === 'remotive' ? 'active' : ''}`} onClick={() => { setRadarSource('remotive'); fetchRadarJobs('remotive'); }}>
                    <FiGlobe/> Tech Startups
                  </button>
                  <button className={`tag-btn ${radarSource === 'jsearch' ? 'active' : ''}`} onClick={() => { setRadarSource('jsearch'); fetchRadarJobs('jsearch'); }}>
                    <FiMapPin/> Indian Local
                  </button>
                </div>

                {isFetchingRadar ? (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 0', gap: '1rem', background: 'var(--surf)', borderRadius: '16px', border: '1px solid var(--border)'}}>
                    <div className="loading-spinner" style={{width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                    <div style={{fontSize: '13px', color: 'var(--dim)'}}>Scanning Job Boards...</div>
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {radarJobs.map((j, i) => (
                      <div key={i} className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem'}}>
                        <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                          <div style={{width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800}}>
                            {j.company.charAt(0)}
                          </div>
                          <div>
                            <h3 style={{fontSize: '15px', fontWeight: 700, marginBottom: '2px'}}>{j.title}</h3>
                            <div style={{fontSize: '12px', color: 'var(--primary)', fontWeight: 600}}>{j.company} • <span style={{color: 'var(--muted)'}}>{j.location}</span></div>
                          </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                           <div style={{fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase'}}>{j.source}</div>
                           {isJobApplied(j.company, j.title) ? (
                            <div style={{color: 'var(--success)', fontSize: '12px', fontWeight: 700}} className="flex-center gap-4">
                              <FiCheckCircle/> Applied
                            </div>
                           ) : (
                            <button onClick={() => handleApplyClick(j)} className="btn btn-primary" style={{padding: '8px 24px', fontSize: '13px'}}>Apply</button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="neet-side-col">
                 <div className="card">
                    <div className="card-title">Live Scan Status</div>
                    <div style={{fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6'}}>
                       Our radar monitors <strong>Remotive</strong> and <strong>JSearch</strong> to bring you the freshest React roles. 
                       <br/><br/>
                       Applied jobs are automatically hidden via your tracking history.
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiCpu style={{display:'inline-block', verticalAlign:'middle', marginRight:'8px'}}/> AI Cold Email / Cover Letter Generator</h1>
              <p>Powered by Google Gemini — Paste the Job Description below and let AI map it to your exact Avua.com experience.</p>
            </div>
            
            <div className="card">
              <div className="card-title">Job Description</div>
              <textarea 
                className="search-box" 
                style={{height: '150px', resize: 'vertical', width: '100%', padding: '12px'}} 
                placeholder="Paste the LinkedIn or company job description here..."
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
              />
              <div style={{display: 'flex', gap: '10px', marginTop: '1rem', alignItems: 'center'}}>
                <select value={aiType} onChange={e => setAiType(e.target.value)} style={{background: 'var(--surf)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0 1rem', borderRadius: '12px', outline: 'none', height: '48px', flex: 1, fontWeight: 600}}>
                  <option value="email">Cold Email</option>
                  <option value="cover-letter">Cover Letter</option>
                </select>
                <button 
                  className="btn btn-primary" 
                  onClick={generateAI} 
                  disabled={isGenerating}
                  style={isGenerating ? {height: '48px', padding: '0 1.5rem', opacity: 0.7, cursor: 'not-allowed', whiteSpace: 'nowrap'} : {height: '48px', padding: '0 1.5rem', whiteSpace: 'nowrap'}}
                >
                  <FiZap /> {isGenerating ? 'Generating...' : 'Generate with Gemini'}
                </button>
              </div>
            </div>

            {aiOutput && (
              <div className="card">
                <div className="card-title">Generated {aiType === 'email' ? 'Email' : 'Cover Letter'}</div>
                <div className="msg-template" style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>
                  <button className="copy-btn" onClick={() => copyMsg(aiOutput)}>Copy</button>
                  {aiOutput}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="page active">
            <div className="neet-layout" style={{alignItems: 'start'}}>
              <div className="neet-main-col">
                <div className="tag-cloud" style={{marginBottom: '2rem'}}>
                  <button className="tag-btn active">Core Track</button>
                  <button className="tag-btn">Advanced Radar</button>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  background: 'var(--surf-light)', padding: '1.5rem', borderRadius: '16px', 
                  border: '1px solid var(--border)', marginBottom: '2rem'
                }}>
                  <div>
                    <h1 style={{fontSize: '24px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em'}}>Job Tracker 150</h1>
                    <p style={{fontSize: '13px', color: 'var(--muted)', maxWidth: '450px'}}>
                      Tracking your daily applications is the key to consistency. Log at least 5 jobs today.
                    </p>
                  </div>
                  <div style={{display: 'flex', gap: '2rem'}}>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: '20px', fontWeight: 800, color: 'var(--success)'}}>{jobs.filter(j=>j.status==='Applied').length}</div>
                      <div style={{fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase'}}>Applied</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: '20px', fontWeight: 800, color: 'var(--warning)'}}>{jobs.filter(j=>j.status==='Interview').length}</div>
                      <div style={{fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase'}}>Interviews</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <div style={{fontSize: '20px', fontWeight: 800, color: 'var(--primary)'}}>{jobs.filter(j=>j.status==='Offer').length}</div>
                      <div style={{fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase'}}>Offers</div>
                    </div>
                  </div>
                </div>

                <div className="neet-search-wrap" style={{position: 'relative'}}>
                  <input 
                    className="neet-search-input" 
                    placeholder="Search jobs by company, role, or status..." 
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                  />
                  <FiSearch style={{position:'absolute', right:'14px', top:'14px', color:'var(--muted)'}} />
                </div>

                <div className="tag-cloud">
                  {['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(tag => (
                    <button 
                      key={tag} 
                      className={`tag-btn ${jobSearchQuery === tag ? 'active' : ''}`}
                      onClick={() => setJobSearchQuery(tag === 'All' ? '' : tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="card" style={{padding: 0, overflow: 'hidden', minHeight: '320px'}}>
                  <table className="neet-table">
                    <thead>
                      <tr>
                        <th style={{width: '40px'}}>#</th>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Source</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs
                        .filter(j => (!selectedTrackerDate || j.date === selectedTrackerDate) && 
                                    (j.company.toLowerCase().includes(jobSearchQuery.toLowerCase()) || 
                                     j.status.toLowerCase().includes(jobSearchQuery.toLowerCase())))
                        .length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{textAlign: 'center', padding: '40px', color: 'var(--muted)'}}>
                            No applications found for this date. Go apply or pick another date!
                          </td>
                        </tr>
                      ) : (
                        jobs
                          .filter(j => (!selectedTrackerDate || j.date === selectedTrackerDate) && 
                                      (j.company.toLowerCase().includes(jobSearchQuery.toLowerCase()) || 
                                       j.status.toLowerCase().includes(jobSearchQuery.toLowerCase())))
                          .map((j, i) => (
                          <tr key={j._id}>
                            <td style={{color: 'var(--muted)', fontSize: '12px'}}>{i + 1}</td>
                            <td style={{fontWeight: 600}}>{j.company}</td>
                            <td style={{color: 'var(--muted)'}}>{j.role}</td>
                            <td><span style={{fontSize: '11px', background: 'var(--surf2)', padding: '2px 6px', borderRadius: '4px'}}>{j.source}</span></td>
                            <td>
                              <select 
                                value={j.status} 
                                onChange={(e) => updateJobStatus(j._id, e.target.value)}
                                style={{background: 'transparent', border: 'none', color: j.status === 'Offer' ? 'var(--success)' : j.status === 'Rejected' ? 'var(--danger)' : 'var(--text)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', outline: 'none'}}
                              >
                                {['Applied', 'Screening', 'Interview', 'Rejected', 'Offer', 'Ghosted'].map(s => <option key={s} value={s} style={{background: 'var(--surf)'}}>{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="card" style={{marginTop: '2rem'}}>
                  <div className="card-title">Log New Application</div>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
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
                        {['LinkedIn', 'Indeed', 'Naukri', 'Wellfound', 'Direct'].map(s => <option key={s} value={s} style={{background: 'var(--surf)'}}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={addJob} style={{width: '200px', height: '48px'}}>
                    <FiZap /> Add to Trackers
                  </button>
                </div>
              </div>

              <div className="neet-side-col">
                <div className="neet-calendar">
                  <div className="neet-cal-header">
                    <button onClick={() => changeMonth(-1)} style={{background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer'}}>←</button>
                    <span>{calDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => changeMonth(1)} style={{background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer'}}>→</button>
                  </div>
                  <div className="neet-cal-grid">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="neet-cal-weekday">{d}</div>)}
                    {Array.from({ length: getFirstDayOfMonth(calDate.getMonth(), calDate.getFullYear()) }).map((_, i) => <div key={`empty-${i}`} className="neet-cal-day other-month" />)}
                  {Array.from({ length: getDaysInMonth(calDate.getMonth(), calDate.getFullYear()) }).map((_, i) => {
                      const day = i + 1;
                      const dObj = new Date(calDate.getFullYear(), calDate.getMonth(), day);
                      const dStr = dObj.toISOString().split('T')[0];
                      const today = new Date().toISOString().split('T')[0];
                      const isToday = dStr === today;
                      const isSelected = dStr === selectedTrackerDate;
                      const hasApplied = jobs.some(j => j.date === dStr);
                      const isPastDay = dStr < today;
                      const isMissed = !hasApplied && isPastDay;
                      
                      return (
                        <div 
                          key={day} 
                          className={`neet-cal-day ${isToday ? 'today' : ''} ${isSelected ? 'active' : ''} ${hasApplied ? 'applied' : ''} ${isMissed ? 'missed' : ''}`}
                          onClick={() => setSelectedTrackerDate(dStr)}
                          title={hasApplied ? `${jobs.filter(j=>j.date===dStr).length} application(s)` : isMissed ? 'No applications' : ''}
                        >
                          {day}
                          {hasApplied && !isSelected && <span className="cal-icon">✓</span>}
                          {isMissed && !isSelected && <span className="cal-icon">✗</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="streak-grid-mini">
                  <div className="streak-box">
                    <div className="streak-label">Current Streak</div>
                    <div className="streak-val-wrap">
                      <FiZap className="streak-icon" style={{color: 'var(--warning)'}} />
                      <div className="streak-val">{currentStreak} days</div>
                    </div>
                  </div>
                  <div className="streak-box">
                    <div className="streak-label">Best Streak</div>
                    <div className="streak-val-wrap">
                      <FiTarget className="streak-icon" style={{color: 'var(--primary)'}} />
                      <div className="streak-val">{bestStreak} days</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{padding: '1.5rem', border: '1px solid var(--danger)', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', marginTop: '1.5rem', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.05)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem'}}>
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px'}}>Daily Activity Target</div>
                      <div style={{fontSize: '24px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center'}}>
                        <span style={{color: 'var(--danger)', marginRight: '10px', textShadow: '0 0 10px rgba(239, 68, 68, 0.4)'}}>❤</span>
                        {jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length} / 5 Applied
                      </div>
                    </div>
                    <div style={{fontSize: '13px', fontWeight: 600, color: 'var(--dim)', background: 'var(--surf)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                      {Math.max(0, 5 - jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length)} to next heart
                    </div>
                  </div>
                  <div style={{height: '14px', background: 'var(--surf2)', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--border)'}}>
                    <div style={{height: '100%', width: `${Math.min(100, (jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length / 5) * 100)}%`, background: 'var(--danger)', borderRadius: '7px', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                  </div>
                  <div style={{fontSize: '11px', color: 'var(--warning)', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600}}>
                    <FiZap style={{fontSize: '14px'}}/> Apply to at least 5 jobs today to maintain your hot streak!
                  </div>
                </div>

                <div className="card" style={{marginTop: '1.25rem', padding: '1rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'}}>🏅</div>
                    <div>
                      <div style={{fontSize: '13px', fontWeight: 600}}>Global Ranking</div>
                      <div style={{fontSize: '11px', color: 'var(--muted)'}}>Top 12.5% this week</div>
                    </div>
                  </div>
                  <div style={{height: '40px', background: 'var(--primary-soft)', border: '1px solid var(--primary)', borderRadius: '6px', overflow: 'hidden', position: 'relative'}}>
                    <div style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '65%', background: 'var(--primary)', opacity: 0.3}}></div>
                    <div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)'}}>
                      LEVEL 4 APPLICANT
                    </div>
                  </div>
                </div>
              </div>{/* end neet-side-col */}
            </div>{/* end neet-layout */}
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiBriefcase style={{color: 'var(--primary)'}}/> Target Companies</h1>
              <p>Top companies that hire React devs regularly. Target the high-growth ones first.</p>
            </div>
            
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search high-priority companies..." 
                className="neet-search-input"
                value={coSearch}
                onChange={(e) => setCoSearch(e.target.value)}
              />
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
                  <div style={{display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '1rem'}}>
                    <a className="tag-btn flex-center" style={{flex: 1, textDecoration: 'none'}} href={`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.search)}`} target="_blank" rel="noreferrer">Recruiters</a>
                    <a className="tag-btn active flex-center" style={{flex: 1, textDecoration: 'none'}} href={`https://${c.jobs}`} target="_blank" rel="noreferrer">Jobs</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{marginTop: '2rem', background: 'linear-gradient(135deg, var(--surf), var(--surf-light))', border: '1px solid var(--primary)', maxWidth: '800px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
              <div style={{width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <FiRadio style={{color: 'var(--primary)', fontSize: '20px'}}/>
              </div>
              <div>
                <div style={{fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '6px'}}>Execution Strategy</div>
                <div style={{fontSize: '14px', color: 'var(--muted)', lineHeight: '1.6'}}>
                  Standard applications fail. Find 3 recruiters from these companies and send them a <strong>LinkedIn Voice Note</strong>. 90% of candidates just click 'Apply' and hope. Be the 10%.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Similar maps for Recruiters, Prep, DSA, etc */}
        {activeTab === 'dsa' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiTerminal style={{color: 'var(--success)'}}/> DSA Patterns</h1>
              <p>Master the top 50 patterns that cover 80% of frontend tech interviews.</p>
            </div>

            <div className="neet-layout">
              <div className="neet-main-col">
                <div className="card" style={{padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{fontSize: '14px', fontWeight: 600}}><span>{doneDsaCount}</span> / 50 Completed</div>
                  <div style={{flex: 0.8, height: '8px', background: 'var(--surf-light)', borderRadius: '4px'}}>
                    <div style={{width: `${dsaProgressPercent}%`, background: 'var(--success)', height: '100%', borderRadius: '4px'}}></div>
                  </div>
                </div>

                <div className="dsa-list">
                  {dsaQuestions.map((q, i) => (
                    <div key={i} className={`dsa-item ${dsaDone[q.n] ? 'done' : ''}`} onClick={() => toggleDsa(q.n)}>
                      <div style={{width: '24px', height: '24px', borderRadius: '6px', border: '2px solid var(--border)', background: dsaDone[q.n] ? 'var(--success)' : 'transparent'}} className="flex-center">
                        {dsaDone[q.n] && <FiCheckCircle style={{fontSize: '14px', color: 'var(--bg)'}}/>}
                      </div>
                      <div style={{fontSize: '12px', color: 'var(--dim)', width: '25px'}}>{String(q.n).padStart(2, '0')}</div>
                      <div style={{flex: 1, fontSize: '14px', fontWeight: 600, color: dsaDone[q.n] ? 'var(--dim)' : 'var(--text)'}}>{q.name}</div>
                      <div className={`difficulty ${q.diff}`}>{q.diff}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="neet-side-col">
                <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
                  <div style={{fontSize: '11px', fontWeight: 800, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '0.1em'}}>Deep Focus Timer</div>
                  <div style={{fontSize: '48px', fontWeight: 800, fontFamily: 'monospace', marginBottom: '2rem', color: timerRunning ? 'var(--warning)' : 'var(--text)'}}>
                    {formatTimer()}
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '10px'}}>
                     <button className="btn btn-primary" onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? 'Pause Session' : 'Start Focus'}</button>
                     <button className="btn btn-secondary" onClick={() => { setTimerRunning(false); setTimer(1500) }}>Reset Timer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prep' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiShield style={{color: 'var(--warning)'}}/> Mastery Modules</h1>
              <p>Tailored scripts and structural answers for 2.4+ years React experience.</p>
            </div>

            <div className="neet-layout">
              <div className="neet-main-col">
                <div className="tag-cloud" style={{marginBottom: '1rem'}}>
                  {interviewCategories.map(cat => (
                    <button 
                      key={cat.id} 
                      className={`tag-btn ${prepCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setPrepCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {interviewCategories.filter(c => c.id === prepCategory).map((data) => {
                  const doneQs = data.questions.filter((_, qi) => prepDone[`${data.id}-${qi}`] === 'confident').length;
                  const pct = (doneQs / Math.max(data.questions.length, 1)) * 100;
                  const levelColor = { Basic: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444', 'Situation-Based': '#8b5cf6', 'Decision-Based': '#38bdf8', STAR: '#f97316', HR: '#ec4899' };
                  
                  return (
                    <div key={data.id} className="card" style={{padding: '1.5rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <div style={{fontSize: '16px', fontWeight: 700}}>{data.label}</div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: flashcardMode ? 'var(--primary)' : 'var(--dim)', whiteSpace: 'nowrap'}}>
                            <input type="checkbox" checked={flashcardMode} onChange={(e) => setFlashcardMode(e.target.checked)} style={{accentColor: 'var(--primary)'}} />
                            Flashcard Mode
                          </label>
                          <div style={{textAlign: 'right', minWidth: '120px'}}>
                            <div style={{fontSize: '11px', color: 'var(--muted)', marginBottom: '4px'}}>{doneQs}/{data.questions.length} Confident</div>
                            <div className="prog-wrap" style={{height: '6px'}}><div className="prog-bar" style={{width:`${pct}%`, background: 'var(--primary)'}}></div></div>
                          </div>
                        </div>
                      </div>

                      {flashcardMode ? (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem'}}>
                          {data.questions.map((q, qi) => {
                            const key = `${data.id}-${qi}`;
                            const isExpanded = expandedAnswers[key];
                            const lvlColor = levelColor[q.level] || 'var(--dim)';
                            const status = prepDone[key];
                            return (
                              <div key={qi} style={{
                                background: isExpanded ? 'var(--surf)' : 'var(--surf-light)', 
                                border: `1px solid ${isExpanded ? lvlColor : 'var(--border)'}`, 
                                borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', minHeight: '180px', boxShadow: isExpanded ? `0 8px 30px ${lvlColor}22` : 'none'
                              }} onClick={() => setExpandedAnswers({...expandedAnswers, [key]: !isExpanded})}>
                                {!isExpanded ? (
                                  <div style={{padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative'}}>
                                    <div style={{position: 'absolute', top: '12px', right: '12px', fontSize: '10px', fontWeight: 700, background: lvlColor+'22', color: lvlColor, padding: '2px 8px', borderRadius: '99px'}}>{q.level}</div>
                                    <div style={{fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem'}}>{q.q}</div>
                                    <div style={{fontSize: '12px', color: 'var(--primary)', fontWeight: 600}}>Click to flip</div>
                                  </div>
                                ) : (
                                  <div style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', cursor: 'default'}} onClick={e => e.stopPropagation()}>
                                    <div style={{fontSize: '12px', color: 'var(--muted)', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)'}}>
                                      <strong>{q.q}</strong>
                                    </div>
                                    <div className="no-scrollbar" style={{flex: 1, overflowY: 'auto', maxHeight: '180px'}}>
                                      {(q.points || []).map((pt, pi) => (
                                        <div key={pi} style={{fontSize: '11px', marginBottom: '6px', lineHeight: '1.5'}}>
                                          <span style={{color: lvlColor, fontWeight: 700, marginRight: '4px'}}>{pt.label}:</span>
                                          <span style={{color: 'var(--muted)'}}>{pt.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div style={{marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem'}}>
                                       <div style={{fontSize: '9px', fontWeight: 800, color: 'var(--dim)', marginBottom: '4px', textTransform: 'uppercase'}}>My Notes</div>
                                       <textarea 
                                          placeholder="Personal anchors..." 
                                          value={prepNotes[key] || ''}
                                          onChange={(e) => updatePrepNotes(data.id, qi, e.target.value)}
                                          style={{
                                            width: '100%', height: '50px', background: 'var(--surf2)', border: '1px solid var(--border)', 
                                            borderRadius: '6px', padding: '6px', fontSize: '11px', color: 'var(--text)', outline: 'none', resize: 'none'
                                          }}
                                       />
                                    </div>
                                    <div style={{marginTop: '1rem', display: 'flex', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--border)'}}>
                                      <button onClick={() => setPrepStatus(data.id, qi, 'need-work')} className="btn" style={{flex: 1, padding: '6px', fontSize: '11px', background: status === 'need-work' ? '#ef4444' : 'var(--surf)', color: status === 'need-work' ? '#fff' : 'var(--dim)', border: '1px solid ' + (status === 'need-work' ? '#ef4444' : 'var(--border)')}}>🔴 Work</button>
                                      <button onClick={() => setPrepStatus(data.id, qi, 'getting-there')} className="btn" style={{flex: 1, padding: '6px', fontSize: '11px', background: status === 'getting-there' ? '#f59e0b' : 'var(--surf)', color: status === 'getting-there' ? '#fff' : 'var(--dim)', border: '1px solid ' + (status === 'getting-there' ? '#f59e0b' : 'var(--border)')}}>🟡 Close</button>
                                      <button onClick={() => setPrepStatus(data.id, qi, 'confident')} className="btn" style={{flex: 1, padding: '6px', fontSize: '11px', background: status === 'confident' ? '#10b981' : 'var(--surf)', color: status === 'confident' ? '#fff' : 'var(--dim)', border: '1px solid ' + (status === 'confident' ? '#10b981' : 'var(--border)')}}>🟢 Got it</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        {data.questions.map((q, qi) => {
                          const key = `${data.id}-${qi}`;
                          const isExpanded = expandedAnswers[key];
                          const lvlColor = levelColor[q.level] || 'var(--dim)';
                          const status = prepDone[key];
                          return (
                            <div key={qi} className="qa-card" style={{margin: 0, paddingLeft: '1rem', borderLeftColor: status === 'confident' ? 'var(--success)' : status === 'need-work' ? '#ef4444' : status === 'getting-there' ? '#f59e0b' : lvlColor}}>
                              <div 
                                style={{padding: '12px 10px', display: 'flex', gap: '12px', alignItems: 'center'}}
                              >
                                <div style={{flex: 1, cursor: 'pointer'}} onClick={() => setExpandedAnswers({...expandedAnswers, [key]: !isExpanded})}>
                                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px'}}>
                                    <span style={{fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '99px', background: lvlColor + '22', color: lvlColor, textTransform: 'uppercase', letterSpacing: '0.05em'}}>{q.level}</span>
                                    {q.structure && <span style={{fontSize: '10px', color: 'var(--dim)', fontStyle: 'italic'}}>→ {q.structure}</span>}
                                  </div>
                                  <div style={{fontSize: '14px', fontWeight: 600, color: status === 'confident' ? 'var(--dim)' : 'var(--text)'}}>{q.q}</div>
                                </div>
                                <div style={{display: 'flex', gap: '4px'}}>
                                  <button onClick={() => setPrepStatus(data.id, qi, 'need-work')} title="Need Work" style={{width:'24px',height:'24px',borderRadius:'50%',border:'none',background:status==='need-work'?'rgba(239, 68, 68, 0.2)':'transparent',cursor:'pointer',fontSize:'12px', display:'flex',alignItems:'center',justifyContent:'center', opacity: status==='need-work'?1:0.3, filter: status==='need-work'?'':'grayscale(1)'}}>🔴</button>
                                  <button onClick={() => setPrepStatus(data.id, qi, 'getting-there')} title="Getting There" style={{width:'24px',height:'24px',borderRadius:'50%',border:'none',background:status==='getting-there'?'rgba(245, 158, 11, 0.2)':'transparent',cursor:'pointer',fontSize:'12px', display:'flex',alignItems:'center',justifyContent:'center', opacity: status==='getting-there'?1:0.3, filter: status==='getting-there'?'':'grayscale(1)'}}>🟡</button>
                                  <button onClick={() => setPrepStatus(data.id, qi, 'confident')} title="Confident" style={{width:'24px',height:'24px',borderRadius:'50%',border:'none',background:status==='confident'?'rgba(16, 185, 129, 0.2)':'transparent',cursor:'pointer',fontSize:'12px', display:'flex',alignItems:'center',justifyContent:'center', opacity: status==='confident'?1:0.3, filter: status==='confident'?'':'grayscale(1)'}}>🟢</button>
                                </div>
                                <div style={{color: 'var(--dim)', fontSize: '12px', marginLeft: '6px', cursor: 'pointer', padding: '4px'}} onClick={() => setExpandedAnswers({...expandedAnswers, [key]: !isExpanded})}>{isExpanded ? '▲' : '▼'}</div>
                              </div>
                              {isExpanded && (
                                <div style={{padding: '0 10px 15px 30px', animation: 'fadeIn 0.2s'}}>
                                  <div style={{background: 'var(--surf-light)', borderRadius: '10px', borderLeft: `3px solid ${lvlColor}`, overflow: 'hidden'}}>
                                    {q.points && q.points.map((pt, pi) => (
                                      <div key={pi} style={{
                                        display: 'flex', gap: '12px', padding: '10px 1.25rem',
                                        borderBottom: pi < q.points.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        alignItems: 'flex-start'
                                      }}>
                                        <div style={{
                                          minWidth: '22px', height: '22px', borderRadius: '50%',
                                          background: lvlColor + '22', color: lvlColor,
                                          fontSize: '10px', fontWeight: 800,
                                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                                          flexShrink: 0, marginTop: '1px'
                                        }}>{pi + 1}</div>
                                        <div style={{lineHeight: '1.7'}}>
                                          <span style={{fontSize: '11px', fontWeight: 800, color: lvlColor, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '6px'}}>{pt.label}:</span>
                                          <span style={{fontSize: '13px', color: 'var(--muted)'}}>{pt.text}</span>
                                        </div>
                                      </div>
                                    ))}
                                    {!q.points && <div style={{padding: '1rem', color: 'var(--muted)', fontSize: '13px'}}>{q.a}</div>}
                                  </div>
                                  <div style={{marginTop: '1rem'}}>
                                    <div style={{fontSize: '11px', fontWeight: 800, color: 'var(--dim)', marginBottom: '6px', textTransform: 'uppercase'}}>Personal Anchors & Notes</div>
                                    <textarea 
                                      placeholder="Add your own key phrases or personal experience anchors here..." 
                                      value={prepNotes[key] || ''}
                                      onChange={(e) => updatePrepNotes(data.id, qi, e.target.value)}
                                      style={{
                                        width: '100%', minHeight: '80px', background: 'var(--surf2)', border: '1px solid var(--border)', 
                                        borderRadius: '8px', padding: '10px', fontSize: '12px', color: 'var(--text)', outline: 'none', resize: 'vertical'
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

              <div className="neet-side-col">
                <AudioRecorder />
                <div className="card" style={{border: '1.5px solid rgba(245,158,11,0.3)', marginTop: 0}}>
                   <div className="card-title" style={{color: 'var(--warning)'}}>Gap Strategy Script</div>
                   <div style={{fontSize: '13px', lineHeight: '1.7', color: 'var(--muted)'}}>
                      "Ended in Jan. Since then, intentionally upskilling. Built a high-performance career command center. Ready to contribute."
                      <br/><br/>
                      <strong>Goal:</strong> Zero apologies. Pure forward momentum.
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mock' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiShuffle style={{color: 'var(--primary)'}}/> Mock Interview</h1>
              <p>Practice out loud. Record your answer. Self-score. Identify weak spots.</p>
            </div>
            <MockInterviewPage />
          </div>
        )}

        {activeTab === 'recruiters' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiUsers style={{color: 'var(--primary)'}}/> CRM Outreach</h1>
              <p>Track your conversations with recruiters and hiring managers.</p>
            </div>
            
            <div className="neet-layout">
              <div className="neet-main-col">
                <div className="card">
                  <div className="card-title">Contact Database</div>
                  {recruiters.length === 0 ? (
                    <div className="empty" style={{padding: '3rem 0'}}>No connections logged. Start with LinkedIn Outreach.</div>
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
                            <td style={{fontWeight: 600}}>{r.name}</td>
                            <td>{r.company}</td>
                            <td><span className="tag-btn active" style={{fontSize: '10px', padding: '2px 8px'}}>{r.type}</span></td>
                            <td style={{color: 'var(--dim)', fontSize: '12px'}}>{r.date}</td>
                            <td style={{textAlign: 'right'}}><button className="btn-secondary" style={{padding: '4px 8px', borderRadius: '6px'}} onClick={() => deleteRecruiter(r._id)}>✕</button></td>
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
                    <button className="btn btn-primary" style={{width: '100%'}} onClick={addRecruiter}>+ Register Log</button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiSend style={{color: 'var(--success)'}}/> Outreach Templates</h1>
              <p>Skip the small talk. Use these tested templates to get direct responses.</p>
            </div>

            <div className="neet-layout">
              <div className="neet-main-col">
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  {[
                    { t: 'Recruiter Cold Message', c: "Hi [Name], I noticed you recruit for [Company] — I'm a React.js developer with 2.4 years of experience building production features at avua.com... Would love to share my portfolio. Thanks!" },
                    { t: 'Alumni / Referral Request', c: "Hey [Name], I see you work at [Company] — I noticed we're both from Kurukshetra University! I'm currently exploring React roles. Would you be open to a referral? Thanks!" },
                    { t: 'Direct Founder Outreach', c: "Hi [Name], I noticed [Company] is building incredible things... I'm a React.js developer with 2.4 years experience and would love to chat about your frontend team." }
                  ].map((tpl, i) => (
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
                     <div style={{fontSize: '13px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <div><strong>LinkedIn:</strong> 15% response</div>
                        <div><strong>Referrals:</strong> 40% response</div>
                        <div style={{marginTop: '8px', padding: '10px', background: 'var(--primary-soft)', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600}}>Success Tip: Send voice notes on LinkedIn.</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'gap' && (
          <div className="page active">
            <div className="page-header">
              <h1><FiZap style={{color: 'var(--amber)'}}/> HR Strategy</h1>
              <p>Addressing the gap with confidence and proof-of-work.</p>
            </div>

            <div className="neet-layout">
              <div className="neet-main-col">
                <div className="card">
                   <div className="card-title">Verbal Mastery</div>
                   <div className="msg-content" style={{borderLeftColor: 'var(--amber)', color: '#fff', fontStyle: 'italic'}}>
                      "Ended in Jan. Since then, intentionally upskilling. Built a high-performance career command center. Ready to contribute."
                   </div>
                   <div className="qa-card" style={{marginTop: '1.5rem'}}>
                      <div className="qa-q">Why did you leave?</div>
                      <div className="qa-a">"Natural conclusion. Shipped core features at Avua. Looking for new React challenges."</div>
                   </div>
                   <div className="qa-card" style={{marginTop: '1.5rem'}}>
                      <div className="qa-q">Salary Expectations?</div>
                      <div className="qa-a">"Based on 2.4yr React exp, looking for market competitive range, but focus is on growth."</div>
                   </div>
                   <div className="qa-card" style={{marginTop: '1.5rem', borderLeftColor: 'var(--secondary)'}}>
                      <div className="qa-q">Tell me about a challenging problem you solved.</div>
                      <div className="qa-a">"Building the drag-and-drop CV editor at Avua. Users needed to reorder resume sections smoothly. I built a live-preview module using React state and optimized re-renders with useMemo. It drastically reduced user friction."</div>
                   </div>
                   <div className="qa-card" style={{marginTop: '1.5rem', borderLeftColor: 'var(--secondary)'}}>
                      <div className="qa-q">Tell me about a time you improved performance.</div>
                      <div className="qa-a">"The complex recruiter dashboards were lagging on massive dataloads. I profiled the app, wrapped expensive components in React.memo, and used useCallback for event handlers to prevent deep re-renders. Performance jumped instantly."</div>
                   </div>
                   <div className="qa-card" style={{marginTop: '1.5rem', borderLeftColor: 'var(--secondary)'}}>
                      <div className="qa-q">How do you handle working independently?</div>
                      <div className="qa-a">"At Avua I owned entire modules end-to-end — from the CV Parser UI to the candidate pipeline structure. I scope my own tasks, build, and ship. I'm highly comfortable managing my own velocity."</div>
                   </div>
                </div>
              </div>

              <div className="neet-side-col">
                 <div className="card">
                    <div className="card-title">Golden Rules</div>
                    <div style={{fontSize: '13px', color: 'var(--dim)', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                       <div><strong>1. No Apologies.</strong> Upskilling is a choice.</div>
                       <div><strong>2. Show Projects.</strong> Proof &gt; Talk.</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
