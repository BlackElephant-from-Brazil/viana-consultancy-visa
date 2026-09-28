/* ============================================================
   VIANA CONSULTANCY — script.js
   ============================================================ */

// ---- NAVBAR ----
// The Liquid Glass nav runs on its own, in liquid-glass-nav.js.

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ---- FADE-IN OBSERVER ----
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));

// ---- COUNTER ANIMATION ----
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 2000;
  const step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) clearInterval(t);
  }, 16);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCount);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObs.observe(statsSection);

// ---- REVIEWS SLIDER ----
const REVIEWS = [
  { name:'Vitória Guedes Carvalho', date:'1 year ago', color:'#8B5CF6', init:'V',
    text:'excelente profissional me ajudou com minhas necessidades e foi super pontual e competente no que fez, super recomendo os seus serviços.' },
  { name:'Krishnan Thampy', date:'1 year ago', color:'#3B82F6', init:'K',
    text:'My friends got TRC within ten days through them. Very friendly and responsible person.' },
  { name:'Nithin Joseph', date:'1 year ago', color:'#EF4444', init:'N',
    text:'Work of excellence as am one her client and got 100% happy with her work. And am suggesting her for everyone without any doubt.' },
  { name:'Imad Benammar', date:'1 year ago', color:'#F59E0B', init:'I',
    text:'A melhor advogada de Portugal 🇵🇹 Recomendo.' },
  { name:'You Guerroudj', date:'1 year ago', color:'#10B981', init:'Y',
    text:'Gostaria de agradecer à excelente advogada Sra. Patrícia, ela é de confiança. Ela tem ampla experiência e habilidades em questões de imigração. Recomendo a todos.' },
  { name:'Sergii Kliebanov', date:'1 year ago', color:'#6366F1', init:'S',
    text:'Thank you for excellent service! Fast, friendly and helpful!' },
  { name:'Azizur Rahman', date:'1 year ago', color:'#EC4899', init:'A',
    text:'Excellent service from Ms Patricia. She like to take challenging cases and of course she got positive results. Best wishes for her team. ❤️❤️❤️' },
  { name:'Jahirul Alam', date:'1 year ago', color:'#F97316', init:'J',
    text:'First of all, I would like to express my gratitude for getting to know such a responsible lawyer like you. I believe that the main job of a lawyer is to listen to his client\'s words with importance and provide him with legal assistance in that way! I have always found you to be an exception in this regard. I am really very happy and grateful to you for the way you are doing one of my tasks with responsibility.' },
  { name:'Dadi A', date:'1 year ago', color:'#14B8A6', init:'D',
    text:'I would like to thank the excellent lawyer Madame Patricia, the trust is well deserved. She has a lot of experience and skills in immigrant issues. I recommend her to everyone. The best immigration lawyer in Portugal! The treatment with her team is excellent. Thank you for your efforts.' },
  { name:'Gulnar Shaikh', date:'1 year ago', color:'#A855F7', init:'G',
    text:'Kudos for Adv.Patricia and her wonderful team! They have done an excellent job in my case and have always been responsive and supportive in times of need. I appreciate their hard work and dedication to solve each and every case.' }
];

const PREVIEW_LEN = 130;
const googleSVG = `<svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>`;

const starSVG = () => `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;

const track = document.getElementById('sliderTrack');
if (track) {
  REVIEWS.forEach((r, i) => {
    const preview = r.text.length > PREVIEW_LEN ? r.text.slice(0, PREVIEW_LEN) + '…' : r.text;
    const hasMore = r.text.length > PREVIEW_LEN;
    track.insertAdjacentHTML('beforeend', `
      <div class="review-card" data-idx="${i}">
        <div class="rc-header">
          <div class="rc-profile">
            <div class="rc-avatar" style="background:${r.color}">${r.init}</div>
            <div>
              <div class="rc-name">${r.name}</div>
              <div class="rc-date">${r.date}</div>
            </div>
          </div>
          ${googleSVG}
        </div>
        <div class="rc-stars">${starSVG().repeat(5)}<span class="rc-check">✓</span></div>
        <div class="rc-text">${preview}</div>
        ${hasMore ? '<span class="rc-more" role="button" tabindex="0">Read more</span>' : ''}
      </div>
    `);
  });
}

// Read more / hide
track?.addEventListener('click', e => {
  const btn = e.target.closest('.rc-more');
  if (!btn) return;
  const card = btn.closest('.review-card');
  const idx  = parseInt(card.dataset.idx, 10);
  const textEl = card.querySelector('.rc-text');
  const r = REVIEWS[idx];
  if (btn.textContent.trim() === 'Read more') {
    textEl.textContent = r.text;
    btn.textContent = 'Hide';
  } else {
    textEl.textContent = r.text.slice(0, PREVIEW_LEN) + '…';
    btn.textContent = 'Read more';
  }
});

// Slider logic
let slideIdx = 0;

function visibleCount() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 4;
}

function cardWidth() {
  const c = track?.querySelector('.review-card');
  return c ? c.getBoundingClientRect().width + 20 : 0; // 20 = gap
}

function maxSlide() { return Math.max(0, REVIEWS.length - visibleCount()); }

function goTo(idx) {
  if (!track) return;
  slideIdx = Math.max(0, Math.min(idx, maxSlide()));
  track.style.transform = `translateX(-${slideIdx * cardWidth()}px)`;
}

document.getElementById('prevBtn')?.addEventListener('click', () => goTo(slideIdx - 1));
document.getElementById('nextBtn')?.addEventListener('click', () => goTo(slideIdx + 1));
window.addEventListener('resize', () => goTo(slideIdx), { passive: true });

// Auto-advance
if (track) {
  setInterval(() => goTo(slideIdx >= maxSlide() ? 0 : slideIdx + 1), 6000);
}

// ---- CALENDLY BOOKING CONVERSION TRACKING ----
// Nothing to do here. The booking conversion is owned by GTM container
// GTM-5DHSWHDP, which registers its own listener for Calendly's postMessage
// and fires the Google Ads tag. This file used to push a second dataLayer
// event that no GTM trigger listened for. Do not re-add it: two listeners
// pushing the same booking would count the conversion twice.
//
// The click id that lets a booking be matched back to its ad click is
// captured in index.html, before the Calendly widget starts.

// ---- FORMS ----
document.getElementById('downloadForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const form      = this;
  const firstName = form.querySelector('[name="firstName"]').value.trim();
  const lastName  = form.querySelector('[name="lastName"]').value.trim();
  const email     = form.querySelector('[name="email"]').value.trim();
  const btn       = form.querySelector('button[type="submit"]');

  if (!firstName || !email) return;

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  fetch('https://black-elephant.app.n8n.cloud/webhook/download-lead-magnetic', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      form.reset();
      window.location.href = 'thank-you/index.html';
    })
    .catch(() => {
      btn.disabled    = false;
      btn.textContent = 'Download';
      alert('Something went wrong. Please try again.');
    });
});

// ---- LEAD FORMS (hero and final CTA) ----
// Name, email and message go to n8n, which emails the visitor a thank-you
// note that quotes the message, with Patrícia in copy. The page stays where
// it is: sending the visitor to a thank-you URL would trip the GTM rule that
// counts eBook downloads.
//
// Each form carries a Cloudflare Turnstile widget (the check against robots).
// It stays invisible unless Cloudflare wants the visitor to click, and its
// token goes with the form: n8n checks it with Cloudflare before sending any
// email, so a script posting straight to the webhook gets nothing out. The
// Turnstile script is loaded after this file and calls onTurnstileLoad.
const LEAD_WEBHOOK       = 'https://black-elephant.app.n8n.cloud/webhook/visa-contact-form';
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';
const LEAD_MIN_MS        = 2500;
const TOKEN_WAIT_MS      = 8000;
const EMAIL_RE           = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;

const turnstileReady = new Promise(resolve => { window.onTurnstileLoad = resolve; });

document.querySelectorAll('.lead-form').forEach(form => {
  const startedAt = Date.now();
  const nameEl    = form.querySelector('[name="name"]');
  const emailEl   = form.querySelector('[name="email"]');
  const msgEl     = form.querySelector('[name="message"]');
  const trapEl    = form.querySelector('[name="company"]');
  const box       = form.querySelector('.lead-turnstile');
  const btn       = form.querySelector('.lead-submit');
  const status    = form.querySelector('.lead-status');
  const btnHTML   = btn.innerHTML;

  function say(text, isError) {
    status.textContent = text;
    status.classList.toggle('is-error', !!isError);
  }

  [nameEl, emailEl, msgEl].forEach(el => el.addEventListener('input', () => {
    el.removeAttribute('aria-invalid');
    if (status.classList.contains('is-error')) say('');
  }));

  // Turnstile: one widget per form. A token is single use and expires after
  // five minutes, so it is dropped on expiry and after every attempt.
  let widgetId = null;
  let token    = '';
  let waiters  = [];
  const settle = value => {
    token = value;
    if (value) waiters.splice(0).forEach(resolve => resolve(value));
  };
  turnstileReady.then(() => {
    widgetId = window.turnstile.render(box, {
      sitekey:            TURNSTILE_SITE_KEY,
      action:             form.dataset.source || 'lead',
      appearance:         'interaction-only',
      size:               box.clientWidth >= 300 ? 'flexible' : 'compact',
      theme:              'light',
      callback:           settle,
      'expired-callback': () => settle(''),
      'error-callback':   () => settle('')
    });
  });
  const waitForToken = () => token
    ? Promise.resolve(token)
    : new Promise(resolve => {
        waiters.push(resolve);
        setTimeout(() => resolve(''), TOKEN_WAIT_MS);
      });
  const resetWidget = () => {
    token = '';
    if (widgetId !== null) window.turnstile.reset(widgetId);
  };

  function fail(text) {
    btn.disabled  = false;
    btn.innerHTML = btnHTML;
    say(text, true);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn.disabled) return;
    const name    = nameEl.value.trim().replace(/\s+/g, ' ');
    const email   = emailEl.value.trim();
    const message = msgEl.value.trim();
    const first   = name.split(' ')[0];

    if (!name) {
      nameEl.setAttribute('aria-invalid', 'true');
      nameEl.focus();
      return say('Enter your name.', true);
    }
    if (!EMAIL_RE.test(email)) {
      emailEl.setAttribute('aria-invalid', 'true');
      emailEl.focus();
      return say('Enter a valid email address.', true);
    }
    if (!message) {
      msgEl.setAttribute('aria-invalid', 'true');
      msgEl.focus();
      return say('Tell us what you are looking for.', true);
    }

    const done = () => {
      form.classList.add('is-sent');
      say(`Thank you, ${first}. Your details reached us and we will be in touch soon.`);
    };

    // A filled hidden field, or a form sent within 2.5 s of the page loading,
    // is a bot: it gets the same thank-you and nothing is sent.
    if (trapEl.value || Date.now() - startedAt < LEAD_MIN_MS) return done();

    btn.disabled    = true;
    btn.textContent = 'Sending…';
    say('');

    const verified = await waitForToken();
    if (!verified) {
      resetWidget();
      return fail('The security check did not finish. Try again, or email us below.');
    }

    try {
      const res = await fetch(LEAD_WEBHOOK, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name,
          email,
          message,
          source:    form.dataset.source || '',
          page:      location.origin + location.pathname,
          turnstile: verified
        })
      });
      if (!res.ok) throw new Error();
      done();
    } catch (err) {
      resetWidget();
      fail('Your details did not reach us. Try again, or email us below.');
    }
  });
});
