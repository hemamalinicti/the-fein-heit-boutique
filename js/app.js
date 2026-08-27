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
}

/* ==================== HERO GLIDING SLIDER ENGINE ==================== */
function initHeroSlider() {
  const container = document.getElementById('hero-slides-wrapper');
  const dotsContainer = document.getElementById('hero-slider-dots');
  if (!container || !BOUTIQUE_DATA.heroSlides) return;

  // Render Slides
  container.innerHTML = BOUTIQUE_DATA.heroSlides.map((slide, idx) => `
    <div class="hero-slide ${idx === 0 ? 'active' : ''}" id="hero-slide-${idx}">
      <img src="${slide.image}" alt="${slide.title}" class="hero-slide-bg" loading="${idx === 0 ? 'eager' : 'lazy'}">
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
  const validRoutes = ['home', 'about', 'collections', 'products', 'testimonials', 'contact', 'cart', 'wishlist', 'tracking', 'booking'];
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
  } else {
    pauseHeroSlider();
  }

  if (targetRoute === 'products') renderProductCatalog();
  if (targetRoute === 'cart') renderCartPage();
  if (targetRoute === 'wishlist') renderWishlist();
  if (targetRoute === 'tracking') initOrderTracking();

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
