# 🏛️ Fund to Field (निधि से निर्माण) — Docker + PostgreSQL Edition

## Changes Summary

### 1. 🐘 PostgreSQL Database Migration
- JSON file store (`store.json`) → PostgreSQL database
- `server/db/database.js` — full async pg pool with same API interface
- Auto-creates all tables on startup (`initSchema()`)
- All routes converted to async/await

### 2. 🐳 Docker Deployment
- `Dockerfile` — Multi-stage build (React frontend + Node.js server)
- `docker-compose.yml` — PostgreSQL 16 + App server + optional Seed service
- Persistent volumes for database and uploads

### 3. 📊 Full Seed Data (All Departments)
- All 5 departments: EDU, TRANS, STARTUP, WATER, **HEALTH**
- Healthcare PHC (Morena) now has **real before/after renovation photos**
- 8 inspections, 8 ledger entries, 7 projects across all departments

### 4. 📸 Public Portal — Before/After Photo URLs for Grievances
- Citizens can paste image URLs (Google Photos, WhatsApp, etc.)
- Live preview of before/after photos in the complaint form
- Photos shown as clickable links on the grievance card

---

## 🚀 Quick Start with Docker

```bash
# 1. Clone / extract the project
cd fund-to-field

# 2. Start PostgreSQL + App
docker-compose up --build -d

# 3. Seed initial data (run once)
docker-compose --profile seed run --rm seed

# 4. App is live at:
#    http://localhost:5000
```

## 🔧 Local Development (without Docker)

```bash
# Start PostgreSQL locally (or use Docker just for DB)
docker run -d --name pg -e POSTGRES_DB=fundtofield -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=govtech@2026 -p 5432:5432 postgres:16-alpine

# Server
cd server
# Edit .env: set DB_HOST=localhost
npm install
npm run seed   # populate database
npm start      # http://localhost:5000

# Client (separate terminal)
cd client
npm install
npm run dev    # http://localhost:5173
```

## 🗄️ Database Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `db` (docker) / `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `fundtofield` | Database name |
| `DB_USER` | `postgres` | DB username |
| `DB_PASSWORD` | `govtech@2026` | DB password |
| `PORT` | `5000` | App server port |
| `GEOFENCE_RADIUS_METERS` | `500` | Inspector geofence radius |

## 📁 Project Structure

```
fund-to-field/
├── Dockerfile               ← Multi-stage Docker build
├── docker-compose.yml       ← PostgreSQL + App services
├── .dockerignore
├── client/                  ← React + Vite frontend
│   └── src/components/
│       └── PublicPortal.jsx ← Updated with photo URL grievance form
└── server/
    ├── .env                 ← Environment config (Docker)
    ├── index.js             ← Async startup with DB init
    ├── db/
    │   ├── database.js      ← PostgreSQL async layer
    │   └── seed.js          ← Full data seed (all departments)
    └── routes/              ← All routes converted to async/await
```
