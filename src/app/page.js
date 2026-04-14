'use client';

import { useState, useEffect } from 'react';
import { interviewCategories } from '../lib/interviewData';

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
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [prepCategory, setPrepCategory] = useState('react');
  const [vaultLinks, setVaultLinks] = useState({ resume: '', portfolio: '', github: '', linkedin: '' });
  const [timer, setTimer] = useState(1500); // 25 mins in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  
  const [jTitle, setJTitle] = useState('');
  const [jRole, setJRole] = useState('Frontend Developer');
  const [jSource, setJSource] = useState('LinkedIn');
  
  const [rName, setRName] = useState('');
  const [rCompany, setRCompany] = useState('');
  const [rType, setRType] = useState('Recruiter');
  
  const [coSearch, setCoSearch] = useState('');

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
        if(data.vaultLinks) setVaultLinks(data.vaultLinks);
      }
    });
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

  const syncProgress = async (newDsa, newPrep, newVault = vaultLinks) => {
    await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dsaDone: newDsa, prepDone: newPrep, vaultLinks: newVault })
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

  const togglePrep = (ti, qi) => {
    const key = `${ti}-${qi}`;
    const nextPrep = { ...prepDone, [key]: !prepDone[key] };
    setPrepDone(nextPrep);
    syncProgress(dsaDone, nextPrep);
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
      <span className="nav-icon">{icon}</span>{label}
      {badge !== undefined && <span className="nav-badge">{badge}</span>}
    </button>
  );

  return (
    <>
      <div className="sidebar">
        <div className="logo">Job Hunt <span>HQ</span><br/><small style={{fontSize:'10px',color:'var(--muted)',fontWeight:400}}>Komal's Command Center</small></div>
        <div className="nav-items">
          <NavItem id="dashboard" icon="📊" label="Dashboard" />
          <NavItem id="ai" icon="🤖" label="AI Assistant" />
          <NavItem id="tracker" icon="📋" label="Job Tracker" badge={jobs.length} />
          <NavItem id="companies" icon="🏢" label="Companies" />
          <NavItem id="recruiters" icon="🔍" label="Find Recruiters" />
          <NavItem id="prep" icon="⚡" label="Interview Prep" />
          <NavItem id="dsa" icon="🧮" label="DSA Tracker" />
          <NavItem id="messages" icon="✉️" label="Message Templates" />
          <NavItem id="gap" icon="🛡️" label="Gap Answers" />
        </div>
        
        <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)'}}>
          <div style={{fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, marginBottom: '8px'}}>Link Vault</div>
          {Object.keys(vaultLinks).map(key => (
            <div key={key} style={{marginBottom: '6px', position: 'relative'}}>
              <input 
                placeholder={key + " URL"} 
                value={vaultLinks[key]} 
                onChange={(e) => updateVault(key, e.target.value)} 
                style={{width: '100%', background: 'var(--surf2)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: '11px', padding: '4px 34px 4px 6px', borderRadius: '4px', outline: 'none'}} 
              />
              <button 
                onClick={() => copyMsg(vaultLinks[key] || '')} 
                style={{position: 'absolute', right: '4px', top: '4px', background: 'var(--border2)', border: 'none', color: 'var(--text)', fontSize: '10px', cursor: 'pointer', borderRadius: '2px', padding: '2px 4px'}}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="main">
        {activeTab === 'dashboard' && (
          <div className="page active">
            <div className="page-header">
              <h1>Good morning, Komal 👋</h1>
              <p>2+ months in — you're closer than you think. Let's get that offer this week.</p>
            </div>
            <div className="stats">
              <div className="stat"><div className="stat-val">{jobs.length}</div><div className="stat-lbl">Total applied</div></div>
              <div className="stat"><div className="stat-val">{jobs.filter(j => ['Applied','Screening','Interview'].includes(j.status)).length}</div><div className="stat-lbl">Active / in progress</div></div>
              <div className="stat"><div className="stat-val">{jobs.filter(j => j.status === 'Interview').length}</div><div className="stat-lbl">Interviews</div></div>
              <div className="stat"><div className="stat-val">{jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length}</div><div className="stat-lbl">Applied today</div></div>
            </div>

            <div className="card">
              <div className="card-title">Conversion Funnel</div>
              <div style={{display: 'flex', gap: '2px', height: '24px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px'}}>
                <div style={{width: `${Math.max((jobs.length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--violet)', opacity: 0.9}} title="Applied"></div>
                <div style={{width: `${Math.max((jobs.filter(j=>['Screening','Interview','Offer'].includes(j.status)).length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--amber)', opacity: 0.9}} title="Screened"></div>
                <div style={{width: `${Math.max((jobs.filter(j=>['Interview','Offer'].includes(j.status)).length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--teal)', opacity: 0.9}} title="Interviewing"></div>
                <div style={{width: `${Math.max((jobs.filter(j=>j.status==='Offer').length / Math.max(jobs.length, 1)) * 100, 5)}%`, background: 'var(--green)', opacity: 0.9}} title="Offers"></div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)'}}>
                <span><strong style={{color:'var(--violet)'}}>■</strong> Applied ({jobs.length})</span>
                <span><strong style={{color:'var(--amber)'}}>■</strong> Screened ({jobs.filter(j=>['Screening','Interview','Offer'].includes(j.status)).length})</span>
                <span><strong style={{color:'var(--teal)'}}>■</strong> Interview ({jobs.filter(j=>['Interview','Offer'].includes(j.status)).length})</span>
                <span><strong style={{color:'var(--green)'}}>■</strong> Offers ({jobs.filter(j=>j.status==='Offer').length})</span>
              </div>
            </div>
            
            <div className="card">
              <div className="card-title">Today's targets</div>
              <div className="li">☐ &nbsp;<strong>DSA:</strong> Solve 3 LeetCode problems (1 easy + 2 mediums)</div>
              <div className="li">☐ &nbsp;<strong>React/JS:</strong> Study 3–5 interview topics from prep section</div>
              <div className="li">☐ &nbsp;<strong>Mock interview:</strong> 1 session on Pramp.com or Interviewing.io</div>
              <div className="li">☐ &nbsp;<strong>Recruiter outreach:</strong> 15 messages on LinkedIn</div>
              <div className="li">☐ &nbsp;<strong>Applications:</strong> Apply to 30+ jobs tonight (7:30–10 PM)</div>
              <div className="li">☐ &nbsp;<strong>Follow-ups:</strong> Reply to day-3 and day-7 applications</div>
            </div>
            
            <div className="card">
              <div className="card-title">Follow-up radar</div>
              <div>
                {jobs.filter(j => {
                   const d = daysSince(j.date);
                   return (d === 3 || d === 7) && j.status === 'Applied';
                 }).length === 0 ? (
                   <div className="empty"><div className="empty-icon">📭</div>Add jobs in the tracker to see follow-up reminders</div>
                ) : (
                  jobs.filter(j => {
                    const d = daysSince(j.date);
                    return (d === 3 || d === 7) && j.status === 'Applied';
                  }).map(j => (
                    <div key={j._id} className="fu-item">
                      <div className="fu-dot fu-urgent"></div>
                      <div className="fu-text"><strong>{j.company}</strong> — {j.role}</div>
                      <div className="fu-day">Day {daysSince(j.date)} — follow up now</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="card">
              <div className="card-title">DSA progress</div>
              <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',color:'var(--dim)',marginBottom:'4px'}}><span>{doneDsaCount}</span> / 50 questions completed</div>
                  <div className="prog-wrap"><div className="prog-bar" style={{width:`${dsaProgressPercent}%`}}></div></div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('dsa')}>Continue →</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="page active">
            <div className="page-header">
              <h1>AI Cold Email / Cover Letter Generator</h1>
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
              <div style={{display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center'}}>
                <select value={aiType} onChange={e => setAiType(e.target.value)} style={{background: 'var(--surf2)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '8px 12px', borderRadius: '8px', outline: 'none'}}>
                  <option value="email">Cold Email</option>
                  <option value="cover-letter">Cover Letter</option>
                </select>
                <button 
                  className="btn btn-primary" 
                  onClick={generateAI} 
                  disabled={isGenerating}
                  style={isGenerating ? {opacity: 0.7, cursor: 'not-allowed'} : {}}
                >
                  {isGenerating ? 'Generating...' : '✨ Generate with Gemini'}
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

        {/* ... Include Tracker, Companies, etc in similar style ... */}
        {activeTab === 'tracker' && (
          <div className="page active">
            <div className="page-header">
              <h1>Job Tracker</h1>
              <p>Log every application. Follow up at day 3 and day 7. Never let a lead go cold.</p>
            </div>
            
            <div className="card" style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '13px', color: 'var(--dim)', marginBottom: '5px'}}>
                    <strong>Daily Target:</strong> <span>{jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length}</span> / 30 applications today
                  </div>
                  <div className="prog-wrap">
                    <div className="prog-bar" style={{width: `${Math.min((jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length / 30) * 100, 100)}%`, background: jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length >= 30 ? 'var(--green)' : 'var(--violet)'}}></div>
                  </div>
                </div>
                {jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length >= 30 && (
                  <div style={{background: 'rgba(32, 201, 151, 0.15)', color: 'var(--green)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', border: '1px solid rgba(32, 201, 151, 0.3)'}}>
                    🎯 Target Hit!
                  </div>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-title">Add application</div>
              <div className="tracker-form">
                <div className="form-group"><label>Company</label><input value={jTitle} onChange={(e) => setJTitle(e.target.value)} type="text" placeholder="e.g. Razorpay" /></div>
                <div className="form-group"><label>Role</label>
                  <select value={jRole} onChange={(e) => setJRole(e.target.value)}>
                    <option>Frontend Developer</option>
                    <option>React Developer</option>
                    <option>SDE 1 (Frontend)</option>
                    <option>Software Engineer</option>
                    <option>Full Stack Developer</option>
                    <option>UI Developer</option>
                  </select>
                </div>
                <div className="form-group"><label>Source</label>
                  <select value={jSource} onChange={(e) => setJSource(e.target.value)}>
                    <option>LinkedIn</option><option>Naukri</option><option>Indeed</option><option>Instahyre</option>
                    <option>Wellfound</option><option>Cutshort</option><option>Referral</option><option>Direct</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={addJob}>+ Add</button>
              </div>
            </div>
            <div className="card">
              <div className="card-title">Your applications ({jobs.length})</div>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>#</th><th>Company</th><th>Role</th><th>Source</th><th>Applied</th><th>Status</th><th>Follow-up</th><th>Action</th></tr></thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr><td colSpan="8"><div className="empty"><div className="empty-icon">📝</div>No applications yet. Add your first one above!</div></td></tr>
                    ) : (
                      jobs.map((j, i) => {
                        const d = daysSince(j.date);
                        const fu = followUpStatus(j.date);
                        return (
                          <tr key={j._id}>
                            <td style={{color:'var(--muted)',fontSize:'11px'}}>{jobs.length - i}</td>
                            <td style={{color:'var(--text)',fontWeight:500}}>{j.company}</td>
                            <td>{j.role}</td>
                            <td><span style={{fontSize:'11px',color:'var(--muted)'}}>{j.source}</span></td>
                            <td style={{fontFamily:'"DM Mono",monospace',fontSize:'11px'}}>{j.date}</td>
                            <td>
                              <select value={j.status} onChange={(e) => updateJobStatus(j._id, e.target.value)} style={{background:'var(--surf2)',border:'1px solid var(--border2)',borderRadius:'6px',padding:'3px 6px',color:'var(--text)',fontSize:'11px',outline:'none'}}>
                                {['Applied','Screening','Interview','Rejected','Offer','Ghosted'].map(s => <option key={s}>{s}</option>)}
                              </select>
                            </td>
                            <td>{fu ? <span style={{fontSize:'10px',color:fu.cls==='fu-urgent'?'var(--red)':'var(--amber)'}}>⚑ {d}d</span> : d+'d'}</td>
                            <td><button className="btn btn-danger btn-sm" onClick={() => deleteJob(j._id)}>✕</button></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="page active">
            <div className="page-header">
              <h1>Target Companies</h1>
              <p>These companies hire React devs regularly. Start with top priority ones.</p>
            </div>
            <input className="search-box" placeholder="🔍  Search companies..." value={coSearch} onChange={(e) => setCoSearch(e.target.value)} />
            <div className="company-grid">
              {filteredCompanies.map(c => (
                <div key={c.name} className="company-card">
                  <div className="co-header">
                    <div className="co-logo">{c.logo}</div>
                    <div><div className="co-name">{c.name}</div><div className="co-type">{c.type}</div></div>
                  </div>
                  <div className="co-tags">{c.tags.map(t => <span key={t} className="co-tag">{t}</span>)}</div>
                  <div className="co-links">
                    <a className="co-link" href={`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.search)}`} target="_blank" rel="noreferrer">🔍 Find recruiter</a>
                    <a className="co-link" href={`https://${c.jobs}`} target="_blank" rel="noreferrer">💼 Jobs page</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar maps for Recruiters, Prep, DSA, etc */}
        {activeTab === 'dsa' && (
          <div className="page active">
            <div className="page-header">
              <h1>DSA Tracker</h1>
              <p>Top 50 questions that cover ~80% of frontend interviews. Do in order. Check off as you go.</p>
            </div>
            <div className="card" style={{marginBottom:'1rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',color:'var(--dim)',marginBottom:'5px'}}><span>{doneDsaCount}</span> / 50 completed</div>
                  <div className="prog-wrap"><div className="prog-bar" style={{width:`${dsaProgressPercent}%`}}></div></div>
                </div>
                <div style={{background: 'var(--surf)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontFamily: '"DM Mono", monospace', fontSize: '18px', fontWeight: 'bold'}}>{formatTimer()}</span>
                  <button className="btn btn-sm" onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? '⏸' : '▶'} Focus</button>
                  <button className="btn btn-sm" onClick={() => {setTimerRunning(false); setTimer(1500)}}>↻ 25m</button>
                </div>
                <button className="btn btn-sm" style={{background:'rgba(255,107,107,.15)',color:'var(--red)',border:'1px solid rgba(255,107,107,.2)'}} onClick={() => { if(confirm('Reset Completion?')){ setDsaDone({}); syncProgress({}, prepDone); } }}>Reset</button>
              </div>
            </div>
            <div className="card">
              {dsaQuestions.map(q => (
                <div key={q.n} className="dsa-row">
                  <span className="dsa-n">{String(q.n).padStart(2,'0')}</span>
                  <span className="dsa-name" style={dsaDone[q.n] ? {textDecoration:'line-through',color:'var(--muted)'} : {}}>{q.name}</span>
                  <span className={`badge b-${q.diff}`}>{q.diff}</span>
                  <div className={`dsa-check ${dsaDone[q.n] ? 'done' : ''}`} onClick={() => toggleDsa(q.n)}>
                    {dsaDone[q.n] ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prep' && (
          <div className="page active">
            <div className="page-header">
              <h1>Comprehensive Interview Prep</h1>
              <p>Categorized, high-level Q&A tailored for 2.4 years React experience. Learn the exact structure and perfect verbal response.</p>
            </div>
            
            <div style={{display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1rem'}}>
              {interviewCategories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setPrepCategory(cat.id)}
                  style={{
                    padding: '8px 16px', background: prepCategory === cat.id ? 'var(--violet)' : 'var(--surf2)',
                    color: prepCategory === cat.id ? '#fff' : 'var(--text)', border: '1px solid var(--border2)',
                    borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {interviewCategories.filter(c => c.id === prepCategory).map((data) => {
                const totalQs = data.questions.length;
                const doneQs = data.questions.filter((_, qi) => prepDone[`${data.id}-${qi}`]).length;
                const pct = (doneQs/Math.max(totalQs, 1))*100;
                return (
                  <div key={data.id} className="card" style={{padding: '1.5rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                      <div>
                        <h2 style={{fontSize: '18px', color: 'var(--text)', marginBottom: '4px'}}>{data.label} Mastery</h2>
                        <div style={{fontSize: '12px', color: 'var(--muted)'}}><strong>Focus:</strong> {data.description}</div>
                      </div>
                      <div style={{textAlign: 'right', minWidth: '100px'}}>
                        <div style={{fontSize: '11px', color: 'var(--muted)', marginBottom: '4px'}}>{doneQs}/{totalQs} mastered</div>
                        <div className="prog-wrap"><div className="prog-bar" style={{width:`${pct}%`, background: 'var(--violet)'}}></div></div>
                      </div>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                      {data.questions.map((q, qi) => {
                        const key = `${data.id}-${qi}`;
                        const isExpanded = expandedAnswers[key];
                        return (
                          <div key={qi} style={{background: 'var(--surf2)', border: '1px solid var(--border2)', borderRadius: '8px', overflow: 'hidden'}}>
                            <div 
                              style={{padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', userSelect: 'none'}}
                              onClick={() => setExpandedAnswers({...expandedAnswers, [key]: !isExpanded})}
                            >
                              <div className={`q-check ${prepDone[key] ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); togglePrep(data.id, qi); }}>
                                {prepDone[key] ? '✓' : ''}
                              </div>
                              <div style={{flex: 1, fontSize: '14px', color: prepDone[key] ? 'var(--muted)' : 'var(--text)', textDecoration: prepDone[key] ? 'line-through' : 'none', fontWeight: 500}}>
                                {q.q}
                              </div>
                              <div style={{color: 'var(--muted)', fontSize: '18px', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>↓</div>
                            </div>
                            
                            {isExpanded && (
                              <div style={{padding: '0 16px 16px 44px', borderTop: '1px solid var(--border2)'}}>
                                <div style={{fontSize: '12px', color: 'var(--amber)', fontFamily: '"DM Mono", monospace', padding: '12px 0 8px 0'}}>
                                  <strong>Structure:</strong> {q.structure}
                                </div>
                                <div style={{fontSize: '13px', color: 'var(--text)', lineHeight: '1.6', background: 'var(--surf)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--violet)'}}>
                                  "{q.answer}"
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'recruiters' && (
          <div className="page active">
            <div className="page-header">
              <h1>Find Recruiters</h1>
            </div>
            <div className="card">
              <div className="card-title">Track your outreach here</div>
              <div className="tracker-form" style={{gridTemplateColumns:'1fr 1fr 1fr auto'}}>
                <div className="form-group"><label>Recruiter name</label><input value={rName} onChange={(e) => setRName(e.target.value)} type="text" placeholder="e.g. Priya Sharma" /></div>
                <div className="form-group"><label>Company</label><input value={rCompany} onChange={(e) => setRCompany(e.target.value)} type="text" placeholder="e.g. Razorpay" /></div>
                <div className="form-group"><label>Type</label>
                  <select value={rType} onChange={(e) => setRType(e.target.value)}><option>Recruiter</option><option>Alumni referral</option><option>Connection</option></select>
                </div>
                <button className="btn btn-primary" onClick={addRecruiter}>+ Log</button>
              </div>
              <div style={{marginTop:'.75rem'}}>
                {recruiters.length === 0 ? <div style={{fontSize:'13px',color:'var(--muted)',padding:'.5rem 0'}}>No outreach logged yet.</div> : (
                  <table style={{width:'100%',fontSize:'13px',borderCollapse:'collapse'}}>
                    <tbody>
                      {recruiters.map(r => (
                        <tr key={r._id}>
                          <td style={{padding:'7px 0',borderBottom:'1px solid var(--border)',color:'var(--text)'}}>{r.name}</td>
                          <td style={{padding:'7px 0',borderBottom:'1px solid var(--border)',color:'var(--muted)'}}>{r.company}</td>
                          <td style={{padding:'7px 0',borderBottom:'1px solid var(--border)'}}><span className="tag t-v" style={{fontSize:'9px'}}>{r.type}</span></td>
                          <td style={{padding:'7px 0',borderBottom:'1px solid var(--border)',fontFamily:'"DM Mono",monospace',fontSize:'10px',color:'var(--muted)'}}>{r.date}</td>
                          <td style={{padding:'7px 0',borderBottom:'1px solid var(--border)'}}><button className="btn btn-danger btn-sm" onClick={() => deleteRecruiter(r._id)}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="page active">
            <div className="page-header">
              <h1>Message Templates</h1>
              <p>Copy any template, personalize the [brackets], send. Don't overthink it.</p>
            </div>
            <div className="card">
              <div className="card-title">Recruiter cold message (LinkedIn)</div>
              <div className="msg-template" id="msg1">
                <button className="copy-btn" onClick={() => copyMsg("Hi [Name], I noticed you recruit for [Company] — I'm a React.js developer with 2.4 years of experience building production features at avua.com, an AI hiring platform. I've worked across React, Redux, Node.js, and MongoDB, and I'm actively looking for my next frontend role. Would love to know if there are any openings on your team. Happy to share my resume and portfolio. Thanks!")}>Copy</button>
                Hi [Name], I noticed you recruit for [Company] — I'm a React.js developer with 2.4 years of experience building production features at avua.com, an AI hiring platform. I've worked across React, Redux, Node.js, and MongoDB, and I'm actively looking for my next frontend role. Would love to know if there are any openings on your team. Happy to share my resume and portfolio. Thanks!
              </div>
              <p style={{fontSize:'12px',color:'var(--muted)'}}>Personalize: Company name + one specific thing about them (their product, a recent launch, etc.)</p>
            </div>
            <div className="card">
              <div className="card-title">Alumni / referral request</div>
              <div className="msg-template" id="msg2">
                <button className="copy-btn" onClick={() => copyMsg("Hey [Name], I see you work at [Company] — I noticed we're both from Kurukshetra University! I'm currently exploring React developer roles (2.4 years of experience, worked on production features at avua.com). Would you be open to referring me if there are any frontend openings? Absolutely no pressure — happy to share my resume either way. Thanks so much!")}>Copy</button>
                Hey [Name], I see you work at [Company] — I noticed we're both from Kurukshetra University! I'm currently exploring React developer roles (2.4 years of experience, worked on production features at avua.com). Would you be open to referring me if there are any frontend openings? Absolutely no pressure — happy to share my resume either way. Thanks so much!
              </div>
            </div>
            <div className="card">
              <div className="card-title">Follow-up message (day 5 — no reply)</div>
              <div className="msg-template" id="msg3">
                <button className="copy-btn" onClick={() => copyMsg("Hi [Name], just following up on my message from a few days ago — still very interested in [Company] and excited about the frontend work you're doing. Happy to chat anytime if there's a fit. Thanks!")}>Copy</button>
                Hi [Name], just following up on my message from a few days ago — still very interested in [Company] and excited about the frontend work you're doing. Happy to chat anytime if there's a fit. Thanks!
              </div>
            </div>
            <div className="card">
              <div className="card-title">Application follow-up email (after 7 days)</div>
              <div className="msg-template" id="msg4">
                <button className="copy-btn" onClick={() => copyMsg("Subject: Frontend Developer Application Follow-up — Komal Sharma\n\nHi [Hiring Manager / Team],\n\nI applied for the Frontend Developer role at [Company] about a week ago and wanted to follow up to express my continued interest.\n\nI have 2.4 years of experience building production-grade React features at avua.com, including a real-time CV editor, job board, and recruiter dashboard. I'm confident I can contribute quickly to your frontend team.\n\nWould love the opportunity to connect. Please find my resume attached.\n\nBest regards,\nKomal Sharma\n+91 9350816435 | ikomalsharma27@gmail.com")}>Copy</button>
                Subject: Frontend Developer Application Follow-up — Komal Sharma<br/><br/>
                Hi [Hiring Manager / Team],<br/><br/>
                I applied for the Frontend Developer role at [Company] about a week ago and wanted to follow up to express my continued interest.<br/><br/>
                I have 2.4 years of experience building production-grade React features at avua.com, including a real-time CV editor, job board, and recruiter dashboard. I'm confident I can contribute quickly to your frontend team.<br/><br/>
                Would love the opportunity to connect. Please find my resume attached.<br/><br/>
                Best regards,<br/>
                Komal Sharma<br/>
                +91 9350816435 | ikomalsharma27@gmail.com
              </div>
            </div>
            <div className="card">
              <div className="card-title">Cover letter template (quick, 3-paragraph)</div>
              <div className="msg-template" id="msg5">
                <button className="copy-btn" onClick={() => copyMsg("Hi [Hiring Manager],\n\nI'm a React.js developer with 2.4 years of experience building production features at avua.com — an AI-powered hiring platform serving both recruiters and job seekers. I've worked across the full candidate and recruiter journey: CV parsing, real-time editing, job board, candidate search, and OAuth integration.\n\nI'm drawn to [Company] because [one specific reason — their product, tech stack, mission]. I believe my experience in [relevant skill] maps directly to what you're building.\n\nI'd love the chance to discuss how I can contribute to your frontend team. Portfolio and GitHub linked below.\n\nThanks,\nKomal")}>Copy</button>
                Hi [Hiring Manager],<br/><br/>
                I'm a React.js developer with 2.4 years of experience building production features at avua.com — an AI-powered hiring platform serving both recruiters and job seekers. I've worked across the full candidate and recruiter journey: CV parsing, real-time editing, job board, candidate search, and OAuth integration.<br/><br/>
                I'm drawn to [Company] because [one specific reason — their product, tech stack, mission]. I believe my experience in [relevant skill] maps directly to what you're building.<br/><br/>
                I'd love the chance to discuss how I can contribute to your frontend team. Portfolio and GitHub linked below.<br/><br/>
                Thanks,<br/>
                Komal
              </div>
            </div>
            <div className="card">
              <div className="card-title">Direct Cold Email (To Founders / Hiring Managers)</div>
              <div className="msg-template" id="msg6">
                <button className="copy-btn" onClick={() => copyMsg("Subject: Frontend Developer (React) — Komal Sharma\n\nHi [Name],\n\nI noticed [Company] is building some incredible things in the [Industry/Space] space, particularly with [specific product feature].\n\nI'm reaching out because I'm a React.js developer with 2.4 years of experience looking for my next challenge. Most recently at avua.com, I built highly interactive frontend features including a real-time CV editor and complex recruiter dashboards, utilizing React, Redux, Node.js, and MongoDB.\n\nI know you're likely busy, but if you're open to expanding the frontend team, I'd love to chat. I've linked my resume and portfolio below for your convenience.\n\nBest,\nKomal Sharma\n[Link to Portfolio / LinkedIn]")}>Copy</button>
                Subject: Frontend Developer (React) — Komal Sharma<br/><br/>
                Hi [Name],<br/><br/>
                I noticed [Company] is building some incredible things in the [Industry/Space] space, particularly with [specific product feature].<br/><br/>
                I'm reaching out because I'm a React.js developer with 2.4 years of experience looking for my next challenge. Most recently at avua.com, I built highly interactive frontend features including a real-time CV editor and complex recruiter dashboards, utilizing React, Redux, Node.js, and MongoDB.<br/><br/>
                I know you're likely busy, but if you're open to expanding the frontend team, I'd love to chat. I've linked my resume and portfolio below for your convenience.<br/><br/>
                Best,<br/>
                Komal Sharma<br/>
                [Link to Portfolio / LinkedIn]
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gap' && (
          <div className="page active">
            <div className="page-header">
              <h1>Gap Answers + HR Prep</h1>
              <p>Your gap started Jan 30, 2025. That's ~2.5 months. Here's exactly how to address it.</p>
            </div>
            <div className="card">
              <div className="card-title">The gap answer — memorize this, say it confidently</div>
              <div className="gap-box">"My previous role at Avua ended in January. Since then, I've been intentionally upskilling — I built a full-stack Expense Tracker with a Node.js backend and MongoDB from scratch, deepened my TypeScript knowledge, and have been preparing seriously for my next role. I'm now focused and ready to contribute from day one."</div>
              <div className="li"><strong>Rule 1:</strong> Never apologize for the gap. State it matter-of-factly — "ended in January" not "I've been unemployed since."</div>
              <div className="li"><strong>Rule 2:</strong> Immediately pivot to what you built (Expense Tracker) and what you learned. Evidence {'>'} explanation.</div>
              <div className="li"><strong>Rule 3:</strong> End with forward energy — "ready to contribute from day one." Don't end on a defensive note.</div>
            </div>
            <div className="card">
              <div className="card-title">Other tricky HR questions — ready answers</div>
              <div className="li"><strong>"Why did you leave Avua?"</strong><br/><span style={{color:'var(--dim)'}}>→ "The role came to a natural end. It was a great experience where I contributed to production features across the full platform. I'm now looking for my next challenge where I can grow further as a frontend developer."</span></div>
              <div className="li"><strong>"What were you doing during the gap?"</strong><br/><span style={{color:'var(--dim)'}}>→ "I took the time to build something from scratch — a full-stack Expense Tracker with React, Node.js, MongoDB, and deployed on Vercel. I also prepared seriously for interviews and worked on deepening my TypeScript and system design knowledge."</span></div>
              <div className="li"><strong>"What's your expected salary?"</strong><br/><span style={{color:'var(--dim)'}}>→ First, research the market rate for 2–3 yr React devs in your city (Naukri has salary data). Give a range: "Based on my research and experience, I'm looking at [X–Y LPA], though I'm open to discussing based on the full package." Never give a number first if you can help it.</span></div>
              <div className="li"><strong>"Why should we hire you?"</strong><br/><span style={{color:'var(--dim)'}}>→ "I have 2.4 years of real production experience — not just personal projects. I built features that served actual users at avua.com: a real-time CV editor, OAuth integrations, recruiter dashboards. I can contribute to complex frontend work from day one without needing significant ramp-up time."</span></div>
              <div className="li"><strong>"Tell me about yourself."</strong><br/><span style={{color:'var(--dim)'}}>→ "I'm a React developer with 2.4 years of experience. I spent those years at Avua International building production features for an AI hiring platform — everything from a real-time resume editor to recruiter dashboards. I also recently built a full-stack expense tracker to expand into the MERN stack. I'm now looking for a frontend role where I can work on meaningful products."</span></div>
            </div>
            <div className="card">
              <div className="card-title">Behavioral questions — STAR format answers</div>
              <div className="li"><strong>"Tell me about a challenging problem you solved."</strong><br/><span style={{color:'var(--dim)'}}>→ Use the drag-and-drop CV editor: Situation (users needed to reorder resume sections), Task (build smooth drag-and-drop with live preview), Action (implemented with React state + CSS transitions, optimized re-renders with useMemo), Result (shipped to production, reduced user friction significantly).</span></div>
              <div className="li"><strong>"Tell me about a time you improved performance."</strong><br/><span style={{color:'var(--dim)'}}>→ Use the data-heavy recruiter pages: used React.memo, useMemo, useCallback to reduce unnecessary re-renders. Can describe the before/after behavior clearly.</span></div>
              <div className="li"><strong>"How do you handle working independently?"</strong><br/><span style={{color:'var(--dim)'}}>→ "At Avua I owned entire modules end to end — from the CV parser UI to the job application dashboard. I was responsible for scoping, building, and shipping. I'm comfortable with ownership and proactive communication."</span></div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
