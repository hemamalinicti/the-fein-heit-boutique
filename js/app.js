/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - MAIN APP CONTROLLER, HERO SLIDER & ANIMATIONS
   ========================================================================== */

let currentHeroIndex = 0;
let heroSlideTimer = null;
let heroProgressInterval = null;
let heroProgressPercent = 0;
const HERO_DURATION_MS = 6000;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Initialize Routing
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  // Initialize UI Components
  initHeader();
  renderBadgeCounts();
  renderCartDrawer();
  renderWishlist();

  // Initialize Hero Slider & Sub-engines
  initHeroSlider();
  if (typeof renderHomeBestSellers === 'function') renderHomeBestSellers();
  if (typeof renderCollections === 'function') renderCollections();
  if (typeof renderProductCatalog === 'function') renderProductCatalog();
  if (typeof initBookingForm === 'function') initBookingForm();
  if (typeof initOrderTracking === 'function') initOrderTracking();
  if (typeof initContactAndReviews === 'function') initContactAndReviews();

  // Setup Scroll Reveal Observer & Counter Animations
  initScrollObserver();
  initPrivacyConsent();
  renderAuthStatus();

  // Event Listeners for State
  window.addEventListener('feinheit:cartUpdated', () => {
    renderBadgeCounts();
    renderCartDrawer();
    renderCartPage();
  });

  window.addEventListener('feinheit:wishlistUpdated', () => {
    renderBadgeCounts();
    renderWishlist();
  });

  window.addEventListener('feinheit:couponUpdated', () => {
    renderCartDrawer();
    renderCartPage();
  });

  window.addEventListener('feinheit:authChanged', () => {
    renderAuthStatus();
    if (window.location.hash.includes('account')) {
      renderAccountPage();
    }
  });
}

/* ==================== HERO GLIDING SLIDER ENGINE ==================== */
function initHeroSlider() {
  const container = document.getElementById('hero-slides-wrapper');
  const dotsContainer = document.getElementById('hero-slider-dots');
  if (!container || !BOUTIQUE_DATA.heroSlides) return;

  // Render Slides
  container.innerHTML = BOUTIQUE_DATA.heroSlides.map((slide, idx) => `
    <div class="hero-slide ${idx === 0 ? 'active' : ''}" id="hero-slide-${idx}">
      ${slide.video 
        ? `<video src="${slide.video}" class="hero-slide-bg" autoplay muted loop playsinline poster="${slide.image}"></video>` 
        : `<img src="${slide.image}" alt="${slide.title}" class="hero-slide-bg" loading="${idx === 0 ? 'eager' : 'lazy'}">`
      }
      <div class="hero-slide-overlay"></div>
      <div class="container" style="height: 100%; display: flex; align-items: center;">
        <div class="hero-slide-content">
          <span class="hero-badge">${slide.badge}</span>
          <h1 class="hero-title">${slide.title}</h1>
          <p class="hero-desc">${slide.desc}</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="navigateTo('${slide.primaryBtn.action}')">
              ${slide.primaryBtn.text}
            </button>
            <button class="btn btn-secondary btn-lg" onclick="navigateTo('${slide.secondaryBtn.action}')">
              ${slide.secondaryBtn.text}
            </button>
          </div>
          <div class="hero-trust">
            <div class="hero-trust-item">
              <strong class="counter-num" data-target="15000" data-suffix="+">15,000+</strong>
              <span>Happy Clients</span>
            </div>
            <div class="hero-trust-item">
              <strong class="counter-num" data-target="100" data-suffix="%">100%</strong>
              <span>Organic Certified</span>
            </div>
            <div class="hero-trust-item">
              <strong>4.9 ★</strong>
              <span>Top Parlour Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Render Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = BOUTIQUE_DATA.heroSlides.map((_, idx) => `
      <div class="hero-dot ${idx === 0 ? 'active' : ''}" onclick="goToHeroSlide(${idx})"></div>
    `).join('');
  }

  // Setup Touch Swipe on Hero Slider
  const sliderEl = document.getElementById('hero-slider-section');
  if (sliderEl) {
    let touchStartX = 0;
    let touchEndX = 0;

    sliderEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseHeroSlider();
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) nextHeroSlide();
      if (touchEndX - touchStartX > 50) prevHeroSlide();
      startHeroSlider();
    }, { passive: true });

    sliderEl.addEventListener('mouseenter', pauseHeroSlider);
    sliderEl.addEventListener('mouseleave', startHeroSlider);
  }

  startHeroSlider();
}

function goToHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  slides.forEach((s, idx) => {
    s.classList.toggle('active', idx === index);
  });

  dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === index);
  });

  currentHeroIndex = index;
  resetHeroProgressBar();
}

function nextHeroSlide() {
  const total = BOUTIQUE_DATA.heroSlides.length;
  const nextIdx = (currentHeroIndex + 1) % total;
  goToHeroSlide(nextIdx);
}

function prevHeroSlide() {
  const total = BOUTIQUE_DATA.heroSlides.length;
  const prevIdx = (currentHeroIndex - 1 + total) % total;
  goToHeroSlide(prevIdx);
}

function startHeroSlider() {
  stopHeroSlider();
  heroSlideTimer = setInterval(nextHeroSlide, HERO_DURATION_MS);
  
  // Progress Bar Animation
  heroProgressPercent = 0;
  const timerBar = document.getElementById('hero-timer-bar');
  if (timerBar) {
    const stepMs = 50;
    const increment = (stepMs / HERO_DURATION_MS) * 100;
    heroProgressInterval = setInterval(() => {
      heroProgressPercent += increment;
      if (heroProgressPercent > 100) heroProgressPercent = 0;
      timerBar.style.width = `${heroProgressPercent}%`;
    }, stepMs);
  }
}

function stopHeroSlider() {
  if (heroSlideTimer) clearInterval(heroSlideTimer);
  if (heroProgressInterval) clearInterval(heroProgressInterval);
}

function pauseHeroSlider() {
  stopHeroSlider();
}

function resetHeroProgressBar() {
  heroProgressPercent = 0;
  const timerBar = document.getElementById('hero-timer-bar');
  if (timerBar) timerBar.style.width = '0%';
}

/* ==================== SCROLL REVEAL & COUNTER OBSERVER ==================== */
function initScrollObserver() {
  triggerScrollReveal();
}

function triggerScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Check for animated number counter
        const counters = entry.target.querySelectorAll('.counter-num');
        counters.forEach(animateCounter);

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal:not(.revealed), .section-header, .product-card, .service-card, .collection-card, .review-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  if (isNaN(target)) return;

  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString() + suffix;
  }, 30);
}

/* ==================== ROUTING SYSTEM ==================== */
function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const validRoutes = ['home', 'about', 'collections', 'products', 'testimonials', 'contact', 'cart', 'wishlist', 'tracking', 'booking', 'account'];
  const targetRoute = validRoutes.includes(hash) ? hash : 'home';

  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const activeView = document.getElementById(`view-${targetRoute}`);
  if (activeView) {
    activeView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-route') === targetRoute);
  });

  closeMobileMenu();

  if (targetRoute === 'home') {
    startHeroSlider();
    if (typeof renderHomeBestSellers === 'function') renderHomeBestSellers();
    if (typeof renderParlourServicesList === 'function') renderParlourServicesList();
    if (typeof renderClientGallery === 'function') renderClientGallery();
  } else {
    pauseHeroSlider();
  }

  if (targetRoute === 'products') renderProductCatalog();
  if (targetRoute === 'testimonials') {
    if (typeof renderReviewsList === 'function') renderReviewsList();
    if (typeof renderClientGallery === 'function') renderClientGallery();
  }
  if (targetRoute === 'cart') renderCartPage();
  if (targetRoute === 'wishlist') renderWishlist();
  if (targetRoute === 'tracking') initOrderTracking();
  if (targetRoute === 'account') renderAccountPage();

  setTimeout(triggerScrollReveal, 100);
}

function navigateTo(route) {
  window.location.hash = `#${route}`;
}

/* ==================== HEADER & MOBILE MENU ==================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function toggleMobileMenu() {
  const menu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (!menu) return;

  const isActive = menu.classList.contains('active');
  menu.classList.toggle('active', !isActive);
  if (backdrop) backdrop.classList.toggle('active', !isActive);
}

function closeMobileMenu() {
  const menu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (menu) menu.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
}

/* ==================== BADGE COUNTERS ==================== */
function renderBadgeCounts() {
  const cartBadges = document.querySelectorAll('.cart-badge-count');
  const wishlistBadges = document.querySelectorAll('.wishlist-badge-count');

  const cartCount = store.getCartCount();
  const wishlistCount = store.getWishlist().length;

  cartBadges.forEach(b => {
    b.textContent = cartCount;
    b.style.display = cartCount > 0 ? 'flex' : 'none';
  });

  wishlistBadges.forEach(b => {
    b.textContent = wishlistCount;
    b.style.display = wishlistCount > 0 ? 'flex' : 'none';
  });
}

/* ==================== CART DRAWER & CART PAGE ==================== */
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    renderCartDrawer();
    drawer.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-items');
  const subtotalEl = document.getElementById('cart-drawer-subtotal');
  const discountEl = document.getElementById('cart-drawer-discount');
  const totalEl = document.getElementById('cart-drawer-total');
  const trackerFill = document.getElementById('cart-drawer-shipping-fill');
  const trackerText = document.getElementById('cart-drawer-shipping-text');

  if (!container) return;

  const cart = store.getCart();
  const subtotal = store.getCartSubtotal();
  const coupon = store.getCoupon();
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const freeShippingThreshold = 75;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  if (trackerFill) trackerFill.style.width = `${progress}%`;
  if (trackerText) {
    if (subtotal >= freeShippingThreshold) {
      trackerText.innerHTML = `🎉 <strong>Complimentary Express Delivery Unlocked!</strong>`;
    } else {
      const remaining = (freeShippingThreshold - subtotal).toFixed(2);
      trackerText.innerHTML = `Add <strong>$${remaining}</strong> more for Free Delivery`;
    }
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🛍️</div>
        <h4 style="margin-bottom: 0.5rem;">Your Shopping Bag is Empty</h4>
        <p class="text-muted" style="font-size: 0.88rem; margin-bottom: 1.5rem;">Treat yourself to our signature botanical skincare and fragrances.</p>
        <button class="btn btn-primary btn-sm" onclick="closeCartDrawer(); navigateTo('products');">Explore Catalog</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (discountEl) discountEl.textContent = '-$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="qty-stepper">
          <button class="qty-btn" onclick="store.updateCartQty('${item.id}', ${item.qty - 1})">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="store.updateCartQty('${item.id}', ${item.qty + 1})">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="store.removeFromCart('${item.id}')" title="Remove item">✕</button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function renderCartPage() {
  const container = document.getElementById('cart-page-items');
  const subtotalEl = document.getElementById('cart-page-subtotal');
  const discountEl = document.getElementById('cart-page-discount');
  const totalEl = document.getElementById('cart-page-total');
  const couponBadge = document.getElementById('cart-page-coupon-badge');

  if (!container) return;

  const cart = store.getCart();
  const subtotal = store.getCartSubtotal();
  const coupon = store.getCoupon();
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  if (couponBadge) {
    if (coupon) {
      couponBadge.innerHTML = `
        <span class="badge badge-gold">Coupon: ${coupon.code} (${coupon.discountPercent}% OFF)</span>
        <button onclick="store.removeCoupon()" style="font-size:0.75rem; color:var(--error); margin-left:6px;">Remove</button>
      `;
    } else {
      couponBadge.innerHTML = '';
    }
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Your Shopping Bag is Empty</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">Explore our curated selection of luxury parlour essentials.</p>
        <button class="btn btn-primary" onclick="navigateTo('products')">Explore Products</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (discountEl) discountEl.textContent = '-$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" style="padding: 1.25rem 0;">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" style="width: 90px; height: 90px;">
      <div class="cart-item-info">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.35rem;">${item.title}</h3>
        <div class="cart-item-price" style="font-size: 1.1rem;">$${item.price.toFixed(2)}</div>
        <div class="qty-stepper" style="margin-top: 0.5rem;">
          <button class="qty-btn" onclick="store.updateCartQty('${item.id}', ${item.qty - 1})">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="store.updateCartQty('${item.id}', ${item.qty + 1})">+</button>
        </div>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; justify-content: space-between;">
        <span style="font-size: 1.2rem; font-weight: 700;">$${(item.price * item.qty).toFixed(2)}</span>
        <button class="btn-outline btn-sm" onclick="store.removeFromCart('${item.id}')" style="align-self: flex-end;">Remove</button>
      </div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function handleApplyCoupon(inputId = 'cart-coupon-input') {
  const input = document.getElementById(inputId);
  if (!input) return;

  const res = store.applyCoupon(input.value);
  if (res.success) {
    showToast(`Promo Code Applied: ${res.coupon.desc}! ✨`, 'success');
    input.value = '';
  } else {
    showToast(res.message, 'error');
  }
}

/* ==================== WISHLIST VIEW ==================== */
function renderWishlist() {
  const container = document.getElementById('wishlist-grid');
  if (!container) return;

  const wishlistIds = store.getWishlist();
  const wishlistedProducts = BOUTIQUE_DATA.products.filter(p => wishlistIds.includes(p.id));

  if (wishlistedProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">♡</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Your Wishlist is Empty</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">Save your favorite beauty rituals and products to track them anytime.</p>
        <button class="btn btn-primary" onclick="navigateTo('products')">Discover Products</button>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlistedProducts.map(p => `
    <div class="product-card reveal">
      <div class="product-image-wrap">
        <img src="${p.image}" alt="${p.title}">
        <button class="wishlist-toggle-btn active" onclick="handleWishlistToggle('${p.id}', event)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.categoryName}</span>
        <h3 class="product-title">${p.title}</h3>
        <div class="product-price-wrap" style="margin-bottom: 1rem;">
          <span class="product-price">$${p.price.toFixed(2)}</span>
        </div>
        <button class="btn-card-add" onclick="handleAddToCart('${p.id}', 1, event)">
          ADD TO CART
        </button>
      </div>
    </div>
  `).join('');
  triggerScrollReveal();
}

function moveAllWishlistToCart() {
  const wishlistIds = store.getWishlist();
  if (wishlistIds.length === 0) {
    showToast('Your wishlist is empty.', 'info');
    return;
  }

  wishlistIds.forEach(id => {
    const p = BOUTIQUE_DATA.products.find(item => item.id === id);
    if (p) store.addToCart(p, 1);
  });

  store.saveWishlist([]);
  showToast('All wishlist items moved to your shopping bag! ✨', 'success');
  openCartDrawer();
}

/* ==================== CHECKOUT SYSTEM ==================== */
function openCheckoutModal() {
  const cart = store.getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty. Please add products before checking out.', 'warning');
    return;
  }

  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  const summaryEl = document.getElementById('checkout-summary-breakdown');

  const subtotal = store.getCartSubtotal();
  const coupon = store.getCoupon();
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
        ${cart.map(i => `
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
            <span>${i.qty}x ${i.title}</span>
            <strong>$${(i.price * i.qty).toFixed(2)}</strong>
          </div>
        `).join('')}
      </div>
      <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        ${discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; color: var(--success);">
            <span>Discount (${coupon.code}):</span>
            <span>-$${discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <span>Shipping:</span>
          <span style="color: var(--success);">Complimentary</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 700; border-top: 1px solid var(--border-light); padding-top: 0.5rem; margin-top: 0.5rem;">
          <span>Total:</span>
          <span style="color: var(--primary-gold-dark);">$${total.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const city = document.getElementById('checkout-city').value.trim();
  const zip = document.getElementById('checkout-zip').value.trim();

  if (!name || !email || !address || !city) {
    showToast('Please complete all required shipping fields.', 'error');
    return;
  }

  const subtotal = store.getCartSubtotal();
  const coupon = store.getCoupon();
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const newOrder = store.createOrder({
    customerName: name,
    email: email,
    address: address,
    city: city,
    zip: zip || '10001',
    items: store.getCart(),
    total: total
  });

  closeCheckoutModal();

  showToast(`Order Placed Successfully! Your Tracking ID is ${newOrder.id}`, 'success');
  navigateTo('tracking');
  
  const searchInput = document.getElementById('tracking-search-input');
  if (searchInput) searchInput.value = newOrder.id;
  renderOrderTrackingResult(newOrder.id);
}

/* ==================== TOAST NOTIFICATIONS ==================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ')}</span>
    <div style="flex: 1;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==================== PRIVACY POLICY & CONSENT ==================== */
function initPrivacyConsent() {
  const consent = localStorage.getItem('feinheit_privacy_consent');
  const banner = document.getElementById('privacy-consent-banner');
  if (!consent && banner) {
    setTimeout(() => {
      banner.classList.remove('hidden');
    }, 1200);
  }
}

function acceptPrivacyConsent() {
  localStorage.setItem('feinheit_privacy_consent', 'accepted');
  const banner = document.getElementById('privacy-consent-banner');
  if (banner) {
    banner.classList.add('hidden');
  }
  showToast('Privacy preferences saved. Thank you! 🌿', 'success');
}

function openPrivacyModal(tab = 'privacy') {
  const modal = document.getElementById('privacy-modal');
  if (!modal) return;

  switchPolicyTab(tab);
  modal.classList.add('active');
}

function closePrivacyModal() {
  const modal = document.getElementById('privacy-modal');
  if (modal) modal.classList.remove('active');
}

function switchPolicyTab(tab) {
  document.querySelectorAll('.policy-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-policy') === tab);
  });

  document.querySelectorAll('.policy-content-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `policy-${tab}`);
  });
}

/* ==================== AUTHENTICATION & MEMBER CONCIERGE ==================== */
function renderAuthStatus() {
  const user = store.getUser();
  const headerBtn = document.getElementById('header-account-btn');
  const mobileBtn = document.getElementById('mobile-account-btn');

  if (headerBtn) {
    if (user && user.isLoggedIn) {
      headerBtn.innerHTML = `
        <span style="display: flex; align-items: center; gap: 6px;">
          <img src="${user.avatar}" alt="${user.name}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--primary-gold);">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--dark-slate); max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.name.split(' ')[0]}</span>
        </span>
      `;
      headerBtn.setAttribute('title', `Logged in as ${user.name} (${user.tier})`);
    } else {
      headerBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `;
      headerBtn.setAttribute('title', 'Sign In / Register');
    }
  }

  if (mobileBtn) {
    if (user && user.isLoggedIn) {
      mobileBtn.innerHTML = `👑 ${user.name} (VIP)`;
    } else {
      mobileBtn.innerHTML = `👤 Sign In / Register`;
    }
  }
}

function renderAccountPage() {
  const container = document.getElementById('account-page-content');
  if (!container) return;

  const user = store.getUser();
  const orders = store.getOrders();
  const bookings = store.getBookings();

  if (user && user.isLoggedIn) {
    // Authenticated VIP Dashboard
    container.innerHTML = `
      <div class="product-card" style="padding: 2.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-md); margin-bottom: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 2rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <img src="${user.avatar}" alt="${user.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-gold); box-shadow: var(--shadow-md);">
            <div>
              <span class="badge badge-gold" style="margin-bottom: 0.35rem;">${user.tier || 'Gold VIP Member'}</span>
              <h2 style="font-size: 1.85rem; margin-bottom: 0.2rem;">Welcome, ${user.name}</h2>
              <span class="text-muted" style="font-size: 0.9rem;">${user.email} • Member since ${user.joinedDate}</span>
            </div>
          </div>
          <div>
            <button class="btn btn-outline btn-sm" onclick="handleLogout()">Sign Out</button>
          </div>
        </div>

        <!-- VIP Perks & Stats Overview -->
        <div class="grid-4" style="text-align: center; gap: 1rem; margin-bottom: 2.5rem;">
          <div style="background: var(--bg-alabaster); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <div style="font-size: 1.6rem; color: var(--primary-gold); font-weight: 700;">${user.parlourPoints || 450}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Beauty Reward Points</div>
          </div>
          <div style="background: var(--bg-alabaster); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <div style="font-size: 1.6rem; color: var(--primary-gold); font-weight: 700;">20% OFF</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">VIP Member Privilege</div>
          </div>
          <div style="background: var(--bg-alabaster); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <div style="font-size: 1.6rem; color: var(--primary-gold); font-weight: 700;">${bookings.length}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Parlour Bookings</div>
          </div>
          <div style="background: var(--bg-alabaster); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
            <div style="font-size: 1.6rem; color: var(--primary-gold); font-weight: 700;">${orders.length}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Boutique Orders</div>
          </div>
        </div>

        <!-- Dashboard Split: Active Bookings & Recent Orders -->
        <div class="grid-2" style="gap: 2rem;">
          <!-- Upcoming Appointments -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem;">Upcoming Parlour Rituals</h3>
              <button class="btn btn-primary btn-sm" onclick="navigateTo('booking')">+ Book Ritual</button>
            </div>
            ${bookings.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${bookings.map(b => `
                  <div style="background: var(--bg-alabaster); padding: 1.25rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary-gold);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                      <span>Voucher: <strong>${b.id}</strong></span>
                      <span class="badge badge-organic" style="font-size: 0.65rem;">${b.status}</span>
                    </div>
                    <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem;">${b.serviceName}</h4>
                    <p style="font-size: 0.88rem; color: var(--dark-slate); margin-bottom: 0.25rem;">
                      📅 <strong>${b.date}</strong> at ⏰ <strong>${b.time}</strong>
                    </p>
                    <span style="font-size: 0.8rem; color: var(--primary-gold-dark);">Specialist: ${b.stylist}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-muted" style="font-size: 0.9rem;">No upcoming appointments reserved yet.</p>
            `}
          </div>

          <!-- Order History -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem;">Recent Boutique Orders</h3>
              <button class="btn-outline btn-sm" onclick="navigateTo('products')">Shop Catalog</button>
            </div>
            ${orders.length > 0 ? `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${orders.slice(0, 3).map(o => `
                  <div style="background: var(--bg-alabaster); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <div>
                        <strong>Order #${o.id}</strong>
                        <span style="display: block; font-size: 0.78rem; color: var(--text-muted);">${o.date}</span>
                      </div>
                      <span class="badge badge-gold" style="font-size: 0.72rem;">${o.statusLabel || o.status}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.88rem;">
                      <span>Total: <strong>$${o.total.toFixed(2)}</strong></span>
                      <button class="btn btn-dark btn-sm" onclick="quickTrackSample('${o.id}'); navigateTo('tracking');" style="font-size: 0.75rem; padding: 0.25rem 0.75rem;">
                        Track Parcel 📦
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-muted" style="font-size: 0.9rem;">No orders placed yet.</p>
            `}
          </div>
        </div>
      </div>
    `;
  } else {
    // Unauthenticated: Render Sign In & Registration Tabs
    container.innerHTML = `
      <div class="product-card" style="max-width: 600px; margin: 0 auto; padding: 2.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);">
        
        <!-- Auth Tabs Switcher -->
        <div class="policy-tabs" style="justify-content: center; margin-bottom: 2rem;">
          <button class="policy-tab-btn active" id="auth-tab-btn-login" onclick="switchAuthTab('login')">
            Sign In to Account
          </button>
          <button class="policy-tab-btn" id="auth-tab-btn-register" onclick="switchAuthTab('register')">
            Join The Circle (New Visitor)
          </button>
        </div>

        <!-- 1. Sign In Form -->
        <div id="auth-section-login" style="display: block;">
          <form onsubmit="handleLoginSubmit(event)">
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" id="login-email-input" class="form-control" placeholder="charlotte@luxury.com" required style="height: 48px;">
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="form-label" style="margin-bottom: 0;">Password *</label>
                <a href="javascript:void(0)" onclick="showToast('Password reset link sent to your registered email! ✉️', 'info')" style="font-size: 0.78rem; color: var(--primary-gold-dark); text-decoration: underline;">
                  Forgot password?
                </a>
              </div>
              <input type="password" id="login-password-input" class="form-control" placeholder="••••••••" required style="height: 48px;">
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.88rem; color: var(--text-muted);">
              <input type="checkbox" id="login-remember-check" checked style="accent-color: var(--primary-gold);">
              <label for="login-remember-check" style="cursor: pointer;">Remember me on this luxury device</label>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg" style="margin-bottom: 1rem;">
              SIGN IN TO BOUTIQUE ACCOUNT
            </button>

            <!-- Quick Demo 1-Click Login -->
            <div style="background: var(--bg-alabaster); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed var(--primary-gold); text-align: center;">
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">
                ✨ Visiting for the first time? Try 1-Click VIP Demo:
              </span>
              <button type="button" class="btn btn-secondary btn-sm btn-full" onclick="quickDemoLogin()">
                One-Click VIP Guest Demo Login
              </button>
            </div>
          </form>
        </div>

        <!-- 2. New Visitor Registration Form -->
        <div id="auth-section-register" style="display: none;">
          <div style="background: var(--primary-gold-subtle); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; text-align: center; border: 1px solid var(--primary-gold-light);">
            <strong style="color: var(--primary-gold-dark); font-size: 0.92rem; display: block;">👑 Welcome Gift: 20% OFF Voucher</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Register your profile today to receive code <strong>FEINHEIT20</strong> applied automatically!</span>
          </div>

          <form onsubmit="handleRegisterSubmit(event)">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" id="reg-name-input" class="form-control" placeholder="Lady Charlotte Montgomery" required style="height: 48px;">
            </div>

            <div class="grid-2" style="gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" id="reg-email-input" class="form-control" placeholder="charlotte@luxury.com" required style="height: 48px;">
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Phone (for SMS Alerts)</label>
                <input type="tel" id="reg-phone-input" class="form-control" placeholder="+1 (555) 019-2831" style="height: 48px;">
              </div>
            </div>

            <div class="grid-2" style="gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Create Password *</label>
                <input type="password" id="reg-password-input" class="form-control" placeholder="Minimum 6 characters" required style="height: 48px;">
              </div>
              <div class="form-group">
                <label class="form-label">Skin Profile / Goal</label>
                <select id="reg-skin-select" class="form-control" style="height: 48px;">
                  <option value="Radiant Glow & Anti-Aging">Radiant Glow & Anti-Aging</option>
                  <option value="Sensitive & Calming Hydration">Sensitive & Calming Hydration</option>
                  <option value="Hair Couture & Balayage Care">Hair Couture & Balayage Care</option>
                  <option value="VIP Bridal Preparation">VIP Bridal Preparation</option>
                </select>
              </div>
            </div>

            <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: var(--text-muted);">
              <input type="checkbox" id="reg-terms-check" required style="margin-top: 3px; accent-color: var(--primary-gold);">
              <label for="reg-terms-check">
                I agree to the <a href="javascript:void(0)" onclick="openPrivacyModal('privacy')" style="color: var(--primary-gold-dark); text-decoration: underline;">Privacy Policy</a> & <a href="javascript:void(0)" onclick="openPrivacyModal('terms')" style="color: var(--primary-gold-dark); text-decoration: underline;">Terms of Service</a>.
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">
              CREATE VIP BOUTIQUE ACCOUNT ✨
            </button>
          </form>
        </div>

      </div>
    `;
  }
}

function switchAuthTab(tab) {
  const loginBtn = document.getElementById('auth-tab-btn-login');
  const registerBtn = document.getElementById('auth-tab-btn-register');
  const loginSec = document.getElementById('auth-section-login');
  const regSec = document.getElementById('auth-section-register');

  if (tab === 'login') {
    if (loginBtn) loginBtn.classList.add('active');
    if (registerBtn) registerBtn.classList.remove('active');
    if (loginSec) loginSec.style.display = 'block';
    if (regSec) regSec.style.display = 'none';
  } else {
    if (loginBtn) loginBtn.classList.remove('active');
    if (registerBtn) registerBtn.classList.add('active');
    if (loginSec) loginSec.style.display = 'none';
    if (regSec) regSec.style.display = 'block';
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById('login-email-input');
  const email = emailInput ? emailInput.value : 'charlotte@luxury.com';

  store.login(email);
  showToast(`Welcome back, ${email.split('@')[0]}! VIP perks active. ✨`, 'success');
  renderAuthStatus();
  renderAccountPage();
  closeLoginModal();
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name-input')?.value || 'Lady Charlotte';
  const email = document.getElementById('reg-email-input')?.value || 'charlotte@luxury.com';
  const phone = document.getElementById('reg-phone-input')?.value || '';
  const skinType = document.getElementById('reg-skin-select')?.value || '';

  store.register({ name, email, phone, skinType });
  showToast(`Welcome to The Fein Heit Circle, ${name}! 20% OFF Code FEINHEIT20 applied to your bag. 🎁`, 'success');
  renderAuthStatus();
  renderAccountPage();
  closeLoginModal();
}

function quickDemoLogin() {
  store.login('lady.charlotte@luxury.com');
  showToast('Logged in as Lady Charlotte Montgomery (VIP Member) ✨', 'success');
  renderAuthStatus();
  renderAccountPage();
  closeLoginModal();
}

function handleLogout() {
  store.logout();
  showToast('You have signed out of your boutique session.', 'info');
  renderAuthStatus();
  renderAccountPage();
}

function openLoginModal(tab = 'login') {
  const user = store.getUser();
  if (user && user.isLoggedIn) {
    navigateTo('account');
    return;
  }
  const modal = document.getElementById('login-modal');
  if (modal) {
    switchModalAuthTab(tab);
    modal.classList.add('active');
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('active');
}

function switchModalAuthTab(tab) {
  const loginBtn = document.getElementById('modal-tab-login');
  const registerBtn = document.getElementById('modal-tab-register');
  const loginSec = document.getElementById('modal-auth-login');
  const regSec = document.getElementById('modal-auth-register');

  if (tab === 'login') {
    if (loginBtn) loginBtn.classList.add('active');
    if (registerBtn) registerBtn.classList.remove('active');
    if (loginSec) loginSec.style.display = 'block';
    if (regSec) regSec.style.display = 'none';
  } else {
    if (loginBtn) loginBtn.classList.remove('active');
    if (registerBtn) registerBtn.classList.add('active');
    if (loginSec) loginSec.style.display = 'none';
    if (regSec) regSec.style.display = 'block';
  }
}


