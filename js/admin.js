/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - OWNER PRODUCT ADMIN
   ========================================================================== */

function renderAdminPage() {
  const container = document.getElementById('admin-page-content');
  if (!container) return;

  const products = getCatalogProducts();
  container.innerHTML = `
    <div class="admin-toolbar">
      <div>
        <span class="section-subtitle">Owner Workspace</span>
        <h2 class="section-title">PRODUCT MANAGEMENT</h2>
        <p class="section-desc">Add products and keep catalog prices current. Changes are saved in this browser.</p>
      </div>
      <button class="btn btn-primary" type="button" onclick="toggleAdminProductForm()"><span aria-hidden="true">+</span> Add Product</button>
    </div>
    <form id="admin-product-form" class="admin-product-form" onsubmit="handleAdminProductSubmit(event)" hidden>
      <div class="admin-form-heading"><h3 id="admin-form-title">Add a product</h3><button class="admin-close-btn" type="button" onclick="closeAdminEditor()" aria-label="Close product form">&times;</button></div>
      <input type="hidden" id="admin-product-id">
      <div class="admin-form-grid">
        <label>Product name<input id="admin-product-title" class="form-control" required></label>
        <label>Category<select id="admin-product-category" class="form-control" required><option value="skincare">Skincare</option><option value="haircare">Hair Care</option><option value="fragrance">Fragrance</option><option value="cosmetics">Cosmetics</option><option value="body">Body & Spa</option></select></label>
        <label>Price (INR)<input id="admin-product-price" class="form-control" type="number" min="0" step="1" required></label>
        <label>Old price (optional)<input id="admin-product-old-price" class="form-control" type="number" min="0" step="1"></label>
        <label class="admin-form-wide">Image URL or project path<input id="admin-product-image" class="form-control" placeholder="images/product.jpg" required></label>
        <label class="admin-form-wide">Description<textarea id="admin-product-description" class="form-control" rows="3" required></textarea></label>
      </div>
      <div class="admin-form-actions"><button class="btn btn-primary" type="submit">Save Product</button><button class="btn btn-outline" type="button" onclick="closeAdminEditor()">Cancel</button></div>
    </form>
    <div class="admin-product-list">
      <div class="admin-list-heading"><h3>Catalog Products</h3><span>${products.length} products</span></div>
      ${products.length ? products.map(createAdminProductRow).join('') : '<p class="text-muted">No products yet. Add your first product above.</p>'}
    </div>
  `;
}

function createAdminProductRow(product) {
  return `
    <article class="admin-product-row" data-admin-product-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" class="admin-product-thumb">
      <div class="admin-product-details"><strong>${product.title}</strong><span>${product.categoryName || product.category}</span></div>
      <label class="admin-price-field">Price (INR)<input class="form-control" type="number" min="0" step="1" value="${product.price}" onchange="updateAdminProductPrice('${product.id}', this.value)"></label>
      <button class="btn btn-outline btn-sm" type="button" onclick="editAdminProduct('${product.id}')">Edit</button>
      <button class="admin-delete-btn" type="button" onclick="deleteAdminProduct('${product.id}')" aria-label="Delete ${product.title}">Delete</button>
    </article>
  `;
}

function toggleAdminProductForm(product) {
  const form = document.getElementById('admin-product-form');
  if (!form) return;
  form.hidden = false;
  document.getElementById('admin-form-title').textContent = product ? 'Edit product' : 'Add a product';
  document.getElementById('admin-product-id').value = product?.id || '';
  document.getElementById('admin-product-title').value = product?.title || '';
  document.getElementById('admin-product-category').value = product?.category || 'skincare';
  document.getElementById('admin-product-price').value = product?.price || '';
  document.getElementById('admin-product-old-price').value = product?.oldPrice || '';
  document.getElementById('admin-product-image').value = product?.image || '';
  document.getElementById('admin-product-description').value = product?.description || '';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeAdminEditor() {
  const form = document.getElementById('admin-product-form');
  if (form) form.hidden = true;
}

function handleAdminProductSubmit(event) {
  event.preventDefault();
  const id = document.getElementById('admin-product-id').value;
  const products = getCatalogProducts();
  const category = document.getElementById('admin-product-category').value;
  const categoryNames = { skincare: 'Organic Skincare', haircare: 'Hair Care', fragrance: 'Fragrance', cosmetics: 'Cosmetics', body: 'Body & Spa' };
  const product = {
    id: id || `prod-${Date.now()}`,
    title: document.getElementById('admin-product-title').value.trim(),
    category,
    categoryName: categoryNames[category],
    price: Number(document.getElementById('admin-product-price').value),
    oldPrice: Number(document.getElementById('admin-product-old-price').value) || null,
    rating: 5,
    reviewsCount: 0,
    badge: 'New',
    badgeType: 'gold',
    image: document.getElementById('admin-product-image').value.trim(),
    inStock: true,
    description: document.getElementById('admin-product-description').value.trim(),
    ingredients: 'Selected by The Fein Heit boutique.',
    howToUse: 'Use as directed in your daily beauty ritual.'
  };

  const existingIndex = products.findIndex(item => item.id === id);
  if (existingIndex >= 0) products[existingIndex] = { ...products[existingIndex], ...product };
  else products.unshift(product);
  store.saveProducts(products);
  closeAdminEditor();
  showToast(id ? 'Product updated successfully.' : 'Product added to the catalog.', 'success');
}

function updateAdminProductPrice(productId, value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price < 0) return;
  const products = getCatalogProducts();
  const product = products.find(item => item.id === productId);
  if (!product) return;
  product.price = price;
  store.saveProducts(products);
  showToast('Product price updated.', 'success');
}

function editAdminProduct(productId) {
  const product = getCatalogProducts().find(item => item.id === productId);
  if (product) toggleAdminProductForm(product);
}

function deleteAdminProduct(productId) {
  const product = getCatalogProducts().find(item => item.id === productId);
  if (!product || !window.confirm(`Delete ${product.title} from the catalog?`)) return;
  store.saveProducts(getCatalogProducts().filter(item => item.id !== productId));
  showToast('Product removed from the catalog.', 'info');
}
