const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

let transporter = null;
let isEthereal = false;

// Initialize mail transporter
async function initTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    isEthereal = false;
    console.log('[EMAIL] Configured live SMTP transport.');
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      isEthereal = true;
      console.log(`[EMAIL] Initialized Ethereal test inbox: ${testAccount.user}`);
    } catch (err) {
      console.warn('[EMAIL] Could not initialize Ethereal, falling back to mock logger:', err.message);
      transporter = null;
    }
  }
}

// Generate QR Code data URL for verification
async function generateQRCode(ticketId, hostUrl = 'http://localhost:3000') {
  const verifyUrl = `${hostUrl}/verify.html?ticket=${encodeURIComponent(ticketId)}`;
  try {
    const dataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 280,
      color: {
        dark: '#111111',
        light: '#F5F2EC'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('[QR] Failed to generate QR code:', err);
    return null;
  }
}

// Build HTML email template
function buildEmailTemplate(ticket, qrDataUrl, hostUrl) {
  const verifyUrl = `${hostUrl}/verify.html?ticket=${encodeURIComponent(ticket.ticket_id)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SYNAPSE 2027 Entry Pass</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: #ECE8E1;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111111;
    }
    .ticket-container {
      max-width: 600px;
      margin: 0 auto;
      background: #FCF9F3;
      border: 3px solid #111111;
      box-shadow: 6px 6px 0px 0px #111111;
    }
    .header-bar {
      background: #111111;
      color: #FCF9F3;
      padding: 16px 24px;
      border-bottom: 2px solid #111111;
    }
    .badge {
      display: inline-block;
      background: #C90016;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 4px 8px;
      text-transform: uppercase;
    }
    .title {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin: 8px 0 2px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 12px;
      color: #DCDAD4;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    .body-content {
      padding: 24px;
    }
    .ticket-badge {
      border: 2px dashed #926F6B;
      background: #F0EEE8;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .serial-no {
      font-family: monospace;
      font-size: 22px;
      font-weight: 900;
      color: #C90016;
      letter-spacing: 0.15em;
      margin: 4px 0 12px 0;
    }
    .qr-img {
      width: 180px;
      height: 180px;
      border: 2px solid #111111;
      margin-bottom: 8px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }
    .meta-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #E5E2DC;
    }
    .meta-label {
      font-family: monospace;
      color: #5F5E5E;
      font-weight: 700;
      text-transform: uppercase;
      width: 35%;
    }
    .meta-value {
      font-weight: 600;
      color: #111111;
    }
    .rules-box {
      background: #111111;
      color: #FCF9F3;
      padding: 16px;
      font-size: 12px;
      line-height: 1.6;
      margin-top: 24px;
    }
    .rules-box ul {
      margin: 8px 0 0 16px;
      padding: 0;
    }
    .footer {
      background: #EBE8E2;
      padding: 16px 24px;
      border-top: 2px solid #111111;
      font-size: 11px;
      color: #5F5E5E;
      text-align: center;
      font-family: monospace;
    }
    .btn-verify {
      display: inline-block;
      background: #C90016;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: bold;
      font-size: 13px;
      padding: 10px 20px;
      border: 2px solid #111111;
      box-shadow: 3px 3px 0px 0px #111111;
      margin-top: 12px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <div class="header-bar">
      <span class="badge">[CONFIRMED ADMISSION]</span>
      <div class="title">SYNAPSE 2027</div>
      <div class="subtitle">FLAGSHIP CONVERGENCE // IILM UNIVERSITY GURUGRAM</div>
    </div>

    <div class="body-content">
      <div class="ticket-badge">
        <div style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #5F5E5E;">OFFICIAL GATE PASS SERIAL</div>
        <div class="serial-no">${ticket.ticket_id}</div>
        ${qrDataUrl ? `<img src="${qrDataUrl}" alt="Gate QR Code" class="qr-img" />` : ''}
        <div style="font-family: monospace; font-size: 10px; color: #5F5E5E;">PRESENT THIS QR CODE AT MAIN GATE 01 FOR ENTRY</div>
        <a href="${verifyUrl}" class="btn-verify" target="_blank">VIEW / PRINT LIVE PASS</a>
      </div>

      <table class="meta-table">
        <tr>
          <td class="meta-label">ATTENDEE NAME</td>
          <td class="meta-value">${ticket.full_name}</td>
        </tr>
        <tr>
          <td class="meta-label">INSTITUTION</td>
          <td class="meta-value">${ticket.college}</td>
        </tr>
        <tr>
          <td class="meta-label">EVENT / TRACK</td>
          <td class="meta-value">${ticket.event_name} <span style="color:#C90016;">[${ticket.track.toUpperCase()}]</span></td>
        </tr>
        <tr>
          <td class="meta-label">ROLE</td>
          <td class="meta-value">${ticket.role}</td>
        </tr>
        ${ticket.team_name ? `
        <tr>
          <td class="meta-label">SQUAD / TEAM</td>
          <td class="meta-value">${ticket.team_name}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="meta-label">FEE STATUS</td>
          <td class="meta-value">₹${ticket.amount} • ${ticket.payment_method} [CAPTURED]</td>
        </tr>
        <tr>
          <td class="meta-label">TRANSACTION REF</td>
          <td class="meta-value" style="font-family: monospace;">${ticket.transaction_ref || ticket.payment_id}</td>
        </tr>
        <tr>
          <td class="meta-label">VENUE</td>
          <td class="meta-value">IILM University, Sector 53, Golf Course Rd, Gurugram</td>
        </tr>
      </table>

      <div class="rules-box">
        <strong style="color: #FF1A35;">[SECURITY INSTRUCTIONS & GATE PROTOCOLS]</strong>
        <ul>
          <li>Carry your original College/University Student ID card alongside this digital or printed pass.</li>
          <li>Each QR code is cryptographically unique and permits single authorized admission.</li>
          <li>Hackathon squads must report 60 minutes prior to opening briefing.</li>
          <li>Food coupons and festival merchandise badges will be issued at the VERVE Welcome Desk.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <div>INITIATED & HOSTED BY <strong>VERVE CLUB, IILM UNIVERSITY</strong></div>
      <div style="margin-top: 4px;">DESIGNED & DEVELOPED WITH HIGH PERFORMANCE — <strong>SITE BY MAYANK</strong></div>
      <div style="margin-top: 4px; color: #926F6B;">SYS // SYNAPSE 2027 AUTOMATION ENGINE • GURUGRAM, HARYANA</div>
    </div>
  </div>
</body>
</html>
  `;
}

// Send Ticket Email
async function sendTicketEmail(ticket, hostUrl = 'http://localhost:3000') {
  if (!transporter) {
    await initTransporter();
  }

  const qrDataUrl = await generateQRCode(ticket.ticket_id, hostUrl);
  const htmlContent = buildEmailTemplate(ticket, qrDataUrl, hostUrl);

  const mailOptions = {
    from: process.env.FROM_EMAIL || '"SYNAPSE 2027 (VERVE Club IILM)" <synapse2027@iilm.edu>',
    to: ticket.email,
    subject: `🎟️ Confirmed Ticket Pass: SYNAPSE 2027 [${ticket.ticket_id}] — IILM University Gurugram`,
    html: htmlContent
  };

  if (!transporter) {
    console.log(`[EMAIL MOCK] Email would be sent to ${ticket.email} for ticket ${ticket.ticket_id}`);
    return {
      success: true,
      mock: true,
      messageId: `mock-${Date.now()}`,
      previewUrl: `${hostUrl}/verify.html?ticket=${encodeURIComponent(ticket.ticket_id)}`,
      qrDataUrl
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    let previewUrl = null;
    if (isEthereal) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[EMAIL] Test message sent! View in browser: ${previewUrl}`);
    }
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || `${hostUrl}/verify.html?ticket=${encodeURIComponent(ticket.ticket_id)}`,
      qrDataUrl
    };
  } catch (err) {
    console.error('[EMAIL] Failed to send ticket email:', err);
    return {
      success: false,
      error: err.message,
      qrDataUrl
    };
  }
}

module.exports = {
  initTransporter,
  generateQRCode,
  sendTicketEmail
};
