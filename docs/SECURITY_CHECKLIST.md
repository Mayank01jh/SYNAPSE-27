# SYNAPSE 2027 — Security & Firewall Checklist

> **Event:** SYNAPSE 2027 — Annual National Tech & Cultural Festival  
> **Initiated by:** VERVE Club, IILM University Gurugram  
> **Architecture & Platform:** Site by Mayank  
> **Target Environment:** Development & Production Hardening Guide  
> **Document Status:** Active / Pre-Production Verified  

---

## Executive Summary

This checklist outlines the defense-in-depth security model implemented and recommended for the **SYNAPSE 2027** platform. The system processes student registrations, simulated/gateway payment verifications, digital holographic ticket generation with QR codes, and physical gate check-in scanning across multi-day college fest operations.

```
+-------------------------------------------------------------+
|        Client Browsers / Volunteers / Attendees             |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|        Edge WAF & DDoS Shield (Cloudflare / CDN)            |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|        Host Firewall (Linux UFW / Windows Defender)         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|        Reverse Proxy (Nginx / TLS 1.3 Termination)          |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|        Node.js Express API (Port 3000)                      |
|  - Helmet (CSP, HSTS, noSniff, frameguard)                  |
|  - Multi-Tier Rate Limiters (Global, Reg, Pay, Admin)       |
|  - Input Sanitization & Regex Validation                    |
|  - Safe Error Handling & Audit Logging                      |
+-------------------------------------------------------------+
            |                                    |
            v                                    v
+-----------------------+              +-----------------------+
|  Restricted SQLite DB |              |  TLS SMTP Nodemailer  |
|     (synapse.db)      |              |   (Automated Passes)  |
+-----------------------+              +-----------------------+
```

---

## 1. Application Layer Security (Implemented & Verified)

| Control | Status | Implementation Details | Verification Test |
| :--- | :---: | :--- | :--- |
| **HTTP Security Headers** | ✅ Active | Configured via `helmet()` middleware: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-DNS-Prefetch-Control`, `Referrer-Policy: no-referrer`. | `test-suite.js` #13 |
| **Content Security Policy (CSP)** | ✅ Active | Explicit whitelist allowing scripts/styles from CDNs (Tailwind, CDNJS, Unpkg, Google Fonts) while blocking untrusted object and frame embeddings (`frameSrc: 'none'`, `objectSrc: 'none'`). | `test-suite.js` #13 |
| **Information Disclosure Prevention** | ✅ Active | `app.disable('x-powered-by')` and Helmet header removal; Server banners suppressed; Internal filesystem paths stripped from API responses. | `test-suite.js` #13, #19 |
| **Global Rate Limiting** | ✅ Active | `express-rate-limit`: 300 requests / 15-minute window per IP on `/api/*` endpoints. Standard `RateLimit-*` RFC headers enabled. | `test-suite.js` #20 |
| **Registration Rate Limiting** | ✅ Active | Stricter limiter on `/api/register`: Maximum 20 registrations / 15 minutes per IP to prevent bot spamming. | Implemented in `server.js` |
| **Payment Endpoint Limiting** | ✅ Active | Maximum 15 payment confirmations / 5 minutes per IP on `/api/payment/confirm`. | Implemented in `server.js` |
| **Admin API Rate Limiting** | ✅ Active | 60 requests / minute on `/api/admin/*` to thwart automated scraping. | Implemented in `server.js` |
| **Request Payload Size Cap** | ✅ Active | `express.json({ limit: '16kb' })` and `express.urlencoded({ limit: '16kb' })` to mitigate JSON bombs and buffer exhaustion attacks (HTTP 413). | `test-suite.js` #17 |
| **XSS Prevention & Sanitization** | ✅ Active | Dynamic input cleaner `sanitize()` strips HTML angle brackets (`<`, `>`) and truncates inputs to 500 characters. | `test-suite.js` #14 |
| **Strict Parameter Validation** | ✅ Active | Format checks on emails (RFC 5322 regex), phone numbers (`7-20` digits/symbols), Ticket IDs (`/^SYN27-[A-F0-9]{8}$/i`), and non-negative integer bounds on fee amounts. | `test-suite.js` #15, #16, #21-#24 |
| **Safe Error Handling** | ✅ Active | Global Express error handler catches uncaught rejections without leaking stack traces or internal filenames to users in production. | `test-suite.js` #18, #19 |
| **Dotfile Shielding** | ✅ Active | Static file server sets `dotfiles: 'deny'`, blocking unauthorized requests to `.env`, `.git`, or hidden configs. | Implemented in `server.js` |

---

## 2. Database & Data Access Security

| Control | Status | Description | Action Item / Best Practice |
| :--- | :---: | :--- | :--- |
| **SQL Injection Immunization** | ✅ Active | 100% of queries use native SQLite parameterized statements (`db.prepare('... ?').run(...)`). No raw string interpolation. | Maintained across `server/db.js` |
| **Database File Permissions** | ⚠️ Checklist | `synapse.db` must have strict OS access permissions (read/write only by the Node.js service user). | `chmod 600 synapse.db` on Linux; ACL restricted on Windows. |
| **Foreign Key Constraints** | ✅ Active | `PRAGMA foreign_keys = ON` executed upon opening connection to enforce referential integrity between registrations, payments, and checkins. | Enforced in SQLite schema |
| **Write-Ahead Logging (WAL)** | ✅ Active | `PRAGMA journal_mode = WAL` enabled for concurrency, resilience against crash corruption, and fast atomic commits. | Configured in `server/db.js` |
| **Database Backups** | ⚠️ Checklist | Automated periodic snapshots during the fest days to prevent data loss. | Set up a cron task or scheduled job to copy `synapse.db` every 30 minutes. |

---

## 3. Network & Firewall Configuration

### A. Port Exposure Guidelines

> **IMPORTANT:** The Node.js application should **NEVER** be bound directly to a public IP on port 80/443 without a reverse proxy.

- **Internal Node.js Port:** `3000` (Bound only to `127.0.0.1` in production)
- **Public Ports:** `80` (HTTP -> Redirect to HTTPS) and `443` (HTTPS with TLS 1.2/1.3)

### B. Windows Firewall Configuration (Host Server)

If running the production host on Windows Server:

```powershell
# 1. Allow inbound HTTP and HTTPS through Windows Firewall
New-NetFirewallRule -DisplayName "HTTP (Port 80)" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS (Port 443)" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow

# 2. Block direct external access to internal Node.js port 3000
New-NetFirewallRule -DisplayName "Block Public 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -RemoteAddress "127.0.0.1" -Action Allow
New-NetFirewallRule -DisplayName "Drop External 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Block
```

### C. Linux (Ubuntu / Debian) UFW Configuration

```bash
# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH management (customize port if non-standard)
sudo ufw allow 22/tcp

# Allow Web Traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ensure port 3000 is NOT exposed to external interfaces
sudo ufw deny 3000/tcp

# Enable Firewall
sudo ufw enable
sudo ufw status verbose
```

### D. Reverse Proxy (Nginx) Hardened Configuration

Deploy an Nginx reverse proxy in front of Node.js for SSL termination, gzip compression, and rate limiting:

```nginx
# /etc/nginx/sites-available/synapse2027.conf

# 1. Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name synapse2027.iilm.edu; # Or custom domain

    return 301 https://$host$request_uri;
}

# 2. Hardened HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name synapse2027.iilm.edu;

    # SSL Certificates (Let's Encrypt Certbot)
    ssl_certificate /etc/letsencrypt/live/synapse2027.iilm.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/synapse2027.iilm.edu/privkey.pem;

    # Modern TLS configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HSTS (6 months)
    add_header Strict-Transport-Security "max-age=15768000; includeSubDomains" always;

    # Client Request Limits
    client_max_body_size 2M;
    client_body_buffer_size 16k;

    # Reverse proxy to Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

---

## 4. Email & Domain Security (Anti-Spoofing & Deliverability)

When dispatching official digital admission passes, the sender domain must be protected against spoofing and spam classification:

| Record Type | Host | Recommended Value | Purpose |
| :--- | :--- | :--- | :--- |
| **SPF** | `@` | `v=spf1 include:_spf.google.com ~all` (or your SMTP provider) | Authorizes legitimate mail server IPs |
| **DKIM** | `default._domainkey` | Cryptographic public key provided by SMTP service | Guarantees email content has not been tampered with |
| **DMARC** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@iilm.edu` | Instructs receiving inboxes how to handle unauthenticated mail |
| **TLS Enforcement** | SMTP Client | `secure: true` on port 465 (or `STARTTLS` on port 587) | Ensures encrypted transit of student tickets and QR passes |

---

## 5. Administrative Access Protection (Pre-Launch Action)

The organizer admin dashboard (`/admin.html`) and admin data endpoints (`/api/admin/*`) provide management capabilities (stats, student rosters, CSV download).

### Recommended Production Guardrails:
1. **Admin Secret Token / Bearer Header:** Add middleware checking `x-admin-token: process.env.ADMIN_SECRET_KEY` on `/api/admin/*`.
2. **IP Whitelist for Gate/Admin:** Restrict `/admin.html` and `/verify.html` to IILM campus network IPs or authorized volunteer VPN subnets if public access is not required.
3. **Session Expiry:** Use temporary signed cookies or short-lived JWT tokens for gate security operators.

---

## 6. Pre-Launch Verification Runbook

Before opening registrations to students across colleges:

- [x] Run comprehensive functional & security test suite:
  ```bash
  node test-suite.js
  ```
  *(Status: 67/67 assertions PASSED)*
- [ ] Configure production `.env` file with live SMTP credentials (e.g., Gmail App Password or SendGrid/Postmark API key):
  ```env
  PORT=3000
  NODE_ENV=production
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=verve.synapse2027@iilm.edu
  SMTP_PASS=your-app-password
  EMAIL_FROM="SYNAPSE 2027 <verve.synapse2027@iilm.edu>"
  ALLOWED_ORIGINS=https://synapse2027.iilm.edu
  ADMIN_KEY=your-secure-admin-passcode
  ```
- [ ] Ensure `synapse.db` and `.env` are in `.gitignore` and never committed to GitHub.
- [ ] Install a process supervisor (such as PM2 or systemd service) for auto-restart on system reboot:
  ```bash
  npm install -g pm2
  pm2 start server.js --name "synapse-2027"
  pm2 save
  pm2 startup
  ```
- [ ] Verify SSL certificate renewal is automated via `certbot renew --dry-run`.
- [ ] Perform gate scanner dry-run using mobile phone camera on `/verify.html`.

---
*SYNAPSE 2027 • Initiated by VERVE Club, IILM University • Site by Mayank*
