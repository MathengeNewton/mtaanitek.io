# Mtaa — Day 1 Work Document (Foundation Day)

**Date:** January 19, 2026  
**Session Time:** 2:00 PM - 4:30 PM  
**Goal:** Repo runs + structure locked

---

## End-of-Day Definition of Done

- [ ] Repo created with clean structure (`apps/web` + `apps/api`)
- [ ] Web app runs locally ("Hello Mtaa")
- [ ] API runs locally and exposes `/api/health`
- [ ] Web calls API `/api/health` and displays "API OK"
- [ ] CORS configured (frontend can call backend)
- [ ] Domain model written (entities + relationships)
- [ ] Week 1 deliverables written + tomorrow recording plan ready
- [ ] `.gitignore` configured
- [ ] First meaningful commit pushed

---

## Today's Step-by-Step Tasks (Suggested Order)

### 1. Lock Stack (15 min)
**Decision:** Backend (Node+TS), DB (Postgres), ORM (Prisma), Frontend (Next.js)

**Write it down:**
- Backend: Node.js + TypeScript + Express/Fastify
- Database: PostgreSQL (local for now)
- ORM: Prisma
- Frontend: Next.js + TypeScript
- Ports: API (4500), Web (3000)

**Output:** Note in `docs/decisions.md`

---

### 2. Create Repo Skeleton (30–45 min)

**Structure:**
```
mtaa/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node/Express backend
├── docs/
│   ├── domain.md
│   ├── decisions.md
│   └── week1-plan.md
├── .gitignore
├── README.md
└── package.json (root, optional - for monorepo)
```

**Tasks:**
- [ ] Create folder structure
- [ ] Initialize git: `git init`
- [ ] Create `.gitignore` (see below)
- [ ] First commit: `git commit -m "Initial repo structure"`

**`.gitignore` essentials:**
```
node_modules/
.env
.env.local
dist/
build/
.next/
*.log
.DS_Store
```

---

### 3. Boot Both Services (45–60 min)

**Backend (API):**
- [ ] Initialize `apps/api/` with npm/package.json
- [ ] Install: Express, TypeScript, dotenv
- [ ] Create `src/main.ts` with Express server
- [ ] Add `/api/health` endpoint returning `{ status: 'ok' }`
- [ ] Configure CORS (allow `http://localhost:3000`)
- [ ] Run on port 4500
- [ ] Test: `curl http://localhost:4500/api/health`

**Frontend (Web):**
- [ ] Initialize `apps/web/` with Next.js
- [ ] Create simple page that calls backend `/api/health`
- [ ] Display "API OK" when health check succeeds
- [ ] Run on port 3000
- [ ] Test: Open `http://localhost:3000` → should show "API OK"

**CORS Setup (Important):**
Backend must allow frontend origin:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true
});
```

**Package.json Scripts:**
Backend:
```json
"scripts": {
  "dev": "ts-node src/main.ts",
  "build": "tsc",
  "start": "node dist/main.js"
}
```

Frontend:
```json
"scripts": {
  "dev": "next dev -p 3000",
  "build": "next build",
  "start": "next start -p 3000"
}
```

---

### 4. Write Domain Model (30 min)

**File:** `docs/domain.md`

**Entities to document:**
- User
- Merchant
- Rider (Bodaboda)
- Zone/Street
- QRToken
- Request (later)

**Include:**
- Purpose of each entity
- Key fields
- Relationships
- Key business rules

**Reference:** See `planw1.md` section 1 for full structure

---

### 5. Write Decisions (20 min)

**File:** `docs/decisions.md`

**Decisions to document:**
- [ ] Boundary method: Radius (Week 1) / Polygon (later)
- [ ] Outside boundary behavior: Read-only (recommended) / Blocked
- [ ] Stack choices (from step 1)
- [ ] Port assignments

**Format:**
- Option A vs Option B
- Decision made
- Rationale
- Implementation notes

**Reference:** See `planw1.md` section 2 for full details

---

### 6. Plan Week 1 Deliverables + Scripts Outline (30 min)

**File:** `docs/week1-plan.md`

**Include:**
- [ ] Week 1 deliverables checklist
- [ ] 3 video titles:
  - Video 1: Principle - "Location as Permission"
  - Video 2: Build - "Implementing Boundary Checks"
  - Video 3: Reflection - "What Breaks in Real Life"
- [ ] Script cards outline for each video

**Reference:** See `planw1.md` section 3 for full structure

---

### 7. Prep Tomorrow Recording Plan (10 min)

**File:** Add to `docs/week1-plan.md` or separate `docs/recording-plan.md`

**Include:**
- [ ] Recording software setup (OBS/SimpleScreenRecorder - install tomorrow)
- [ ] Video 1: What to show (domain model, philosophy)
- [ ] Video 2: Start file, end file, feature slice
- [ ] Video 3: Edge cases to discuss

**Feature Slice for Video 2:**
- Start: Empty function `isPointInZone(userLat, userLng, zone)`
- End: Working function with test
- Files: `apps/api/src/zones/zone.service.ts`

**Reference:** See `planw1.md` section 4 for full recording plan

---

## Outputs to Produce Today (Files to Create)

- [ ] **README.md** — How to run web + api locally
  - Prerequisites (Node version, Postgres if needed)
  - Installation steps
  - Running instructions
  - Port numbers

- [ ] **docs/domain.md** — Domain model + rules
  - All entities
  - Relationships
  - Business rules

- [ ] **docs/decisions.md** — Key choices + rationale
  - Stack decisions
  - Boundary method
  - Outside behavior
  - Any other architectural choices

- [ ] **docs/week1-plan.md** — Week 1 deliverables + 3 video titles
  - Deliverables checklist
  - Video scripts outline
  - Recording plan

- [ ] **.gitignore** — Standard ignores
  - node_modules, .env, dist, build, .next, logs

---

## Additional Setup Notes

### Environment Variables
Create `.env.example` files:

**Backend (`apps/api/.env.example`):**
```
PORT=4500
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/mtaa_dev
```

**Frontend (`apps/web/.env.example`):**
```
NEXT_PUBLIC_API_URL=http://localhost:4500/api
```

### Testing the Full Flow
Before marking Day 1 done:
1. Start backend: `cd apps/api && npm run dev`
2. Start frontend: `cd apps/web && npm run dev`
3. Open browser: `http://localhost:3000`
4. Verify: Page shows "API OK" (or similar)
5. Check browser console: No CORS errors

---

## Notes / Decisions (Fill In)

**Stack chosen:** ________________________________

**Boundary method (radius/polygon):** ____________________

**Outside boundary behavior (blocked/read-only):** ____________

**API Port:** 4500  
**Web Port:** 3000

**Tomorrow's recording feature slice:** _______________________

**Recording software to install tomorrow:** OBS / SimpleScreenRecorder

---

## End of Session Checklist

- [ ] Both services run locally
- [ ] Frontend successfully calls backend
- [ ] Domain model written
- [ ] Decisions documented
- [ ] Week 1 plan ready
- [ ] Recording plan ready
- [ ] All files committed to git
- [ ] README.md is helpful for future you

---

## Tomorrow's Setup (Before Recording)

- [ ] Install OBS or SimpleScreenRecorder
- [ ] Test 10-second recording
- [ ] Increase terminal font size
- [ ] Close personal tabs/windows
- [ ] Set recording: 720p, 30fps
- [ ] Phone on silent

---

**Remember:** Day 1 is about foundations, not features. If it runs and you can call the API, you've won.
