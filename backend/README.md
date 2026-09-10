# Ideal Educational Hub Backend

Node.js + Express + MongoDB backend for the Ideal Educational Hub frontend.

## Features

- JWT authentication
- Student/admin roles
- Password hashing with bcrypt
- Courses
- Student profiles
- Admissions/enquiries
- Tests and results
- Attendance
- Announcements
- Student dashboard API
- Admin dashboard API
- Helmet security headers
- CORS
- Login rate limiting
- MongoDB indexes

## Setup

1. Install Node.js 18+.
2. Install MongoDB locally OR create a MongoDB Atlas database.
3. Copy `.env.example` to `.env`.
4. Set `MONGO_URI` and a strong `JWT_SECRET`.
5. Run:

```bash
npm install
npm run seed
npm run dev
```

API starts at `http://localhost:5000`.

Health check:
`GET /api/health`

## Demo login

The seed script creates:

Student:
- email: `student@idealhub.local`
- password: `Student123!`

Admin:
- email from `ADMIN_EMAIL`
- password from `ADMIN_PASSWORD`

Change demo credentials before real deployment.

## Frontend

Set the frontend API base URL to:

`http://localhost:5000/api`

Then replace the current frontend's demo login/enquiry logic with API calls.

## Important

This is a production-oriented starter backend, not a substitute for deployment/security review. Before going live, use a strong secret, HTTPS, a managed database, real email/WhatsApp integrations, backups, logging, and stricter production CORS settings.
