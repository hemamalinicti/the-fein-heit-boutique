/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - ORDER TRACKING ENGINE
   ========================================================================== */

function initOrderTracking() {
  const input = document.getElementById('tracking-search-input');
  if (input) {
    // Default search with the first demo order for instant visual fidelity
    const defaultOrder = store.getOrders()[0];
    if (defaultOrder && !input.value) {
      input.value = defaultOrder.id;
      renderOrderTrackingResult(defaultOrder.id);
    }
  }
}

function handleTrackingSearch(event) {
  if (event) event.preventDefault();
  const input = document.getElementById('tracking-search-input');
  if (!input) return;

  const orderId = input.value.trim();
  if (!orderId) {
    showToast('Please enter your Order Tracking ID (e.g., FH-89241)', 'warning');
    return;
  }

  renderOrderTrackingResult(orderId);
}

function quickTrackSample(orderId) {
  const input = document.getElementById('tracking-search-input');
  if (input) input.value = orderId;
  renderOrderTrackingResult(orderId);
}

function renderOrderTrackingResult(orderId) {
  const container = document.getElementById('tracking-result-container');
  if (!container) return;

  const order = store.getOrderById(orderId);

  if (!order) {
    container.innerHTML = `
      <div class="tracking-card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Order Not Found</h3>
        <p class="text-muted" style="margin-bottom: 1.5rem;">We could not locate an order matching ID "<strong>${orderId}</strong>". Please verify your tracking code from your receipt email.</p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <span style="font-size: 0.85rem; color: var(--text-muted); align-self: center;">Try sample orders:</span>
          <button class="btn btn-outline btn-sm" onclick="quickTrackSample('FH-89241')">Track FH-89241</button>
          <button class="btn btn-outline btn-sm" onclick="quickTrackSample('FH-10492')">Track FH-10492</button>
        </div>
      </div>
    `;
    return;
  }

  // Calculate timeline progress width percentage
  const totalSteps = order.timeline.length;
  let activeIndex = 0;
  order.timeline.forEach((step, idx) => {
    if (step.completed || step.current) activeIndex = idx;
  });
  const progressPercent = totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 0;

  container.innerHTML = `
    <div class="tracking-card animate-fade-in">
      <div class="tracking-header">
        <div>
          <span class="badge badge-gold" style="margin-bottom: 0.5rem;">${order.statusLabel}</span>
          <h2 style="font-size: 1.75rem;">Tracking Order ${order.id}</h2>
          <p class="text-muted" style="font-size: 0.88rem; margin-top: 0.25rem;">
            Placed on ${order.date} • Carrier: <strong>${order.carrier}</strong>
          </p>
        </div>
        <div style="text-align: right;">
          <span class="text-muted" style="font-size: 0.85rem;">Estimated Delivery:</span>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--primary-gold-dark);">
            ${order.estimatedDelivery}
          </div>
        </div>
      </div>

      <!-- Interactive Status Progress Bar -->
      <div class="tracking-timeline">
        <div class="timeline-progress-line" style="width: ${progressPercent}%;"></div>
        ${order.timeline.map((step, idx) => {
          const isCompleted = step.completed;
          const isCurrent = step.current;
          const statusClass = isCurrent ? 'current' : (isCompleted ? 'completed' : '');
          const icon = isCompleted && !isCurrent ? '✓' : (idx + 1);

          return `
            <div class="timeline-step ${statusClass}">
              <div class="step-icon">${icon}</div>
              <div class="step-title">${step.title}</div>
              <div class="step-time">${step.time}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Shipping & Item Details Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; background: var(--bg-alabaster); padding: 1.75rem; border-radius: var(--radius-md); margin-top: 2rem;">
        <div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--dark-slate);">Shipping Details</h4>
          <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>Recipient:</strong> ${order.customerName}</p>
          <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>Destination:</strong> ${order.shippingAddress}</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.75rem;">
            🛡 Includes temperature-controlled cosmetic packaging & signature on arrival.
          </p>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--dark-slate);">Order Breakdown</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                <span>${item.qty}x ${item.title}</span>
                <strong>${formatCurrency(item.price * item.qty)}</strong>
              </div>
            `).join('')}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; border-top: 1px solid var(--border-light); padding-top: 0.75rem;">
            <span>Total Paid:</span>
            <span style="color: var(--primary-gold-dark);">${formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
