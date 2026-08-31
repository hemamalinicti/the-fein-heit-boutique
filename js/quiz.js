/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - SKIN & HAIR RITUAL QUIZ ENGINE
   ========================================================================== */

const RITUAL_QUIZ_QUESTIONS = [
  {
    id: 'skinType',
    title: "What's your skin type?",
    subtitle: 'Step 1 of 4',
    options: [
      { value: 'oily', label: 'Oily & Shine-Prone', icon: '💧' },
      { value: 'dry', label: 'Dry & Dehydrated', icon: '🌵' },
      { value: 'combination', label: 'Combination', icon: '🌗' },
      { value: 'sensitive', label: 'Sensitive & Reactive', icon: '🌸' }
    ]
  },
  {
    id: 'hairConcern',
    title: "What's your biggest hair concern?",
    subtitle: 'Step 2 of 4',
    options: [
      { value: 'frizz', label: 'Frizzy & Dry Ends', icon: '🌾' },
      { value: 'color', label: 'Color-Treated & Dull', icon: '🎨' },
      { value: 'scalp', label: 'Thinning & Scalp Stress', icon: '🌿' },
      { value: 'none', label: "It's Great, Skip This", icon: '✨' }
    ]
  },
  {
    id: 'goal',
    title: 'What are you hoping to achieve?',
    subtitle: 'Step 3 of 4',
    options: [
      { value: 'glow', label: 'Radiant, Anti-Aging Glow', icon: '☀️' },
      { value: 'hydration', label: 'Deep Hydration & Repair', icon: '💦' },
      { value: 'relax', label: 'Relaxation & Stress Relief', icon: '🕊️' },
      { value: 'bridal', label: 'Bridal / Special Occasion', icon: '👑' }
    ]
  },
  {
    id: 'time',
    title: 'How much time can you set aside for self-care?',
    subtitle: 'Step 4 of 4',
    options: [
      { value: 'quick', label: 'Under 1 hour', icon: '⏱️' },
      { value: 'medium', label: '1–2 hours', icon: '⏳' },
      { value: 'full', label: 'A full pampering afternoon', icon: '🛁' }
    ]
  }
];

let quizState = {};
let quizCurrentStep = 0;

function openRitualQuiz() {
  quizState = {};
  quizCurrentStep = 0;
  const modal = document.getElementById('ritual-quiz-modal');
  if (!modal) return;
  modal.classList.add('active');
  renderQuizStep();
}

function closeRitualQuiz() {
  const modal = document.getElementById('ritual-quiz-modal');
  if (modal) modal.classList.remove('active');
}

function renderQuizStep() {
  const body = document.getElementById('ritual-quiz-body');
  if (!body) return;

  if (quizCurrentStep >= RITUAL_QUIZ_QUESTIONS.length) {
    renderQuizResult();
    return;
  }

  const q = RITUAL_QUIZ_QUESTIONS[quizCurrentStep];
  const progressPercent = Math.round((quizCurrentStep / RITUAL_QUIZ_QUESTIONS.length) * 100);

  body.innerHTML = `
    <div class="quiz-progress-track">
      <div class="quiz-progress-fill" style="width:${progressPercent}%;"></div>
    </div>
    <span class="quiz-step-label">${q.subtitle}</span>
    <h3 class="quiz-question-title">${q.title}</h3>
    <div class="quiz-options-grid">
      ${q.options.map(opt => `
        <button type="button" class="quiz-option-btn" onclick="selectQuizAnswer('${q.id}', '${opt.value}')">
          <span class="quiz-option-icon">${opt.icon}</span>
          <span>${opt.label}</span>
        </button>
      `).join('')}
    </div>
    ${quizCurrentStep > 0 ? `<button type="button" class="quiz-back-btn" onclick="quizGoBack()">← Back</button>` : ''}
  `;
}

function selectQuizAnswer(questionId, value) {
  quizState[questionId] = value;
  quizCurrentStep += 1;
  renderQuizStep();
}

function quizGoBack() {
  if (quizCurrentStep > 0) {
    quizCurrentStep -= 1;
    renderQuizStep();
  }
}

function getQuizRecommendation() {
  const products = (typeof getCatalogProducts === 'function') ? getCatalogProducts() : BOUTIQUE_DATA.products;
  const findProduct = id => products.find(p => p.id === id);
  const findService = id => BOUTIQUE_DATA.services.find(s => s.id === id);

  // Primary service recommendation is driven by the stated goal.
  const goalServiceMap = {
    glow: 'srv-01',
    hydration: 'srv-03',
    relax: 'srv-05',
    bridal: 'srv-04'
  };

  // Refine with hair concern & time available when relevant.
  let serviceId = goalServiceMap[quizState.goal] || 'srv-01';
  if (quizState.hairConcern === 'color' && quizState.goal !== 'bridal') serviceId = 'srv-02';
  if (quizState.hairConcern === 'scalp' && quizState.goal === 'hydration') serviceId = 'srv-03';
  if (quizState.time === 'quick' && quizState.goal === 'relax') serviceId = 'srv-06';

  const skinProductMap = {
    oily: 'prod-03',
    dry: 'prod-02',
    combination: 'prod-01',
    sensitive: 'prod-03'
  };
  const goalProductMap = {
    glow: 'prod-01',
    hydration: 'prod-02',
    relax: 'prod-04',
    bridal: 'prod-05'
  };
  const hairProductMap = {
    frizz: 'prod-07',
    color: 'prod-07',
    scalp: 'prod-08'
  };

  const productIds = new Set();
  if (skinProductMap[quizState.skinType]) productIds.add(skinProductMap[quizState.skinType]);
  if (goalProductMap[quizState.goal]) productIds.add(goalProductMap[quizState.goal]);
  if (hairProductMap[quizState.hairConcern]) productIds.add(hairProductMap[quizState.hairConcern]);

  const recommendedProducts = Array.from(productIds).map(findProduct).filter(Boolean).slice(0, 3);
  const recommendedService = findService(serviceId);

  const goalBlurbs = {
    glow: 'a luminous, youthful glow',
    hydration: 'deep hydration and skin barrier repair',
    relax: 'true relaxation and stress relief',
    bridal: 'a flawless, camera-ready bridal look'
  };

  return {
    service: recommendedService,
    products: recommendedProducts,
    blurb: goalBlurbs[quizState.goal] || 'your best skin and hair yet'
  };
}

function renderQuizResult() {
  const body = document.getElementById('ritual-quiz-body');
  if (!body) return;

  const result = getQuizRecommendation();
  const svc = result.service;

  body.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-badge">✨ Your Personalized Ritual</div>
      <h3 class="quiz-result-title">Curated for ${result.blurb}</h3>
      <p class="quiz-result-desc">Based on your answers, here's what our specialists recommend for you.</p>

      ${svc ? `
        <div class="quiz-result-service">
          <img src="${svc.image}" alt="${svc.title}" loading="lazy">
          <div class="quiz-result-service-info">
            <span class="badge badge-gold" style="margin-bottom: 0.4rem;">Recommended Ritual</span>
            <h4>${svc.title}</h4>
            <p>${svc.duration} • ${formatCurrency(svc.price)}</p>
            <button class="btn btn-primary btn-sm" onclick="closeRitualQuiz(); openBookingWithService('${svc.id}');">
              Book This Ritual ✨
            </button>
          </div>
        </div>
      ` : ''}

      ${result.products.length ? `
        <div class="quiz-result-products-label">Recommended Products for You</div>
        <div class="quiz-result-products-grid">
          ${result.products.map(p => `
            <div class="quiz-result-product-card" onclick="closeRitualQuiz(); openProductQuickView('${p.id}');">
              <img src="${p.image}" alt="${p.title}" loading="lazy">
              <span>${p.title}</span>
              <strong>${formatCurrency(p.price)}</strong>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="quiz-result-actions">
        <button class="btn btn-outline" type="button" onclick="restartRitualQuiz()">Retake Quiz</button>
        <button class="btn btn-outline" type="button" onclick="closeRitualQuiz()">Close</button>
      </div>
    </div>
  `;
}

function restartRitualQuiz() {
  quizState = {};
  quizCurrentStep = 0;
  renderQuizStep();
}
