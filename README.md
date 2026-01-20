# DashX
This is a universal dashboard which combines leetcode, github and also manual goals. It solves the issue of streak break on one platform while contributing on other. It can be referred by recruiters to check your efforts and dedication.  



DashX Backend 🚀

DashX is a developer productivity tracking platform that unifies activity across platforms like GitHub, LeetCode, and manual learning tasks into a single weighted streak and analytics dashboard.

This repository contains the Node.js + Express.js backend powering DashX, built with MongoDB, JWT authentication, and a cron-safe activity sync system.

✨ Features

🔐 Secure authentication with JWT + refresh token rotation

🌍 Per-user timezone support

📅 Daily activity tracking (GitHub, LeetCode, Manual tasks)

🔥 Weighted streak system (manual-only days supported with low weight)

✅ Reusable manual task templates

🎯 Auto-updating goals (score, streak, platform-based)

📊 Single optimized dashboard summary API

🔁 Cron-safe daily sync with retry-once strategy

🛡️ Free-tier safe (memory, rate limits, idempotent jobs)

🧱 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT (access + refresh tokens)

bcrypt

Helmet & rate-limiting

GitHub Actions / Render Cron (external scheduler)

📁 Project Structure
src/
├── config/          # DB & scoring configs
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # Express routes
├── middleware/      # Auth & error handlers
├── services/        # External platform fetchers
├── utils/           # Helpers (date, streak, retry, logger)
├── app.js
server.js

⚙️ Environment Variables

Create a .env file in the root:

PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CRON_SECRET=your_internal_cron_secret

▶️ Running Locally
1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev


Server will run at:

http://localhost:5000

🔐 Authentication Flow

Access Token: 15 minutes

Refresh Token: 7 days

Refresh tokens are:

Rotated on every refresh

Stored hashed in DB

Invalidated on reuse

Auth Endpoints
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh

📊 Dashboard API (Single Call)
Get full dashboard data
GET /api/dashboard/summary
Authorization: Bearer <accessToken>


Returns:

Combined & platform streaks

Today’s activity

Weekly progress

Activity calendar data

Goals

Recent tasks

Platform connection status

🔗 Platform Connection

Users connect platforms using public profile links (no OAuth yet).

POST   /api/user/platforms/connect
GET    /api/user/platforms
DELETE /api/user/platforms/:platform


Supported platforms:

GitHub

LeetCode

🧠 Activity & Streak Logic

One document per user per day (DailyActivity)

Streak continues if:

Weighted score ≥ minimum threshold

Manual-only days are allowed (low weight)

All dates are calculated using user’s timezone

🔁 Daily Sync (Cron-Safe)
Internal endpoint (not public)
POST /internal/sync/daily
Headers:
x-cron-secret: <CRON_SECRET>


Behavior:

Syncs yesterday only

One retry per user

Logs errors, does not crash

Idempotent (safe to rerun)

Recommended Scheduler

GitHub Actions

Render Cron Jobs

Railway Scheduled Jobs

❌ Do NOT use node-cron inside the app.

🛡️ Free-Tier Safety

No in-memory caching

No unbounded queries

Paginated reads

Limited request body size

External cron scheduler

Minimal logging (errors only)

🚧 Current Limitations (Intentional)

No OAuth (GitHub / Google) yet

Platform APIs currently stubbed

Goal period scoping (daily/weekly/monthly) can be extended

Email notifications not enabled

These are planned for v2.

🛣️ Roadmap

OAuth login (GitHub / Google)

Real GitHub & LeetCode API integrations

Advanced analytics & insights

Team dashboards

Premium features

🧑‍💻 Author

Built with care as a production-grade MVP backend for DashX.

If you’re reviewing this as a recruiter or collaborator:

This project emphasizes architecture, scalability, and reliability, not just features.
