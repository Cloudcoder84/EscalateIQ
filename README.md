# EscalateIQ ⚡

> **Universal AI-Powered Interview Readiness & Career Acceleration Studio**  
> *Engineered for Technical Support Engineers (TSE), Escalation Managers (EEM), Solutions Architects, and Mission-Critical Systems Leaders.*

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange?logo=google)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📌 Overview

**EscalateIQ** is an executive-grade career acceleration and mock interview simulation platform designed specifically for high-stakes technical customer engineering roles. Whether you are aiming for **Principal Technical Support Engineer (TSE)**, **Enterprise Escalation Manager (EEM)**, or **Customer Solutions Architect**, EscalateIQ trains you to navigate SEV-0 incidents, high-pressure executive communications, architectural root-cause analyses (RCA), and rigorous hiring bar-raisers.

Powered by **Google Gemini** with real-time **Google Search Grounding**, EscalateIQ cross-references real-time web intelligence on target employers, delivers dynamic interactive simulations, and persists your historical progression across devices with **Firebase**.

---

## ✨ Key Features

### 1. 🎙️ Adaptive AI Mock Interview Simulator
- **Multi-Persona Evaluators**: Simulates interactions with Senior Engineering Directors, Crisis Escalation VPs, and Systems Bar-Raisers.
- **Multiple Assessment Tracks**:
  - **SEV-0 Incident Command & Triage**: High-urgency crisis simulation, mitigation roadmaps, and stakeholder alignment.
  - **Architectural & Deep Troubleshooting**: Kernel-level panics, distributed race conditions, network latency spikes, and microservice debugging.
  - **Executive & Customer De-escalation**: Hostile customer negotiations, C-suite SLA breaches, and expectation alignment.
  - **Behavioral & Cross-Functional Influence**: Product vs. Support trade-offs and team mentorship.
- **Dynamic Grading & Rubric Scoring**: Scores candidates across Technical Depth, Customer Empathy, Incident Governance, and Communication Structure, offering actionable strengths and blind spots.

### 2. 🔍 Job Description (JD) Reverse-Engineer Studio
- **Real-Time Google Search Grounding**: Paste any job description and company name to automatically query live web data for recent outages, architectural pivots, public incident reports, and corporate priorities.
- **Executive Blueprint Generation**:
  - Core competency and evaluation rubric extraction.
  - Anticipated interview curveballs and target questions.
  - Recommended architectural war stories to highlight.
  - Target cloud certifications and domain knowledge gaps.
- **One-Click Simulator Launch**: Convert any parsed JD blueprint into a live tailored interview scenario with a single click.

### 3. 📈 Performance Analytics & Progress Dashboard
- **Longitudinal Score Tracking**: Visualizes performance trajectory over time with interactive SVG trend lines.
- **Response Latency & Pacing**: Tracks average response time per turn to calibrate concise crisis communication under pressure.
- **Track & Stage Breakdown**: Comparative metrics across triage, systems troubleshooting, and behavioral interviews.
- **Session History & Review**: Detailed logs of past transcripts, scenarios, and evaluator feedback.

### 4. 📅 4-Week Structured Preparation Curriculum
- Day-by-day 28-day roadmap designed to take engineers from foundational brush-up to final executive loop readiness.
- Covers networking, Linux/container internals, cloud resilience, RCA post-mortem authoring, and salary negotiation.
- Integrated checkbox milestone tracker with local state persistence.

### 5. 🛡️ War Stories & Enterprise Cheat Sheet Vault
- Structured **STAR / CAR** story matrix (Context, Action, Result, Metric) tailored for enterprise support and escalation.
- Cheat sheet reference covering incident management lifecycle, blameless post-mortem frameworks, and SLA/SLO calculation matrices.

### 6. 🧭 Strategic Career Advisor & Fit Evaluator
- Strategic analysis between Principal Support, Escalation Management, and Solutions Engineering tracks.
- Guidance on leveraging advanced academic degrees (MS/PhD in CS/Data Science) into senior enterprise compensation packages.

### 7. ☁️ Firebase Authentication & Multi-Device Sync
- Optional **Google One-Click Sign-In** for seamless cloud persistence.
- Automatic Firestore syncing for interview transcripts, scorecard history, and saved JD blueprints.
- Secure fallback to local browser storage for offline or guest access.

---

## 🛠️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   EscalateIQ Web UI                    │
│    React 19 + TypeScript + Tailwind CSS v4 + Vite      │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
        HTTP API Proxy               Auth & Sync
               │                          │
               ▼                          ▼
┌──────────────────────────────┐ ┌────────────────────────┐
│       Express Backend        │ │   Firebase Services    │
│  • Google Gemini 2.5 Flash   │ │  • Firebase Auth       │
│  • Google Search Grounding   │ │  • Cloud Firestore     │
│  • Evaluation & Chat Prompts │ │  • firestore.rules     │
└──────────────────────────────┘ └────────────────────────┘
```

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Backend**: [Express](https://expressjs.com/) on Node.js with Vite middleware integration
- **AI Engine**: [Google Gen AI SDK (`@google/genai`)](https://github.com/google-gemini/generative-ai-js) with `gemini-2.5-flash`
- **Database & Authentication**: [Firebase SDK v13](https://firebase.google.com/) with Google Sign-In and Cloud Firestore

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Google Gemini API key ([Get one at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/escalate-iq.git
   cd escalate-iq
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   # Required: Google Gemini API Key for AI interview simulation & JD parsing
   GEMINI_API_KEY=your_gemini_api_key_here

   # Port configuration (default: 3000)
   PORT=3000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express server with Vite middleware in development mode |
| `npm run build` | Builds the client application for production |
| `npm run start` | Runs the production application server |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans build artifacts (`dist` folder) |

---

## 🔒 Security & Firestore Rules

EscalateIQ implements user isolation security rules in `firestore.rules`:
- Users can only read and write their own simulation records, blueprints, and profiles under `/users/{userId}/*`.
- Requests require valid Firebase Authentication credentials for database access.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
