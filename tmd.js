/*
 * ============================================================
 * tmd.js — Test My Drive shared suburb page scripts
 *
 * USAGE: Each suburb page must declare this variable
 * before loading this script:
 *
 *   <script>const TMD_SUBURB = "Logan Central";</script>
 *   <script src="../tmd.js"></script>
 *
 * The page must also have these placeholder divs:
 *   <div id="tmd-instructors"></div>
 *   <div id="tmd-pricing"></div>
 *
 * DATA SOURCE: ../data.json (one level up from locations/)
 * ============================================================
 */

(async function () {

  /* ── 1. Fetch data ── */
  let data;
  try {
    const res = await fetch('../data.json');
    data = await res.json();
  } catch (e) {
    console.warn('TMD: Could not load data.json', e);
    return;
  }

  const suburb = (typeof TMD_SUBURB !== 'undefined') ? TMD_SUBURB : null;

  /* ── 2. Render instructors ── */
  const instructorTarget = document.getElementById('tmd-instructors');
  if (instructorTarget && suburb) {
    const matched = data.instructors.filter(i =>
      i.suburbs.map(s => s.toLowerCase()).includes(suburb.toLowerCase())
    );

    if (matched.length === 0) {
      instructorTarget.innerHTML = `
        <p style="text-align:center;color:var(--grey);font-size:0.88rem;">
          No instructor listed for this area yet. <a href="../index.html#contact" style="color:var(--amber);">Get in touch</a> and we will help you out.
        </p>`;
      return;
    }

    instructorTarget.innerHTML = matched.map(instructor => `
      <div style="max-width:280px;margin:0 auto 1.5rem;background:var(--white);border:1.5px solid var(--lightgrey);border-radius:14px;padding:2rem;text-align:center;">
        <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;border:3px solid var(--amber);margin:0 auto 1rem;">
          <img
            src="${instructor.photo}"
            alt="${instructor.name}, driving instructor Test My Drive ${suburb}"
            style="width:100%;height:100%;object-fit:cover;object-position:top;display:block;"
          />
        </div>
        <div style="font-family:var(--condensed);font-size:1.4rem;font-weight:800;color:var(--navy);margin-bottom:1.25rem;">
          ${instructor.name}
        </div>
        <a href="${instructor.bookingLink}"
           target="_blank"
           rel="noopener"
           class="btn-primary"
           style="display:block;text-align:center;padding:0.85rem;">
          📅 Book With ${instructor.name}
        </a>
      </div>
    `).join('');
  }

  /* ── 3. Render pricing ── */
  const pricingTarget = document.getElementById('tmd-pricing');
  if (pricingTarget) {
    pricingTarget.innerHTML = `
      <div style="margin-top:2.5rem;border-top:1px solid var(--lightgrey);padding-top:2.5rem;">
        <div style="text-align:center;margin-bottom:1.5rem;">
          <div class="section-label">Pricing</div>
          <div class="section-title">Choose What Works For You</div>
        </div>
        <div class="pricing-grid">
          ${data.pricing.map(p => `
            <div class="pricing-card${p.highlight ? ' highlight' : ''}">
              <div class="pricing-label">${p.label}</div>
              <div class="pricing-amount">${p.amount}</div>
              <div class="pricing-duration">${p.duration}</div>
              <div class="pricing-desc">${p.description}</div>
            </div>
          `).join('')}
        </div>
        <p style="color:var(--grey);font-size:0.75rem;margin-top:1rem;text-align:center;">
          All lessons are automatic transmission. Your instructor will be in touch to confirm your booking and arrange payment.
        </p>
      </div>
    `;
  }

  /* ── 4. FAQ toggle (shared utility) ── */
  window.toggleFaq = function(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

})();
