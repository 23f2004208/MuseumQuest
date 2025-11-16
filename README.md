// ...existing code...
# MuseumQuest

MuseumQuest is an educational web app that showcases museums on an interactive world map. Click a museum to view details, images, and try a short quiz. Users can collect stamps, earn XP, level up, and compete on a leaderboard.

---

## Features

- Interactive map with museum markers
- Museum detail pages with background images and quizzes
- Passport system: stamps, XP, levels, and progress bar
- AI-powered chatbot for museum context
- Leaderboard showing top explorers
- Local backend API that integrates with Firestore

---

## Tech stack

- Frontend: React + Vite (see [frontend/package.json](frontend/package.json))
- Backend: Express (see [backend/package.json](backend/package.json))
- Firebase Authentication & Firestore (see [frontend/src/firebase.js](frontend/src/firebase.js) and [backend/firebase-admin.js](backend/firebase-admin.js))
- Leaflet for maps (see [frontend/src/components/MapComponent.jsx](frontend/src/components/MapComponent.jsx))
- Gemini / Google Generative AI integration in backend (see [backend/server.js](backend/server.js))

---

## Repo structure (key files)

- [backend/server.js](backend/server.js) - main API server and endpoints
- [backend/.env.example](backend/.env.example) - example env vars required by backend
- [backend/firebase-admin.js](backend/firebase-admin.js) - admin SDK init for Firestore
- [frontend/package.json](frontend/package.json) - frontend scripts & deps
- [frontend/src/main.jsx](frontend/src/main.jsx) - app entry
- [frontend/src/services/api.js](frontend/src/services/api.js) - client API wrappers
- [frontend/src/services/firestore.js](frontend/src/services/firestore.js) - Firestore client helpers (see [`awardStamp`](frontend/src/services/firestore.js))
- [frontend/src/data/museums.js](frontend/src/data/museums.js) - museum metadata and image paths
- [frontend/src/data/quizzes.js](frontend/src/data/quizzes.js) - quiz question sets
- [frontend/src/pages/QuizPage.jsx](frontend/src/pages/QuizPage.jsx) - quiz UI and image mapping logic
- [frontend/src/pages/ChatbotPage.jsx](frontend/src/pages/ChatbotPage.jsx) - chatbot UI and AI calls
- [frontend/src/data/images/britishmuseum.avif](frontend/src/data/images/britishmuseum.avif) - example museum asset

Backend helpers:
- [`getUserProgress`](backend/server.js) - fetch user progress (server-side)
- [`calculateLevel`](backend/server.js) - derive level from XP

Frontend helpers:
- [`awardStamp`](frontend/src/services/firestore.js) - award a stamp & update user progress (client-side)
- [`getUserProgress`](frontend/src/services/firestore.js) - client wrapper to fetch passport

---

## Prerequisites

- Node.js 18.x (backend `engines` in [backend/package.json](backend/package.json))
- npm or pnpm
- Firebase project / credentials if using production Firestore (or run with emulator)

---

## Setup (local development)

1. Backend
   - Copy env example:
     - cp backend/.env.example backend/.env
   - Provide credentials:
     - Set `GOOGLE_APPLICATION_CREDENTIALS` to your service account JSON path or set `FIREBASE_SERVICE_ACCOUNT` env var.
   - Install & run:
     - cd backend
     - npm install
     - npm run dev
   - Backend listens on port 5000 by default and exposes endpoints implemented in [backend/server.js](backend/server.js).

2. Frontend
   - Install & run:
     - cd frontend
     - npm install
     - npm run dev
   - Open the Vite URL printed in the console.

---

## Important environment variables

Check [backend/.env.example](backend/.env.example). Common vars:

- GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT — Firebase admin credentials (see [backend/firebase-admin.js](backend/firebase-admin.js))
- GEMINI_API_KEY — Google Generative AI key used in [backend/server.js](backend/server.js)
- WOLFRAM_API_KEY — optional Wolfram support used in backend routes

The frontend uses Firebase config stored in [frontend/src/firebase.js](frontend/src/firebase.js).

---

## API Endpoints (overview)

Implemented in [backend/server.js](backend/server.js):

- GET /api/museums — list museums
- GET /api/museums/:id — museum detail
- POST /api/quiz/:museumId — get quiz for a museum
- POST /api/quiz/check — check quiz answers
- POST /api/passport/stamp — award a stamp (server side) — uses [`calculateLevel`](backend/server.js)
- GET /api/passport/:userId — get a user's passport (`getUserProgress`)
- GET /api/leaderboard — top users aggregation
- POST /api/ai/ask — AI museum Q&A (Gemini) (see [backend/server.js](backend/server.js))
- GET /api/wolfram/context/:year — simple historical context

Client wrappers are in [frontend/src/services/api.js](frontend/src/services/api.js).

---

## Notes & gotchas

- Images in [frontend/src/data/images](frontend/src/data/images) are imported in pages like [QuizPage.jsx](frontend/src/pages/QuizPage.jsx) and [ChatbotPage.jsx](frontend/src/pages/ChatbotPage.jsx). Vite requires imports rather than string file paths — see the image mapping in those files.
- The app handles two data shapes for user progress (legacy vs current). See server-side [`getUserProgress`](backend/server.js) and client-side [`getUserProgress`](frontend/src/services/firestore.js).
- If using local emulator for Firestore, backend may initialize without credentials (see [backend/firebase-admin.js](backend/firebase-admin.js)).

---

## Running tests

There are no tests configured in the repo. Add tests and scripts to [backend/package.json](backend/package.json) and [frontend/package.json](frontend/package.json) as needed.

---

## Contributing

1. Fork the repo
2. Create a branch
3. Open a PR with a description

---

## License

MIT — see [LICENSE](LICENSE)


// ...existing code...
{ changed code }
// ...existing code...