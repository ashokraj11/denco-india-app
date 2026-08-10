# DENCO INDIA — React + Express + MySQL

This is a React (Vite) + Express + MySQL rebuild of the original static
`index.html` marketing site. The original file (plus `hero-bg.png` and
`hero-image-animation/`) is left untouched in the repo root as a reference.

For local development, keep reading below. To put this live on Hostinger
via GitHub, see [DEPLOYMENT.md](DEPLOYMENT.md).

```
/server   Express REST API + MySQL access
/client   React (Vite) frontend
```

## 1. Prerequisites

- Node.js 18+
- A running MySQL server (8.x recommended)

## 2. Database

Create an empty database:

```sql
CREATE DATABASE denco_india CHARACTER SET utf8mb4;
```

## 3. Server setup

```powershell
cd server
npm install
Copy-Item .env.example .env
# edit .env: DB_USER / DB_PASSWORD / DB_NAME / JWT_SECRET / ADMIN_USERNAME / ADMIN_PASSWORD
npm run db:schema   # creates tables
npm run db:seed     # loads real DENCO INDIA content + creates the admin user
npm run dev          # starts the API on http://localhost:4000
```

Health check: `GET http://localhost:4000/api/health` → `{ "status": "ok" }`

## 4. Client setup

```powershell
cd client
npm install
Copy-Item .env.example .env
# VITE_API_URL should point at the server, e.g. http://localhost:4000/api
npm run dev          # starts Vite on http://localhost:5173
```

Open http://localhost:5173 — the page should look and behave like the
original `index.html`, but every section (services, products,
certifications, service network, FAQs, trust stats) is now fetched from
the Express API, which reads it from MySQL.

## 5. Admin panel

Go to http://localhost:5173/admin/login and sign in with the
`ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `server/.env` (these are
hashed into the `admin_users` table by `npm run db:seed`). The dashboard
at `/admin` lists every contact-form submission stored in the `enquiries`
table, newest first, with pagination and delete.

## 6. Contact form behavior

Submitting the "Request a Quote / Enquiry Form" on the homepage:

1. POSTs the enquiry to `POST /api/enquiries`, which validates it and
   inserts a row into MySQL.
2. Opens a pre-filled WhatsApp chat (`wa.me/...`) in a new tab, same as
   the original static site — set `VITE_WHATSAPP_NUMBER` in
   `client/.env` to override the default number.
3. Shows the "Thank you" success note inline.

## 7. Re-seeding

`npm run db:seed` (from `/server`) is safe to re-run — it clears and
re-inserts every content table (services, products, certifications,
offices, FAQs, stats) and upserts the admin user. It does **not** touch
the `enquiries` table, so submitted leads are never wiped by a reseed.
