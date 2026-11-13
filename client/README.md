# 🖥️ ResolveAI — Frontend Client

The frontend web application for ResolveAI, built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

It provides both a marketing landing page and the **Live Support Desk & Operator Copilot** where agents triage tickets, inspect real-time AI briefings, and intervene seamlessly.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/node` and `@tailwindcss/oxide`)
- **UI Components & Icons**:
  - [Lucide React](https://lucide.dev/)
  - [Base UI](https://base-ui.com/) & Radix UI accessible primitives
  - [Class Variance Authority (CVA)](https://cva.style/)
- **Networking**: [Axios](https://axios-http.com/) configured with credentials for HttpOnly cookie support

---

## 📁 Directory Structure

```bash
client/
├── app/                        # App Router hierarchy
│   ├── auth/                   # OAuth callback handling
│   ├── dashboard/              # Live Support Desk & Copilot UI
│   ├── login/                  # Agent sign-in view
│   ├── signup/                 # Registration view
│   ├── globals.css             # Compiled Tailwind output
│   ├── input.css               # Base Tailwind theme and tokens
│   ├── layout.tsx              # Root HTML & metadata layout
│   └── page.tsx                # Marketing landing page
├── components/                 # Component library
│   ├── dashboard/              # Support desk components
│   │   ├── CreateTicketModal.tsx   # Ticket creator with scenario presets
│   │   ├── DashboardHeader.tsx     # Header bar with user profile & status
│   │   ├── LiveSupportDesk.tsx     # Real-time chat, briefing & timeline view
│   │   ├── MetricsOverview.tsx     # KPI metric summary cards
│   │   └── types.ts                # TypeScript interfaces for tickets & briefings
│   ├── landing/                # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── FeaturesGrid.tsx
│   │   ├── ArchitectureSection.tsx
│   │   ├── ComparisonSection.tsx
│   │   └── FAQSection.tsx
│   └── ui/                     # Shared UI primitives (buttons, badges, modals)
├── lib/
│   ├── api/                    # Axios API client and ticket endpoints
│   ├── auth-context.tsx        # React Context for user authentication & sessions
│   └── utils.ts                # Styling & helper utilities
├── build-css.js                # Tailwind CSS v4 compiler runner
└── package.json
```

---

## ⚡ Quickstart

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure `client/.env.local`:
```env
# Backend server URL (FastAPI)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# API v1 base route
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_VERSION=v1
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run Development Server

```bash
npm run dev
```

*Note: The `npm run dev` script automatically executes `node build-css.js` prior to launching Next.js to compile Tailwind CSS v4 classes.*

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### 4. Build for Production

```bash
npm run build
npm start
```
