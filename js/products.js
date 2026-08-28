/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - PRODUCTS & COLLECTIONS ENGINE
   ========================================================================== */

let currentFilters = {
  search: '',
  category: 'all',
  maxPrice: 6000,
  minRating: 0,
  sortBy: 'featured'
};

/* Render Star Icons Helper */
function renderStars(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHtml += `<svg viewBox="0 0 20 20" fill="#d4af37"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    } else {
      starsHtml += `<svg viewBox="0 0 20 20" fill="#e5e7eb"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    }
  }
  return starsHtml;
}

/* Render a Single Product Card HTML (Matches Exact Design Mockup) */
function createProductCardHtml(product) {
  const isWishlisted = store.isInWishlist(product.id);
  const badgeClass = product.badgeType === 'sale' ? 'badge-sale' : (product.badgeType === 'organic' ? 'badge-organic' : 'badge-gold');

  return `
    <div class="product-card reveal" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.title}" loading="lazy" onclick="openProductQuickView('${product.id}')" style="cursor: pointer;">
        ${product.badge ? `<div class="product-badges"><span class="badge ${badgeClass}">${product.badge}</span></div>` : ''}
        
        <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" 
                onclick="handleWishlistToggle('${product.id}', event)" 
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="product-info">
        <h3 class="product-title" onclick="openProductQuickView('${product.id}')" style="cursor:pointer">${product.title}</h3>
        
        <div class="product-price-wrap">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <div class="product-rating" style="margin-bottom:0; margin-left:auto;">
            <span class="star-rating">${renderStars(product.rating)}</span>
            <span style="font-weight:600; color:var(--dark-slate); font-size:0.85rem;">★ ${product.rating.toFixed(1)}</span>
          </div>
        </div>

        <button class="btn-card-add" onclick="handleAddToCart('${product.id}', 1, event)">
          ADD TO CART
        </button>
      </div>
    </div>
  `;
}

/* Filter and Sort Products */
function getFilteredProducts() {
  return BOUTIQUE_DATA.products.filter(item => {
    // Search Filter
    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.categoryName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // Category Filter
    if (currentFilters.category !== 'all' && item.category !== currentFilters.category) {
      return false;
    }

    // Price Filter
    if (item.price > currentFilters.maxPrice) {
      return false;
    }

    // Rating Filter
    if (currentFilters.minRating > 0 && item.rating < currentFilters.minRating) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (currentFilters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'featured':
      default:
        return b.reviewsCount - a.reviewsCount;
    }
  });
}

/* Render Catalog Grid */
function renderProductCatalog() {
  const container = document.getElementById('products-grid');
  const countBadge = document.getElementById('products-count-badge');
  if (!container) return;

  const filtered = getFilteredProducts();

  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} products`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">No products match your criteria</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">Try adjusting your price range, clearing your search or switching categories.</p>
        <button class="btn btn-outline" onclick="resetProductFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(createProductCardHtml).join('');
  triggerScrollReveal();
}

/* Render Home Page Best Sellers */
function renderHomeBestSellers() {
  const container = document.getElementById('home-bestsellers-grid');
  if (!container) return;

  const bestSellers = BOUTIQUE_DATA.products.slice(0, 4);
  container.innerHTML = bestSellers.map(createProductCardHtml).join('');
  triggerScrollReveal();
}

/* Render Collections Page Cards */
function renderCollections() {
  const container = document.getElementById('collections-grid');
  if (!container) return;

  container.innerHTML = BOUTIQUE_DATA.collections.map((col, idx) => `
    <div class="collection-card reveal reveal-delay-${(idx % 3) + 1}" onclick="selectCollectionCategory('${col.categoryFilter}')">
      <img src="${col.image}" alt="${col.title}" loading="lazy">
      <div class="collection-overlay">
        <span class="collection-subtitle">${col.subtitle}</span>
        <h3 class="collection-title">${col.title}</h3>
        <p style="font-size: 0.88rem; opacity: 0.9; margin-bottom: 0.5rem;">${col.description}</p>
        <div class="collection-link">
          Explore Products (${col.itemCount})
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  `).join('');
  triggerScrollReveal();
}

/* Navigate from Collection Card directly to Products filtered */
function selectCollectionCategory(category) {
  currentFilters.category = category;
  
  document.querySelectorAll('#category-filters .filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.category === category);
  });

  navigateTo('products');
  renderProductCatalog();
}

/* Quick View Modal */
function openProductQuickView(productId) {
  const product = BOUTIQUE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-quickview-modal');
  const body = document.getElementById('quickview-modal-body');
  if (!modal || !body) return;

  const isWishlisted = store.isInWishlist(product.id);

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: start;">
      <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-alabaster);">
        <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 380px; object-fit: cover;">
      </div>
      <div>
        <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${product.categoryName}</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">${product.title}</h2>
        
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          <span class="star-rating">${renderStars(product.rating)}</span>
          <span class="text-muted" style="font-size: 0.85rem;">(${product.reviewsCount} customer reviews)</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 1.25rem;">
          <span style="font-size: 1.6rem; font-weight: 700; color: var(--dark-slate);">${formatCurrency(product.price)}</span>
          ${product.oldPrice ? `<span style="font-size: 1.1rem; color: var(--text-muted); text-decoration: line-through;">${formatCurrency(product.oldPrice)}</span>` : ''}
          <span class="badge badge-organic" style="margin-left: auto;">In Stock</span>
        </div>

        <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
          ${product.description}
        </p>

        <div style="background: var(--bg-alabaster); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-size: 0.85rem;">
          <strong>Key Ingredients:</strong> <span class="text-muted">${product.ingredients}</span><br><br>
          <strong>Ritual & Usage:</strong> <span class="text-muted">${product.howToUse}</span>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem;">
          <div class="qty-stepper" style="height: 44px;">
            <button class="qty-btn" onclick="adjustQuickViewQty(-1)">-</button>
            <span class="qty-val" id="quickview-qty">1</span>
            <button class="qty-btn" onclick="adjustQuickViewQty(1)">+</button>
          </div>
          <button class="btn btn-primary" style="flex: 1; height: 44px;" onclick="handleAddToCart('${product.id}', getQuickViewQty()); closeQuickViewModal();">
            Add to Cart • ${formatCurrency(product.price)}
          </button>
        </div>

        <button class="btn btn-outline btn-full" onclick="handleWishlistToggle('${product.id}'); updateQuickViewWishlistBtn('${product.id}');" id="quickview-wishlist-btn">
          ${isWishlisted ? '♥ Saved in Wishlist' : '♡ Add to Wishlist'}
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function getQuickViewQty() {
  const el = document.getElementById('quickview-qty');
  return el ? parseInt(el.textContent) || 1 : 1;
}

function adjustQuickViewQty(delta) {
  const el = document.getElementById('quickview-qty');
  if (!el) return;
  let current = parseInt(el.textContent) || 1;
  current = Math.max(1, current + delta);
  el.textContent = current;
}

function updateQuickViewWishlistBtn(productId) {
  const btn = document.getElementById('quickview-wishlist-btn');
  if (!btn) return;
  const isWishlisted = store.isInWishlist(productId);
  btn.innerHTML = isWishlisted ? '♥ Saved in Wishlist' : '♡ Add to Wishlist';
}

function closeQuickViewModal() {
  const modal = document.getElementById('product-quickview-modal');
  if (modal) modal.classList.remove('active');
}

/* Event Handlers */
function handleAddToCart(productId, qty = 1, event) {
  if (event) event.stopPropagation();
  const product = BOUTIQUE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  store.addToCart(product, qty);
  showToast(`Added "${product.title}" to your shopping bag! ✨`, 'success');
}

function handleWishlistToggle(productId, event) {
  if (event) event.stopPropagation();
  const product = BOUTIQUE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const isAdded = store.toggleWishlist(productId);
  showToast(isAdded ? `Saved "${product.title}" to your wishlist!` : `Removed from wishlist`, 'info');

  renderProductCatalog();
  renderHomeBestSellers();
  renderWishlist();
}

function resetProductFilters() {
  currentFilters = {
    search: '',
    category: 'all',
    maxPrice: 6000,
    minRating: 0,
    sortBy: 'featured'
  };

  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';

  const priceSlider = document.getElementById('price-range-slider');
  const priceVal = document.getElementById('price-slider-value');
  if (priceSlider) priceSlider.value = 6000;
  if (priceVal) priceVal.textContent = formatCurrency(6000);

  const sortSelect = document.getElementById('product-sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('#category-filters .filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.category === 'all');
  });

  renderProductCatalog();
}
