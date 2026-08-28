/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - PARLOUR APPOINTMENT BOOKING ENGINE
   ========================================================================== */

let selectedBooking = {
  serviceId: 'srv-01',
  stylistId: 'sty-01',
  date: '',
  time: '11:30 AM',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  specialNotes: ''
};

function initBookingForm() {
  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split('T')[0];
  
  const dateInput = document.getElementById('booking-date-input');
  if (dateInput) {
    dateInput.min = formattedDate;
    dateInput.value = formattedDate;
    selectedBooking.date = formattedDate;
  }

  renderServiceOptions();
  renderStylistOptions();
  renderTimeSlots();
  renderParlourServicesList();
  renderStylistsList();
}

function renderServiceOptions() {
  const select = document.getElementById('booking-service-select');
  if (!select) return;

  select.innerHTML = BOUTIQUE_DATA.services.map(s => `
    <option value="${s.id}" ${s.id === selectedBooking.serviceId ? 'selected' : ''}>
      ${s.title} (${s.duration}) - $${s.price.toFixed(2)}
    </option>
  `).join('');
}

function renderStylistOptions() {
  const select = document.getElementById('booking-stylist-select');
  if (!select) return;

  select.innerHTML = `
    <option value="any">First Available Master Esthetician</option>
    ${BOUTIQUE_DATA.stylists.map(st => `
      <option value="${st.id}" ${st.id === selectedBooking.stylistId ? 'selected' : ''}>
        ${st.name} - ${st.role}
      </option>
    `).join('')}
  `;
}

function renderTimeSlots() {
  const container = document.getElementById('booking-time-slots');
  if (!container) return;

  const slots = [
    '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'
  ];

  container.innerHTML = slots.map(slot => `
    <button type="button" class="filter-chip ${slot === selectedBooking.time ? 'active' : ''}" 
            onclick="selectBookingTime('${slot}', this)" style="text-align: center;">
      ${slot}
    </button>
  `).join('');
}

function selectBookingTime(time, el) {
  selectedBooking.time = time;
  document.querySelectorAll('#booking-time-slots .filter-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

/* Render Parlour Services Showcase Cards on Services / Home */
function renderParlourServicesList() {
  const homeContainer = document.getElementById('home-services-grid');
  const aboutServicesContainer = document.getElementById('about-services-grid');

  const createServiceCardHtml = (srv) => `
    <div class="service-card reveal">
      <div class="service-image-wrap" style="position: relative; overflow: hidden; height: 230px;">
        <img src="${srv.image}" alt="${srv.title}" class="service-image" loading="lazy">
        <span style="position: absolute; top: 12px; left: 12px; background: rgba(23,21,20,0.85); backdrop-filter: blur(6px); color: #dfc2ad; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid rgba(197,155,125,0.4); text-transform: uppercase;">
          ${srv.category}
        </span>
        <span style="position: absolute; bottom: 12px; right: 12px; background: rgba(255,255,255,0.94); backdrop-filter: blur(4px); color: var(--dark-slate); font-size: 0.78rem; font-weight: 600; padding: 3px 10px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm);">
          ⏱ ${srv.duration}
        </span>
      </div>
      <div class="service-content">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h3 class="service-title" style="margin-bottom: 0; font-size: 1.25rem;">${srv.title}</h3>
          <span class="service-price" style="font-size: 1.25rem; font-weight: 700; color: var(--primary-gold-dark); white-space: nowrap;">$${srv.price.toFixed(2)}</span>
        </div>
        <p class="service-desc" style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1.1rem;">${srv.description}</p>
        
        <div style="margin-bottom: 1.4rem; flex: 1;">
          <ul style="font-size: 0.82rem; color: var(--dark-muted); display: flex; flex-direction: column; gap: 5px;">
            ${srv.includes.map(inc => `<li style="display:flex; align-items:center; gap:8px;"><span style="color:var(--primary-gold); font-weight: 700;">✓</span> ${inc}</li>`).join('')}
          </ul>
        </div>

        <div class="service-footer" style="border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <button class="btn btn-primary btn-sm btn-full" onclick="openBookingWithService('${srv.id}')">
            Book Ritual ✨
          </button>
        </div>
      </div>
    </div>
  `;

  if (homeContainer && BOUTIQUE_DATA.services) {
    homeContainer.innerHTML = BOUTIQUE_DATA.services.slice(0, 3).map(createServiceCardHtml).join('');
  }
  if (aboutServicesContainer && BOUTIQUE_DATA.services) {
    aboutServicesContainer.innerHTML = BOUTIQUE_DATA.services.map(createServiceCardHtml).join('');
  }
}

/* Render Stylists Profiles */
function renderStylistsList() {
  const container = document.getElementById('stylists-grid');
  if (!container) return;

  container.innerHTML = BOUTIQUE_DATA.stylists.map(st => `
    <div class="product-card" style="text-align: center;">
      <div class="product-image-wrap" style="padding-top: 100%;">
        <img src="${st.image}" alt="${st.name}" loading="lazy">
      </div>
      <div class="product-info" style="align-items: center;">
        <span class="product-category">${st.experience}</span>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem;">${st.name}</h3>
        <p style="color: var(--primary-gold-dark); font-weight: 600; font-size: 0.85rem; margin-bottom: 0.75rem;">${st.role}</p>
        <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 1.25rem;">${st.specialty}</p>
        <button class="btn btn-outline btn-sm btn-full" onclick="openBookingWithStylist('${st.id}')">
          Book with ${st.name.split(' ')[0]}
        </button>
      </div>
    </div>
  `).join('');
}

function openBookingWithService(serviceId) {
  selectedBooking.serviceId = serviceId;
  const select = document.getElementById('booking-service-select');
  if (select) select.value = serviceId;
  navigateTo('booking');
}

function openBookingWithStylist(stylistId) {
  selectedBooking.stylistId = stylistId;
  const select = document.getElementById('booking-stylist-select');
  if (select) select.value = stylistId;
  navigateTo('booking');
}

/* Submit Appointment Booking Form */
function handleBookingSubmit(event) {
  event.preventDefault();

  const serviceSelect = document.getElementById('booking-service-select');
  const stylistSelect = document.getElementById('booking-stylist-select');
  const dateInput = document.getElementById('booking-date-input');
  const nameInput = document.getElementById('booking-name-input');
  const emailInput = document.getElementById('booking-email-input');
  const phoneInput = document.getElementById('booking-phone-input');
  const notesInput = document.getElementById('booking-notes-input');

  if (!nameInput.value || !phoneInput.value || !dateInput.value) {
    showToast('Please fill in your name, phone number, and preferred date.', 'error');
    return;
  }

  const selectedSrv = BOUTIQUE_DATA.services.find(s => s.id === serviceSelect.value) || BOUTIQUE_DATA.services[0];
  const selectedSty = BOUTIQUE_DATA.stylists.find(st => st.id === stylistSelect.value) || { name: 'First Available Master Esthetician' };

  const newBooking = store.createBooking({
    serviceId: selectedSrv.id,
    serviceName: selectedSrv.title,
    servicePrice: selectedSrv.price,
    stylist: selectedSty.name,
    date: dateInput.value,
    time: selectedBooking.time,
    clientName: nameInput.value.trim(),
    clientEmail: emailInput.value.trim(),
    clientPhone: phoneInput.value.trim(),
    specialNotes: notesInput ? notesInput.value.trim() : ''
  });

  // Display Confirmation Ticket Modal
  displayBookingConfirmation(newBooking);
  showToast('Your parlour appointment has been confirmed! ✨', 'success');

  // Reset form
  nameInput.value = '';
  phoneInput.value = '';
  if (notesInput) notesInput.value = '';
}

function displayBookingConfirmation(booking) {
  const modal = document.getElementById('booking-confirmation-modal');
  const content = document.getElementById('booking-confirmation-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="text-align: center; padding: 1rem 0;">
      <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-gold-subtle); color: var(--primary-gold-dark); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.25rem;">
        ✓
      </div>
      <span class="badge badge-gold" style="margin-bottom: 0.5rem;">Booking Confirmed</span>
      <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">We Look Forward to Pampering You</h2>
      <p class="text-muted" style="margin-bottom: 1.5rem; font-size: 0.95rem;">
        Your digital booking voucher has been issued. A confirmation message was sent to your phone.
      </p>

      <div style="background: var(--bg-alabaster); border: 1px dashed var(--primary-gold); border-radius: var(--radius-md); padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">Booking Reference</span>
          <strong style="color: var(--primary-gold-dark); letter-spacing: 0.05em;">${booking.id}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
          <span class="text-muted">Ritual:</span>
          <strong>${booking.serviceName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
          <span class="text-muted">Specialist:</span>
          <span>${booking.stylist}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
          <span class="text-muted">Date & Time:</span>
          <span>${booking.date} at ${booking.time}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
          <span class="text-muted">Guest:</span>
          <span>${booking.clientName} (${booking.clientPhone})</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding-top: 0.5rem; border-top: 1px solid var(--border-light);">
          <span class="text-muted">Boutique Location:</span>
          <span>142 Haute Blvd, Suite 500</span>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-primary" onclick="closeBookingModal(); navigateTo('home');">
          Back to Boutique Home
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('booking-confirmation-modal');
  if (modal) modal.classList.remove('active');
}
