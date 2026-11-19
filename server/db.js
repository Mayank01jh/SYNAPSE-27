const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const crypto = require('node:crypto');

const dbPath = path.join(__dirname, '..', 'synapse.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      college TEXT NOT NULL,
      student_id TEXT,
      track TEXT NOT NULL,
      event_id TEXT NOT NULL,
      event_name TEXT NOT NULL,
      role TEXT NOT NULL,
      team_name TEXT,
      team_members TEXT,
      registration_status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payment_id TEXT UNIQUE NOT NULL,
      ticket_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'INR',
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'PENDING',
      transaction_ref TEXT,
      captured_at DATETIME,
      FOREIGN KEY(ticket_id) REFERENCES registrations(ticket_id)
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      gate_name TEXT DEFAULT 'Main Gate 01 (IILM Gurugram)',
      scanned_by TEXT DEFAULT 'VERVE Gate Coordinator',
      scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES registrations(ticket_id)
    );

    CREATE INDEX IF NOT EXISTS idx_reg_ticket ON registrations(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);
    CREATE INDEX IF NOT EXISTS idx_pay_ticket ON payments(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_checkin_ticket ON checkins(ticket_id);
  `);
}

initDatabase();

// Generate unique ticket ID: e.g. SYN27-9F8A2B
function generateTicketId() {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SYN27-${hex}`;
}

// Generate unique payment ID: e.g. PAY-SYN27-482910
function generatePaymentId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `PAY-SYN27-${num}`;
}

// 1. Create a pending registration
function createRegistration(data) {
  const ticketId = generateTicketId();
  const paymentId = generatePaymentId();

  const insertReg = db.prepare(`
    INSERT INTO registrations (
      ticket_id, full_name, email, phone, college, student_id,
      track, event_id, event_name, role, team_name, team_members,
      registration_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
  `);

  insertReg.run(
    ticketId,
    data.fullName.trim(),
    data.email.trim().toLowerCase(),
    data.phone.trim(),
    data.college.trim(),
    data.studentId ? data.studentId.trim() : '',
    data.track,
    data.eventId,
    data.eventName,
    data.role || 'Attendee',
    data.teamName ? data.teamName.trim() : null,
    data.teamMembers ? JSON.stringify(data.teamMembers) : null
  );

  const amount = parseInt(data.amount, 10) || 0;
  const insertPay = db.prepare(`
    INSERT INTO payments (
      payment_id, ticket_id, amount, currency, payment_method, payment_status
    ) VALUES (?, ?, ?, 'INR', ?, ?)
  `);

  const initialStatus = amount === 0 ? 'CAPTURED' : 'PENDING';
  insertPay.run(
    paymentId,
    ticketId,
    amount,
    amount === 0 ? 'FREE' : (data.paymentMethod || 'UPI'),
    initialStatus
  );

  // If free event pass, immediately mark confirmed
  if (amount === 0) {
    db.prepare(`
      UPDATE registrations SET registration_status = 'CONFIRMED' WHERE ticket_id = ?
    `).run(ticketId);
  }

  return { ticketId, paymentId, amount, isFree: amount === 0 };
}

// 2. Confirm payment
function confirmPayment({ ticketId, paymentId, paymentMethod, transactionRef }) {
  const now = new Date().toISOString();

  const updatePay = db.prepare(`
    UPDATE payments
    SET payment_status = 'CAPTURED',
        payment_method = COALESCE(?, payment_method),
        transaction_ref = ?,
        captured_at = ?
    WHERE ticket_id = ? AND (payment_id = ? OR ? IS NULL)
  `);
  updatePay.run(paymentMethod || 'UPI', transactionRef || `TXN-${Date.now()}`, now, ticketId, paymentId, paymentId);

  const updateReg = db.prepare(`
    UPDATE registrations
    SET registration_status = 'CONFIRMED'
    WHERE ticket_id = ?
  `);
  updateReg.run(ticketId);

  return getTicket(ticketId);
}

// 3. Get full ticket details
function getTicket(ticketId) {
  const query = db.prepare(`
    SELECT 
      r.ticket_id, r.full_name, r.email, r.phone, r.college, r.student_id,
      r.track, r.event_id, r.event_name, r.role, r.team_name, r.team_members,
      r.registration_status, r.created_at,
      p.payment_id, p.amount, p.payment_method, p.payment_status, p.transaction_ref, p.captured_at
    FROM registrations r
    LEFT JOIN payments p ON r.ticket_id = p.ticket_id
    WHERE r.ticket_id = ?
  `);

  const row = query.get(ticketId);
  if (!row) return null;

  return {
    ...row,
    team_members: row.team_members ? JSON.parse(row.team_members) : []
  };
}

// 4. Verify ticket for gate scanner
function verifyTicket(ticketId) {
  const ticket = getTicket(ticketId);
  if (!ticket) {
    return { valid: false, reason: 'Ticket ID not found in SYNAPSE database.' };
  }

  if (ticket.registration_status !== 'CONFIRMED') {
    return { valid: false, reason: 'Registration is not confirmed (Payment Pending).' };
  }

  const checkinQuery = db.prepare(`
    SELECT * FROM checkins WHERE ticket_id = ? ORDER BY scanned_at DESC LIMIT 1
  `);
  const existingCheckin = checkinQuery.get(ticketId);

  return {
    valid: true,
    ticket,
    alreadyCheckedIn: !!existingCheckin,
    lastCheckin: existingCheckin || null
  };
}

// 5. Record gate check-in
function recordCheckin(ticketId, gateName = 'Main Gate 01', scannedBy = 'VERVE Gate Coordinator') {
  const insert = db.prepare(`
    INSERT INTO checkins (ticket_id, gate_name, scanned_by)
    VALUES (?, ?, ?)
  `);
  insert.run(ticketId, gateName, scannedBy);
  return { success: true, timestamp: new Date().toISOString() };
}

// 6. Admin stats & overview
function getAdminStats() {
  const totalRegs = db.prepare(`SELECT COUNT(*) as count FROM registrations`).get().count;
  const confirmedRegs = db.prepare(`SELECT COUNT(*) as count FROM registrations WHERE registration_status = 'CONFIRMED'`).get().count;
  const pendingRegs = db.prepare(`SELECT COUNT(*) as count FROM registrations WHERE registration_status = 'PENDING'`).get().count;
  const totalRevenue = db.prepare(`SELECT COALESCE(SUM(amount), 0) as sum FROM payments WHERE payment_status = 'CAPTURED'`).get().sum;
  const totalCheckins = db.prepare(`SELECT COUNT(DISTINCT ticket_id) as count FROM checkins`).get().count;

  const trackDistribution = db.prepare(`
    SELECT track, COUNT(*) as count FROM registrations WHERE registration_status = 'CONFIRMED' GROUP BY track
  `).all();

  const recentRegistrations = db.prepare(`
    SELECT r.ticket_id, r.full_name, r.email, r.college, r.event_name, r.role, r.registration_status, r.created_at, p.amount
    FROM registrations r
    LEFT JOIN payments p ON r.ticket_id = p.ticket_id
    ORDER BY r.id DESC LIMIT 10
  `).all();

  return {
    totalRegistrations: totalRegs,
    confirmedRegistrations: confirmedRegs,
    pendingRegistrations: pendingRegs,
    totalRevenue,
    totalCheckins,
    trackDistribution,
    recentRegistrations
  };
}

// 7. Get all registrations for admin table & CSV export
function getAllRegistrations() {
  return db.prepare(`
    SELECT 
      r.ticket_id, r.full_name, r.email, r.phone, r.college, r.student_id,
      r.track, r.event_name, r.role, r.team_name, r.registration_status, r.created_at,
      p.payment_id, p.amount, p.payment_method, p.payment_status, p.transaction_ref,
      c.scanned_at as checkin_time
    FROM registrations r
    LEFT JOIN payments p ON r.ticket_id = p.ticket_id
    LEFT JOIN (
      SELECT ticket_id, MIN(scanned_at) as scanned_at FROM checkins GROUP BY ticket_id
    ) c ON r.ticket_id = c.ticket_id
    ORDER BY r.id DESC
  `).all();
}

module.exports = {
  createRegistration,
  confirmPayment,
  getTicket,
  verifyTicket,
  recordCheckin,
  getAdminStats,
  getAllRegistrations
};
