# Project: College Research Journal Website
Reference site: ijcsms.com

## Stack
- Frontend: Next.js 14 (TypeScript, Tailwind CSS)
- Backend: Node.js + Express
- Database: MongoDB (Dockerized, via docker-compose)
- ODM: Mongoose
- Auth: JWT (access + refresh), bcrypt for passwords

## Roles
- Admin: full control (manage editors, board, pages, settings)
- Editor: manage issues, papers, CFP, view contact queries
- Viewer: public, read-only, no login

## Conventions
- Role-protected routes use `auth` + `requireRole(...)` middleware
- Public pages are statically renderable where possible
- Collections: users, editorial_board, issues, papers, cfp, contact_submissions, activity_log
- Every admin/editor write action logs to activity_log

## Project Structure
```
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & logging
│   ├── scripts/         # Setup scripts
│   └── server.js
├── frontend/
│   ├── app/            # Next.js pages
│   ├── components/     # Reusable components
│   ├── context/        # Auth context
│   └── lib/            # API client
└── docker-compose.yml
```

## Quick Start
1. Start Docker Desktop
2. Run: `./start.sh` (or `bash start.sh`)
3. Access at http://localhost:3000
4. Login with admin@college-journal.com / admin123

## Development
- Backend dev: `cd backend && npm run dev`
- Frontend dev: `cd frontend && npm run dev`
- View logs: `docker compose logs -f`
- Stop services: `docker compose down`
