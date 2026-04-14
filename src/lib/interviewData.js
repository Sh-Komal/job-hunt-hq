export const interviewCategories = [
  {
    id: 'react',
    label: 'React Core',
    description: 'Hooks, Architecture, State Management, and Performance',
    questions: [
      {
        q: "How does React's Virtual DOM actually work?",
        structure: "Render → Diffing (Reconciliation) → Commit",
        answer: "Instead of manipulating the real DOM directly, React keeps a lightweight JavaScript representation of it called the Virtual DOM. When state changes, React creates a new Virtual DOM tree. It then runs a 'diffing' algorithm (Reconciliation) against the previous tree to find the exact changes. Finally, in the Commit phase, it batches those precise updates to the real DOM, making the process highly performant."
      },
      {
        q: "What is the difference between useMemo and useCallback?",
        structure: "Values vs Functions → Referential Equality",
        answer: "Both are used for performance optimization through memoization. `useMemo` caches the *result* of an expensive calculation and returns that value. `useCallback` caches a *function definition* itself. I primarily use `useCallback` when passing a function down as a prop to a child component wrapped in `React.memo`, to prevent the child from re-rendering just because the function's reference changed."
      },
      {
        q: "Why do we need keys in React lists?",
        structure: "Reconciliation → Identity tracking → Bugs if index is used",
        answer: "Keys help React identify which items have changed, been added, or been removed during the reconciliation process. If I don't provide a unique key, React uses the array index by default. This causes massive UI bugs if the list order changes (like sorting or deleting an item in the middle), because React will map the wrong component state to the new index."
      },
      {
        q: "How do you avoid unnecessary re-renders?",
        structure: "State colocation → React.memo → Memo/Callback hooks",
        answer: "At Avua, we had heavy recruiter dashboards. My first step is always 'State Colocation'—moving state as far down the component tree as possible so parent components don't re-render. If that's not enough, I wrap expensive child components in `React.memo` and ensure the props passed to them are memoized using `useMemo` for objects and `useCallback` for functions."
      },
      {
        q: "Explain Context API vs Redux Toolkit.",
        structure: "Prop drilling vs Global State → Re-rendering issues",
        answer: "Context API is built into React and is great for avoiding simple prop drilling (like theme or auth state). But it has a downside: changing a Context value re-renders *every* component consuming that context. For complex, rapidly changing state (like our CV editor at Avua), I use Redux Toolkit. It uses selectors, which ensure components only re-render if the specific slice of state they care about changes."
      },
      {
        q: "What are Custom Hooks and why do we use them?",
        structure: "Logic reuse → Clean UI components",
        answer: "Custom hooks allow us to extract complex, reusable logic out of our UI components. For example, instead of writing `fetch` and `useEffect` logic inside 10 different pages, I build a `useFetch` hook that returns `{ data, loading, error }`. Custom hooks can only be called at the top level of a component and can call other React hooks inside them."
      },
      {
        q: "What is the difference between controlled and uncontrolled components?",
        structure: "React State vs DOM Refs",
        answer: "A controlled component takes its current value through props and notifies changes through callbacks like `onChange`. The data is handled by React state. An uncontrolled component stores its own state internally, and we query the DOM directly using a `ref` (via `useRef`) to find its current value when needed, like on form submission."
      },
      {
        q: "How does the dependency array in useEffect work under the hood?",
        structure: "Object.is() equality check → Stale Closures",
        answer: "React uses `Object.is()` to check if the dependencies have changed since the last render. If even one dependency changed, it clears the old effect and runs the new one. If we omit a variable used inside the effect from the dependency array, we create a 'Stale Closure', where the effect is running but seeing an old, outdated version of the variable."
      },
      {
        q: "Can you explain Error Boundaries in React?",
        structure: "Catch rendering errors → Fallback UI",
        answer: "Error boundaries are class components (they cannot be written as hooks yet) that implement `componentDidCatch` and `static getDerivedStateFromError`. They act like a `catch{}` block for components. If a child component throws an error during rendering, the boundary catches it and displays a fallback UI instead of crashing the entire React tree."
      },
      {
        q: "What is Prop Drilling and how do you fix it?",
        structure: "Passing props deeply → Component Composition / Context",
        answer: "Prop drilling is when you pass a prop through multiple layers of intermediate components that don't need it, just to reach a deeply nested child. To fix it, you can either use the Context API/Redux to access it globally, or better yet, use 'Component Composition'—passing the child component itself as a prop (usually `children`) so you don't drill data."
      },
      {
        q: "What exactly is Portals in React?",
        structure: "Render outside hierarchy → Modals/Tooltips",
        answer: "React Portals (`ReactDOM.createPortal`) allow you to render a child component into a DOM node that exists entirely outside the DOM hierarchy of the parent component. It is strictly used for UI elements that must break out of standard flow, like Modals, Tooltips, or Dropdowns, so they aren't trapped by the parent's `overflow: hidden` or `z-index`."
      }
    ]
  },
  {
    id: 'js',
    label: 'JavaScript',
    description: 'Event Loop, Closures, Async/Await, and Core Engine Mechanics',
    questions: [
      {
        q: "Explain the JavaScript Event Loop.",
        structure: "Call Stack → Web APIs → Callback/Microtask Queue",
        answer: "JS is single-threaded. When a script runs, synchronous code goes onto the Call Stack. Async operations (like setTimeout or fetch) are sent to Web APIs. When they finish, their callbacks go to a Queue. The Event Loop constantly checks: 'Is the Call Stack empty?'. If yes, it pushes the first task from the Queue onto the Call Stack. Microtasks (Promises) always get priority over Macrotasks (setTimeout)."
      },
      {
        q: "What is a Closure? Give me a real-world example.",
        structure: "Lexical Scope retention → Data Privacy / Debouncing",
        answer: "A closure happens when a function remembers its lexical scope—the variables outside its block—even after the outer function has returned. A classic real-world example is a `debounce` function. The inner returned function has access to the `timerId` variable declared in the outer function, allowing it to clear the previous timeout every time the user types."
      },
      {
        q: "What is Event Delegation?",
        structure: "Event Bubbling → Memory optimization",
        answer: "Event delegation relies on 'Event Bubbling', where an event on a child element bubbles up to its parents. Tell the interviewer: Say I have a list of 100 job cards. Instead of attaching 100 `onClick` listeners, I put ONE listener on the parent `<ul>`. Inside the listener, I check `event.target` to figure out which card was clicked. This saves massive amounts of memory."
      },
      {
        q: "Difference between var, let, and const? What is the Temporal Dead Zone?",
        structure: "Scoping → Reassignment → TDZ explanation",
        answer: "`var` is function-scoped and gets hoisted with an initial value of undefined. `let` and `const` are block-scoped and hoisted *without* being initialized, throwing an error if accessed early. `const` prevents reassignment. The Temporal Dead Zone (TDZ) is the time between when a `let`/`const` block is entered and when the variable is actually initialized. Accessing it in the TDZ throws a ReferenceError."
      },
      {
        q: "How does 'this' work in JavaScript?",
        structure: "Execution context → 4 rules (Implicit, Explicit, New, Window)",
        answer: "The value of `this` depends entirely on *how* a function is called, not where it's written. 1) Implicit binding: `obj.func()` -> `this` is `obj`. 2) Explicit: using `.call()`, `.apply()`, or `.bind()`. 3) New binding: `new Constructor()`. 4) Default: if none of those apply, `this` is the global window object (or undefined in strict mode). Arrow functions are the exception—they inherit `this` lexically from their parent scope."
      },
      {
        q: "What is the difference between Promise.all, Promise.allSettled, and Promise.race?",
        structure: "Short-circuiting vs full execution",
        answer: "`Promise.all` runs promises concurrently but instantly fails if ANY promise rejects. `Promise.allSettled` waits for all to finish entirely regardless of success or failure. `Promise.race` simply returns the result (fulfilled or rejected) of whichever promise finishes absolutely first."
      },
      {
        q: "Deep vs Shallow Copy in JavaScript?",
        structure: "References vs Values → structuredClone",
        answer: "A shallow copy (like `...spread` or `Object.assign`) copies flat values but only copies references for nested objects. Modifying a deeply nested key updates the original. A deep copy clones everything. Previously we used `JSON.parse(JSON.stringify(obj))` but now the standard is the native `structuredClone()` API."
      },
      {
        q: "What are Generators and Iterator functions?",
        structure: "function* → yield → pausing execution",
        answer: "Generators are functions that can be paused mid-execution and resumed later. They are defined with `function*` and use the `yield` keyword to return values sequentially. When called, they don't execute immediately but instead return an Iterator object, which you can call `.next()` on to proceed block-by-block."
      },
      {
        q: "What is Currying in JavaScript?",
        structure: "Breaking down arguments",
        answer: "Currying is a functional programming technique where a function that takes multiple arguments is transformed into a sequence of nested functions, each taking a single argument. So `sum(1, 2, 3)` becomes `sum(1)(2)(3)`. It is incredibly useful for event handlers in React or creating configuration functions."
      }
    ]
  },
  {
    id: 'ts',
    label: 'TypeScript',
    description: 'Types vs Interfaces, Generics, and strict mode configurations',
    questions: [
      {
        q: "Interface vs Type - When to use which?",
        structure: "Extensibility → Unions → Convention",
        answer: "They are very similar, but `interface` is specifically for defining the shape of an Object or Class, and it supports 'declaration merging' (if you define the same interface twice, they merge). `type` is more flexible—it can be used for Primitive types, Unions (`string | number`), and Tuples. By convention, I use `interface` for component Props and complex objects, and `type` for unions and utility aliases."
      },
      {
        q: "What are Generics in TypeScript?",
        structure: "Reusable types → Type parameters → Real example",
        answer: "Generics allow us to write reusable, type-safe functions or components where the type isn't known until the function is called. It's like passing arguments to a function, but for types. For example, a generic API fetcher: `async function fetchData<T>(url): Promise<T>`. When calling it, I can specify `fetchData<User>('/user')`, and TS will know the response perfectly matches the User interface."
      },
      {
        q: "Explain Omit, Pick, Partial, and Required utility types.",
        structure: "Type transformations without duplication",
        answer: "These utility types prevent us from rewriting types constantly. \n`Partial<T>` makes all fields optional. \n`Required<T>` makes all fields mandatory. \n`Pick<T, 'name' | 'age'>` creates a new type with only specific fields from T. \n`Omit<T, 'password'>` creates a new type excluding specific fields. I use these heavily when defining API payload types vs Database schema types."
      },
      {
        q: "What is the 'any' type and why avoid it?",
        structure: "Disables type checking → unknown is better",
        answer: "Using `any` completely turns off TypeScript's compiler for that variable, defeating the point of using TS. If I genuinely don't know what data is coming in (e.g. user input or a raw API response), I use `unknown` instead. `unknown` forces me to do type-checking/narrowing (e.g. `typeof val === 'string'`) before I can actually execute operations on it."
      },
      {
        q: "What is a Tuple in TypeScript?",
        structure: "Fixed-length array → Specific types per index",
        answer: "A Tuple is an array with a fixed number of elements whose types are known and do not have to be the same. The best example in React is the `useState` hook, which returns a Tuple of exactly two items: `[State, Setter]`. Example: `let user: [number, string] = [1, 'Komal']`."
      },
      {
        q: "What are Discriminated Unions?",
        structure: "Shared literal property → Type Narrowing",
        answer: "A Discriminated Union is when you have multiple object types in a Union, and they all share a single literal property (like `type: 'success' | 'error'`). TypeScript is smart enough so that when you use an `if (res.type === 'error')` statement, it instantly knows the exact shape of `res` inside that block. Very useful in Redux reducers."
      }
    ]
  },
  {
    id: 'system',
    label: 'Frontend System Design',
    description: 'Architecture, scalable structures, WebSockets, Performance APIs',
    questions: [
      {
        q: "Design a fast, scalable News Feed or Job Feed (like LinkedIn/Naukri).",
        structure: "Requirements → Architecture (Virtualization, Pagination) → State",
        answer: "First, I'd clarify constraints. For the UI, since we'll have hundreds of cards, rendering them all destroys the DOM. I'd use 'Virtualization' (e.g., react-virtualized) to render only the 10 visible cards. For data fetching, I'd implement cursor-based infinite scrolling using the `IntersectionObserver` API. For state management of the feed data, I'd use React Query or SWR to handle caching, deduplication, and stale-time automatically."
      },
      {
        q: "How would you design a real-time Chat Application?",
        structure: "Protocols → WebSocket → Optimistic UI",
        answer: "For real-time delivery, traditional HTTP polling is inefficient. I'd establish a WebSocket connection (or use Server-Sent Events). On the frontend, the most critical part is 'Optimistic UI'. When a user hits send, I instantly render the message in the DOM so it feels blazing fast, while sending the data over the socket in the background. If the socket returns an error, I show a red 'Failed to send' icon and allow retries."
      },
      {
        q: "What are Core Web Vitals and how do you improve them?",
        structure: "LCP → CLS → FID/INP",
        answer: "1) LCP (Largest Contentful Paint): How fast the main content loads. Fix it by lazy-loading below-the-fold images and preloading the hero image. 2) CLS (Cumulative Layout Shift): When the UI jumps around. Fix it by providing fixed width/heights to images and ad slots before they load. 3) INP (Interaction to Next Paint): UI responsiveness. Fix it by breaking up heavy JavaScript execution into smaller chunks so the main thread isn't blocked."
      },
      {
        q: "How would you build an auto-suggest/autocomplete search architecture?",
        structure: "Trie/Backend constraints → Debounce → Cancel requests",
        answer: "Frontend-wise: I'd bind a controlled input with an onChange handler that runs through a `useDebounce` hook (say 300ms). This prevents API slamming. Critically, if I type 'React' and the API for 'Reac' is exceptionally slow and returns *after* 'React', it overrides the UI. I prevent this by attaching an `AbortController` to cancel any pending/stale API requests every time the user hits a new key."
      },
      {
        q: "Design an elegant Drag and Drop interface (like the Avua CV Builder).",
        structure: "State mapping → Pointer events → Re-renders",
        answer: "I've built this at Avua. Instead of tracking exact drag XY coordinates in React state (which causes thousands of re-renders and lags), I use standard HTML5 Drag/Drop APIs or a lightweight library. The state simply holds an array of objects. On `onDragEnd`, I swap the indexes in the array and update the state ONCE. I wrap child cards in React.memo so unaffected elements don't suddenly re-render."
      }
    ]
  },
  {
    id: 'next',
    label: 'Next.js',
    description: 'SSR, App Router, SEO, and Server Components',
    questions: [
      {
        q: "CSR vs SSR vs SSG - When to use what?",
        structure: "Definitions → SEO → Data freshness",
        answer: "Client-Side Rendering (CSR) renders empty HTML and loads JS; great for private dashboards (like Avua recruiter portal). Server-Side Rendering (SSR) fetches fresh data and renders HTML on the server *per request*; great for dynamic SEO pages like Job Descriptions. Static Site Generation (SSG) compiles the HTML at build time; perfect for blazing fast blogs or marketing pages that don't change every second."
      },
      {
        q: "What are React Server Components (RSC) in the App Router?",
        structure: "Zero JS bundle size → Direct DB access",
        answer: "In Next.js 13+ App Router, components are Server Components by default. Unlike SSR, these never send Javascript to the browser—they execute fully on the server and send pure HTML. This massively reduces the client JS bundle size. It also allows us to write `async/await` directly in the component and fetch data from the database securely without writing an intermediary API endpoint."
      },
      {
        q: "What is Hydration in Next.js? What causes hydration errors?",
        structure: "Attaching event listeners → Mismatch cause",
        answer: "Hydration is the process where React takes the static HTML sent by the server and attaches JavaScript event listeners to make it interactive. A hydration error occurs when the HTML generated on the server doesn't perfectly match the HTML generated on the client's first render. This usually happens if you try to render something based on `window` or `localStorage` on the initial mount, since the server doesn't know about them."
      },
      {
        q: "How does image optimization work in Next.js <Image />?",
        structure: "WebP conversion → CLS prevention",
        answer: "The built-in `<Image>` tag prevents Cumulative Layout Shift (CLS) by forcing you to define width and height. Under the hood, it automatically resizes, optimizes, and serves images in modern formats like WebP or AVIF on-demand when the browser requests them, rather than shipping massive PNGs. It also lazy-loads them out of the box."
      },
      {
        q: "What is the difference between getServerSideProps and getStaticProps (Pages Router)?",
        structure: "Per-request vs Build-time",
        answer: "`getServerSideProps` runs on the server on absolutely every single request. It's slower but guarantees 100% fresh data. `getStaticProps` runs exactly once at build time (or on an interval if using ISR revalidation). It renders an HTML file that can be instantly served from a CDN, making it unbelievably fast but potentially slightly out of date."
      }
    ]
  }
];
