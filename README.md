# Resume Coach

Resume Coach is an AI-powered interview preparation app. It uses a candidate's resume or self-description together with a target job description to generate a personalized interview plan.

## Features

- Account registration and login with cookie-based authentication.
- Generate interview reports from a job description and either an uploaded PDF resume or a self-description.
- Extract text from PDF resumes for AI analysis.
- Generate technical and behavioral interview questions with suggested answers, a match score, skill gaps, and a day-by-day preparation roadmap.
- View and regenerate saved interview reports.
- Download the extracted resume text associated with a report.

## Tech stack

- **Frontend:** React 19, React Router, Vite, Sass
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **AI:** Google Gemini via `@google/genai`
- **Resume processing:** `pdf-parse`

## Requirements

- Node.js and npm
- MongoDB connection string
- Google Gemini API key

## Setup

### 1. Configure backend environment

Create `Backend/src/.env` with your own credentials:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
GOOGLE_API_KEY=your_google_gemini_api_key
CORS_ORIGINS=http://localhost:5173
```

Keep this file private. It is ignored by Git; never commit credentials or paste them into issues or chat.
The backend allows `https://resume-coach77.vercel.app` and `http://localhost:5173` by default. For other deployments or preview URLs, set `CORS_ORIGINS` to the frontend's exact origin; multiple additional origins may be comma-separated.
For MongoDB Atlas deployments, set `MONGO_URI` in the backend's Vercel environment variables and ensure Atlas Network Access allows connections from the deployed backend. Do not put database credentials in frontend variables.
Deploy the backend as a separate Vercel project with `Backend` as its Root Directory. The backend exposes `/api/health` to check whether the deployment can connect to MongoDB.

### 2. Install dependencies

From the repository root, install backend and frontend dependencies separately:

```bash
cd Backend
npm install
```

In a second terminal:

```bash
cd Frontend
npm install
```

For a deployed frontend, set `VITE_API_URL` in the frontend environment (for example, `https://your-backend.vercel.app`). For local development it defaults to `http://localhost:3000`.

### 3. Start the app

Start the backend from the `Backend` directory:

```bash
npm run dev
```

The API listens at `http://localhost:3000`.

Start the frontend from the `Frontend` directory:

```bash
npm run dev
```

Vite serves the frontend at `http://localhost:5173`. The backend allows this origin by default. In production, login cookies require HTTPS and are configured for cross-origin requests.

## API overview

All interview endpoints require the authenticated session cookie.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/get-me` | Get the current user |
| `GET` | `/api/auth/logout` | Sign out |
| `POST` | `/api/interview` | Generate and save an interview report; accepts multipart form data |
| `GET` | `/api/interview` | List the current user's reports |
| `GET` | `/api/interview/:interviewId` | Get one of the current user's reports |
| `POST` | `/api/interview/:interviewId/regenerate` | Regenerate a saved report |

For report generation, send `jobDescription` and either `selfDescription` or a PDF file in the `resume` field. PDF uploads are limited to 3 MB.

## Project structure

```text
Backend/
  src/
    config/        MongoDB connection
    controller/    Authentication and interview request handlers
    middlewares/   Authentication and file upload handling
    models/        Mongoose models
    routes/        Express API routes
    services/      Gemini report generation
Frontend/
  src/
    features/auth/       Registration and login
    features/interview/  Interview creation, reports, and styling
```
