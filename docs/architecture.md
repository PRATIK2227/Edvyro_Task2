# Architecture and design notes

## Product model
CareerConnect has three principal roles: students, recruiters and administrators. Students discover and apply to open opportunities. Recruiters publish opportunities and manage candidate applications. Administrators are represented in the role model for future moderation capabilities.

## Backend layers
- Routes map HTTP paths to middleware and controller handlers.
- Zod validators parse body, query and path inputs.
- Controllers translate service results into HTTP responses.
- Services own business rules and orchestrate data operations.
- PostgreSQL persists users, internships, applications and bookmarks.

## Security choices
- bcrypt password hashing with a work factor of 12.
- Signed JWT bearer tokens with an environment-provided secret.
- Role-based route authorization.
- Parameterized SQL queries.
- Zod validation and request size limits.
- Helmet security headers, CORS allowlist and rate limiting.
- Secrets are excluded from Git.

## Important production follow-ups
Before public production deployment, add refresh-token rotation/revocation, email verification, password reset, CSRF strategy if cookies are introduced, structured audit trails, moderation/admin routes, file upload scanning, stronger integration tests against a disposable PostgreSQL database, and monitoring/backups.
