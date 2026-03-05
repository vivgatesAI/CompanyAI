# CompanyAI on Railway (Fast Launch)

This is the quickest path to get CompanyAI live with Railway + managed Postgres.

## 1) Create services
1. In Railway, create a **new project**.
2. Add a **PostgreSQL** service.
3. Add a **GitHub service** and point it to this repo (`vivgatesAI/CompanyAI`).

## 2) Deploy settings
Use the repo root `Dockerfile` for deployment.

Recommended:
- Runtime: Docker
- Root directory: `/`
- Build command: (Dockerfile handles it)
- Start command: (Dockerfile handles it)

## 3) Required environment variables (App service)
Set these in Railway variables:

- `HOST=0.0.0.0`
- `PORT=${{RAILWAY_PORT}}` (Railway often injects PORT automatically, so this may be optional)
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `PAPERCLIP_DEPLOYMENT_MODE=authenticated`
- `PAPERCLIP_DEPLOYMENT_EXPOSURE=public`
- `PAPERCLIP_AUTH_BASE_URL_MODE=explicit`
- `PAPERCLIP_AUTH_PUBLIC_BASE_URL=https://<your-app-domain>`
- `BETTER_AUTH_URL=https://<your-app-domain>`
- `BETTER_AUTH_SECRET=<long-random-secret>`
- `PAPERCLIP_AGENT_JWT_SECRET=<long-random-secret-2>`
- `VENICE_API_KEY=<your-existing-venice-key>`

Optional but recommended:
- `PAPERCLIP_SECRETS_STRICT_MODE=true`

## 4) Domain
1. Generate Railway domain for the app.
2. Replace `<your-app-domain>` above with that full HTTPS URL.
3. Redeploy.

## 5) First run checklist
After successful deploy:
1. Open the app URL.
2. Sign up / sign in.
3. Create your first company in onboarding.
4. Add your first CEO agent and starter task.

## Notes
- Railway Postgres replaces embedded local Postgres (fixes local Windows permission issue).
- If deploy fails due Node version mismatch, set Node to **20.x** in Railway.
- Current codebase includes initial CompanyAI branding (title/theme/logo).