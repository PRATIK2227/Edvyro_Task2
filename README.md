# CareerConnect — Internship & Career Portal

A full-stack internship discovery and application platform inspired by the structure and purpose of the author's InternBoard project, rebuilt as a separate application with a modern React interface and a REST API.

## What it does

### Student
- Create an account and sign in securely.
- Browse internships with keyword search and filters.
- Open detailed internship descriptions.
- Save/bookmark opportunities.
- Apply to internships and track application status.
- View a personal dashboard with application activity.

### Recruiter
- Register as a recruiter.
- Create, edit and close internship opportunities.
- View applications received for their opportunities.
- Update application statuses.

### Platform
- Role-based authorization (`student`, `recruiter`, `admin`).
- PostgreSQL persistence with migrations and seed data.
- Password hashing with bcrypt and signed JWT authentication.
- Zod validation, parameterized SQL and consistent error responses.
- Helmet, CORS, request logging and rate limiting.
- Responsive React/Vite frontend.
- Backend unit and API contract tests.
- GitHub Actions CI workflow.

## Requirements
- Node.js 20+
- npm 10+
- PostgreSQL 13+

## Setup (Windows PowerShell)

1. Extract the ZIP and open the `CareerConnect_Internship_Portal` folder in VS Code.
2. Install all workspace dependencies:

   ```powershell
   npm install
   ```

3. Copy the environment template:

   ```powershell
   Copy-Item .env.example backend/.env
   ```

4. Edit `backend/.env` and set a real PostgreSQL connection string and a long random `JWT_SECRET`.
5. Create the database in PostgreSQL:

   ```sql
   CREATE DATABASE careerconnect;
   ```

6. Create the tables and sample opportunities:

   ```powershell
   npm run db:migrate
   npm run db:seed
   ```

7. Start frontend and backend:

   ```powershell
   npm run dev
   ```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/v1
- Health: http://localhost:5000/api/v1/health

## Demo accounts

The seed script creates demo accounts only if they do not already exist:
- Student: `student@careerconnect.demo` / `Student@123`
- Recruiter: `recruiter@careerconnect.demo` / `Recruiter@123`

Change these credentials before any public deployment. Never use demo credentials for a real account.

## API overview

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register student/recruiter |
| POST | `/api/v1/auth/login` | Public | Login |
| GET | `/api/v1/auth/me` | Authenticated | Current user |
| GET | `/api/v1/internships` | Public | Search/list |
| GET | `/api/v1/internships/:id` | Public | Internship detail |
| POST | `/api/v1/internships` | Recruiter | Create opportunity |
| PATCH | `/api/v1/internships/:id` | Owner recruiter | Update opportunity |
| DELETE | `/api/v1/internships/:id` | Owner recruiter | Delete opportunity |
| POST | `/api/v1/internships/:id/apply` | Student | Apply |
| GET | `/api/v1/applications/mine` | Student | My applications |
| GET | `/api/v1/applications/received` | Recruiter | Received applications |
| PATCH | `/api/v1/applications/:id/status` | Recruiter | Update status |
| GET | `/api/v1/bookmarks` | Student | Saved internships |
| PUT | `/api/v1/bookmarks/:internshipId` | Student | Save internship |
| DELETE | `/api/v1/bookmarks/:internshipId` | Student | Remove bookmark |
| GET | `/api/v1/dashboard` | Authenticated | Role dashboard metrics |

## Quality checks

```bash
npm test
npm run build
```

## Project structure

```text
CareerConnect_Internship_Portal/
├── backend/
│   ├── migrations/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       ├── pages/
│       └── styles/
├── docs/
└── .github/workflows/
```

## Submission checklist

- [ ] Configure PostgreSQL and run migration/seed commands.
- [ ] Run backend tests and frontend production build.
- [ ] Test registration, login, browse, bookmark, apply and recruiter flows.
- [ ] Replace demo content/credentials as appropriate.
- [ ] Add screenshots and a short walkthrough video if requested.
- [ ] Add your deployed frontend/API links after actual deployment.
- [ ] Push this folder to a new GitHub repository; do not overwrite InternBoard.
- [ ] Verify `.env` is not tracked by Git.

## Author
Add your name, internship cohort and repository/deployment URLs before submitting.

**Integrity note:** This repository is delivered as source code. Database setup, test execution, deployment and production verification must be completed in your environment before claiming those steps are done.
