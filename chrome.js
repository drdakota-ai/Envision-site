/* ──────────────────────────────────────────────────────────────────────────
   Shared chrome: theme loader, booking modal, sticky CTA, scroll reveals,
   mobile menu. Loaded on every page.
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // ── Theme loader ─────────────────────────────────────────────────────────
  // Apply user's saved Tweaks-panel choices across all pages.
  function applyTheme() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem('envision-theme-v2') || '{}'); }
    catch (e) { saved = {}; }

    const r = document.documentElement.style;
    if (saved.palette) {
      r.setProperty('--accent', saved.palette[0]);
      r.setProperty('--accent-ink', saved.palette[1] || '#1f2421');
    }
    if (saved.font) {
      const pairs = {
        big_shoulders: { display: '"Big Shoulders Display", sans-serif', ui: '"Montserrat", sans-serif' },
        anton:         { display: '"Anton", sans-serif',                   ui: '"Inter", sans-serif' },
        archivo:       { display: '"Archivo Black", sans-serif',           ui: '"Archivo", sans-serif' },
        bebas:         { display: '"Bebas Neue", sans-serif',              ui: '"Manrope", sans-serif' },
      };
      const p = pairs[saved.font];
      if (p) {
        r.setProperty('--font-display', p.display);
        r.setProperty('--font-ui', p.ui);
      }
    }
    if (saved.cta) {
      const styles = {
        square:  { radius: '0px',   bg: 'var(--ink)', fg: 'var(--bone)', border: '1.5px solid var(--ink)' },
        pill:    { radius: '999px', bg: 'var(--ink)', fg: 'var(--bone)', border: '1.5px solid var(--ink)' },
        outline: { radius: '0px',   bg: 'transparent', fg: 'var(--ink)', border: '1.5px solid var(--ink)' },
      };
      const s = styles[saved.cta];
      if (s) {
        r.setProperty('--cta-radius', s.radius);
        r.setProperty('--cta-bg', s.bg);
        r.setProperty('--cta-fg', s.fg);
        r.setProperty('--cta-border', s.border);
      }
    }
    if (saved.headline) {
      document.querySelectorAll('[data-hero-headline]').forEach((el) => {
        el.textContent = saved.headline;
      });
    }
  }
  applyTheme();
  // Tweaks panel posts this on every change.
  window.addEventListener('tweakchange', applyTheme);

  // ── Booking modal markup (injected once) ─────────────────────────────────
  function injectModal() {
    if (document.getElementById('booking-modal')) return;
    const html = `
      <div class="modal-backdrop" id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <div class="modal">
          <button class="modal-close" data-close aria-label="Close booking">✕</button>
          <div class="modal-head">
            <div class="eyebrow">Step <span data-step-num>1</span> of 3</div>
            <h3 class="display" id="booking-title" data-step-title>Book Your First Visit</h3>
          </div>
          <div class="modal-body" data-step-body>
            <!-- Step 1: service -->
            <div data-step="1">
              <p class="lede" style="font-size:15px;margin:0 0 18px;">What brings you in?</p>
              <div class="chip-grid" data-service-chips>
                <button class="chip" data-val="New Patient Consultation" aria-pressed="true">New Patient Consult</button>
                <button class="chip" data-val="Adjustment">Adjustment</button>
                <button class="chip" data-val="Corrective Care">Corrective Care</button>
                <button class="chip" data-val="Spinal Decompression">Decompression</button>
                <button class="chip" data-val="Laser Therapy">Laser Therapy</button>
                <button class="chip" data-val="Postural Rehab">Postural Rehab</button>
                <button class="chip" data-val="Auto Injury">Auto Injury</button>
              </div>
            </div>
            <!-- Step 2: date/time -->
            <div data-step="2" hidden>
              <div class="field">
                <label>Preferred date</label>
                <input type="date" data-date>
              </div>
              <div class="field" style="margin-top:14px;">
                <label>Preferred time</label>
                <div class="chip-grid" data-time-chips>
                  <button class="chip" data-val="8:00 AM">8:00 AM</button>
                  <button class="chip" data-val="9:30 AM">9:30 AM</button>
                  <button class="chip" data-val="11:00 AM" aria-pressed="true">11:00 AM</button>
                  <button class="chip" data-val="1:30 PM">1:30 PM</button>
                  <button class="chip" data-val="3:00 PM">3:00 PM</button>
                  <button class="chip" data-val="4:30 PM">4:30 PM</button>
                </div>
              </div>
            </div>
            <!-- Step 3: info -->
            <div data-step="3" hidden>
              <div class="field-row">
                <div class="field"><label>First name</label><input type="text" data-first placeholder="Jane"></div>
                <div class="field"><label>Last name</label><input type="text" data-last placeholder="Doe"></div>
              </div>
              <div class="field-row">
                <div class="field"><label>Email</label><input type="email" data-email placeholder="you@email.com"></div>
                <div class="field"><label>Phone</label><input type="tel" data-phone placeholder="(360) 555-0000"></div>
              </div>
              <div class="field">
                <label>Anything we should know?</label>
                <textarea rows="3" data-notes placeholder="Symptoms, prior treatment, questions…"></textarea>
              </div>
            </div>
            <!-- Confirmation -->
            <div data-step="done" hidden style="text-align:center;padding:18px 0 6px;">
              <div class="num" style="font-size:64px;color:var(--accent);">✓</div>
              <h3 class="display h-md" style="margin-top:10px;">You're on the list.</h3>
              <p class="lede" style="font-size:15px;margin:14px auto 0;">A real human from our team will confirm your appointment within one business day. For urgent visits, call <strong>(360) 996-6505</strong>.</p>
              <div class="summary" data-summary style="margin-top:24px;padding:18px;border:1px solid var(--rule);background:var(--paper);text-align:left;font-size:13px;line-height:1.7;"></div>
            </div>
          </div>
          <div class="modal-foot" data-foot>
            <button class="btn ghost sm" data-back hidden>← Back</button>
            <span style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-family:var(--font-display);font-weight:700;color:var(--ink-soft);">No card. No commitment.</span>
            <button class="btn accent sm" data-next>Continue →</button>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstElementChild);
    wireModal();
  }

  let state = { step: 1, service: 'New Patient Consultation', date: '', time: '11:00 AM' };

  function wireModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    modal.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));

    // chip toggles (radio-style — only one)
    modal.querySelectorAll('[data-service-chips] .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        modal.querySelectorAll('[data-service-chips] .chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        state.service = chip.dataset.val;
      });
    });
    modal.querySelectorAll('[data-time-chips] .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        modal.querySelectorAll('[data-time-chips] .chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        state.time = chip.dataset.val;
      });
    });

    modal.querySelector('[data-next]').addEventListener('click', () => {
      if (state.step === 1) gotoStep(2);
      else if (state.step === 2) gotoStep(3);
      else if (state.step === 3) gotoStep('done');
    });
    modal.querySelector('[data-back]').addEventListener('click', () => {
      if (state.step === 2) gotoStep(1);
      else if (state.step === 3) gotoStep(2);
    });

    // Default date to today + 2
    const d = new Date(); d.setDate(d.getDate() + 2);
    const iso = d.toISOString().slice(0, 10);
    modal.querySelector('[data-date]').value = iso;
    state.date = iso;
    modal.querySelector('[data-date]').addEventListener('change', (e) => { state.date = e.target.value; });
  }

  function gotoStep(step) {
    state.step = step;
    const modal = document.getElementById('booking-modal');
    modal.querySelectorAll('[data-step]').forEach((el) => { el.hidden = el.dataset.step != String(step); });
    const titles = {
      1: ['Step 1 of 3', "Book Your First Visit"],
      2: ['Step 2 of 3', "Pick A Time That Works"],
      3: ['Step 3 of 3', "Tell Us About You"],
      done: ['Confirmed', "You're Booked."],
    };
    modal.querySelector('[data-step-num]').textContent = step === 'done' ? '3' : step;
    modal.querySelector('.eyebrow').firstChild.textContent = titles[step][0].replace(/\sof\s.*/, '');
    if (step !== 'done') {
      modal.querySelector('.eyebrow').innerHTML = `Step <span>${step}</span> of 3`;
    } else {
      modal.querySelector('.eyebrow').textContent = 'Confirmed';
    }
    modal.querySelector('[data-step-title]').textContent = titles[step][1];

    const back = modal.querySelector('[data-back]');
    const next = modal.querySelector('[data-next]');
    const foot = modal.querySelector('[data-foot]');
    if (step === 'done') {
      foot.hidden = true;
      const sum = modal.querySelector('[data-summary]');
      const first = modal.querySelector('[data-first]').value || 'You';
      const dateStr = state.date ? new Date(state.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'TBD';
      sum.innerHTML = `
        <div><strong>Service:</strong> ${state.service}</div>
        <div><strong>When:</strong> ${dateStr} · ${state.time}</div>
        <div><strong>Name:</strong> ${first}</div>
        <div style="margin-top:10px;color:var(--ink-soft);">Confirmation sent to ${modal.querySelector('[data-email]').value || 'your email'}.</div>
      `;
    } else {
      foot.hidden = false;
      back.hidden = step === 1;
      next.textContent = step === 3 ? 'Confirm Booking →' : 'Continue →';
    }
  }

  // ── Booking URL — clicks open the real ChiroHD scheduler in a new tab ───
  const BOOKING_URL = 'https://intake.chirohd.com/new-patient-scheduling/1043/envision-chiropractic';

  // Hook up any [data-book] triggers — go straight to ChiroHD
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-book]');
    if (t) {
      e.preventDefault();
      window.open(BOOKING_URL, '_blank', 'noopener');
    }
  });

  // Legacy modal helper kept for any code calling window.openBooking()
  window.openBooking = () => window.open(BOOKING_URL, '_blank', 'noopener');

  // ── Sticky CTA show after scrolling past hero ────────────────────────────
  const sticky = document.querySelector('.sticky-cta');
  if (sticky) {
    const onScroll = () => {
      const y = window.scrollY;
      // Show after a sensible amount; hide near very bottom (avoid covering footer CTA)
      const nearBottom = (window.innerHeight + y) > document.body.offsetHeight - 200;
      sticky.classList.toggle('show', y > 600 && !nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Reveal on scroll ─────────────────────────────────────────────────────
  // Safety net: if the page loads in an iframe/embed context where IO may not
  // fire for above-the-fold elements (or the iframe was briefly zero-sized
  // during initial paint), force everything above the fold visible on load.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // Fallback — after window load, anything inside the first viewport that
    // hasn't been activated yet gets forced in. Avoids blank-page-hero in
    // embed contexts.
    const forceAboveFold = () => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh + 80) el.classList.add('in');
      });
    };
    if (document.readyState === 'complete') setTimeout(forceAboveFold, 400);
    else window.addEventListener('load', () => setTimeout(forceAboveFold, 400));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  // ── Mobile menu ──────────────────────────────────────────────────────────
  const burger = document.querySelector('.nav-burger');
  const menu = document.querySelector('.mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.add('open'));
    menu.querySelector('.close')?.addEventListener('click', () => menu.classList.remove('open'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  // ── Save theme to localStorage from Tweaks panel on parent windows ──────
  // (Tweaks panel dispatches 'tweakchange' before the EDITMODE roundtrip)
  // Persist whatever the homepage Tweaks panel sets.
  window.addEventListener('tweakchange', (ev) => {
    try {
      const cur = JSON.parse(localStorage.getItem('envision-theme-v2') || '{}');
      Object.assign(cur, ev.detail || {});
      localStorage.setItem('envision-theme-v2', JSON.stringify(cur));
    } catch (e) {}
  });

  // ── FAQ accordion (used on FAQ + service pages) ──────────────────────────
  document.querySelectorAll('[data-faq]').forEach((q) => {
    const btn = q.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = q.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
