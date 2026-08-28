/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - LOCALSTORAGE STATE STORE
   ========================================================================== */

const STORAGE_KEYS = {
  CART: 'feinheit_cart_v2',
  WISHLIST: 'feinheit_wishlist_v1',
  ORDERS: 'feinheit_orders_v2',
  BOOKINGS: 'feinheit_bookings_v2',
  REVIEWS: 'feinheit_reviews_v4',
  COUPON: 'feinheit_coupon_v1',
  USER: 'feinheit_user_v1'
};

class BoutiqueStore {
  constructor() {
    this.init();
  }

  init() {
    // Initialize Cart
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      // Seed with 1 welcome sample product for instant delight
      const initialCart = [
        {
          id: 'prod-01',
          title: 'Radiant Lumière Vitamin C Glow Serum',
          price: 2499,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
          qty: 1
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(initialCart));
    }

    // Initialize Wishlist
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(['prod-03']));
    }

    // Initialize Orders
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(BOUTIQUE_DATA.demoOrders));
    }

    // Initialize Bookings
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      const initialBooking = [
        {
          id: 'BK-78219',
          serviceName: 'The Fein Heit Royal HydraFacial',
          stylist: 'Dr. Ananya Mehta',
          date: '2026-09-02',
          time: '11:30 AM',
          clientName: 'Aaradhya Rao',
          clientPhone: '+91 98765 43210',
          status: 'Confirmed'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBooking));
    }

    // Initialize Reviews
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(BOUTIQUE_DATA.reviews));
    }
  }

  /* ================== CART METHODS ================== */
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('feinheit:cartUpdated', { detail: { cart } }));
  }

  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty: qty
      });
    }

    this.saveCart(cart);
    return cart;
  }

  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.qty = qty;
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  }

  clearCart() {
    this.saveCart([]);
    this.removeCoupon();
  }

  getCartSubtotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  getCartCount() {
    return this.getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  /* ================== COUPON METHODS ================== */
  getCoupon() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPON));
    } catch {
      return null;
    }
  }

  applyCoupon(code) {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FEINHEIT20') {
      const coupon = { code: 'FEINHEIT20', discountPercent: 20, desc: '20% Special Boutique Discount' };
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(coupon));
      window.dispatchEvent(new CustomEvent('feinheit:couponUpdated', { detail: coupon }));
      return { success: true, coupon };
    } else if (cleanCode === 'WELCOME10') {
      const coupon = { code: 'WELCOME10', discountPercent: 10, desc: '10% Welcome Gift' };
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(coupon));
      window.dispatchEvent(new CustomEvent('feinheit:couponUpdated', { detail: coupon }));
      return { success: true, coupon };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try FEINHEIT20' };
  }

  removeCoupon() {
    localStorage.removeItem(STORAGE_KEYS.COUPON);
    window.dispatchEvent(new CustomEvent('feinheit:couponUpdated', { detail: null }));
  }

  /* ================== WISHLIST METHODS ================== */
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST)) || [];
    } catch {
      return [];
    }
  }

  saveWishlist(list) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('feinheit:wishlistUpdated', { detail: { wishlist: list } }));
  }

  toggleWishlist(productId) {
    let list = this.getWishlist();
    let isAdded = false;

    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
      isAdded = false;
    } else {
      list.push(productId);
      isAdded = true;
    }

    this.saveWishlist(list);
    return isAdded;
  }

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  }

  /* ================== ORDERS & TRACKING METHODS ================== */
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch {
      return [];
    }
  }

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.id.trim().toUpperCase() === orderId.trim().toUpperCase());
  }

  createOrder(orderData) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `FH-${randomSuffix}`;
    const now = new Date();
    
    const newOrder = {
      id: newOrderId,
      customerName: orderData.customerName,
      email: orderData.email,
      date: now.toISOString().split('T')[0],
      status: 'processing',
      statusLabel: 'Order Confirmed & Preparing',
      statusCode: 2,
      carrier: 'Fein Heit White-Glove Courier',
      estimatedDelivery: '3 Business Days',
      shippingAddress: `${orderData.address}, ${orderData.city}, ${orderData.zip}`,
      timeline: [
        { title: 'Order Placed & Confirmed', time: 'Just now', completed: true, current: false },
        { title: 'Formulated & Gift-Wrapped in Boutique', time: 'In Progress', completed: false, current: true },
        { title: 'Dispatched with Express Courier', time: 'Pending', completed: false },
        { title: 'Out for Delivery to Doorstep', time: 'Pending', completed: false },
        { title: 'Delivered', time: 'Pending', completed: false }
      ],
      items: orderData.items,
      total: orderData.total
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();

    return newOrder;
  }

  /* ================== APPOINTMENTS METHODS ================== */
  getBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    } catch {
      return [];
    }
  }

  createBooking(bookingData) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `BK-${randomSuffix}`;

    const newBooking = {
      id: bookingId,
      ...bookingData,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  }

  /* ================== REVIEWS METHODS ================== */
  getReviews() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS)) || [];
    } catch {
      return [];
    }
  }

  addReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewData.author,
      avatar: reviewData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: parseInt(reviewData.rating) || 5,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      service: reviewData.service || 'Fein Heit Beauty Treatment',
      content: reviewData.content,
      verified: true
    };

    const reviews = this.getReviews();
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent('feinheit:reviewsUpdated'));
    return newReview;
  }

  /* ================== USER AUTHENTICATION METHODS ================== */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return null;
    }
  }

  login(email, password) {
    // Check if user matches registered profile or demo profile
    let user = this.getUser();
    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
      // Create guest profile or demo user
      user = {
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        tier: 'Gold VIP Member',
        joinedDate: 'August 2026',
        parlourPoints: 450,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=85'
      };
    }
    
    user.isLoggedIn = true;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('feinheit:authChanged', { detail: { user } }));
    return { success: true, user };
  }

  register(userData) {
    const newUser = {
      name: userData.name || 'Valued Guest',
      email: userData.email,
      phone: userData.phone || '',
      skinType: userData.skinType || 'Radiant Normal',
      tier: 'Gold VIP Member',
      joinedDate: 'Just Now',
      parlourPoints: 200,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=85',
      isLoggedIn: true
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    // Also automatically apply the 20% discount coupon
    this.applyCoupon('FEINHEIT20');
    window.dispatchEvent(new CustomEvent('feinheit:authChanged', { detail: { user: newUser } }));
    return { success: true, user: newUser };
  }

  logout() {
    const user = this.getUser();
    if (user) {
      user.isLoggedIn = false;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    window.dispatchEvent(new CustomEvent('feinheit:authChanged', { detail: { user: null } }));
    return { success: true };
  }
}

const store = new BoutiqueStore();

