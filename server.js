require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const db = require('./server/db');
const email = require('./server/email');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Also allow serving stitch design reference assets if needed
app.use('/stitch', express.static(path.join(__dirname, 'stitch_tech_fest_2027_website_ui')));

// Helper to determine base host URL
function getHostUrl(req) {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
}

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

// 2. Submit student registration
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email: studentEmail, phone, college, studentId, track, eventId, eventName, role, teamName, teamMembers, amount } = req.body;

    if (!fullName || !studentEmail || !phone || !college || !track || !eventName) {
      return res.status(400).json({ success: false, error: 'Missing required registration fields.' });
    }

    const registration = db.createRegistration({
      fullName,
      email: studentEmail,
      phone,
      college,
      studentId,
      track,
      eventId: eventId || 'general',
      eventName,
      role: role || 'Attendee',
      teamName,
      teamMembers,
      amount: parseInt(amount, 10) || 0
    });

    const hostUrl = getHostUrl(req);
    let emailResult = null;
    let qrDataUrl = null;

    // If it's a free pass, it's instantly confirmed and email is sent immediately
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
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Confirm payment & dispatch automated ticket email
app.post('/api/payment/confirm', async (req, res) => {
  try {
    const { ticketId, paymentId, paymentMethod, transactionRef } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, error: 'Missing ticketId.' });
    }

    const confirmedTicket = db.confirmPayment({
      ticketId,
      paymentId,
      paymentMethod: paymentMethod || 'UPI',
      transactionRef: transactionRef || `TXN-SYN27-${Date.now()}`
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
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get ticket details by ID
app.get('/api/ticket/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
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
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Gate Scanner / Verification endpoint
app.get('/api/verify/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const result = db.verifyTicket(ticketId);

    if (!result.valid) {
      return res.json({
        valid: false,
        reason: result.reason
      });
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
    res.status(500).json({ valid: false, error: err.message });
  }
});

// 6. Record gate check-in
app.post('/api/checkin/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const { gateName, scannedBy } = req.body;

    const verification = db.verifyTicket(ticketId);
    if (!verification.valid) {
      return res.status(400).json({ success: false, error: verification.reason });
    }

    const record = db.recordCheckin(
      ticketId,
      gateName || 'Main Gate 01 (IILM Gurugram)',
      scannedBy || 'VERVE Gate Coordinator'
    );

    res.json({
      success: true,
      message: 'Gate admission granted and recorded.',
      record
    });
  } catch (err) {
    console.error('[API /checkin/:ticketId] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Organizer admin statistics
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('[API /admin/stats] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Admin registrations list with search/export
app.get('/api/admin/registrations', (req, res) => {
  try {
    const registrations = db.getAllRegistrations();
    res.json({ success: true, registrations });
  } catch (err) {
    console.error('[API /admin/registrations] Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for client-side navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`⚡ SYNAPSE 2027 Server live on http://localhost:${PORT}`);
  console.log(`⚡ Initiated by: VERVE Club, IILM University Gurugram`);
  console.log(`⚡ Created by: Site by Mayank`);
  console.log(`⚡ Verification Portal: http://localhost:${PORT}/verify.html`);
  console.log(`⚡ Organizer Admin:    http://localhost:${PORT}/admin.html`);
  console.log(`======================================================\n`);
  
  // Initialize email transporter asynchronously
  await email.initTransporter();
});
