/* ============================================================
   VISIUM — JS v3 · Figma style
   ============================================================ */
(function () {
  'use strict';

  const WEBHOOK = 'https://discord.com/api/webhooks/1474867828485259294/KcbrnmFu01oFPek6EkqC7Xh0xjoIMb5Y1OVbWdHDufn8a34vKJZA1EQRg6vZ3zGuzfoH';
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const t = document.querySelector(link.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Cursor ── */
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursor-follower');
  if (cur && fol && !isMobile) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function tick() {
      fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
      fol.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    })();
    document.addEventListener('mouseleave', () => { cur.style.opacity='0'; fol.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cur.style.opacity='1'; fol.style.opacity='1'; });
  }

  /* ── Navbar ── */
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });

  /* ── Reveal ── */
  const ro = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));

  /* ── Progress bars animate on reveal ── */
  const barObs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.pstat-fill').forEach((bar) => {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 200);
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const panel = document.querySelector('.hero-panel');
  if (panel) barObs.observe(panel);

  /* ── Avis slider with dots ── */
  const track  = document.getElementById('avis-track');
  const prev   = document.getElementById('avis-prev');
  const next   = document.getElementById('avis-next');
  const dotsEl = document.getElementById('avis-dots');

  if (track && prev && next) {
    let cur2 = 0;
    const cards = track.querySelectorAll('.avis-card');
    const dots  = dotsEl ? dotsEl.querySelectorAll('.dot-item') : [];
    const gap = 16;
    const cardW = () => cards[0] ? cards[0].offsetWidth + gap : 396;
    const maxI  = () => Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / cardW()));

    function go(i) {
      cur2 = Math.max(0, Math.min(i, maxI()));
      track.style.transform = `translateX(-${cur2 * cardW()}px)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === cur2));
    }

    prev.addEventListener('click', () => go(cur2 - 1));
    next.addEventListener('click', () => go(cur2 + 1));
    if (dotsEl) {
      dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
    }

    let auto = setInterval(() => go(cur2 >= maxI() ? 0 : cur2 + 1), 5500);
    [prev, next].forEach((b) => b.addEventListener('click', () => {
      clearInterval(auto);
      auto = setInterval(() => go(cur2 >= maxI() ? 0 : cur2 + 1), 5500);
    }));

    let sx = 0;
    track.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    track.addEventListener('pointerup',   (e) => {
      const d = sx - e.clientX;
      if (Math.abs(d) > 50) go(d > 0 ? cur2 + 1 : cur2 - 1);
    });
  }

  /* ── Comparatif stagger ── */
  const firstRow = document.querySelector('.comp-row');
  if (firstRow) {
    const rows = document.querySelectorAll('.comp-row');
    rows.forEach((r) => { r.style.opacity='0'; r.style.transform='translateX(-10px)'; r.style.transition='opacity .5s ease, transform .5s ease'; });
    new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        rows.forEach((r, i) => setTimeout(() => { r.style.opacity='1'; r.style.transform='none'; }, i * 80));
      }
    }, { threshold: 0.15 }).observe(firstRow);
  }

  /* ── Orbs parallax ── */
  const o1 = document.querySelector('.orb1');
  const o2 = document.querySelector('.orb2');
  window.addEventListener('scroll', () => {
    const y = scrollY;
    if (o1) o1.style.transform = `translateY(${y * 0.06}px)`;
    if (o2) o2.style.transform = `translateY(${y * -0.04}px)`;
  }, { passive: true });

  /* ── Discord Webhook ── */
  const form = document.getElementById('devis-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      const nom        = form.querySelector('#nom').value.trim();
      const email      = form.querySelector('#email').value.trim();
      const tel        = form.querySelector('#telephone').value.trim();
      const entreprise = form.querySelector('#entreprise').value.trim();
      const budget     = form.querySelector('#budget').value;
      const message    = form.querySelector('#message').value.trim();
      const bLabel = {'990-2000':'990€ – 2 000€','2000-5000':'2 000€ – 5 000€','5000+':'5 000€ +','nc':'Non défini'}[budget] || 'Non renseigné';

      btn.innerHTML = '<span style="opacity:.7">Envoi en cours…</span>';
      btn.disabled  = true;

      const payload = {
        username: 'Visium · Nouveau devis',
        embeds: [{
          title : '📬 Nouvelle demande de devis — Visium',
          color : 0x7eb8f7,
          fields: [
            { name:'👤 Nom',         value: nom        || '—', inline: true  },
            { name:'🏢 Entreprise',  value: entreprise || '—', inline: true  },
            { name:'📧 Email',       value: email      || '—', inline: false },
            { name:'📞 Téléphone',   value: tel        || '—', inline: true  },
            { name:'💶 Budget',      value: bLabel,            inline: true  },
            { name:'💬 Message',     value: message    || '—', inline: false },
          ],
          footer: { text: 'Visium.fr · ' + new Date().toLocaleString('fr-FR') }
        }]
      };

      try {
        const res = await fetch(WEBHOOK, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        if (res.ok) {
          btn.innerHTML = '✓ Message envoyé — réponse sous 24h';
          btn.style.cssText += ';background:linear-gradient(135deg,rgba(86,217,138,.25),rgba(40,180,100,.15));border-color:rgba(86,217,138,.45)';
          form.reset();
          setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; btn.disabled = false; }, 5000);
        } else { throw new Error(); }
      } catch {
        btn.innerHTML = '⚠ Erreur — contactez contact@visium.fr';
        btn.style.cssText += ';background:linear-gradient(135deg,rgba(255,80,80,.2),rgba(200,40,40,.12));border-color:rgba(255,80,80,.4)';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = orig; btn.style.cssText = ''; }, 5000);
      }
    });
  }

  /* ── Burger ── */
  const bur = document.getElementById('burger');
  if (bur) bur.addEventListener('click', () => bur.classList.toggle('open'));

})();
