# ArchSync

**Architecture studio collaboration platform** — file management, version control, spatially-pinned comments, kanban tasks, client approvals, and real-time team presence. Built for architects who have high visual standards and need a tool that actually fits their workflow.

> Vite + React · Node.js + Express · Supabase · Three.js · TypeScript

---

## What it does

Architecture studios fail at coordination, not design. ArchSync replaces the patchwork of Dropbox, email threads, and spreadsheets with a single purpose-built workspace.

| Module | What it solves |
|---|---|
| **Project Workspace** | Central hub per project — files, people, milestones, phases |
| **File & CAD Management** | Upload DWG, RVT, IFC, PDF, PNG — preview in browser without native software |
| **Version History** | Every upload auto-versioned. Named milestone releases. One-click restore. |
| **Spatially-pinned Comments** | Click anywhere on a render to drop a numbered pin and start a thread |
| **Task & Workflow Management** | Kanban board with drag-and-drop. Tasks linked to specific files. |
| **Client Portal & Approvals** | Shareable link (no account needed). Digital sign-off with timestamp and audit trail. |
| **Real-time Collaboration** | Live presence indicators. Activity feed. See who's viewing which file right now. |
| **AI Features** | AI-generated changelogs, meeting notes → action items, design description generator |

---

## Tech Stack

### Frontend (`/client`)
- **Vite + React 18** — fast dev server, ESM-native
- **TypeScript** — strict mode throughout
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — component library (Nova preset)
- **React Router v6** — client-side routing
- **TanStack Query v5** — server state management
- **Three.js + @react-three/fiber** — in-browser 3D/CAD file viewer
- **@dnd-kit** — drag-and-drop for kanban board
- **Lucide React** — icons

### Backend (`/server`)
- **Node.js + Express** — REST API layer
- **TypeScript** — strict mode
- **Supabase** (via `@supabase/supabase-js`) — database queries using service role key
- **Multer** — file upload handling
- **Resend** — transactional email
- **OpenAI API** — AI features (Phase 3)

### Infrastructure
- **Supabase** — PostgreSQL database, Auth, Storage, Realtime WebSockets
- **Supabase Storage** — file storage (`project-files` bucket)
- **Supabase Realtime** — live presence and activity feed

---

## Project Structure

```
ArchSync/
├── client/                    # Vite + React frontend (port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # shadcn/ui components (auto-generated)
│   │   │   ├── layout/        # AppLayout, Sidebar, TopBar
│   │   │   └── features/      # FileViewer, CommentPin, ModelViewer, etc.
│   │   ├── pages/             # Route-level page components
│   │   │   ├── auth/          # LoginPage
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   ├── OnboardingPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── hooks/             # useProjects, useFiles, usePresence, etc.
│   │   ├── lib/
│   │   │   ├── supabase.ts    # Supabase ANON client (browser only)
│   │   │   └── api.ts         # fetch wrapper → Express with auto auth header
│   │   ├── store/             # Zustand global state
│   │   ├── types/             # TypeScript interfaces
│   │   └── App.tsx            # Router setup
│   ├── .env                   # VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
│   └── package.json
│
├── server/                    # Node.js + Express backend (port 3001)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts        # POST /api/auth/*
│   │   │   ├── projects.ts    # GET/POST/DELETE /api/projects
│   │   │   ├── files.ts       # POST /api/files/upload
│   │   │   ├── comments.ts    # GET/POST /api/comments
│   │   │   ├── tasks.ts       # Task CRUD
│   │   │   ├── clients.ts     # Client portal endpoints
│   │   │   └── ai.ts          # AI feature routes (Phase 3)
│   │   ├── middleware/
│   │   │   ├── auth.ts        # requireAuth — verifies Supabase JWT on every route
│   │   │   ├── roles.ts       # requireRole('editor') etc.
│   │   │   └── upload.ts      # Multer config
│   │   ├── lib/
│   │   │   ├── supabase.ts    # Supabase SERVICE ROLE client (server only)
│   │   │   ├── openai.ts      # OpenAI client (Phase 3)
│   │   │   └── resend.ts      # Resend email client
│   │   └── index.ts           # Express entry point
│   ├── .env                   # SUPABASE_SERVICE_ROLE_KEY, etc. — NEVER commit
│   └── package.json
│
├── package.json               # Root — runs both servers with concurrently
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/archsync.git
cd archsync
```

### 2. Install dependencies

```bash
# Install root dev dependencies
npm install

# Install client and server dependencies
npm install --prefix client
npm install --prefix server
```

### 3. Set up environment variables

**Client** — create `client/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Server** — create `server/.env`:
```env
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_key_here
CLIENT_URL=http://localhost:5173
PORT=3001
```

> Get your Supabase keys from **Supabase Dashboard → Settings → API**
> - `VITE_SUPABASE_ANON_KEY` = the `anon public` key
> - `SUPABASE_SERVICE_ROLE_KEY` = the `service_role` key — **never expose this to the browser**

### 4. Set up the database

1. Go to **Supabase → SQL Editor → New query**
2. Paste and run `archsync_schema_fixed.sql`
3. Confirm all 19 tables are visible in **Table Editor**

Create the storage bucket:
1. Go to **Supabase → Storage → New bucket**
2. Name: `project-files`
3. Set to **Private**

### 5. Run the development servers

```bash
# From the root — starts both servers
npm run dev
```

Or separately:
```bash
npm run dev:client   # Vite on http://localhost:5173
npm run dev:server   # Express on http://localhost:3001
```

Verify Express is running: `http://localhost:3001/health` → `{ "status": "ok" }`

---

## How the Stack Connects

```
Browser (React)  →  Express (port 3001)  →  Supabase (Postgres + Storage)
                                          →  OpenAI API (Phase 3)
                                          →  Resend (email)

Browser (React)  →  Supabase Realtime (direct WebSocket — presence + activity feed only)
```

**Key rule:** React never calls Supabase directly for data mutations — everything goes through Express. Express verifies the Supabase JWT on every protected request via `requireAuth` middleware. The only direct browser-to-Supabase connection is Realtime (read-only live updates).

### Auth flow
1. User logs in → Supabase Auth issues a JWT access token
2. `api.ts` attaches it to every request: `Authorization: Bearer <token>`
3. Express `requireAuth` calls `supabaseAdmin.auth.getUser(token)` to verify
4. Valid → `req.userId` set, route handler runs
5. Invalid → 401 returned

---

## Database

19 tables:

`users` · `organizations` · `organization_members` · `projects` · `project_members` · `files` · `file_versions` · `comments` · `comment_mentions` · `tasks` · `client_presentations` · `approvals` · `activity_log` · `notifications` · `notification_preferences` · `invites` · `ai_usage`

**Realtime enabled on:** `comments` · `tasks` · `notifications` · `activity_log` · `file_versions` · `approvals`

> ⚠️ RLS (Row Level Security) is disabled during development. Enable it when RBAC is implemented in Phase 2 Step 13.

---

## Build Roadmap

### Phase 1 — Foundation (Weeks 1–4)
- [x] Monorepo structure — `client/` + `server/`
- [x] Supabase project + database schema (19 tables)
- [x] Express server scaffold + auth middleware
- [x] Frontend scaffold — shadcn/ui, React Router, `api.ts`
- [x] File upload — multer + Supabase Storage (working)
- [ ] Supabase Auth — login, signup, Google OAuth, protected routes
- [ ] Project CRUD

### Phase 2 — Core Features (Weeks 5–10)
- [ ] Auto-versioning — version history panel, named releases
- [ ] Three.js file viewer — 3D, image, PDF
- [ ] Spatially-pinned comment system
- [ ] Kanban task board with drag-and-drop
- [ ] Real-time presence + activity feed
- [ ] Role-based access control + team invite flow
- [ ] Client portal — shareable token, digital sign-off
- [ ] Email notifications — Resend + 6 templates

### Phase 3 — AI + Polish (Weeks 11–15)
- [ ] AI changelog generator (GPT-4o-mini)
- [ ] AI meeting notes summarizer (GPT-4o)
- [ ] AI design description generator (GPT-4o vision)
- [ ] Skeleton loaders, empty states, error boundaries
- [ ] Onboarding flow + Cmd+K command palette

---

## Available Scripts

```bash
# Root
npm run dev              # Start both client and server
npm run dev:client       # Start client only
npm run dev:server       # Start server only
npm run install:all      # Install all dependencies

# Client (from /client)
npm run dev              # Vite dev server
npm run build            # Production build

# Server (from /server)
npm run dev              # nodemon + ts-node
npm run build            # tsc compile
npm run start            # Run compiled output
```

---

## Environment Variables

### client/.env
| Variable | Description |
|---|---|
| `VITE_API_URL` | Express server URL (`http://localhost:3001`) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key — safe to expose in browser |

### server/.env
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **never expose to browser** |
| `RESEND_API_KEY` | Resend key for transactional email |
| `OPENAI_API_KEY` | OpenAI key (Phase 3 only, leave empty for now) |
| `CLIENT_URL` | Frontend URL for CORS (`http://localhost:5173`) |
| `PORT` | Express port (`3001`) |

---

## Git Workflow

```
main        → stable code
redesign    → active UI/layout work
feature/*   → one branch per feature
```

```bash
# New feature
git checkout -b feature/your-feature-name

# Save progress
git add .
git commit -m "what works"

# Merge when done
git checkout main
git merge feature/your-feature-name
```

---

## AI Tools

| Tool | Role |
|---|---|
| **Claude** | Database schema, API architecture, debugging |
| **Antigravity** | UI component and page generation |
| **Cursor** | Implementation, wiring, bug fixing |

---

## License

MIT
