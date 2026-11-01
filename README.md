# Monkey Frontend

React + TypeScript + Vite dashboard for **Monkey** — public dashboard and staff manage page that
monitor the monkey traders run by the backend.

Project docs (overview, deploy, operations, roadmap, status) live in ops-docs:
`~/ops-docs/docs/services/monkey/` → https://docs.killerwhalee.com/services/monkey/

```bash
npm ci
cp .env.example .env.local   # VITE_API_BASE_URL=http://127.0.0.1:8000/api
npm run dev
npm run lint && npm run build
```
