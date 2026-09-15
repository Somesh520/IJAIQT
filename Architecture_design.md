# College Research Journal Website — Project Starter
**Reference:** ijcsms.com | **Roles:** Admin, Editor, Viewer | **DB:** MongoDB (Dockerized)

---

## 1. Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (React) |
| Backend | Node.js + Express |
| Database | MongoDB (via Docker) |
| ODM | Mongoose |
| Auth | JWT (access + refresh token), bcrypt for password hashing |
| File storage | Local `/uploads` volume (mounted in Docker) — can move to Cloudflare R2 later if needed |
| Containerization | Docker + Docker Compose (app + db + optional mongo-express admin UI) |

---

## 2. Project Structure

```
journal-website/
├── docker-compose.yml
├── .env
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── EditorialBoard.js
│   │   │   ├── Issue.js
│   │   │   ├── Paper.js
│   │   │   ├── Cfp.js
│   │   │   ├── ContactSubmission.js
│   │   │   └── ActivityLog.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # verifies JWT
│   │   │   └── requireRole.js   # role-based access guard
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── issues.routes.js
│   │   │   ├── papers.routes.js
│   │   │   ├── cfp.routes.js
│   │   │   ├── board.routes.js
│   │   │   ├── contact.routes.js
│   │   │   └── admin.routes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
└── frontend/
    ├── pages/
    │   ├── index.js              # Home
    │   ├── call-for-papers.js
    │   ├── authors.js
    │   ├── current-issue.js
    │   ├── archive/[year].js
    │   ├── editorial-board.js
    │   ├── contact.js
    │   ├── login.js
    │   └── dashboard/
    │       ├── index.js          # role-based landing
    │       ├── issues.js         # editor+admin
    │       ├── cfp.js            # editor+admin
    │       ├── editors.js        # admin only
    │       └── settings.js       # admin only
    ├── Dockerfile
    └── package.json
```

---

## 3. Docker Compose (starting point)

```yaml
version: "3.9"

services:
  mongodb:
    image: mongo:7
    container_name: journal-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASS}
      MONGO_INITDB_DATABASE: journal_db
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express
    container_name: journal-mongo-admin
    restart: unless-stopped
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_ROOT_USER}
      ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_ROOT_PASS}
      ME_CONFIG_MONGODB_URL: mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASS}@mongodb:27017/
    depends_on:
      - mongodb

  backend:
    build: ./backend
    container_name: journal-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      MONGO_URI: mongodb://${MONGO_ROOT_USER}:${MONGO_ROOT_PASS}@mongodb:27017/journal_db?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    volumes:
      - ./backend:/app
      - /app/node_modules
      - uploads_data:/app/uploads
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: journal-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    depends_on:
      - backend

volumes:
  mongo_data:
  uploads_data:
```

`.env` (do not commit — add to `.gitignore`):
```
MONGO_ROOT_USER=admin
MONGO_ROOT_PASS=change_this_password
JWT_SECRET=change_this_secret
JWT_REFRESH_SECRET=change_this_too
```

> `mongo-express` gives you a free web UI to inspect the DB during development — remove/disable it in production or put it behind auth.

---

## 4. Mongoose Schemas (data model)

```js
// models/User.js
const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "editor"], required: true },
}, { timestamps: true });

// models/EditorialBoard.js
const editorialBoardSchema = new Schema({
  name: String,
  designation: String,
  affiliation: String,
  photoUrl: String,
  displayOrder: Number,
});

// models/Issue.js
const issueSchema = new Schema({
  volume: Number,
  issueNumber: Number,
  year: Number,
  title: String,
  publishedDate: Date,
  status: { type: String, enum: ["draft", "published"], default: "draft" },
});

// models/Paper.js
const paperSchema = new Schema({
  issueId: { type: Schema.Types.ObjectId, ref: "Issue" },
  title: String,
  authors: String,
  abstract: String,
  pdfUrl: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// models/Cfp.js
const cfpSchema = new Schema({
  title: String,
  deadline: Date,
  description: String,
  isActive: { type: Boolean, default: true },
});

// models/ContactSubmission.js
const contactSchema = new Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

// models/ActivityLog.js
const activityLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  action: String,
  target: String,
}, { timestamps: true });
```

---

## 5. Role-Based Access Middleware

```js
// middleware/auth.js — verifies JWT, attaches req.user
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// middleware/requireRole.js — restricts route to specific role(s)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { auth, requireRole };
```

```js
// Example usage in routes/board.routes.js
router.put("/editorial-board/:id", auth, requireRole("admin"), updateBoardMember);
router.post("/issues", auth, requireRole("admin", "editor"), createIssue);
router.get("/dashboard/contact-queries", auth, requireRole("admin", "editor"), listContactQueries);
```

This mirrors the permission matrix directly: `requireRole("admin")` for admin-only actions, `requireRole("admin", "editor")` for shared ones, and public routes simply skip the `auth` middleware entirely.

---

## 6. Getting Started (first-time setup)

1. `git init journal-website && cd journal-website` — set up repo structure as above
2. Create `.env` file with your own secrets (never commit it)
3. `docker compose up --build` — spins up MongoDB, mongo-express, backend, frontend together
4. Backend available at `http://localhost:5000`, frontend at `http://localhost:3000`, DB admin UI at `http://localhost:8081`
5. Seed one Admin user manually (via a one-time seed script or directly in mongo-express) so you can log in and create Editor accounts from the dashboard
6. Build out public pages first (static content, no auth) → then dashboard pages → then role-protected routes

---

## 7. Note on "No Maintenance" Goal

Running MongoDB in Docker means **you own uptime, backups, and updates** — this is a deliberate trade-off you're making for using MongoDB specifically. To keep it manageable long-term:
- Set `restart: unless-stopped` (already in the compose file above) so containers auto-restart on crash/reboot
- Schedule a weekly `mongodump` cron job to back up the `mongo_data` volume
- Pin the MongoDB image version (`mongo:7`) rather than `latest`, so it doesn't silently change on rebuild
- Revisit hosting choice (VPS provider) separately — this compose file runs the same locally or on any VPS