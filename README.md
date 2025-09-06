# 🌐 BHASA-RAKSHAK — Dialect Preservation Platform  

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

---

## 📖 Overview  

**BHASA-RAKSHAK** is a **modern full-stack web application** built to **preserve endangered dialects** using  
💡 **AI-powered tools** + 🌍 **community-driven contributions**.  

It empowers **native speakers, learners, linguists, and researchers** to **record, share, learn, and archive dialects** in an interactive and engaging platform.  

---

## ✨ Features  

### 👤 Contributor  
- Record & upload **audio, video, text, and images**.  
- Add metadata: dialect, region, tags, translation.  
- Offline-first upload → sync later.  
- Like, comment, share, and follow contributors.  
- Edit/delete contributions with version control.  

### 📚 Learner  
- Explore archives with **search & filters**.  
- AI transcripts & translations.  
- **Text-to-Speech (TTS)** dialect playback.  
- Pronunciation feedback & interactive chatbots.  
- Gamified learning: quizzes, flashcards, leaderboards.  

### 🎓 Linguist  
- Verify & annotate contributions.  
- Add phonetic transcriptions (IPA).  
- Approve verified dialect data.  
- Historical reconstruction tools.  

### 🧑‍🔬 Researcher  
- Structured access to datasets.  
- Export in CSV, JSON, audio packs.  
- Dialect maps & timeline visualizations.  
- Controlled access for sensitive data.  

### 🛠️ Admin  
- CRUD for contributions.  
- User & role management.  
- Moderation for flagged content.  
- Analytics dashboards.  

---

## 🏗️ Tech Stack  

### 🎨 Frontend  
- Next.js 14.0.4 (React 18)  
- TypeScript  
- Tailwind CSS + Framer Motion  
- Lucide React (icons)  
- React Hook Form (forms)  
- React Hot Toast (notifications)  
- React Dropzone (file uploads)  
- Recharts (charts/analytics)  
- clsx, tailwind-merge (utilities)  

### 🗄️ Backend & Database  
- Supabase (PostgreSQL)  
- Supabase Auth (authentication)  
- Supabase Storage (media storage)  
- Supabase Auth Helpers for Next.js/React  

### 🛠️ Dev Tools  
- ESLint  
- PostCSS + Autoprefixer  
- TypeScript (type safety)  
- npm (package manager)  
- dotenv (environment config)  

### 🚀 Deployment  
- Vercel (serverless hosting)  
- Supabase JS client (API calls)  

---

## 📌 Architecture  

```mermaid
flowchart TD
    U[User] -->|Login/Signup| A[Supabase Auth]
    U -->|Upload/Explore| F[Next.js Frontend]
    F -->|Data| DB[(Supabase Postgres DB)]
    F -->|Files| ST[Supabase Storage]
    F -->|AI Services| AI[Gemini / Whisper / TTS APIs]
    DB --> F
    ST --> F
    A --> DB
