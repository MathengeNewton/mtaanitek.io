# Week 1 Planning Document - Mtaa App Build Series

**Date:** [Today's Date]  
**Session Time:** 2:00 PM - 4:30 PM  
**Goal:** Plan Week 1 deliverables and prepare for tomorrow's recording

---

## 1. Domain Model (30 minutes)

### Entities

#### User
- **Purpose:** End users who browse and make requests
- **Key Fields:**
  - `id` (UUID)
  - `location` (lat/lng - optional, for boundary checks)
  - `createdAt`
  - `lastSeenAt`
- **Relationships:**
  - Can create multiple Requests
  - Belongs to a Zone/Street (by location)

#### Merchant
- **Purpose:** Street vendors/shops offering products/services
- **Key Fields:**
  - `id` (UUID)
  - `name` (string)
  - `description` (text, optional)
  - `zoneId` (FK to Zone)
  - `isActive` (boolean)
  - `createdAt`
- **Relationships:**
  - Belongs to one Zone/Street
  - Has multiple QRTokens
  - Receives Requests

#### Rider (Bodaboda)
- **Purpose:** Delivery and transport providers
- **Key Fields:**
  - `id` (UUID)
  - `name` (string)
  - `phone` (string, optional)
  - `zoneId` (FK to Zone)
  - `isAvailable` (boolean)
  - `mode` (enum: 'delivery' | 'transport' | 'both')
  - `createdAt`
- **Relationships:**
  - Belongs to one Zone/Street
  - Can fulfill Requests

#### Zone/Street
- **Purpose:** Geographic boundary defining accessible area
- **Key Fields:**
  - `id` (UUID)
  - `name` (string) - e.g., "Kawangware Street"
  - `centerLat` (float)
  - `centerLng` (float)
  - `radius` (float, in meters) - for Week 1
  - `boundaryPolygon` (JSON, optional) - for later upgrade
  - `isActive` (boolean)
  - `createdAt`
- **Relationships:**
  - Has many Merchants
  - Has many Riders
  - Has many QRTokens

#### QRToken
- **Purpose:** Physical QR codes that link to streets/merchants
- **Key Fields:**
  - `id` (UUID)
  - `token` (string, unique) - the QR code value
  - `zoneId` (FK to Zone)
  - `merchantId` (FK to Merchant, optional)
  - `qrType` (enum: 'street' | 'merchant')
  - `createdAt`
- **Relationships:**
  - Points to a Zone/Street
  - Optionally points to a Merchant

#### Request (Later - Month 5)
- **Purpose:** User orders/requests for merchants/riders
- **Key Fields:**
  - `id` (UUID)
  - `userId` (FK to User)
  - `merchantId` (FK to Merchant)
  - `riderId` (FK to Rider, optional)
  - `status` (enum: 'NEW' | 'ACCEPTED' | 'IN_PROGRESS' | 'DONE')
  - `type` (enum: 'delivery' | 'pickup' | 'transport')
  - `createdAt`
- **Relationships:**
  - Belongs to User, Merchant
  - Optionally belongs to Rider

### Key Rules

1. **Access Control:**
   - User location must be inside Zone boundary to access full features
   - Outside boundary = read-only or blocked (see Decisions section)

2. **Zone Membership:**
   - Merchants belong to exactly one Zone
   - Riders belong to exactly one Zone
   - Users can access multiple Zones (by location)

3. **QR Flow:**
   - QR scan → checks token → redirects to Zone page
   - If merchant-specific QR → shows merchant details on Zone page

---

## 2. Decisions (20 minutes)

### Decision 1: Boundary Method (Week 1)

**Options:**
- **A) Radius (Simple Circle)**
  - Pros: Fast to implement, easy to understand, low compute
  - Cons: Less accurate for irregular streets, doesn't match real geography
  - Implementation: Distance formula (Haversine or simple Euclidean)

- **B) Polygon (Complex Boundaries)**
  - Pros: Accurate, matches real street shapes, professional
  - Cons: More complex, requires polygon libraries, harder to test

**Decision:** ✅ **Start with Radius (Option A)**

**Rationale:**
- Week 1 goal is to prove the concept works
- Can upgrade to polygon in Week 3-4
- Faster to ship = faster to learn
- Users won't notice the difference initially

**Implementation Notes:**
- Use simple distance calculation
- Store `centerLat`, `centerLng`, `radius` in Zone table
- Function: `isPointInRadius(userLat, userLng, zone) -> boolean`

---

### Decision 2: Outside Boundary Behavior

**Options:**
- **A) Hard Block (No Access)**
  - User sees: "This service is not available in your area"
  - Pros: Clear, simple, enforces boundaries strictly
  - Cons: Limits growth, no virality, feels restrictive

- **B) Read-Only (Teaser Mode)**
  - User sees: Zone page with merchant list, but can't create requests
  - Message: "Available in [Zone Name]. Visit to access full features."
  - Pros: Better for marketing, QR codes can be shared, builds curiosity
  - Cons: Slightly more complex state management

**Decision:** ✅ **Read-Only Mode (Option B)**

**Rationale:**
- Better for growth and sharing
- QR codes become shareable marketing tools
- Users can "preview" before visiting
- Can always add hard block later if needed

**Implementation:**
- Check `isUserInZone()` on every request
- If false → show read-only UI
- If true → show full access
- Store access level in React context/state

---

## 3. Week 1 Deliverables + Scripts Outline (30 minutes)

### Week 1 Deliverables Checklist

- [ ] **Repo Structure**
  - [ ] `apps/web/` (Next.js frontend)
  - [ ] `apps/api/` (Node/Express backend)
  - [ ] Basic README

- [ ] **Backend API**
  - [ ] `/api/health` endpoint (already done)
  - [ ] `/api/zones` - list zones
  - [ ] `/api/zones/:id` - get zone details
  - [ ] `/api/zones/check` - POST with lat/lng, returns if inside any zone
  - [ ] Basic Zone model (radius-based)

- [ ] **Frontend**
  - [ ] Map view (Leaflet/OpenStreetMap)
  - [ ] Display test zone (hardcoded for now)
  - [ ] User location detection (browser geolocation API)
  - [ ] Boundary check UI (inside/outside indicator)
  - [ ] Read-only mode UI (when outside)

- [ ] **Testing**
  - [ ] Test with mock location inside zone
  - [ ] Test with mock location outside zone
  - [ ] Test with real GPS (on phone)

---

### Video Scripts Outline

#### Video 1: Principle - "Location as Permission"
**Duration:** 3-4 min  
**Type:** Talking head / terminal + text

**Script Cards:**
1. Hook: "Location isn't UX. It's permission."
2. Point 1: "Global platforms fail at street level"
3. Point 2: "Geo-fencing is a design philosophy"
4. Point 3: "Design for place, or design for nobody"
5. Close: "Design for place. Or you design for nobody."

**What to show:**
- Domain model sketch
- Terminal with notes
- Explain the philosophy

---

#### Video 2: Build - "Implementing Boundary Checks"
**Duration:** 3-4 min  
**Type:** Vibecoding session

**Script Cards:**
1. Hook: "Let's implement the boundary check. Zero magic."
2. Point 1: "Start simple. Radius first."
3. Point 2: "Get location. Calculate distance. If statement."
4. Point 3: "No complex algorithms. Just math."
5. Close: "Simple rules beat clever maps."

**What to code:**
- Start: Empty function `isPointInZone(userLat, userLng, zone)`
- End: Working function with test case
- Show: Distance calculation, if/else logic, test output

**Files to touch:**
- `apps/api/src/zones/zone.service.ts` (or similar)
- `apps/api/src/zones/zone.controller.ts`
- Test file or terminal test

---

#### Video 3: Reflection - "What Breaks in Real Life"
**Duration:** 3-4 min  
**Type:** Code review + discussion

**Script Cards:**
1. Hook: "GPS lies. Networks fail. Users keep moving."
2. Point 1: "GPS accuracy is a myth. Accept it."
3. Point 2: "Offline is normal. Design for it."
4. Point 3: "Edge cases are the product."
5. Close: "Reality always wins. Build for it."

**What to show:**
- Edge case code examples
- Failure scenarios
- Trade-off discussion

---

## 4. Tomorrow's Recording Plan (10 minutes)

### Recording Setup Checklist

- [ ] Install OBS or SimpleScreenRecorder
- [ ] Test 10-second recording
- [ ] Increase terminal font size (for phone viewers)
- [ ] Close personal tabs/windows
- [ ] Phone on silent
- [ ] Set recording to 720p, 30fps

---

### Video 1 Recording Plan (Principle)

**Start State:**
- Terminal open
- Text editor with domain model notes
- Browser with mtaa app (if running)

**What to do:**
- Explain the domain model
- Walk through entities
- Discuss "location as permission" philosophy
- No coding, just thinking out loud

**End State:**
- Domain model explained
- Philosophy clear

**Files to have open:**
- `docs/domain.md` (or notes file)
- Terminal (for reference)

---

### Video 2 Recording Plan (Build)

**Start State:**
- Cursor open
- File: `apps/api/src/zones/zone.service.ts` (or equivalent)
- Empty function: `isPointInZone(userLat, userLng, zone)`
- Terminal open for testing

**What to code:**
1. Write distance calculation function
2. Write boundary check logic
3. Add test case (hardcoded zone + user location)
4. Run test, show result

**End State:**
- Working `isPointInZone()` function
- Test passes (user inside zone = true)
- Test passes (user outside zone = false)

**Feature Slice:**
- One function
- One test
- One feature: "Can I check if a user is inside a zone?"

**Files to touch:**
- `apps/api/src/zones/zone.service.ts` - main function
- `apps/api/src/zones/zone.controller.ts` - endpoint
- Terminal - for testing

---

### Video 3 Recording Plan (Reflection)

**Start State:**
- Same code from Video 2
- Terminal with test results
- Notes on edge cases

**What to discuss:**
- Show GPS accuracy issues
- Discuss offline scenarios
- Walk through edge cases:
  - User exactly on boundary line
  - GPS drift (50m error)
  - Multiple zones overlap
  - No GPS permission

**End State:**
- Edge cases documented
- Trade-offs acknowledged
- Next steps clear

**Files to reference:**
- Same code from Video 2
- Notes file with edge cases

---

## Session Notes

### Decisions Made Today:
- [ ] Boundary method: Radius / Polygon
- [ ] Outside behavior: Blocked / Read-only
- [ ] Stack confirmed: [Node/TS/Next.js/etc]

### Questions to Resolve:
- [ ] 
- [ ] 
- [ ] 

### Tomorrow's Focus:
- Record 3 videos
- Keep it simple
- Ship, don't perfect

---

**End of Session Checklist:**
- [ ] Domain model written
- [ ] Decisions documented
- [ ] Week 1 deliverables planned
- [ ] Video scripts outlined
- [ ] Recording plan ready
- [ ] Tomorrow's setup checklist done
