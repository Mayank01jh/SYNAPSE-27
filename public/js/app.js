// SYNAPSE 2027 Client Application Logic
// Initiated by VERVE Club, IILM University Gurugram | Site by Mayank

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTracksAndEvents();
  initSchedule();
  initRegistrationWorkflow();
  initFAQs();
  checkCachedPass();
});

// 1. Navigation & Scroll-Spy
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileNav = document.getElementById('closeMobileNav');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('hidden');
    });
  }

  if (closeMobileNav && mobileNavDrawer) {
    closeMobileNav.addEventListener('click', () => {
      mobileNavDrawer.classList.add('hidden');
    });
  }

  // Close mobile drawer when clicking any nav link
  document.querySelectorAll('#mobileNavDrawer a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNavDrawer.classList.add('hidden');
    });
  });

  // Scroll spy active link indicator
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
      }
    });
  });
}

// 2. Tracks & Events Directory
let currentTrackFilter = 'all';

function initTracksAndEvents() {
  const container = document.getElementById('eventsGridContainer');
  const filterButtons = document.querySelectorAll('.track-filter-btn');
  const searchInput = document.getElementById('eventSearchInput');

  function renderEvents() {
    if (!container) return;
    const query = (searchInput ? searchInput.value.toLowerCase().trim() : '');

    const filtered = SYNAPSE_DATA.events.filter(item => {
      const matchesTrack = currentTrackFilter === 'all' || item.track === currentTrackFilter;
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query) ||
        item.trackName.toLowerCase().includes(query);
      return matchesTrack && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-12 text-center bg-surface-container border-brutal">
          <p class="font-mono text-sm text-secondary uppercase">[NO EVENTS FOUND MATCHING FILTER: "${query || currentTrackFilter}"]</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(event => `
      <div class="group bg-surface border-brutal brutalist-shadow transition-all hover:-translate-y-1 hover:brutalist-shadow-lg flex flex-col justify-between overflow-hidden">
        <div>
          <!-- Header Bar with Track Tag -->
          <div class="bg-surface-container-high px-4 py-2 border-b-brutal flex items-center justify-between">
            <span class="font-mono text-[11px] font-bold text-primary uppercase">[${event.trackName}]</span>
            <span class="font-mono text-[10px] uppercase px-2 py-0.5 bg-surface text-on-surface border border-surface-variant font-semibold">
              ${event.fee === 0 ? 'FREE ADMISSION' : `ENTRY ₹${event.fee}`}
            </span>
          </div>

          <!-- Event Content -->
          <div class="p-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-mono text-[10px] text-secondary uppercase">${event.format}</span>
              <span class="text-secondary">•</span>
              <span class="font-mono text-[10px] text-secondary uppercase">${event.slots}</span>
            </div>
            <h3 class="font-anton text-2xl uppercase tracking-wide text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
              ${event.title}
            </h3>
            <p class="text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
              ${event.desc}
            </p>
            <div class="bg-surface-container-low p-2.5 border border-surface-variant mb-4 font-mono text-xs text-on-surface flex items-center justify-between">
              <span class="text-secondary uppercase">PRIZE POOL:</span>
              <span class="font-bold text-primary">${event.prizePool}</span>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="px-6 pb-6 pt-0 grid grid-cols-2 gap-2">
          <button onclick="openEventModal('${event.id}')" class="px-3 py-2 bg-surface hover:bg-surface-container border-brutal font-mono text-xs uppercase tracking-wider font-bold transition-all text-center">
            RULEBOOK
          </button>
          <button onclick="openRegistrationModal('${event.id}')" class="px-3 py-2 bg-primary text-on-primary hover:bg-primary-hover border-brutal font-mono text-xs uppercase tracking-wider font-bold transition-all text-center brutalist-shadow-sm">
            REGISTER
          </button>
        </div>
      </div>
    `).join('');
  }

  // Filter click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-on-surface', 'text-surface');
        b.classList.add('bg-surface', 'text-on-surface');
      });
      btn.classList.remove('bg-surface', 'text-on-surface');
      btn.classList.add('bg-on-surface', 'text-surface');

      currentTrackFilter = btn.dataset.track;
      renderEvents();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', renderEvents);
  }

  renderEvents();
}

// 3. Event Detail Modal (Rulebook)
window.openEventModal = function(eventId) {
  const event = SYNAPSE_DATA.events.find(e => e.id === eventId);
  if (!event) return;

  const modal = document.getElementById('eventDetailModal');
  const content = document.getElementById('eventModalBody');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="border-b-brutal bg-surface-container-high p-6 flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="font-mono text-xs font-bold text-primary uppercase">[${event.trackName} // SPECIFICATION]</span>
          <span class="font-mono text-xs text-secondary">•</span>
          <span class="font-mono text-xs text-secondary uppercase">${event.slots}</span>
        </div>
        <h2 class="font-anton text-3xl uppercase tracking-wide leading-none text-on-surface mt-1">
          ${event.title}
        </h2>
      </div>
      <button onclick="closeEventModal()" class="w-8 h-8 flex items-center justify-center border-brutal bg-surface hover:bg-primary hover:text-white transition-colors">
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
    </div>

    <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
      <div>
        <h4 class="font-mono text-xs uppercase text-secondary font-bold mb-1">[MISSION OVERVIEW]</h4>
        <p class="text-sm text-on-surface leading-relaxed">${event.desc}</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container p-4 border-brutal">
        <div>
          <div class="font-mono text-[10px] text-secondary uppercase">FORMAT</div>
          <div class="font-bold text-xs uppercase text-on-surface mt-0.5">${event.format}</div>
        </div>
        <div>
          <div class="font-mono text-[10px] text-secondary uppercase">REGISTRATION FEE</div>
          <div class="font-bold text-xs uppercase text-primary mt-0.5">${event.fee === 0 ? 'FREE' : '₹' + event.fee}</div>
        </div>
        <div>
          <div class="font-mono text-[10px] text-secondary uppercase">PRIZE POOL</div>
          <div class="font-bold text-xs uppercase text-on-surface mt-0.5">${event.prizePool}</div>
        </div>
        <div>
          <div class="font-mono text-[10px] text-secondary uppercase">VENUE</div>
          <div class="font-bold text-xs uppercase text-on-surface mt-0.5">${event.venue}</div>
        </div>
      </div>

      <div>
        <h4 class="font-mono text-xs uppercase text-secondary font-bold mb-2">[RULES OF ENGAGEMENT & PROTOCOLS]</h4>
        <ul class="list-disc list-inside space-y-1.5 text-xs text-on-surface leading-relaxed">
          ${event.rules.map(rule => `<li>${rule}</li>`).join('')}
        </ul>
      </div>

      <div>
        <h4 class="font-mono text-xs uppercase text-secondary font-bold mb-1">[LEAD COORDINATORS]</h4>
        <div class="flex flex-wrap gap-4 font-mono text-xs">
          ${event.coordinators.map(c => `
            <div class="bg-surface-container px-3 py-1.5 border border-surface-variant">
              <strong>${c.name}</strong>: ${c.contact}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="p-6 bg-surface-container-low border-t-brutal flex items-center justify-between">
      <div class="font-mono text-xs text-secondary">
        TIMELINE: <span class="font-bold text-on-surface">${event.timeline}</span>
      </div>
      <button onclick="closeEventModal(); openRegistrationModal('${event.id}')" class="px-6 py-2.5 bg-primary text-on-primary hover:bg-primary-hover border-brutal font-mono text-xs uppercase tracking-wider font-bold transition-all brutalist-shadow">
        REGISTER FOR THIS EVENT
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
};

window.closeEventModal = function() {
  const modal = document.getElementById('eventDetailModal');
  if (modal) modal.classList.add('hidden');
};

// 4. Schedule Tabs & Filtering
function initSchedule() {
  const scheduleDayBtns = document.querySelectorAll('.schedule-day-btn');
  const container = document.getElementById('scheduleListContainer');

  let activeDay = 'day1';

  function renderSchedule() {
    if (!container) return;
    const items = SYNAPSE_DATA.schedule[activeDay] || [];

    container.innerHTML = items.map(item => `
      <div class="p-4 bg-surface border-brutal flex flex-col md:flex-row md:items-center justify-between gap-4 brutalist-shadow-sm hover:brutalist-shadow transition-all">
        <div class="flex items-start md:items-center gap-4">
          <div class="bg-surface-container-high px-3 py-1.5 font-mono text-xs font-bold text-on-surface border border-surface-variant min-w-[90px] text-center">
            ${item.time}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] text-primary uppercase font-bold">[${item.stage}]</span>
              <span class="text-secondary text-xs">•</span>
              <span class="font-mono text-[11px] text-secondary uppercase">${item.venue}</span>
            </div>
            <h4 class="font-anton text-lg uppercase tracking-wide text-on-surface mt-0.5">
              ${item.title}
            </h4>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start md:self-center">
          <span class="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 bg-surface-container text-secondary uppercase border border-surface-variant">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            ${item.status}
          </span>
        </div>
      </div>
    `).join('');
  }

  scheduleDayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scheduleDayBtns.forEach(b => {
        b.classList.remove('bg-on-surface', 'text-surface');
        b.classList.add('bg-surface', 'text-on-surface');
      });
      btn.classList.remove('bg-surface', 'text-on-surface');
      btn.classList.add('bg-on-surface', 'text-surface');
      activeDay = btn.dataset.day;
      renderSchedule();
    });
  });

  renderSchedule();
}

// 5. Registration & Payment Confirmation Workflow
let currentRegPayload = null;
let currentTicketId = null;
let currentPaymentId = null;

window.openRegistrationModal = function(preselectEventId = null) {
  const modal = document.getElementById('registrationModal');
  const eventSelect = document.getElementById('regEventSelect');

  if (eventSelect) {
    eventSelect.innerHTML = SYNAPSE_DATA.events.map(ev => `
      <option value="${ev.id}" ${ev.id === preselectEventId ? 'selected' : ''}>
        ${ev.title} (${ev.fee === 0 ? 'FREE' : '₹' + ev.fee})
      </option>
    `).join('');

    updateFeeDisplay();
    eventSelect.onchange = updateFeeDisplay;
  }

  // Reset steps
  showStep(1);
  if (modal) modal.classList.remove('hidden');
};

function updateFeeDisplay() {
  const eventSelect = document.getElementById('regEventSelect');
  const feeDisplay = document.getElementById('regFeeDisplay');
  const teamSection = document.getElementById('regTeamSection');
  if (!eventSelect) return;

  const event = SYNAPSE_DATA.events.find(e => e.id === eventSelect.value);
  if (event) {
    if (feeDisplay) {
      feeDisplay.textContent = event.fee === 0 ? 'FREE ENTRY (₹0)' : `₹${event.fee}`;
    }
    // Show team name input if event format is Squad / Team
    if (teamSection) {
      const isTeam = event.format.toLowerCase().includes('squad') || event.format.toLowerCase().includes('team');
      teamSection.classList.toggle('hidden', !isTeam);
    }
  }
}

window.closeRegistrationModal = function() {
  const modal = document.getElementById('registrationModal');
  if (modal) modal.classList.add('hidden');
};

function showStep(stepNumber) {
  document.querySelectorAll('.reg-step').forEach(step => step.classList.add('hidden'));
  const target = document.getElementById(`regStep${stepNumber}`);
  if (target) target.classList.remove('hidden');
}

function initRegistrationWorkflow() {
  const regForm = document.getElementById('registrationForm');
  const confirmPayBtn = document.getElementById('confirmPayBtn');
  const upiRadio = document.getElementById('payMethodUPI');
  const cardRadio = document.getElementById('payMethodCard');

  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const eventSelect = document.getElementById('regEventSelect');
      const selectedEvent = SYNAPSE_DATA.events.find(ev => ev.id === eventSelect.value) || SYNAPSE_DATA.events[0];

      currentRegPayload = {
        fullName: document.getElementById('regFullName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        college: document.getElementById('regCollege').value,
        studentId: document.getElementById('regStudentId').value,
        role: document.getElementById('regRole').value,
        eventId: selectedEvent.id,
        eventName: selectedEvent.title,
        track: selectedEvent.track,
        amount: selectedEvent.fee,
        teamName: document.getElementById('regTeamName') ? document.getElementById('regTeamName').value : null
      };

      const submitBtn = regForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'INITIATING REGISTRATION...';

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentRegPayload)
        });
        const data = await response.json();

        if (!data.success) {
          alert('Registration Error: ' + (data.error || 'Failed to submit registration'));
          submitBtn.disabled = false;
          submitBtn.textContent = 'PROCEED TO CONFIRMATION';
          return;
        }

        currentTicketId = data.ticketId;
        currentPaymentId = data.paymentId;

        // If free ticket, skip payment and go directly to Step 3 (Confirmed Ticket)
        if (data.isFree) {
          renderTicketPass(data.ticketId, data.qrDataUrl, data.emailPreviewUrl);
          showStep(3);
        } else {
          // Open Payment Checkout Step
          document.getElementById('checkoutTicketId').textContent = data.ticketId;
          document.getElementById('checkoutAmount').textContent = `₹${data.amount}`;
          showStep(2);
        }
      } catch (err) {
        alert('Network Error: Unable to contact registration server.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'PROCEED TO CONFIRMATION';
      }
    });
  }

  // Payment Confirmation Action
  if (confirmPayBtn) {
    confirmPayBtn.addEventListener('click', async () => {
      confirmPayBtn.disabled = true;
      confirmPayBtn.textContent = 'AUTHORIZING PAYMENT & GENERATING PASS...';

      const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI';

      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: currentTicketId,
            paymentId: currentPaymentId,
            paymentMethod: selectedMethod,
            transactionRef: `SYN27-TXN-${Date.now()}`
          })
        });

        const data = await response.json();
        if (!data.success) {
          alert('Payment confirmation failed: ' + data.error);
          confirmPayBtn.disabled = false;
          confirmPayBtn.textContent = 'CONFIRM PAYMENT NOW';
          return;
        }

        renderTicketPass(data.ticket.ticket_id, data.qrDataUrl, data.emailPreviewUrl);
        showStep(3);
      } catch (err) {
        alert('Payment error: Could not confirm with server.');
      } finally {
        confirmPayBtn.disabled = false;
        confirmPayBtn.textContent = 'CONFIRM PAYMENT NOW';
      }
    });
  }
}

// 6. Render Ticket Pass
function renderTicketPass(ticketId, qrDataUrl, emailPreviewUrl) {
  fetch(`/api/ticket/${ticketId}`)
    .then(res => res.json())
    .then(res => {
      if (!res.success) return;
      const t = res.ticket;
      const qr = qrDataUrl || res.qrDataUrl;

      // Cache pass in localStorage so returning student can view it anytime
      localStorage.setItem('synapse27_saved_pass', JSON.stringify({ ticketId: t.ticket_id }));

      const passCard = document.getElementById('passCardOutput');
      if (passCard) {
        passCard.innerHTML = `
          <div class="holo-card-pass border-brutal-thick brutalist-shadow-lg p-6 max-w-md mx-auto relative bg-[#FCF9F3]">
            <div class="laser-line"></div>
            
            <!-- Top Telemetry Strip -->
            <div class="flex items-center justify-between border-b-brutal pb-2 mb-4">
              <span class="font-mono text-[10px] text-primary uppercase font-bold">[SYNAPSE // 2027 PASS]</span>
              <span class="font-mono text-[10px] text-secondary uppercase font-bold">SECTOR 53, GURUGRAM</span>
            </div>

            <!-- Title & Pass ID -->
            <div class="text-center mb-4">
              <h2 class="font-anton text-3xl uppercase tracking-wider text-on-surface leading-none m-0">SYNAPSE 2027</h2>
              <div class="font-mono text-xs uppercase text-secondary mt-1">VERVE CLUB • IILM UNIVERSITY</div>
              <div class="font-mono text-lg font-bold text-primary mt-2 bg-surface-container py-1 border border-dashed border-secondary">
                ${t.ticket_id}
              </div>
            </div>

            <!-- QR Code Centerpiece -->
            <div class="flex flex-col items-center justify-center p-3 bg-surface-container-low border-brutal mb-4">
              ${qr ? `<img src="${qr}" alt="Gate Entry QR" class="w-48 h-48 border border-black mb-1 bg-white" />` : ''}
              <div class="font-mono text-[10px] text-secondary uppercase tracking-wider">SCAN AT GATE 01 FOR ENTRY</div>
            </div>

            <!-- Attendee Details Grid -->
            <div class="space-y-1.5 font-mono text-xs border-t-brutal pt-3 mb-4">
              <div class="flex justify-between">
                <span class="text-secondary">NAME:</span>
                <span class="font-bold text-on-surface uppercase">${t.full_name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">COLLEGE:</span>
                <span class="font-bold text-on-surface truncate max-w-[200px] uppercase">${t.college}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">EVENT:</span>
                <span class="font-bold text-primary uppercase">${t.event_name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">ROLE / TRACK:</span>
                <span class="font-bold text-on-surface uppercase">${t.role} (${t.track.toUpperCase()})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-secondary">STATUS:</span>
                <span class="font-bold text-green-700 uppercase">[${t.registration_status} // ₹${t.amount}]</span>
              </div>
            </div>

            <!-- Watermark Footer -->
            <div class="border-t border-surface-variant pt-2 text-center font-mono text-[9px] text-secondary uppercase">
              INITIATED BY VERVE CLUB IILM • SITE BY MAYANK
            </div>
          </div>
        `;
      }

      // Email notification box
      const emailNotice = document.getElementById('emailNotificationNotice');
      if (emailNotice) {
        emailNotice.innerHTML = `
          <div class="p-3 bg-surface-container border-brutal text-left text-xs font-mono space-y-1">
            <div class="text-primary font-bold">✓ AUTOMATED PASS DISPATCHED TO: ${t.email}</div>
            <div class="text-secondary">Check your email inbox or spam folder for your official ticket PDF and entry instructions.</div>
            ${emailPreviewUrl ? `
              <div class="pt-1">
                <a href="${emailPreviewUrl}" target="_blank" class="text-primary font-bold underline">
                  [CLICK TO PREVIEW DELIVERED EMAIL TICKET IN TEST INBOX]
                </a>
              </div>
            ` : ''}
          </div>
        `;
      }
    });
}

// 7. Check cached pass in local storage
function checkCachedPass() {
  try {
    const cached = localStorage.getItem('synapse27_saved_pass');
    if (cached) {
      const { ticketId } = JSON.parse(cached);
      const quickViewBtn = document.getElementById('viewSavedPassBtn');
      if (quickViewBtn && ticketId) {
        quickViewBtn.classList.remove('hidden');
        quickViewBtn.onclick = () => {
          openRegistrationModal();
          renderTicketPass(ticketId);
          showStep(3);
        };
      }
    }
  } catch (e) {}
}

// 8. Print Ticket Action
window.printTicketPass = function() {
  window.print();
};

// 9. FAQ Accordions
function initFAQs() {
  const container = document.getElementById('faqsAccordionContainer');
  if (!container) return;

  container.innerHTML = SYNAPSE_DATA.faqs.map((faq, idx) => `
    <div class="border-brutal bg-surface overflow-hidden brutalist-shadow-sm">
      <button class="w-full p-5 text-left font-space text-lg font-bold uppercase text-on-surface flex items-center justify-between hover:bg-surface-container-high transition-colors" onclick="toggleFAQ(${idx})">
        <span class="flex items-center gap-3">
          <span class="font-mono text-xs text-primary font-bold">[0${idx + 1}]</span>
          <span>${faq.q}</span>
        </span>
        <span class="material-symbols-outlined text-secondary transition-transform" id="faqIcon${idx}">add</span>
      </button>
      <div class="p-5 border-t border-surface-variant text-sm text-secondary leading-relaxed hidden bg-surface-container-low" id="faqBody${idx}">
        ${faq.a}
      </div>
    </div>
  `).join('');
}

window.toggleFAQ = function(idx) {
  const body = document.getElementById(`faqBody${idx}`);
  const icon = document.getElementById(`faqIcon${idx}`);
  if (body) {
    const isClosed = body.classList.contains('hidden');
    body.classList.toggle('hidden');
    if (icon) {
      icon.textContent = isClosed ? 'remove' : 'add';
    }
  }
};
