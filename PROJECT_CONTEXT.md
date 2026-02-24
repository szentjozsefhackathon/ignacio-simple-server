# Ignáci imák - CMS Project Context

## Overview

Content Management System (CMS) for "Ignáci imák" (Ignatius Prayers) prayer app. Built with React frontend, Express backend, PostgreSQL database, Redis caching, and MinIO for media storage.

## Tech Stack

- **Frontend**: React 18 + Material UI (Jesuit red theme #8B0000)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Media Storage**: MinIO (S3-compatible)
- **Container**: Docker + Docker Compose

## Project Structure

```
ignacio-simple-server/
├── backend/
│   ├── src/
│   │   ├── data/              # Local data storage (git-ignored)
│   │   │   ├── postgres/      # PostgreSQL data
│   │   │   ├── minio/        # Media files
│   │   │   ├── data.json      # Original JSON data (94 steps)
│   │   │   └── versions.json
│   │   ├── db/
│   │   │   └── connection.js  # Knex/PostgreSQL connection
│   │   ├── repositories/       # Data access layer
│   │   │   ├── categoryRepository.js
│   │   │   ├── prayerRepository.js
│   │   │   ├── stepRepository.js
│   │   │   └── mediaRepository.js
│   │   ├── routes/             # API endpoints
│   │   │   ├── categories.js
│   │   │   ├── prayers.js
│   │   │   ├── steps.js
│   │   │   ├── media.js
│   │   │   └── auth.js
│   │   ├── services/
│   │   │   ├── s3.js           # MinIO client
│   │   │   └── redis.js        # Redis caching
│   │   └── server.js           # Express app
│   ├── .env                    # Environment variables
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── PrayersPage.jsx
│   │   │   ├── StepsPage.jsx
│   │   │   └── MediaPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx
│   └── Dockerfile
├── docker-compose.yml
└── .gitignore
```

## Current Setup

### Running Services (Ports)

| Service  | Port | URL                          |
|----------|------|------------------------------|
| Frontend | 3000 | http://localhost:3000       |
| Backend  | 5005 | http://localhost:5005       |
| Nginx    | 80   | http://localhost            |
| Postgres | 5432 | localhost:5432              |
| Redis    | 6379 | localhost:6379              |
| MinIO    | 9000 | http://localhost:9000      |
| MinIO UI | 9001 | http://localhost:9001       |

### Credentials

- **Admin CMS**: `marcell` / `Ignaci26`
- **PostgreSQL**: `ignacio` / `ignacio`
- **Redis**: password: `redis`
- **MinIO**: `minioadmin` / `minioadmin`

### Database Schema

```sql
-- categories table
categories (id, title, image, description, created_at, updated_at)

-- prayers table  
prayers (id, category_id, title, description, image, voice_options, min_time_in_minutes, created_at, updated_at)

-- steps table
steps (id, prayer_id, step_order, description, voices, time_in_seconds, step_type, created_at, updated_at)

-- media table
media (id, filename, s3_key, media_type, mime_type, size_bytes, created_at)
```

## What Was Accomplished

### ✅ Completed Features

1. **CMS Frontend** - Material UI with Jesuit red theme (#8B0000)
2. **Authentication** - bcrypt password hashing, protected admin routes
3. **Dynamic Navbar** - Shows login/edit/logout based on auth state
4. **PostgreSQL Database** - Full schema migrated from JSON
5. **Redis Caching** - API responses cached (5 min TTL)
6. **MinIO Media Storage** - With public read policy
7. **External Volumes** - Data persists in `backend/src/data/`
8. **Field Mapping** - API returns camelCase (minTimeInMinutes, timeInSeconds, type)
9. **Auth Persistence** - Fixed reload redirect issue

### Known Issues / TODOs

1. **Media CMS** - May need testing/verification
2. **Unused imports** - Some ESLint warnings in frontend build

## Running the Project

### Start all services:
```bash
cd /path/to/ignacio-simple-server
docker compose up -d
```

### View logs:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Rebuild after changes:
```bash
docker compose build backend && docker compose up -d backend
docker compose build frontend && docker compose up -d frontend
```

## Key API Endpoints

### Public (JSON fallback):
- `GET /api/json/download-data` - All data as JSON

### Categories:
- `GET /api/categories` - All categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Prayers:
- `GET /api/prayers/category/:id` - Prayers by category
- `GET /api/prayers/:id` - Single prayer with steps
- `POST /api/prayers/category/:id` - Create prayer
- `PUT /api/prayers/:id` - Update prayer
- `DELETE /api/prayers/:id` - Delete prayer

### Steps:
- `GET /api/steps/prayer/:prayerId` - Steps for a prayer
- `POST /api/steps/prayer/:prayerId` - Create step
- `PUT /api/steps/:id` - Update step
- `DELETE /api/steps/:id` - Delete step

### Media:
- `GET /api/media` - All media files
- `POST /api/media/upload` - Upload file
- `DELETE /api/media/:id` - Delete file

### Auth:
- `POST /api/auth/login` - Login (marcell/Ignaci26)

## Environment Variables (backend/.env)

```
PORT=5005
DATABASE_URL=postgres://ignacio:ignacio@postgres:5432/ignacio
REDIS_URL=redis://:redis@redis:6379
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=ignacio-media
```

## Deployment Notes

When deploying to a production server:

1. **Data folders**: `backend/src/data/postgres` and `backend/src/data/minio` contain persistent data - back these up
2. **Change passwords**: Update all credentials in `.env` and `docker-compose.yml`
3. **Domain**: Update MinIO URLs in `backend/src/services/s3.js` to use domain instead of `localhost:9000`
4. **Firewall**: Open ports 80, 443 (nginx), optionally 9001 for MinIO console
