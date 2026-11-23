const path = require('node:path');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');

// Determine database file location & execution environment
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
let dbPath = path.join(__dirname, '..', 'synapse.db');

// Safe loader for SQLite DatabaseSync
let DatabaseSync = null;
let db = null;
let useFallback = isServerless; // In Vercel / serverless environment, use resilient pure-JS engine to prevent native crashes

if (!isServerless) {
  try {
    ({ DatabaseSync } = require('node:sqlite'));
    if (DatabaseSync) {
      try {
        db = new DatabaseSync(dbPath);
        db.exec(`PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;`);
      } catch (fsErr) {
        dbPath = path.join(os.tmpdir(), 'synapse.db');
        try {
          db = new DatabaseSync(dbPath);
          db.exec(`PRAGMA foreign_keys = ON;`);
        } catch (tmpErr) {
          useFallback = true;
          db = null;
        }
      }
    }
  } catch (err) {
    console.warn('[DB] Native node:sqlite not available. Activating resilient in-memory storage engine.');
    useFallback = true;
    db = null;
  }
}

if (!db) {
  useFallback = true;
}

// ═══════════════════════════════════════════════════
// SQLITE INITIALIZATION
// ═══════════════════════════════════════════════════

if (!useFallback && db) {
  try {
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

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  } catch (schemaErr) {
    console.error('[DB] Schema init failed, falling back to memory engine:', schemaErr.message);
    useFallback = true;
  }
}

// ═══════════════════════════════════════════════════
// RESILIENT IN-MEMORY / JSON ENGINE (FALLBACK)
// ═══════════════════════════════════════════════════

const fallbackStorePath = path.join(os.tmpdir(), 'synapse_fallback_store.json');
let fallbackStore = { registrations: [], payments: [], checkins: [] };

function loadFallbackStore() {
  try {
    if (fs.existsSync(fallbackStorePath)) {
      const content = fs.readFileSync(fallbackStorePath, 'utf8');
      fallbackStore = JSON.parse(content);
    }
  } catch (e) {}
}

function saveFallbackStore() {
  try {
    fs.writeFileSync(fallbackStorePath, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (e) {}
}

if (useFallback) {
  loadFallbackStore();
}

// ═══════════════════════════════════════════════════
// ID GENERATORS
// ═══════════════════════════════════════════════════

function generateTicketId() {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SYN27-${hex}`;
}

function generatePaymentId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `PAY-SYN27-${num}`;
}

// ═══════════════════════════════════════════════════
// EXPORTED OPERATIONS (DUAL-MODE: SQLITE + FALLBACK)
// ═══════════════════════════════════════════════════

function createRegistration(data) {
  const ticketId = generateTicketId();
  const paymentId = generatePaymentId();
  const amount = parseInt(data.amount, 10) || 0;
  const initialPaymentStatus = amount === 0 ? 'CAPTURED' : 'PENDING';
  const initialRegStatus = amount === 0 ? 'CONFIRMED' : 'PENDING';
  const now = new Date().toISOString();

  if (!useFallback && db) {
    const insertReg = db.prepare(`
      INSERT INTO registrations (
        ticket_id, full_name, email, phone, college, student_id,
        track, event_id, event_name, role, team_name, team_members,
        registration_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.teamMembers ? JSON.stringify(data.teamMembers) : null,
      initialRegStatus,
      now
    );

    const insertPay = db.prepare(`
      INSERT INTO payments (
        payment_id, ticket_id, amount, currency, payment_method, payment_status, captured_at
      ) VALUES (?, ?, ?, 'INR', ?, ?, ?)
    `);

    insertPay.run(
      paymentId,
      ticketId,
      amount,
      amount === 0 ? 'FREE' : (data.paymentMethod || 'UPI'),
      initialPaymentStatus,
      amount === 0 ? now : null
    );

    return { ticketId, paymentId, amount, isFree: amount === 0 };
  }

  // Fallback Engine
  const regRecord = {
    id: fallbackStore.registrations.length + 1,
    ticket_id: ticketId,
    full_name: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    college: data.college.trim(),
    student_id: data.studentId ? data.studentId.trim() : '',
    track: data.track,
    event_id: data.eventId,
    event_name: data.eventName,
    role: data.role || 'Attendee',
    team_name: data.teamName ? data.teamName.trim() : null,
    team_members: data.teamMembers ? JSON.stringify(data.teamMembers) : null,
    registration_status: initialRegStatus,
    created_at: now
  };
  fallbackStore.registrations.push(regRecord);

  const payRecord = {
    id: fallbackStore.payments.length + 1,
    payment_id: paymentId,
    ticket_id: ticketId,
    amount,
    currency: 'INR',
    payment_method: amount === 0 ? 'FREE' : (data.paymentMethod || 'UPI'),
    payment_status: initialPaymentStatus,
    transaction_ref: null,
    captured_at: amount === 0 ? now : null
  };
  fallbackStore.payments.push(payRecord);
  saveFallbackStore();

  return { ticketId, paymentId, amount, isFree: amount === 0 };
}

function confirmPayment({ ticketId, paymentId, paymentMethod, transactionRef }) {
  const now = new Date().toISOString();

  if (!useFallback && db) {
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

  // Fallback Engine
  const pay = fallbackStore.payments.find(p => p.ticket_id === ticketId && (!paymentId || p.payment_id === paymentId));
  if (pay) {
    pay.payment_status = 'CAPTURED';
    if (paymentMethod) pay.payment_method = paymentMethod;
    pay.transaction_ref = transactionRef || `TXN-${Date.now()}`;
    pay.captured_at = now;
  }

  const reg = fallbackStore.registrations.find(r => r.ticket_id === ticketId);
  if (reg) {
    reg.registration_status = 'CONFIRMED';
  }
  saveFallbackStore();

  return getTicket(ticketId);
}

function getTicket(ticketId) {
  if (!useFallback && db) {
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
      team_members: row.team_members ? (typeof row.team_members === 'string' ? JSON.parse(row.team_members) : row.team_members) : []
    };
  }

  // Fallback Engine
  const reg = fallbackStore.registrations.find(r => r.ticket_id === ticketId);
  if (!reg) return null;
  const pay = fallbackStore.payments.find(p => p.ticket_id === ticketId) || {};

  return {
    ticket_id: reg.ticket_id,
    full_name: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    college: reg.college,
    student_id: reg.student_id,
    track: reg.track,
    event_id: reg.event_id,
    event_name: reg.event_name,
    role: reg.role,
    team_name: reg.team_name,
    team_members: reg.team_members ? (typeof reg.team_members === 'string' ? JSON.parse(reg.team_members) : reg.team_members) : [],
    registration_status: reg.registration_status,
    created_at: reg.created_at,
    payment_id: pay.payment_id || null,
    amount: pay.amount || 0,
    payment_method: pay.payment_method || 'FREE',
    payment_status: pay.payment_status || 'PENDING',
    transaction_ref: pay.transaction_ref || null,
    captured_at: pay.captured_at || null
  };
}

function verifyTicket(ticketId) {
  const ticket = getTicket(ticketId);
  if (!ticket) {
    return { valid: false, reason: 'Ticket ID not found in SYNAPSE database.' };
  }

  if (ticket.registration_status !== 'CONFIRMED') {
    return { valid: false, reason: 'Registration is not confirmed (Payment Pending).' };
  }

  if (!useFallback && db) {
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

  // Fallback Engine
  const existingCheckin = [...fallbackStore.checkins]
    .filter(c => c.ticket_id === ticketId)
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))[0];

  return {
    valid: true,
    ticket,
    alreadyCheckedIn: !!existingCheckin,
    lastCheckin: existingCheckin || null
  };
}

function recordCheckin(ticketId, gateName = 'Main Gate 01 (IILM Gurugram)', scannedBy = 'VERVE Gate Coordinator') {
  const now = new Date().toISOString();

  if (!useFallback && db) {
    const insert = db.prepare(`
      INSERT INTO checkins (ticket_id, gate_name, scanned_by)
      VALUES (?, ?, ?)
    `);
    insert.run(ticketId, gateName, scannedBy);
    return { success: true, timestamp: now };
  }

  // Fallback Engine
  fallbackStore.checkins.push({
    id: fallbackStore.checkins.length + 1,
    ticket_id: ticketId,
    gate_name: gateName,
    scanned_by: scannedBy,
    scanned_at: now
  });
  saveFallbackStore();
  return { success: true, timestamp: now };
}

function getAdminStats() {
  if (!useFallback && db) {
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

  // Fallback Engine
  const totalRegs = fallbackStore.registrations.length;
  const confirmedRegs = fallbackStore.registrations.filter(r => r.registration_status === 'CONFIRMED').length;
  const pendingRegs = fallbackStore.registrations.filter(r => r.registration_status === 'PENDING').length;
  const totalRevenue = fallbackStore.payments
    .filter(p => p.payment_status === 'CAPTURED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCheckins = new Set(fallbackStore.checkins.map(c => c.ticket_id)).size;

  const trackMap = {};
  fallbackStore.registrations
    .filter(r => r.registration_status === 'CONFIRMED')
    .forEach(r => {
      trackMap[r.track] = (trackMap[r.track] || 0) + 1;
    });
  const trackDistribution = Object.keys(trackMap).map(track => ({ track, count: trackMap[track] }));

  const recentRegistrations = [...fallbackStore.registrations]
    .reverse()
    .slice(0, 10)
    .map(r => {
      const p = fallbackStore.payments.find(pay => pay.ticket_id === r.ticket_id) || {};
      return {
        ticket_id: r.ticket_id,
        full_name: r.full_name,
        email: r.email,
        college: r.college,
        event_name: r.event_name,
        role: r.role,
        registration_status: r.registration_status,
        created_at: r.created_at,
        amount: p.amount || 0
      };
    });

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

function getAllRegistrations() {
  if (!useFallback && db) {
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

  // Fallback Engine
  return [...fallbackStore.registrations]
    .reverse()
    .map(r => {
      const p = fallbackStore.payments.find(pay => pay.ticket_id === r.ticket_id) || {};
      const checkin = fallbackStore.checkins.find(c => c.ticket_id === r.ticket_id);
      return {
        ticket_id: r.ticket_id,
        full_name: r.full_name,
        email: r.email,
        phone: r.phone,
        college: r.college,
        student_id: r.student_id,
        track: r.track,
        event_name: r.event_name,
        role: r.role,
        team_name: r.team_name,
        registration_status: r.registration_status,
        created_at: r.created_at,
        payment_id: p.payment_id || null,
        amount: p.amount || 0,
        payment_method: p.payment_method || null,
        payment_status: p.payment_status || null,
        transaction_ref: p.transaction_ref || null,
        checkin_time: checkin ? checkin.scanned_at : null
      };
    });
}

// 8. Dynamic Settings & Price/Payment Options
const DEFAULT_SETTINGS = {
  defaultFee: 350,
  eventFees: {
    "hackathon-6h": 350,
    "prompt-wars": 350,
    "ctf-cyber": 350,
    "uiux-design": 350,
    "tech-quiz": 350,
    "tech-expo": 350,
    "treasure-hunt": 350,
    "workshops": 0,
    "tech-pictionary": 150,
    "innovation-pitching": 350,
    "logo-quiz": 150,
    "jam-session": 100,
    "general-fest-pass": 350
  },
  paymentMethods: {
    upi: true,
    card: true,
    netbanking: true,
    cash: true
  },
  upiId: "verve.iilm@upi",
  payeeName: "VERVE Club IILM University",
  qrCodeNote: "SYNAPSE '27 Registration Fee",
  allowRegistrations: true
};

function getSettings() {
  if (!useFallback && db) {
    try {
      const row = db.prepare(`SELECT value FROM settings WHERE key = 'app_config'`).get();
      if (row && row.value) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(row.value) };
      }
    } catch (e) {}
    return { ...DEFAULT_SETTINGS };
  }

  // Fallback
  if (fallbackStore.settings) {
    return { ...DEFAULT_SETTINGS, ...fallbackStore.settings };
  }
  return { ...DEFAULT_SETTINGS };
}

function updateSettings(newSettings) {
  const current = getSettings();
  const merged = {
    ...current,
    ...newSettings,
    eventFees: {
      ...current.eventFees,
      ...(newSettings.eventFees || {})
    },
    paymentMethods: {
      ...current.paymentMethods,
      ...(newSettings.paymentMethods || {})
    }
  };

  if (!useFallback && db) {
    try {
      db.prepare(`
        INSERT INTO settings (key, value) VALUES ('app_config', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(JSON.stringify(merged));
    } catch (e) {
      console.warn('[DB] Failed to save settings to SQLite:', e.message);
    }
  }

  fallbackStore.settings = merged;
  saveFallbackStore();
  return merged;
}

function clearAllRegistrations() {
  if (!useFallback && db) {
    try {
      db.exec(`
        DELETE FROM checkins;
        DELETE FROM payments;
        DELETE FROM registrations;
      `);
    } catch (e) {
      console.warn('[DB] Clear registrations error:', e.message);
    }
  }

  fallbackStore.registrations = [];
  fallbackStore.payments = [];
  fallbackStore.checkins = [];
  saveFallbackStore();
  return { success: true, message: 'All registration and test data cleared.' };
}

module.exports = {
  createRegistration,
  confirmPayment,
  getTicket,
  verifyTicket,
  recordCheckin,
  getAdminStats,
  getAllRegistrations,
  getSettings,
  updateSettings,
  clearAllRegistrations
};
