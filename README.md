# College Research Journal Website

International Journal for Research and Development platform built with Next.js, Express, and MongoDB.

## Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (Dockerized)
- **ODM**: Mongoose
- **Auth**: JWT (access + refresh tokens), bcrypt

## Features

- Role-based access (Admin, Editor, Public Viewer)
- Issue and paper management
- PDF upload for research papers
- Call for Papers (CFP) management
- Editorial board management
- Contact form with rate limiting
- Activity logging for audit trails

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Setup

1. **Start Docker services:**
   ```bash
   docker compose up --build
   ```

   This starts:
   - MongoDB (port 27017)
   - Mongo Express (port 8081)
   - Backend API (port 5000)
   - Frontend (port 3000)

2. **Create the first admin user:**
   ```bash
   docker compose exec backend node scripts/createAdmin.js
   ```

   Default credentials:
   - Email: `admin@college-journal.com`
   - Password: `admin123`

3. **(Optional) Seed database with sample data:**
   ```bash
   docker compose exec backend node scripts/seed.js
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Mongo Express**: http://localhost:8081
- **API Health Check**: http://localhost:5000/api/health

## Project Structure

```
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & logging middleware
│   ├── scripts/         # Utility scripts
│   └── server.js        # Express app entry
├── frontend/
│   ├── app/            # Next.js pages (App Router)
│   ├── components/     # Reusable components
│   ├── context/        # React context (Auth)
│   └── lib/            # API client & utilities
└── docker-compose.yml
```

## API Endpoints

### Public Routes
- `GET /api/issues` - List all issues
- `GET /api/papers?issueId=...` - List papers
- `GET /api/cfp` - Active calls for papers
- `GET /api/board` - Editorial board members
- `POST /api/contact` - Submit contact form

### Protected Routes (Editor + Admin)
- `POST/PUT/DELETE /api/issues`
- `POST/PUT/DELETE /api/papers`
- `POST/PUT/DELETE /api/cfp`
- `GET /api/contact` - View submissions

### Admin Only
- `POST /api/auth/register` - Create editor accounts
- `POST/PUT/DELETE /api/board`
- `GET/DELETE /api/admin/editors`
- `GET /api/admin/logs`

## Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:adminpassword@mongodb:27017/college_journal?authSource=admin
JWT_SECRET=your-jwt-secret-change-in-production
JWT_REFRESH_SECRET=your-jwt-refresh-secret-change-in-production
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## User Roles

### Admin
- Full system access
- Manage editors, editorial board
- View activity logs
- All editor permissions

### Editor
- Manage issues and papers
- Manage CFP
- View contact submissions
- Cannot manage users or board

### Viewer (Public)
- Browse published content
- No login required
- Read-only access

## Production Deployment

1. Update environment variables with production values
2. Change JWT secrets to secure random strings
3. Remove `mongo-express` service from docker-compose
4. Add restart policies and health checks
5. Set up reverse proxy (nginx) for SSL
6. Configure backup strategy for MongoDB

## License

MIT

## Support

For issues or questions, contact: info@college-journal.com
