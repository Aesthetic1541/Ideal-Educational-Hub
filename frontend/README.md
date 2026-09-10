# Ideal Educational Hub — Connected Frontend

React/Vite frontend for Ideal Educational Hub & Motivational Training Centre.

## Run

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:5000

## Backend connection

The frontend uses `VITE_API_URL` and defaults to:

```env
VITE_API_URL=http://localhost:5000/api
```

Create `.env` in this frontend folder if you want to change it.

## Connected features

- Courses load from `GET /api/courses`
- Admissions/enquiry form saves to `POST /api/enquiries`
- Student login uses `POST /api/auth/login`
- Student dashboard uses `GET /api/student/dashboard`
- JWT is stored locally for the student session
- Logout clears the session

## Demo student seeded by the backend

Email: `student@idealhub.local`
Password: `Student123!`

Do not use the demo credentials in production.
