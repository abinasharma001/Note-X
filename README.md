# Note-X

Note-X is a full-stack secure online notepad with JWT authentication, rich-text notes, tasks, reminders, and recycle bin protection.

## Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt password hashing
- **Uploads:** Local storage (`server/src/uploads`) with cloud-ready metadata model

## Folder Structure
```
/client
/server
  /src
    /config
    /controllers
    /middleware
    /models
    /routes
    /utils
    /uploads
```

## Backend-First Build Summary
1. Implemented secure Express API with modular routes/controllers.
2. Added MongoDB models for User, Note, Task, Reminder.
3. Added JWT auth middleware, input validation, XSS sanitization, rate limiting.
4. Added soft-delete recycle bin and recycle-bin PIN verification.
5. Added file upload support for images/PDF/audio with size and type limits.
6. Added reminder polling endpoint for in-app popup notifications.

## API Endpoints (high level)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/recycle-pin`
- `GET/POST/PATCH/DELETE /api/notes`
- `PATCH /api/notes/:id/undo`
- `PATCH /api/notes/:id/pin`
- `GET /api/notes/recycle/bin`
- `PATCH /api/notes/recycle/:id/restore`
- `DELETE /api/notes/recycle/:id/permanent`
- `GET/POST/PATCH/DELETE /api/notes/:noteId/tasks`
- `GET/POST/PATCH/DELETE /api/reminders`
- `GET /api/reminders/due`
- `POST /api/recycle/verify-pin`

## Setup
### 1) Prerequisites
- Node.js 18+
- MongoDB running locally or remote URI

### 2) Environment variables
Copy `.env.example` into:
- `server/.env` for server values
- `client/.env` for `VITE_API_URL`

### 3) Install dependencies
```bash
npm run install:all
```

### 4) Run app
Terminal A:
```bash
npm run dev:server
```

Terminal B:
```bash
npm run dev:client
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Security Included
- Password hashing (`bcryptjs`)
- JWT protected routes
- Helmet headers
- Basic rate limiting
- Mongo operator sanitization
- HTTP parameter pollution protection
- Input validation (Joi)
- Rich-text sanitization (`sanitize-html`)
- Upload MIME and size limits
- Separate recycle bin PIN verification

## Feature Mapping
- Authentication system with logout ✅
- Note CRUD + pin/unpin + undo last edit ✅
- Rich text + links + per-note theme ✅
- Upload-ready note attachments + cover image ✅
- Daily tasks checklist ✅
- Reminders persisted and popup-ready polling ✅
- Recycle bin with soft delete/restore/permanent delete + PIN gate ✅
- Responsive dashboard + dark/light mode + search + sort ✅

## Notes
- Browser notification popup is implemented as in-app reminder toasts fetched from `/api/reminders/due`.
- For production, move uploads to object storage (S3/GCS) and swap storage adapter while keeping attachment schema.
