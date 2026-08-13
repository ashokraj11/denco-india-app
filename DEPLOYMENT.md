# Deploying DENCO INDIA to Hostinger (Business/Cloud plan) via GitHub

This covers a Hostinger **Business or Cloud** shared-hosting plan, which
includes the Node.js app manager in hPanel — so the React frontend, the
Express API, and MySQL all live on the same Hostinger account. No separate
VPS or third-party Node host needed.

Layout on Hostinger once done:

```
https://yourdomain.com          -> React build (public_html), served by Apache
https://api.yourdomain.com      -> Express API, served by Node.js app (Passenger)
MySQL (denco_india)             -> same Hostinger account, used only by the API
```

---

## Part A — Push the project to GitHub

1. Create a new **empty** repository on GitHub (no README/license, you already have files) — e.g. `denco-india`.
2. From the project root:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: React + Express + MySQL rebuild"
   git branch -M main
   git remote add origin https://github.com/<your-username>/denco-india.git
   git push -u origin main
   ```
3. Double check `.env` files were **not** committed (`.gitignore` already excludes them) — only `.env.example` files should be in the repo. Run `git status` after the first commit and confirm no `.env` shows up.

---

## Part B — Point your domain at Hostinger

Skip this if your domain is already live on Hostinger.

- **Domain bought through Hostinger**: nothing to do, it's already pointed at your hosting.
- **Domain bought elsewhere** (GoDaddy, Namecheap, etc.): in hPanel go to *Domains → your domain → DNS / Nameservers*, and either:
  - Change nameservers at your registrar to Hostinger's (`ns1.dns-parking.com` / `ns2.dns-parking.com`, or the pair hPanel shows you), **or**
  - Keep your registrar's nameservers and instead add an `A` record pointing `@` at Hostinger's shared IP (shown in hPanel → *Websites → your site → Overview*).

DNS propagation can take up to 24-48 hours (usually much faster).

---

## Part C — Create the MySQL database

1. hPanel → **Databases → MySQL Databases**.
2. Create a database and a user, and attach the user to the database with all privileges. Hostinger prefixes both with your account username, e.g.:
   - Database: `u123456789_denco`
   - User: `u123456789_admin`
3. Note the **host** shown (usually `localhost` since the API will run on the same server).
4. Open **phpMyAdmin** (hPanel → Databases → phpMyAdmin) for the new database and use *Import* to run `server/src/db/schema.sql`.
5. You'll seed real content in Part D (the seed script needs the API's Node environment, not phpMyAdmin).

---

## Part D — Deploy the Express API

1. hPanel → **Advanced → Node.js** → **Create Application**.
2. Fill in:
   - **Node.js version**: 18 or 20
   - **Application root**: e.g. `denco-india/server` (see step 3 below — this is a path under your home directory)
   - **Application URL**: choose the `api` subdomain, e.g. `api.yourdomain.com` (hPanel creates the subdomain for you)
   - **Application startup file**: `src/server.js`
3. Get the code onto the server. Easiest is hPanel's Git tool:
   - hPanel → **Advanced → Git** → **Create a new repository**
   - Repository URL: `https://github.com/<your-username>/denco-india.git`
   - Branch: `main`
   - Directory: `denco-india` (so it clones the whole monorepo there; your Node app's "Application root" from step 2 should then be `denco-india/server`)
   - Click **Deploy** now, and again any time you push changes (there's a "Deploy" button per repo — for auto-deploy on every push, add the webhook URL hPanel shows you under GitHub repo → Settings → Webhooks).
4. Back in **Advanced → Node.js**, open your app and:
   - Click **Run NPM Install** (installs `server/package.json` dependencies).
   - Add **Environment variables** (same keys as `server/.env.example`):
     ```
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=u123456789_admin
     DB_PASSWORD=<the password you set in Part C>
     DB_NAME=u123456789_denco
     JWT_SECRET=<generate a long random string>
     JWT_EXPIRES_IN=12h
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=<a strong password>
     CLIENT_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
     WHATSAPP_NUMBER=917010767919
     UPLOAD_DIR=/home/u123456789/app-uploads
     ```
     (Do **not** set `PORT` — Passenger assigns it automatically and `server.js` already respects `process.env.PORT`.)
     `UPLOAD_DIR` is not optional in production: it MUST point outside the deployed code folder (e.g. a plain folder in your home directory, created once via SSH with `mkdir -p ~/app-uploads`), or every redeploy wipes every uploaded logo/photo/gallery item/hero slide. Leaving it unset defaults to a path inside the deployed folder that Git-deploy recreates from scratch on every push.
   - Click **Restart** so the new env vars take effect.
5. Apply the schema and seed data. Open the **Node.js app's SSH/terminal access** (hPanel shows a command like `source /home/u123456789/nodevenv/domain/20/bin/activate && cd /home/u123456789/domain/denco-india/server`) via **Advanced → SSH Access**, then run:
   ```bash
   npm run db:schema
   npm run db:seed
   ```
6. Confirm it's live: `https://api.yourdomain.com/api/health` should return `{"status":"ok"}`, and `https://api.yourdomain.com/api/services` should return the seeded services.

---

## Part E — Deploy the React frontend

The static build (`client/dist/`) goes into `public_html`, **not** the raw source — Hostinger's web server just serves files, it doesn't run a build step.

**First deploy (manual, do this once):**

1. On your machine:
   ```powershell
   cd client
   Copy-Item .env.production.example .env.production
   # edit .env.production: set VITE_API_URL=https://api.yourdomain.com/api
   npm run build
   ```
2. hPanel → **Files → File Manager**, open `public_html`, delete the default placeholder files, then upload everything from `client/dist/` (including the hidden `.htaccess` file — File Manager's upload should preserve it; if it drops dotfiles, create `.htaccess` directly in File Manager with the same content as `client/public/.htaccess`).
3. Visit `https://yourdomain.com` — the site should load, fetch data from the API, and refreshing `/admin` should not 404 (that's what `.htaccess` fixes).

**Automating future deploys with GitHub Actions (optional but recommended):**

A workflow is already included at `.github/workflows/deploy-client.yml`. It builds `client/` and FTPs `client/dist/` into `public_html` on every push to `main` that touches `client/**`.

1. hPanel → **Files → FTP Accounts** → note the server, username, and (re)set a password.
2. GitHub repo → **Settings → Secrets and variables → Actions** → add:
   - `FTP_SERVER` (e.g. `ftp://ftp.yourdomain.com`)
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
   - `VITE_API_URL` (e.g. `https://api.yourdomain.com/api`)
3. Push to `main` — the Action rebuilds and re-uploads the frontend automatically. Check the **Actions** tab on GitHub for status.

The backend doesn't need this — hPanel's Git "Deploy" button (or its webhook auto-deploy) plus **Run NPM Install** and **Restart** after pulling covers it.

---

## Part F — SSL

hPanel → **Security → SSL** → issue a free Let's Encrypt certificate for both `yourdomain.com` and `api.yourdomain.com`. Hostinger auto-renews these. Once issued, force HTTPS (hPanel usually has a toggle for this, or add a redirect rule).

---

## Part G — Verify end to end

1. `https://yourdomain.com` loads and every section (services, products, certifications, service network, FAQs, trust stats) renders real data.
2. Submit the contact form → check phpMyAdmin's `enquiries` table for the new row, and confirm WhatsApp opens with the pre-filled message.
3. `https://yourdomain.com/admin/login` → sign in with `ADMIN_USERNAME`/`ADMIN_PASSWORD` → the enquiry from step 2 shows up in the dashboard.
4. Refresh while on `/admin` — should not 404 (confirms `.htaccess` is working).

---

## Updating the live site later

- **Frontend change**: push to `main` → GitHub Action rebuilds and re-uploads automatically (or repeat the manual build+upload from Part E if you skipped Actions).
- **Backend change**: push to `main` → hPanel Git either auto-deploys (if you set up the webhook) or click **Deploy** manually → if `server/package.json` changed, click **Run NPM Install** again → **Restart** the Node.js app.
- **Content change** (products, services, FAQs, etc.): either re-run `npm run db:seed` after editing `server/src/db/seed.js`, or edit rows directly in phpMyAdmin — the API reads live from MySQL on every request, so changes show up immediately with no redeploy.
