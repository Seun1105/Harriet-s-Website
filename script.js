/* ══════════════════════════════════════════════════
   STS Initiative v2 — Interactions + Diagnostic
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ──────────────── SCROLL REVEAL ──────────────── */
  const revealTargets = [
    '.problem__head', '.problem__text', '.problem__photo',
    '.tri-stat', '.framework__header-text',
    '.fw-step', '.approach__big-quote', '.approach__col',
    '.audience__head', '.aud-tile', '.evidence__head',
    '.evid-block', '.founder__portrait', '.founder__text',
    '.cta-block__inner'
  ];
  document.querySelectorAll(revealTargets.join(',')).forEach(el => {
    el.classList.add('will-reveal');
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('revealed'), i * 60);
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    document.querySelectorAll('.will-reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.will-reveal').forEach(el => el.classList.add('revealed'));
  }

  /* ──────────────── ACTIVE NAV ─────────────────── */
  const navAnchors = Array.from(document.querySelectorAll('.nav__links a'));
  const navSections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-35% 0px -58% 0px' });
    navSections.forEach(s => navIO.observe(s));
  }

  /* ──────────────── MOBILE DRAWER ──────────────── */
  const drawer = document.getElementById('drawer');

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.querySelector('.nav__hamburger').setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelector('.nav__hamburger').setAttribute('aria-expanded', 'false');
  }

  document.querySelector('.js-menu-open').addEventListener('click', openDrawer);
  document.querySelectorAll('.js-menu-close').forEach(el => el.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* ──────────────── DIAGNOSTIC ─────────────────── */
  const modal       = document.getElementById('diagModal');
  const progFill    = document.getElementById('diagProgress');
  const stepLabel   = document.getElementById('diagStepLabel');
  const diagBody    = document.getElementById('diagBody');
  const diagControls = document.getElementById('diagControls');
  const diagResults = document.getElementById('diagResults');
  const resultContent = document.getElementById('diagResultContent');
  const btnBack     = document.getElementById('diagBack');
  const btnNext     = document.getElementById('diagNext');
  const btnRetake   = document.getElementById('diagRetake');

  let step = 0;
  const answers = {};

  /* ── Questions ── */
  const questions = [
    {
      id: 'sector',
      text: 'What type of business do you run?',
      scored: false,
      options: [
        { label: 'Retail or Food Service',                                   value: 'retail'        },
        { label: 'Professional Services (accounting, consulting, legal…)',   value: 'professional'  },
        { label: 'Local Manufacturing or Trades',                            value: 'manufacturing' },
        { label: 'Health & Wellness',                                        value: 'health'        },
        { label: 'Construction or Skilled Trades',                           value: 'construction'  },
        { label: 'Other',                                                    value: 'other'         },
      ],
    },
    {
      id: 'size',
      text: 'How many people work in your business, including yourself?',
      scored: false,
      options: [
        { label: 'Just me',             value: 'solo'   },
        { label: '2 to 5 people',       value: 'tiny'   },
        { label: '6 to 20 people',      value: 'small'  },
        { label: '21 to 50 people',     value: 'medium' },
        { label: 'More than 50 people', value: 'large'  },
      ],
    },
    {
      id: 'tech',
      text: 'Which best describes the technology your business uses today?',
      scored: true,
      options: [
        { label: 'Mostly paper and manual processes',                            value: 0 },
        { label: 'Basic tools — spreadsheets, email, a simple POS',             value: 1 },
        { label: 'Some business software (QuickBooks, scheduling apps…)',        value: 2 },
        { label: 'Multiple connected software systems',                          value: 3 },
      ],
    },
    {
      id: 'challenge',
      text: 'What is your biggest day-to-day business challenge right now?',
      scored: false,
      options: [
        { label: 'Finding and keeping customers',           value: 'customers'   },
        { label: 'Managing daily operations efficiently',   value: 'operations'  },
        { label: 'Keeping costs under control',             value: 'costs'       },
        { label: 'Competing with larger businesses',        value: 'competition' },
        { label: 'Managing employees and scheduling',       value: 'employees'   },
      ],
    },
    {
      id: 'comfort',
      text: 'How comfortable is your team with learning new technology?',
      scored: true,
      options: [
        { label: 'We avoid new tech whenever possible',                         value: 0 },
        { label: 'We use what we have to, but keep it as simple as possible',   value: 1 },
        { label: 'Most of us are comfortable picking up new tools',             value: 2 },
        { label: 'We actively seek out better tools and adopt them quickly',    value: 3 },
      ],
    },
    {
      id: 'budget',
      text: 'What is your realistic monthly budget for new business tools or software?',
      scored: false,
      options: [
        { label: 'Nothing right now',         value: 'none' },
        { label: 'Up to $50 per month',       value: 'low'  },
        { label: '$51 to $200 per month',     value: 'mid'  },
        { label: '$200 or more per month',    value: 'high' },
      ],
    },
    {
      id: 'awareness',
      text: 'How would you describe your current relationship with AI tools for business?',
      scored: true,
      options: [
        { label: "I haven't really looked into AI for my business",   value: 0 },
        { label: "I've heard about it but think it's not for me",     value: 1 },
        { label: "I'm curious but don't know where to start",         value: 2 },
        { label: "I've already tried some AI tools",                  value: 3 },
      ],
    },
    {
      id: 'concern',
      text: 'What is your biggest hesitation about AI right now?',
      scored: false,
      options: [
        { label: "I'm not sure AI is relevant to my type of business",  value: 'relevance'    },
        { label: 'It seems too expensive for a business my size',       value: 'cost'         },
        { label: "I'm worried about my employees' reaction",            value: 'employees'    },
        { label: "I don't understand how it works",                     value: 'understanding'},
        { label: 'I have no major hesitations',                         value: 'none'         },
      ],
    },
    {
      id: 'openness',
      text: 'How do you typically approach new ideas or changes in your business?',
      scored: true,
      options: [
        { label: 'I need a lot of convincing before trying something new',   value: 0 },
        { label: "I'll try something if I see clear proof it works",         value: 1 },
        { label: "I'm generally open to trying new approaches",              value: 2 },
        { label: 'I actively seek out new tools and strategies',             value: 3 },
      ],
    },
    {
      id: 'support',
      text: 'Who is most likely to lead a technology change in your business?',
      scored: false,
      options: [
        { label: 'Me — I make all decisions myself',           value: 'owner'      },
        { label: 'An employee who handles our tech',           value: 'employee'   },
        { label: "We'd need outside guidance to get started",  value: 'outside'    },
        { label: 'I work with a consultant or advisor',        value: 'consultant' },
      ],
    },
    {
      id: 'goal',
      text: 'Where would you most want AI to help your business first?',
      scored: false,
      options: [
        { label: 'Saving time on repetitive tasks',              value: 'automation' },
        { label: 'Communicating better with customers',          value: 'customers'  },
        { label: 'Managing inventory, scheduling, or logistics', value: 'operations' },
        { label: 'Understanding my business data and trends',    value: 'analytics'  },
        { label: 'Marketing and reaching new customers',         value: 'marketing'  },
      ],
    },
  ];

  /* ── Scoring ── */
  function calcScore() {
    return questions.reduce((sum, q) => {
      if (q.scored && answers[q.id] !== undefined) return sum + Number(answers[q.id]);
      return sum;
    }, 0);
  }

  function profileKey(score) {
    if (score <= 3) return 'early';
    if (score <= 7) return 'ready';
    return 'strategic';
  }

  /* ── Profile content ── */
  const sectorLabels = {
    retail: 'Retail & Food Service', professional: 'Professional Services',
    manufacturing: 'Local Manufacturing & Trades', health: 'Health & Wellness',
    construction: 'Construction & Skilled Trades', other: 'Your Sector',
  };
  const challengeMap = {
    customers:   'the Strategic Communication Modules and Peer Learning Library',
    operations:  'the Sector-Specific Adoption Roadmaps and Visual Storytelling System',
    costs:       'the Diagnostic Roadmap and the Plain-Language AI Glossary',
    competition: 'the Sector-Specific Roadmaps and Peer Learning Library',
    employees:   'the Strategic Communication Modules — designed to build trust, not resistance',
  };
  const goalMap = {
    automation: 'scheduling tools, automated email responses, and AI-powered task management',
    customers:  'customer service chatbots, personalized email tools, and review management',
    operations: 'inventory forecasting, demand planning, and logistics optimization',
    analytics:  'sales dashboards, customer behavior tracking, and trend reporting',
    marketing:  'AI writing assistants, ad targeting tools, and social content schedulers',
  };

  const profiles = {
    early: {
      name: 'Early Explorer',
      desc: "You're at the very beginning of your AI journey — and that is exactly the right place to start. The most important step right now is building a clear, honest understanding of what AI actually is and what it can realistically do for a business like yours. There is no rush. The path is clear.",
      steps: [
        'Start with the Plain-Language AI Glossary to build vocabulary without jargon',
        'Browse the Peer Learning Library — real stories from owners in your exact sector',
        'Return to the diagnostic in 30 days; your readiness score will likely shift',
      ],
      resources: ['Plain-Language AI Glossary', 'Peer Learning & Case Study Library', 'Visual Storytelling System'],
    },
    ready: {
      name: 'Ready Starter',
      desc: "You have the foundation — the technology literacy, the openness, the awareness. What you need now is a structured, specific path tailored to your sector and your challenges. You are closer than you think.",
      steps: [
        'Download your Sector-Specific Adoption Roadmap for a phased, realistic plan',
        'Use the Strategic Communication Modules before introducing AI to your team',
        'Identify one task in your business to automate or assist in the next 90 days',
      ],
      resources: ['Sector-Specific Adoption Roadmaps', 'Strategic Communication Modules', 'AI Adoption Diagnostic Tool'],
    },
    strategic: {
      name: 'Strategic Adopter',
      desc: "You are ahead of 82% of businesses your size. You have the technology comfort, the openness, and the awareness to move from curiosity to implementation. The question is no longer whether — it is where and in what order.",
      steps: [
        'Use the full six-component framework to build your 12-month AI strategy',
        'Connect with the Peer Learning Library to find implementation partners',
        'Consider contributing your experience to the case study library for others',
      ],
      resources: ['Full Six-Component Framework', 'Peer Learning & Case Study Library', 'Sector-Specific Adoption Roadmaps'],
    },
  };

  /* ── Render question ── */
  function renderQ(i) {
    const q     = questions[i];
    const total = questions.length;

    progFill.style.width     = ((i / total) * 100) + '%';
    stepLabel.textContent    = 'Question ' + (i + 1) + ' of ' + total;
    btnBack.disabled         = i === 0;
    btnNext.textContent      = i === total - 1 ? 'See My Results' : 'Continue';

    diagBody.innerHTML = `
      <div class="diag-question" role="group" aria-labelledby="qt${i}">
        <p class="diag-q-text" id="qt${i}">${q.text}</p>
        <div class="diag-options">
          ${q.options.map((opt, j) => `
            <div class="diag-option">
              <input
                type="radio"
                name="dq_${q.id}"
                id="do_${q.id}_${j}"
                value="${opt.value}"
                ${answers[q.id] === String(opt.value) ? 'checked' : ''}
              />
              <label for="do_${q.id}_${j}">${opt.label}</label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ── Show results ── */
  function showResults() {
    progFill.style.width = '100%';
    stepLabel.textContent = 'Your results are ready';
    diagBody.hidden = true;
    diagControls.hidden = true;
    diagResults.hidden = false;

    const score   = calcScore();
    const key     = profileKey(score);
    const profile = profiles[key];
    const sector  = sectorLabels[answers.sector] || 'Your Sector';
    const cTool   = challengeMap[answers.challenge] || 'the full six-component framework';
    const gTool   = goalMap[answers.goal] || 'AI tools tailored to your business';

    resultContent.innerHTML = `
      <div class="result-badge">
        <p class="result-badge__label">Your AI Readiness Profile</p>
        <h3 class="result-badge__name">${profile.name}</h3>
        <p class="result-badge__desc">${profile.desc}</p>
      </div>

      <div class="result-section">
        <h4>For ${sector} Businesses</h4>
        <ul>
          <li>To address your primary challenge, we recommend ${cTool}.</li>
          <li>For your goal area, explore ${gTool} as practical first steps.</li>
        </ul>
      </div>

      <div class="result-section">
        <h4>Your Next Three Steps</h4>
        <ul>
          ${profile.steps.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>

      <div class="result-section">
        <h4>Most Relevant Framework Resources</h4>
        <ul>
          ${profile.resources.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  /* ── Next / Back ── */
  function advance() {
    const q   = questions[step];
    const sel = diagBody.querySelector(`input[name="dq_${q.id}"]:checked`);
    if (!sel) {
      const opts = diagBody.querySelector('.diag-options');
      opts.style.animation = 'none';
      requestAnimationFrame(() => {
        opts.style.animation = '';
        opts.style.animation = 'nudge 0.35s ease';
      });
      return;
    }
    answers[q.id] = sel.value;
    if (step < questions.length - 1) {
      step++;
      renderQ(step);
    } else {
      showResults();
    }
  }

  btnNext.addEventListener('click', advance);
  btnBack.addEventListener('click', () => {
    if (step > 0) { step--; renderQ(step); }
  });
  diagBody.addEventListener('keydown', e => { if (e.key === 'Enter') advance(); });

  /* ── Open / Close modal ── */
  function openModal() {
    step = 0;
    Object.keys(answers).forEach(k => delete answers[k]);
    modal.removeAttribute('hidden');
    diagBody.hidden     = false;
    diagControls.hidden = false;
    diagResults.hidden  = true;
    document.body.style.overflow = 'hidden';
    renderQ(0);
    closeDrawer();
    // focus the panel for keyboard users
    setTimeout(() => {
      const panel = modal.querySelector('.diag-modal__box');
      panel.setAttribute('tabindex', '-1');
      panel.focus();
    }, 80);
  }
  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-diag-open').forEach(btn => btn.addEventListener('click', openModal));
  document.querySelectorAll('.js-diag-close').forEach(el => el.addEventListener('click', closeModal));
  if (btnRetake) btnRetake.addEventListener('click', openModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal(); });

  /* ── Nudge animation (injected once) ── */
  const nudgeStyle = document.createElement('style');
  nudgeStyle.textContent = `
    @keyframes nudge {
      0%,100% { transform: translateX(0); }
      25%      { transform: translateX(-8px); }
      75%      { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(nudgeStyle);

  /* ──────────────── COUNTER ANIMATION ──────────────── */
  if ('IntersectionObserver' in window) {
    const cntIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el   = entry.target;
        const raw  = el.dataset.count;
        if (!raw) return;
        const num  = parseFloat(raw);
        const decimalPlaces = (raw.split('.')[1] || '').length;
        const dur  = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = num * eased;
          el.dataset.display = decimalPlaces > 0 ? val.toFixed(decimalPlaces) : Math.round(val);
          el.firstChild.nodeValue = el.dataset.display;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cntIO.unobserve(el);
      });
    }, { threshold: 0.5 });

    // Tag stats for counting
    document.querySelectorAll('.stat-pill__num').forEach(el => {
      const txt = el.textContent.trim();
      const match = txt.match(/^[\d.]+/);
      if (match) {
        el.dataset.count = match[0];
        el.dataset.suffix = txt.slice(match[0].length);
      }
      cntIO.observe(el);
    });
  }

  /* ──────────────── HERO PARALLAX (subtle) ──────────── */
  const heroPhotos = document.querySelector('.hero__photos');
  if (heroPhotos && window.matchMedia('(min-width: 1024px)').matches) {
    let raf = false;
    window.addEventListener('scroll', () => {
      if (!raf) {
        raf = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 900) {
            heroPhotos.style.transform = `translateY(${y * 0.08}px)`;
          }
          raf = false;
        });
      }
    }, { passive: true });
  }

})();
