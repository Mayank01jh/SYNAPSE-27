require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const qrcode = require('qrcode');
const db = require('./server/db');
const email = require('./server/email');

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ═══════════════════════════════════════════════════
// SECURITY MIDDLEWARE LAYER
// ═══════════════════════════════════════════════════

// 1. Helmet: Sets security HTTP headers (XSS, HSTS, noSniff, frameguard, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.tailwindcss.com",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://ajax.googleapis.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,  // Allow external CDN resources
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. CORS: Restrict origins in production
const corsOptions = IS_PROD
  ? { origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : false }
  : { origin: true };
app.use(cors(corsOptions));

// 3. Rate Limiting: Prevent abuse and brute-force attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15-minute window
  max: 300,                     // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' }
});
app.use('/api/', globalLimiter);

// Registration-specific rate limiter (stricter)
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                      // 20 registrations per IP per 15 mins
  message: { success: false, error: 'Registration rate limit exceeded. Please wait before submitting again.' }
});

// Payment confirmation rate limiter
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: { success: false, error: 'Payment confirmation rate limit exceeded.' }
});

// Admin endpoints rate limiter
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { success: false, error: 'Admin API rate limit exceeded.' }
});

// 4. Body parser with size limits (prevents large payload attacks)
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// 5. Remove X-Powered-By header (already done by helmet, but explicit)
app.disable('x-powered-by');

// 6. Request logging middleware (security audit trail)
app.use('/api/', (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[AUDIT] ${timestamp} | ${req.method} ${req.path} | IP: ${ip}`);
  next();
});

// ═══════════════════════════════════════════════════
// STATIC ASSETS
// ═══════════════════════════════════════════════════

app.use(express.static(path.join(__dirname, 'public'), {
  dotfiles: 'deny',          // Block access to dotfiles (.env, .git)
  maxAge: IS_PROD ? '1d' : 0  // Cache static assets in production
}));
app.use('/stitch', express.static(path.join(__dirname, 'stitch_tech_fest_2027_website_ui'), {
  dotfiles: 'deny'
}));

// ═══════════════════════════════════════════════════
// INPUT SANITIZATION HELPERS
// ═══════════════════════════════════════════════════

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().slice(0, 500);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPhone(phone) {
  return /^[\d\s+\-()]{7,20}$/.test(phone);
}

function isValidTicketId(id) {
  return /^SYN27-[A-F0-9]{8}$/i.test(id);
}

// Helper to determine base host URL
function getHostUrl(req) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
}

// ═══════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'SYNAPSE-2027-API',
    organizer: 'VERVE Club, IILM University',
    author: 'Site by Mayank',
    timestamp: new Date().toISOString()
  });
});

// 1.5 Dynamic Public Settings (Price & Payment Options)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    console.error('[API /settings] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Admin settings endpoints
app.get('/api/admin/settings', adminLimiter, (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    console.error('[API /admin/settings GET] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

app.post('/api/admin/settings', adminLimiter, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated, message: 'Settings saved successfully.' });
  } catch (err) {
    console.error('[API /admin/settings POST] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Admin Clear Test Registrations
app.post('/api/admin/clear-data', adminLimiter, (req, res) => {
  try {
    const result = db.clearAllRegistrations();
    res.json(result);
  } catch (err) {
    console.error('[API /admin/clear-data] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// Dynamic QR Code Generator endpoint (replaces client-side cdnjs qrcode)
app.get('/api/qr', async (req, res) => {
  try {
    const text = req.query.text || 'https://synapse2027.iilm.edu';
    const dataUrl = await qrcode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: { dark: '#111111', light: '#FFFFFF' }
    });
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const img = Buffer.from(base64Data, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(img);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to generate QR.' });
  }
});

// 2. Submit student registration
app.post('/api/register', registrationLimiter, async (req, res) => {
  try {
    const { fullName, email: studentEmail, phone, college, studentId, track, eventId, eventName, role, teamName, teamMembers, amount } = req.body;

    // Validate required fields
    if (!fullName || !studentEmail || !phone || !college || !track || !eventName) {
      return res.status(400).json({ success: false, error: 'Missing required registration fields.' });
    }

    // Validate email format
    if (!isValidEmail(studentEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address format.' });
    }

    // Validate phone format
    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Invalid phone number format.' });
    }

    // Validate track
    const validTracks = ['software', 'robotics', 'startup', 'cultural', 'gaming', 'general'];
    if (!validTracks.includes(track)) {
      return res.status(400).json({ success: false, error: 'Invalid track selection.' });
    }

    // Validate amount is non-negative
    const parsedAmount = parseInt(amount, 10) || 0;
    if (parsedAmount < 0 || parsedAmount > 10000) {
      return res.status(400).json({ success: false, error: 'Invalid registration amount.' });
    }

    const registration = db.createRegistration({
      fullName: sanitize(fullName),
      email: sanitize(studentEmail),
      phone: sanitize(phone),
      college: sanitize(college),
      studentId: sanitize(studentId || ''),
      track,
      eventId: sanitize(eventId || 'general'),
      eventName: sanitize(eventName),
      role: sanitize(role || 'Attendee'),
      teamName: teamName ? sanitize(teamName) : null,
      teamMembers,
      amount: parsedAmount
    });

    const hostUrl = getHostUrl(req);
    let emailResult = null;
    let qrDataUrl = null;

    if (registration.isFree) {
      const ticket = db.getTicket(registration.ticketId);
      qrDataUrl = await email.generateQRCode(registration.ticketId, hostUrl);
      emailResult = await email.sendTicketEmail(ticket, hostUrl);
    } else {
      qrDataUrl = await email.generateQRCode(registration.ticketId, hostUrl);
    }

    res.json({
      success: true,
      ticketId: registration.ticketId,
      paymentId: registration.paymentId,
      amount: registration.amount,
      isFree: registration.isFree,
      qrDataUrl,
      emailSent: registration.isFree && emailResult ? emailResult.success : false,
      emailPreviewUrl: emailResult ? emailResult.previewUrl : null
    });
  } catch (err) {
    console.error('[API /register] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error during registration.' });
  }
});

// 3. Confirm payment & dispatch automated ticket email
app.post('/api/payment/confirm', paymentLimiter, async (req, res) => {
  try {
    const { ticketId, paymentId, paymentMethod, transactionRef } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, error: 'Missing ticketId.' });
    }

    // Validate ticketId format
    if (!isValidTicketId(ticketId)) {
      return res.status(400).json({ success: false, error: 'Invalid ticket ID format.' });
    }

    // Validate payment method
    const validMethods = ['UPI', 'CARD', 'NETBANKING', 'FREE', 'CASH'];
    const method = (paymentMethod || 'UPI').toUpperCase();
    if (!validMethods.includes(method)) {
      return res.status(400).json({ success: false, error: 'Invalid payment method.' });
    }

    const confirmedTicket = db.confirmPayment({
      ticketId,
      paymentId: paymentId ? sanitize(paymentId) : null,
      paymentMethod: method,
      transactionRef: transactionRef ? sanitize(transactionRef) : `TXN-SYN27-${Date.now()}`
    });

    if (!confirmedTicket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }

    const hostUrl = getHostUrl(req);
    const qrDataUrl = await email.generateQRCode(ticketId, hostUrl);
    const emailResult = await email.sendTicketEmail(confirmedTicket, hostUrl);

    res.json({
      success: true,
      ticket: confirmedTicket,
      qrDataUrl,
      emailSent: emailResult.success,
      emailPreviewUrl: emailResult.previewUrl
    });
  } catch (err) {
    console.error('[API /payment/confirm] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error during payment confirmation.' });
  }
});

// 4. Get ticket details by ID
app.get('/api/ticket/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!isValidTicketId(ticketId)) {
      return res.status(400).json({ success: false, error: 'Invalid ticket ID format.' });
    }

    const ticket = db.getTicket(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found.' });
    }

    const hostUrl = getHostUrl(req);
    const qrDataUrl = await email.generateQRCode(ticketId, hostUrl);

    res.json({
      success: true,
      ticket,
      qrDataUrl
    });
  } catch (err) {
    console.error('[API /ticket/:ticketId] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// 5. Gate Scanner / Verification endpoint
app.get('/api/verify/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!isValidTicketId(ticketId)) {
      return res.json({ valid: false, reason: 'Invalid ticket ID format.' });
    }

    const result = db.verifyTicket(ticketId);
    if (!result.valid) {
      return res.json({ valid: false, reason: result.reason });
    }

    const hostUrl = getHostUrl(req);
    const qrDataUrl = await email.generateQRCode(ticketId, hostUrl);

    res.json({
      valid: true,
      ticket: result.ticket,
      alreadyCheckedIn: result.alreadyCheckedIn,
      lastCheckin: result.lastCheckin,
      qrDataUrl
    });
  } catch (err) {
    console.error('[API /verify/:ticketId] Error:', err);
    res.status(500).json({ valid: false, error: 'Internal server error.' });
  }
});

// 6. Record gate check-in
app.post('/api/checkin/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const { gateName, scannedBy } = req.body;

    if (!isValidTicketId(ticketId)) {
      return res.status(400).json({ success: false, error: 'Invalid ticket ID format.' });
    }

    const verification = db.verifyTicket(ticketId);
    if (!verification.valid) {
      return res.status(400).json({ success: false, error: verification.reason });
    }

    const record = db.recordCheckin(
      ticketId,
      sanitize(gateName || 'Main Gate 01 (IILM Gurugram)'),
      sanitize(scannedBy || 'VERVE Gate Coordinator')
    );

    res.json({
      success: true,
      message: 'Gate admission granted and recorded.',
      record
    });
  } catch (err) {
    console.error('[API /checkin/:ticketId] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// 7. Organizer admin statistics
app.get('/api/admin/stats', adminLimiter, (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('[API /admin/stats] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// 8. Admin registrations list with search/export
app.get('/api/admin/registrations', adminLimiter, (req, res) => {
  try {
    const registrations = db.getAllRegistrations();
    res.json({ success: true, registrations });
  } catch (err) {
    console.error('[API /admin/registrations] Error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ═══════════════════════════════════════════════════
// 404 & ERROR HANDLING
// ═══════════════════════════════════════════════════

// Fallback for client-side navigation (API routes return 404 JSON, static files fall back safely)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found.' });
  }
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // When running inside serverless lambdas where public/ is hosted at CDN edge
  res.status(200).send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/"></head><body>Redirecting to SYNAPSE '27...</body></html>`);
});

// Global error handler (prevents stack trace leaks and preserves HTTP status)
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 413 ? 'Payload too large. Max request body is 16kb.' : (IS_PROD ? 'Internal server error.' : err.message)
  });
});

// ═══════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`\n======================================================`);
    console.log(`⚡ SYNAPSE 2027 Server live on http://localhost:${PORT}`);
    console.log(`⚡ Initiated by: VERVE Club, IILM University Gurugram`);
    console.log(`⚡ Created by: Site by Mayank`);
    console.log(`⚡ Mode: ${IS_PROD ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`⚡ Verification Portal: http://localhost:${PORT}/verify.html`);
    console.log(`⚡ Organizer Admin:    http://localhost:${PORT}/admin.html`);
    console.log(`======================================================\n`);

    await email.initTransporter();
  });
}

module.exports = app;
