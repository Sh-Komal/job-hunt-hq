# CareerPilot — Smart Job Application Tracker

A modern, AI-powered job application tracking platform built with Next.js. Track every application, manage recruiter relationships, and accelerate your job search — all from one beautiful dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-blue?logo=next.js)

---

## ✨ Features

- **📊 Dashboard** — Real-time stats, daily goals, follow-up reminders, and application streak tracker
- **🤖 AI Assistant** — Auto-generate cover letters and job-specific content using Google Gemini
- **📋 Job Tracker** — Log applications with company, role, source, and status tracking with calendar view
- **🏢 Target Companies** — Curated list of 20+ top tech companies with direct recruiter search links
- **👥 Recruiter CRM** — Track and manage recruiter contacts and outreach
- **📝 Templates** — Ready-to-use LinkedIn and email outreach message templates
- **🛡️ Gap Handling** — HR strategy scripts for confidently addressing career gaps
- **🔐 Authentication** — Google OAuth + email/password login with per-user data isolation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB Atlas (Mongoose) |
| Auth | NextAuth.js (Google OAuth + Credentials) |
| AI | Google Gemini API |
| Styling | Vanilla CSS (Light Modern Theme) |
| Icons | React Icons (Feather) |
| Fonts | Inter, Outfit, JetBrains Mono |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials (for authentication)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/next-jobhunt.git
cd next-jobhunt
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/jobhunt

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI (Optional)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the login page.

### 4. First-Time Data Migration (Optional)

If you have existing job data without `userId` fields, run the migration endpoint once:

```
GET http://localhost:3000/api/migrate?secret=jobhunt-migrate-2024
```

This tags all existing documents with the specified user email.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js   # NextAuth config
│   │   │   └── signup/route.js          # Email/password signup
│   │   ├── jobs/                        # CRUD for job applications
│   │   ├── recruiters/                  # CRUD for recruiter contacts
│   │   ├── generate/route.js            # AI content generation
│   │   └── migrate/route.js             # One-time data migration
│   ├── components/
│   │   ├── AuthProvider.js              # NextAuth SessionProvider
│   │   ├── DashboardTab.js              # Main dashboard view
│   │   ├── AITab.js                     # AI cover letter generator
│   │   ├── TrackerTab.js                # Job tracker with calendar
│   │   ├── CompaniesTab.js              # Target companies directory
│   │   ├── RecruitersTab.js             # Recruiter CRM
│   │   ├── TemplatesTab.js              # Message templates
│   │   └── GapTab.js                    # Career gap strategies
│   ├── login/page.js                    # Animated login/signup page
│   ├── layout.js                        # Root layout with AuthProvider
│   ├── page.js                          # Main app (auth-gated)
│   └── globals.css                      # Light modern design system
├── lib/
│   ├── mongodb.js                       # MongoDB connection handler
│   └── auth.js                          # Auth helper utilities
└── models/
    ├── User.js                          # User schema (email/password/google)
    ├── Job.js                           # Job application schema
    └── Recruiter.js                     # Recruiter contact schema
```

## 🔒 Authentication Flow

1. **Google OAuth** — One-click sign in, auto-creates user on first login
2. **Email/Password** — Traditional signup with bcrypt password hashing
3. **Per-user isolation** — All data queries filter by `userId` (user's email)
4. **Protected routes** — API returns `401 Unauthorized` if no valid session

## 🌐 Deployment

Deploy to Vercel:

```bash
npm run build
```

Set environment variables in Vercel dashboard → Settings → Environment Variables.

Add production callback URI to Google OAuth:
```
https://your-app.vercel.app/api/auth/callback/google
```

## 📄 License

This project is private and built for personal use.
