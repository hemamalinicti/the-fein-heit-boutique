/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - CONTACT & TESTIMONIALS ENGINE
   ========================================================================== */

let currentReviewRatingFilter = 0;
let newReviewSelectedStars = 5;

/* Init Reviews & Contact Page */
function initContactAndReviews() {
  renderReviewsList();
  initReviewFormStars();
  renderFaqAccordion();
}

/* Render Testimonials */
function renderReviewsList() {
  const container = document.getElementById('testimonials-grid');
  const statsAvg = document.getElementById('review-avg-rating');
  const statsCount = document.getElementById('review-total-count');
  if (!container) return;

  const reviews = store.getReviews();

  // Compute average rating
  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  if (statsAvg) statsAvg.textContent = `${avg} / 5.0`;
  if (statsCount) statsCount.textContent = `Based on ${reviews.length} client reviews`;

  const filtered = currentReviewRatingFilter === 0 
    ? reviews 
    : reviews.filter(r => r.rating === currentReviewRatingFilter);

  container.innerHTML = filtered.map(rev => `
    <div class="product-card" style="padding: 1.75rem; border-radius: var(--radius-md);">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
        <img src="${rev.avatar}" alt="${rev.author}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-gold-light);">
        <div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.15rem;">${rev.author}</h4>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="star-rating">${renderStars(rev.rating)}</span>
            ${rev.verified ? `<span class="badge badge-organic" style="font-size: 0.65rem; padding: 1px 6px;">Verified Client</span>` : ''}
          </div>
        </div>
      </div>

      <div style="font-size: 0.78rem; color: var(--primary-gold-dark); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
        Ritual / Product: ${rev.service}
      </div>

      <p style="font-size: 0.92rem; color: var(--dark-slate); line-height: 1.6; margin-bottom: 1rem; font-style: italic;">
        "${rev.content}"
      </p>

      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
        <span>${rev.date}</span>
        <span style="color: var(--primary-gold-dark); font-weight: 500;">✓ Verified Experience</span>
      </div>
    </div>
  `).join('');
}

function filterReviewsByStar(stars, el) {
  currentReviewRatingFilter = stars;
  document.querySelectorAll('#review-filter-chips .filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderReviewsList();
}

/* Interactive Star Rating Selector for New Review */
function initReviewFormStars() {
  const container = document.getElementById('new-review-stars');
  if (!container) return;

  renderNewReviewStars();
}

function renderNewReviewStars() {
  const container = document.getElementById('new-review-stars');
  if (!container) return;

  let html = '';
  for (let i = 1; i <= 5; i++) {
    const isSelected = i <= newReviewSelectedStars;
    html += `
      <button type="button" onclick="setNewReviewStars(${i})" style="font-size: 1.6rem; color: ${isSelected ? '#f59e0b' : '#d1d5db'}; transition: var(--transition-fast);">
        ★
      </button>
    `;
  }
  container.innerHTML = html;
}

function setNewReviewStars(rating) {
  newReviewSelectedStars = rating;
  renderNewReviewStars();
}

/* Submit Review Form */
function handleReviewSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('review-author-input');
  const serviceInput = document.getElementById('review-service-input');
  const contentInput = document.getElementById('review-content-input');

  if (!nameInput.value || !contentInput.value) {
    showToast('Please provide your name and review details.', 'error');
    return;
  }

  store.addReview({
    author: nameInput.value.trim(),
    rating: newReviewSelectedStars,
    service: serviceInput.value.trim() || 'Fein Heit Beauty Treatment',
    content: contentInput.value.trim()
  });

  showToast('Thank you! Your review has been published ✨', 'success');

  // Reset form
  nameInput.value = '';
  contentInput.value = '';
  newReviewSelectedStars = 5;
  renderNewReviewStars();
  renderReviewsList();
}

/* Contact Form Submission with Simulated Concierge Response */
function handleContactSubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const msgInput = document.getElementById('contact-message');

  if (!nameInput.value || !emailInput.value || !msgInput.value) {
    showToast('Please fill out all required contact fields.', 'error');
    return;
  }

  // Simulated instant notification
  showToast(`Thank you, ${nameInput.value.trim()}! Our concierge will reply to ${emailInput.value.trim()} within 2 hours.`, 'success');

  nameInput.value = '';
  emailInput.value = '';
  if (subjectInput) subjectInput.value = '';
  msgInput.value = '';
}

/* FAQ Accordion Renderer */
function renderFaqAccordion() {
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  container.innerHTML = BOUTIQUE_DATA.faqs.map((faq, idx) => `
    <div class="faq-item" style="border: 1px solid var(--border-light); border-radius: var(--radius-sm); margin-bottom: 0.75rem; background: var(--bg-white); overflow: hidden;">
      <button type="button" class="faq-question" onclick="toggleFaq(${idx})" style="width: 100%; text-align: left; padding: 1.1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 0.95rem; color: var(--dark-slate);">
        <span>${faq.question}</span>
        <span id="faq-icon-${idx}" style="font-size: 1.2rem; color: var(--primary-gold-dark); transition: transform 0.3s ease;">+</span>
      </button>
      <div id="faq-answer-${idx}" class="faq-answer" style="display: none; padding: 0 1.5rem 1.25rem; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
        ${faq.answer}
      </div>
    </div>
  `).join('');
}

function toggleFaq(index) {
  const answer = document.getElementById(`faq-answer-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  if (!answer || !icon) return;

  const isOpen = answer.style.display === 'block';
  answer.style.display = isOpen ? 'none' : 'block';
  icon.textContent = isOpen ? '+' : '−';
}
