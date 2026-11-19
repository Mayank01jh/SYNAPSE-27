/**
 * ═══════════════════════════════════════════════════════════════
 *  SYNAPSE 2027 — Full Test Suite (Functional + Security)
 *  Initiated by VERVE Club, IILM University | Site by Mayank
 * ═══════════════════════════════════════════════════════════════
 *
 *  Run:  node test-suite.js
 *  Requires server running on http://localhost:3000
 */

const BASE = 'http://localhost:3000';
let passed = 0;
let failed = 0;
let total  = 0;
const results = [];

// ── Helpers ──────────────────────────────────────────────────

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return { status: res.status, headers: res.headers, data: await res.json() };
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('json') ? await res.json() : await res.text();
  return { status: res.status, headers: res.headers, data };
}

function assert(label, condition) {
  total++;
  if (condition) {
    passed++;
    results.push({ label, status: 'PASS' });
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    results.push({ label, status: 'FAIL' });
    console.log(`  ❌ ${label}`);
  }
}

// ── Functional Tests ─────────────────────────────────────────

async function testHealthEndpoint() {
  console.log('\n[1] Health Check');
  const r = await get('/api/health');
  assert('Status 200',                r.status === 200);
  assert('status is ONLINE',          r.data.status === 'ONLINE');
  assert('system is SYNAPSE-2027-API', r.data.system === 'SYNAPSE-2027-API');
  assert('organizer is VERVE Club',   r.data.organizer.includes('VERVE'));
  assert('author is Site by Mayank',  r.data.author === 'Site by Mayank');
}

async function testStaticPages() {
  console.log('\n[2] Static Pages');
  const index = await get('/');
  assert('index.html served (200)',   index.status === 200);
  assert('index contains SYNAPSE',    typeof index.data === 'string' && index.data.includes('SYNAPSE'));

  const verify = await get('/verify.html');
  assert('verify.html served (200)',  verify.status === 200);

  const admin = await get('/admin.html');
  assert('admin.html served (200)',   admin.status === 200);
}

async function testFreeRegistration() {
  console.log('\n[3] Free Registration + Auto Email');
  const r = await post('/api/register', {
    fullName: 'Riya Sharma',
    email: 'riya@test.com',
    phone: '9876543210',
    college: 'IILM University',
    studentId: 'IILM-2027-001',
    track: 'software',
    eventId: 'hackathon',
    eventName: 'The Synapse Hackathon',
    role: 'Hacker',
    amount: 0
  });
  assert('Registration succeeds',     r.data.success === true);
  assert('Ticket ID starts with SYN27-', r.data.ticketId && r.data.ticketId.startsWith('SYN27-'));
  assert('isFree is true',            r.data.isFree === true);
  assert('Email sent for free reg',   r.data.emailSent === true);
  assert('QR data URL present',       r.data.qrDataUrl && r.data.qrDataUrl.startsWith('data:image'));

  // Store for later tests
  return r.data.ticketId;
}

async function testPaidRegistration() {
  console.log('\n[4] Paid Registration');
  const r = await post('/api/register', {
    fullName: 'Arjun Kapoor',
    email: 'arjun@test.com',
    phone: '8765432109',
    college: 'DU',
    studentId: 'DU-2027-002',
    track: 'robotics',
    eventId: 'robowars',
    eventName: 'RoboWars X',
    role: 'Team Lead',
    teamName: 'Circuit Breakers',
    amount: 500
  });
  assert('Paid registration succeeds',  r.data.success === true);
  assert('Has paymentId',               !!r.data.paymentId);
  assert('isFree is false',             r.data.isFree === false);
  assert('Email NOT sent yet (unpaid)',  r.data.emailSent === false);

  return { ticketId: r.data.ticketId, paymentId: r.data.paymentId };
}

async function testPaymentConfirmation(ticketId, paymentId) {
  console.log('\n[5] Payment Confirmation + Auto Email');
  const r = await post('/api/payment/confirm', {
    ticketId,
    paymentId,
    paymentMethod: 'UPI',
    transactionRef: 'UPI-REF-TEST-12345'
  });
  assert('Payment confirmation succeeds', r.data.success === true);
  assert('Email sent after payment',      r.data.emailSent === true);
  assert('Email preview URL present',     !!r.data.emailPreviewUrl);
  assert('Ticket returned with CONFIRMED/CAPTURED status',
    r.data.ticket && (r.data.ticket.registration_status === 'CONFIRMED' || r.data.ticket.payment_status === 'CAPTURED')
  );
}

async function testTicketRetrieval(ticketId) {
  console.log('\n[6] Ticket Retrieval');
  const r = await get(`/api/ticket/${ticketId}`);
  assert('Ticket retrieval succeeds',    r.data.success === true);
  const name = r.data.ticket ? (r.data.ticket.full_name || r.data.ticket.fullName) : '';
  assert('Full name matches',            typeof name === 'string' && name.includes('Riya'));
  assert('QR data URL in response',      !!r.data.qrDataUrl);
}

async function testGateVerify(ticketId) {
  console.log('\n[7] Gate Verify (pre check-in)');
  const r = await get(`/api/verify/${ticketId}`);
  assert('Verification returns valid',   r.data.valid === true);
  assert('Not yet checked in',           r.data.alreadyCheckedIn === false);
}

async function testCheckin(ticketId) {
  console.log('\n[8] Gate Check-in');
  const r = await post(`/api/checkin/${ticketId}`, {
    gateName: 'Main Gate',
    scannedBy: 'VERVE Coordinator'
  });
  assert('Check-in recorded',           r.data.success === true);

  // Verify subsequent verify shows checked-in
  const v = await get(`/api/verify/${ticketId}`);
  assert('Re-verify shows checked in',  v.data.alreadyCheckedIn === true);
}

async function testInvalidTicket() {
  console.log('\n[9] Invalid Ticket Rejection');
  const r = await get('/api/verify/SYN27-ZZZZZZZZ');
  assert('Invalid ticket is not valid',  r.data.valid === false);
}

async function testAdminStats() {
  console.log('\n[10] Admin Stats');
  const r = await get('/api/admin/stats');
  assert('Admin stats returns success',   r.data.success === true);
  assert('Stats has totalRegistrations',  typeof r.data.stats.totalRegistrations === 'number');
}

async function testAdminRoster() {
  console.log('\n[11] Admin Registrations Roster');
  const r = await get('/api/admin/registrations');
  assert('Roster returns success',        r.data.success === true);
  assert('Roster is an array',            Array.isArray(r.data.registrations));
  assert('Roster has at least 2 entries', r.data.registrations.length >= 2);
}

async function testMissingFields() {
  console.log('\n[12] Missing Fields Validation');
  const r = await post('/api/register', { fullName: 'Incomplete' });
  assert('Missing fields returns 400',    r.status === 400);
  assert('Error message mentions fields', r.data.error.includes('Missing'));
}

// ── Security Tests ───────────────────────────────────────────

async function testSecurityHeaders() {
  console.log('\n[13] Security Headers (Helmet)');
  const r = await get('/api/health');
  const h = r.headers;

  assert('X-Content-Type-Options: nosniff',  h.get('x-content-type-options') === 'nosniff');
  assert('X-Frame-Options present',          !!h.get('x-frame-options'));
  assert('No X-Powered-By header',           !h.get('x-powered-by'));
  assert('Content-Security-Policy present',  !!h.get('content-security-policy'));
  assert('X-DNS-Prefetch-Control present',   !!h.get('x-dns-prefetch-control'));
}

async function testXSSSanitization() {
  console.log('\n[14] XSS Input Sanitization');
  const r = await post('/api/register', {
    fullName: '<script>alert("xss")</script>Hacker',
    email: 'xss@test.com',
    phone: '1234567890',
    college: '<img src=x onerror=alert(1)>Fake College',
    track: 'software',
    eventName: 'Test Event',
    amount: 0
  });
  assert('Registration with XSS payload succeeds', r.data.success === true);

  // Retrieve and verify sanitization
  const ticket = await get(`/api/ticket/${r.data.ticketId}`);
  const t = ticket.data.ticket;
  const name = t ? (t.full_name || t.fullName) : '';
  const college = t ? t.college : '';
  assert('Name has angle brackets stripped',    typeof name === 'string' && !name.includes('<') && !name.includes('>'));
  assert('College has angle brackets stripped',  typeof college === 'string' && !college.includes('<') && !college.includes('>'));
}

async function testInvalidEmailFormat() {
  console.log('\n[15] Invalid Email Rejection');
  const r = await post('/api/register', {
    fullName: 'Bad Email User',
    email: 'not-an-email',
    phone: '9999999999',
    college: 'Test College',
    track: 'general',
    eventName: 'Test Event',
    amount: 0
  });
  assert('Invalid email returns 400',     r.status === 400);
  assert('Error mentions email format',   r.data.error.toLowerCase().includes('email'));
}

async function testInvalidTicketIdFormat() {
  console.log('\n[16] Invalid Ticket ID Format');
  const r = await get('/api/ticket/BADFORMAT123');
  assert('Invalid format returns 400',    r.status === 400);
  assert('Error mentions format',         r.data.error.toLowerCase().includes('format'));
}

async function testOversizedPayload() {
  console.log('\n[17] Oversized Payload Rejection');
  try {
    const bigPayload = { fullName: 'A'.repeat(100000) };
    const res = await fetch(`${BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bigPayload)
    });
    // Should get 413 (Payload Too Large) or 400
    assert('Oversized payload rejected', res.status === 413 || res.status === 400);
  } catch (err) {
    // Connection reset or similar is also acceptable
    assert('Oversized payload rejected (connection reset)', true);
  }
}

async function testUnknownApiRoute() {
  console.log('\n[18] Unknown API Route → 404 JSON');
  const r = await get('/api/nonexistent/route');
  assert('Unknown API returns 404',       r.status === 404);
  assert('Returns JSON error',            r.data && r.data.success === false);
  assert('No stack trace in response',    !JSON.stringify(r.data).includes('at '));
}

async function testNoStackTraceLeaks() {
  console.log('\n[19] Error Responses — No Stack Traces');
  // Try malformed payment confirmation
  const r = await post('/api/payment/confirm', {
    ticketId: 'SYN27-00000000',
    paymentMethod: 'UPI'
  });
  const body = JSON.stringify(r.data);
  assert('No stack trace in error response',     !body.includes('at Object.'));
  assert('No file paths in error response',      !body.includes('server.js') && !body.includes('node_modules'));
  assert('Error message is generic',             r.data.error && r.data.error.length < 100);
}

async function testRateLimitHeaders() {
  console.log('\n[20] Rate Limit Headers');
  const r = await get('/api/health');
  const h = r.headers;
  assert('RateLimit-Limit header present',     !!h.get('ratelimit-limit'));
  assert('RateLimit-Remaining header present', !!h.get('ratelimit-remaining'));
  assert('RateLimit-Reset header present',     !!h.get('ratelimit-reset'));
}

async function testInvalidTrack() {
  console.log('\n[21] Invalid Track Rejection');
  const r = await post('/api/register', {
    fullName: 'Bad Track User',
    email: 'track@test.com',
    phone: '9999999999',
    college: 'Test College',
    track: 'invalid_track',
    eventName: 'Test Event',
    amount: 0
  });
  assert('Invalid track returns 400',    r.status === 400);
  assert('Error mentions track',         r.data.error.toLowerCase().includes('track'));
}

async function testInvalidPaymentMethod() {
  console.log('\n[22] Invalid Payment Method Rejection');
  const r = await post('/api/payment/confirm', {
    ticketId: 'SYN27-AAAAAAAA',
    paymentMethod: 'BITCOIN'
  });
  assert('Invalid payment method returns 400', r.status === 400);
  assert('Error mentions payment method',      r.data.error.toLowerCase().includes('payment'));
}

async function testInvalidPhoneNumber() {
  console.log('\n[23] Invalid Phone Number Rejection');
  const r = await post('/api/register', {
    fullName: 'Bad Phone User',
    email: 'phone@test.com',
    phone: 'abc',
    college: 'Test College',
    track: 'general',
    eventName: 'Test Event',
    amount: 0
  });
  assert('Invalid phone returns 400',   r.status === 400);
  assert('Error mentions phone',        r.data.error.toLowerCase().includes('phone'));
}

async function testNegativeAmount() {
  console.log('\n[24] Negative Amount Rejection');
  const r = await post('/api/register', {
    fullName: 'Negative Amount',
    email: 'neg@test.com',
    phone: '9999999999',
    college: 'Test College',
    track: 'general',
    eventName: 'Test Event',
    amount: -500
  });
  assert('Negative amount returns 400',  r.status === 400);
  assert('Error mentions amount',        r.data.error.toLowerCase().includes('amount'));
}

// ── Runner ───────────────────────────────────────────────────

async function run() {
  console.log('═══════════════════════════════════════════════════════');
  console.log(' SYNAPSE 2027 — Test Suite (Functional + Security)');
  console.log(' Initiated by VERVE Club, IILM University');
  console.log(' Site by Mayank');
  console.log('═══════════════════════════════════════════════════════');

  // Check server is running
  try {
    await fetch(`${BASE}/api/health`);
  } catch (err) {
    console.error('\n❌ Server not reachable at', BASE);
    console.error('   Start the server first: node server.js\n');
    process.exit(1);
  }

  // ── Functional Tests ──
  console.log('\n━━━ FUNCTIONAL TESTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await testHealthEndpoint();
  await testStaticPages();
  const freeTicketId = await testFreeRegistration();
  const { ticketId: paidTicketId, paymentId } = await testPaidRegistration();
  await testPaymentConfirmation(paidTicketId, paymentId);
  await testTicketRetrieval(freeTicketId);
  await testGateVerify(freeTicketId);
  await testCheckin(freeTicketId);
  await testInvalidTicket();
  await testAdminStats();
  await testAdminRoster();
  await testMissingFields();

  // ── Security Tests ──
  console.log('\n━━━ SECURITY TESTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await testSecurityHeaders();
  await testXSSSanitization();
  await testInvalidEmailFormat();
  await testInvalidTicketIdFormat();
  await testOversizedPayload();
  await testUnknownApiRoute();
  await testNoStackTraceLeaks();
  await testRateLimitHeaders();
  await testInvalidTrack();
  await testInvalidPaymentMethod();
  await testInvalidPhoneNumber();
  await testNegativeAmount();

  // ── Summary ──
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(` RESULTS: ${passed}/${total} PASSED | ${failed} FAILED`);
  console.log('═══════════════════════════════════════════════════════');

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.label}`));
  }

  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Test suite crashed:', err);
  process.exit(1);
});
