/* ==========================================================================
   THE FEIN HEIT BOUTIQUE - CATALOG & APP DATA (EXACT MOCKUP MATCH)
   ========================================================================== */

const BOUTIQUE_DATA = {
  heroSlides: [
    {
      id: 'slide-1',
      badge: 'Haute Beauté & Parlour',
      title: 'DISCOVER YOUR RADIANCE',
      desc: 'Experience curated luxury beauty, transformative parlour rituals, and organic botanical skincare.',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-with-perfect-skin-applying-cream-49298-large.mp4',
      image: 'images/pexels-amirkshot-13469411.jpg',
      primaryBtn: { text: 'Explore Shop', action: 'products' },
      secondaryBtn: { text: 'Book a Service', action: 'booking' }
    },
    {
      id: 'slide-3',
      badge: 'Clinical Botanicals',
      title: 'THE RADIANCE FACIAL SUITE',
      desc: 'Ultrasonic vortex pore cleansing, collagen LED phototherapy, and 24K pure gold skin infusion.',
      image: 'images/radiance.jpg',
      primaryBtn: { text: 'Reserve Facial', action: 'booking' },
      secondaryBtn: { text: 'View Skincare', action: 'products' }
    },
    {
      id: 'slide-5',
      badge: 'Sanctuary of Tranquility',
      title: 'AROMATHERAPY RETREAT',
      desc: 'Volcanic heated basalt stones and organic damask rose oils to melt tension and restore peace.',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-rubbing-lotion-on-her-hands-49292-large.mp4',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=85',
      primaryBtn: { text: 'Book Spa Ritual', action: 'booking' },
      secondaryBtn: { text: 'Explore Body & Spa', action: 'products' }
    },
    {
      id: 'slide-4',
      badge: 'Indian Bridal Radiance',
      title: 'BRIDAL GLOW FOR YOUR SPECIAL DAY',
      desc: 'Celebrate your wedding moments with luminous skin, traditional elegance, and personalised bridal beauty rituals.',
      image: 'images/pexels-krishna-19891850.jpg',
      primaryBtn: { text: 'Book Bridal Ritual', action: 'booking' },
      secondaryBtn: { text: 'Meet Our Stylists', action: 'about' }
    }
  ],

  collections: [
    {
      id: 'skin-radiance',
      title: 'Skin Radiance & Anti-Aging',
      subtitle: 'Pure Botanical Elixirs',
      description: 'Clinically proven botanical formulations that restore collagen, boost luminosity, and hydrate deeply.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85',
      itemCount: 14,
      categoryFilter: 'skincare'
    },
    {
      id: 'hair-couture',
      title: 'Hair Couture & Scalp Therapy',
      subtitle: 'Salon-Grade Hair Care',
      description: 'Nourishing botanical hair serums, silk repair masks, and restorative scalp therapy formulas.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
      itemCount: 10,
      categoryFilter: 'haircare'
    },
    {
      id: 'luxury-fragrance',
      title: 'Luxury Fragrances & Body Mists',
      subtitle: 'Haute Parfumerie',
      description: 'Artisanal perfumes infused with rare damask rose, ambergris, warm vanilla, and sandalwood.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
      itemCount: 8,
      categoryFilter: 'fragrance'
    },
    {
      id: 'organic-cosmetics',
      title: 'Organic & Vegan Cosmetics',
      subtitle: 'Clean Aesthetic Glow',
      description: 'Weightless luminous foundations, mineral tints, and nourishing lip elixirs enriched with plant squalane.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=85',
      itemCount: 12,
      categoryFilter: 'cosmetics'
    },
    {
      id: 'bridal-glam',
      title: 'Bridal & Gala Glam Packages',
      subtitle: 'Red Carpet Perfection',
      description: 'Bespoke high-definition bridal styling, crystal skin prep, and luxury aesthetic makeover kits.',
      image: 'images/pexels-rajibahmed-26622724.jpg',
      itemCount: 6,
      categoryFilter: 'parlour'
    },
    {
      id: 'nail-artistry',
      title: 'Nail Artistry & Hand Spa',
      subtitle: 'Velvet Care & Polish',
      description: 'Custom Japanese gel nail artistry, keratin cuticle serums, and organic exfoliating hand therapy.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=85',
      itemCount: 9,
      categoryFilter: 'body'
    }
  ],

  products: [
    {
      id: 'prod-01',
      title: 'Radiant Glow Serum',
      category: 'skincare',
      categoryName: 'Organic Skincare',
      price: 2499,
      oldPrice: 3299,
      rating: 4.9,
      reviewsCount: 128,
      badge: 'Bestseller',
      badgeType: 'bestseller',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'A potent 15% stabilized Vitamin C complex enriched with Kakadu plum, Ferulic acid, and pure Hyaluronic Acid. Visibly fades dark spots and evens texture within 14 days.',
      ingredients: 'Kakadu Plum Extract, 15% Ethyl Ascorbic Acid, Ferulic Acid, Hyaluronic Acid, Rosehip Seed Oil, Green Tea Leaf Extract.',
      howToUse: 'Apply 3-4 drops onto cleansed damp face every morning. Follow with your favorite Fein Heit botanical moisturizer and SPF.'
    },
    {
      id: 'prod-02',
      title: 'Velvet Hydration Cream',
      category: 'skincare',
      categoryName: 'Organic Skincare',
      price: 2899,
      oldPrice: 3499,
      rating: 4.8,
      reviewsCount: 94,
      badge: 'Organic',
      badgeType: 'organic',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'Deep cellular restorative cream powered by copper tripeptides, plant ceramides, and organic Damascus rose hydrosol for ultimate skin barrier repair.',
      ingredients: 'Copper Tripeptide-1, Ceramide NP, Damascus Rose Water, Squalane, Shea Butter, Centella Asiatica Extract.',
      howToUse: 'Warm a pearl-sized amount between fingertips and gently press into skin morning and night.'
    },
    {
      id: 'prod-03',
      title: 'Botanical Essence Toner',
      category: 'skincare',
      categoryName: 'Organic Skincare',
      price: 2199,
      oldPrice: 2699,
      rating: 4.9,
      reviewsCount: 88,
      badge: 'Popular',
      badgeType: 'gold',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'Micro-exfoliating fermented floral essence toner with witch hazel, niacinamide, and wild chamomile to rebalance skin pH and shrink pores.',
      ingredients: 'Wild Chamomile Hydrosol, Fermented Galactomyces, Niacinamide 3%, Witch Hazel, Allantoin.',
      howToUse: 'Pour into palms and gently pat into face and neck directly after cleansing.'
    },
    {
      id: 'prod-04',
      title: 'Rosehip Luxury Oil',
      category: 'skincare',
      categoryName: 'Organic Skincare',
      price: 3299,
      oldPrice: 3899,
      rating: 5.0,
      reviewsCount: 115,
      badge: 'Signature',
      badgeType: 'bestseller',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'Cold-pressed virgin Patagonian rosehip fruit oil rich in Provitamin A, trans-retinoic acid, and Omega 3-6-9 to stimulate skin elasticity.',
      ingredients: '100% Cold-Pressed Organic Rosa Canina Seed Oil, Tocopherol (Vitamin E).',
      howToUse: 'Warm 2-3 drops on fingertips and press over moisturizer as the sealing step of your ritual.'
    },
    {
      id: 'prod-05',
      title: 'Damask Rose & Amber Parfum',
      category: 'fragrance',
      categoryName: 'Fragrance',
      price: 4499,
      oldPrice: 5299,
      rating: 5.0,
      reviewsCount: 64,
      badge: 'Signature',
      badgeType: 'gold',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'An enchanting Eau de Parfum featuring top notes of morning dew and pink pepper, blooming into velvet Damask rose and warm golden amber.',
      ingredients: 'Organic Sugarcane Alcohol, Damask Rose Absolute, Pink Peppercorn Essence, Amber Resin, Sandalwood.',
      howToUse: 'Spritz onto pulse points at wrists, neck, and behind ears.'
    },
    {
      id: 'prod-06',
      title: 'Velvet Matte Lip Elixir',
      category: 'cosmetics',
      categoryName: 'Cosmetics',
      price: 1299,
      oldPrice: 1599,
      rating: 4.8,
      reviewsCount: 75,
      badge: 'Organic',
      badgeType: 'organic',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'Luxe cushion lip pigment infused with hyaluronic spheres and organic shea butter. Delivers non-drying velvet matte tint with 8-hour wear.',
      ingredients: 'Organic Ricinus Seed Oil, Shea Butter, Hyaluronic Spheres, Candelilla Wax, Mineral Pigments.',
      howToUse: 'Glide applicator directly across lips starting from cupid’s bow outwards.'
    },
    {
      id: 'prod-07',
      title: 'Golden Argan Hair Gloss',
      category: 'haircare',
      categoryName: 'Hair Care',
      price: 1799,
      oldPrice: 2299,
      rating: 4.7,
      reviewsCount: 82,
      badge: 'Sale',
      badgeType: 'sale',
      image: 'images/pexels-79380313-10110225.jpg',
      inStock: true,
      description: 'Weightless salon-grade finishing serum that tames frizz, protects against 450°F heat styling, and infuses brilliant glass-like shine.',
      ingredients: 'Pure Moroccan Argan Oil, Hydrolyzed Vegan Keratin, Camellia Seed Oil, Jojoba Esters.',
      howToUse: 'Dispense 1-2 pumps onto palms and glide through towel-dried or styled lengths and ends.'
    },
    {
      id: 'prod-08',
      title: 'Japanese Camellia Scalp Elixir',
      category: 'haircare',
      categoryName: 'Hair Care',
      price: 1999,
      oldPrice: 2499,
      rating: 4.9,
      reviewsCount: 53,
      badge: 'Parlour Excl.',
      badgeType: 'gold',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=85',
      inStock: true,
      description: 'Micro-exfoliating scalp pre-wash serum with rosemary peptide, Japanese Tsubaki camellia oil, and salicylic acid.',
      ingredients: 'Tsubaki Oil, Rosemary Leaf Extract, Salicylic Acid, Peppermint Essential Oil, Niacinamide.',
      howToUse: 'Part dry hair and apply dropper directly to scalp. Massage for 5 minutes before shampooing.'
    }
  ],

  services: [
    {
      id: 'srv-01',
      title: 'The Radiance Facial',
      category: 'skincare',
      duration: '75 min',
      price: 4999,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85',
      description: 'Our signature 6-step deep pore cleansing, ultrasonic exfoliation, vortex hyaluronic infusion, and LED collagen phototherapy.',
      includes: ['Double Organic Cleansing', 'Ultrasonic Microdermabrasion', 'Hyaluronic Vortex Infusion', 'Collagen LED Therapy', 'Neck & Shoulder Massage']
    },
    {
      id: 'srv-02',
      title: 'Balayage & Glaze Couture',
      category: 'haircare',
      duration: '120 min',
      price: 6999,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=85',
      description: 'Hand-painted dimensional color customized to your undertone, followed by our botanical bond-strengthening gloss and signature blowout.',
      includes: ['Colorist Consultation', 'Custom Lightening Artistry', 'Olaplex/Keratin Glaze', 'Blowout & Style']
    },
    {
      id: 'srv-03',
      title: 'Japanese Head Spa & Scalp Therapy',
      category: 'haircare',
      duration: '60 min',
      price: 3999,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85',
      description: 'Waterfall cascade hydrotherapy, deep follicle purification, botanical hair mask, and pressure-point tension relief.',
      includes: ['Micro-camera Scalp Analysis', 'Botanical Scalp Scrub', 'Waterfall Hydro-Mist', 'Acupressure Scalp & Neck Massage']
    },
    {
      id: 'srv-04',
      title: 'Haute Bridal Glow & Glam',
      category: 'bridal',
      duration: '150 min',
      price: 12999,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=85',
      description: 'Pre-makeup 24K gold collagen mask, couture airbrush HD makeup, silk lash application, and intricate bridal hair styling.',
      includes: ['24K Gold Skin Prep', 'Airbrush HD Waterproof Makeup', 'Silk Lash Application', 'Couture Hair Updo', 'Bridal Touchup Kit']
    },
    {
      id: 'srv-05',
      title: 'Aromatherapy Hot Stone Ritual',
      category: 'body',
      duration: '90 min',
      price: 5999,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=85',
      description: 'Volcanic heated basalt stones paired with pure damask rose and lavender essential oils to melt muscular tension.',
      includes: ['Aroma Selection', 'Warm Basalt Stone Therapy', 'Full Body Organic Oil Massage', 'Herbal Calming Tea Service']
    },
    {
      id: 'srv-06',
      title: 'Velvet Gel Manicure & Hand Spa',
      category: 'body',
      duration: '50 min',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=85',
      description: 'Warm almond soak, organic sugar exfoliation, keratin cuticle treatment, tension relief massage, and non-toxic gel polish.',
      includes: ['Warm Botanical Soak', 'Gentle Cuticle Care', 'Organic Scrub & Massage', 'Gel Finish & Cuticle Oil']
    }
  ],

  stylists: [
    {
      id: 'sty-01',
      name: 'Dr. Ananya Mehta',
      role: 'Master Esthetician & Skin Director',
      experience: '14+ Years Experience',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=85',
      specialty: 'HydraFacials, Anti-Aging & 24K Gold Therapy'
    },
    {
      id: 'sty-02',
      name: 'Rohan Kapoor',
      role: 'Creative Director & Hair Alchemist',
      experience: '12+ Years Experience',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=85',
      specialty: 'French Balayage, Precision Cut & Japanese Head Spa'
    },
    {
      id: 'sty-03',
      name: 'Meera Iyer',
      role: 'Head Bridal & Couture Makeup Artist',
      experience: '9+ Years Experience',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=85',
      specialty: 'Red Carpet HD Glam, Editorial & Bridal Styling'
    }
  ],

  reviews: [
    {
      id: 'rev-01',
      author: 'Aaradhya Rao',
      location: 'Bandra West, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=250&q=85',
      treatmentPhoto: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=85',
      rating: 5,
      date: 'August 14, 2026',
      service: 'The Radiance Facial',
      content: 'Absolute bliss! The ambiance and treatments are unmatched. My skin has never looked so supple and luminous. The Radiant Glow Serum is now a permanent vanity staple.',
      verified: true
    },
    {
      id: 'rev-02',
      author: 'Ishita Sharma',
      location: 'Koramangala, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=250&q=85',
      treatmentPhoto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=85',
      rating: 5,
      date: 'August 02, 2026',
      service: 'Balayage Couture',
      content: 'Jean-Luc is a master! He created the most seamless, dimensional blonde balayage I have ever had. The gloss serum kept my hair smelling divine for days.',
      verified: true
    },
    {
      id: 'rev-03',
      author: 'Kavya Nair',
      location: 'Koregaon Park, Pune',
      avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=250&q=85',
      treatmentPhoto: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=85',
      rating: 5,
      date: 'July 28, 2026',
      service: 'Damask Rose & Amber Parfum',
      content: 'The perfume is pure luxury in a bottle. Enduring scent trail, satin packaging, and remarkably fast doorstep delivery with the live tracker.',
      verified: true
    },
    {
      id: 'rev-04',
      author: 'Simran Malhotra',
      location: 'South Delhi',
      avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=250&q=85',
      treatmentPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=85',
      rating: 5,
      date: 'July 15, 2026',
      service: 'Haute Bridal Glow & Glam',
      content: 'Soraya made me feel like royalty for my wedding day. The makeup lasted all night without a single touch-up required. Highest recommendation!',
      verified: true
    }
  ],

  clientGallery: [
    {
      id: 'cg-1',
      title: 'Glass-Skin HydraFacial Glow',
      handle: '@aaradhya_radiance',
      treatment: 'The Radiance Facial',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=85'
    },
    {
      id: 'cg-2',
      title: 'Sun-Kissed Balayage Glaze',
      handle: '@ishita_couture',
      treatment: 'Balayage Couture',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=85'
    },
    {
      id: 'cg-3',
      title: '24K Gold VIP Bridal Glam',
      handle: '@simran_wedding',
      treatment: 'Haute Bridal Glow',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=85'
    },
    {
      id: 'cg-4',
      title: 'Japanese Head Spa Revitalized',
      handle: '@kavya_wellness',
      treatment: 'Head Spa & Therapy',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=85'
    },
    {
      id: 'cg-5',
      title: 'Aromatherapy Hot Stone Bliss',
      handle: '@ananya_retreat',
      treatment: 'Hot Stone Ritual',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=85'
    },
    {
      id: 'cg-6',
      title: 'Velvet Japanese Gel Manicure',
      handle: '@meera_nails',
      treatment: 'Velvet Manicure',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=85'
    }
  ],

  demoOrders: [
    {
      id: 'FH-89241',
      customerName: 'Aarav Mehta',
      email: 'aarav.mehta@example.in',
      date: '2026-08-25',
      status: 'out_for_delivery',
      statusLabel: 'Out for Delivery',
      statusCode: 4,
      carrier: 'Fein Heit White-Glove Express',
      estimatedDelivery: 'August 28, 2026 by 4:00 PM',
      shippingAddress: '24 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
      timeline: [
        { title: 'Order Placed & Confirmed', time: 'Aug 25, 09:30 AM', completed: true },
        { title: 'Formulated & Gift-Wrapped in Boutique', time: 'Aug 25, 02:15 PM', completed: true },
        { title: 'Dispatched with Express Courier', time: 'Aug 26, 08:45 AM', completed: true },
        { title: 'Out for Delivery to Doorstep', time: 'Aug 27, 07:15 AM', completed: true, current: true },
        { title: 'Delivered', time: 'Expected Aug 28', completed: false }
      ],
      items: [
        { title: 'Radiant Glow Serum', qty: 1, price: 2499 },
        { title: 'Velvet Hydration Cream', qty: 1, price: 2899 }
      ],
      total: 5398
    },
    {
      id: 'FH-10492',
      customerName: 'Nandini Kapoor',
      email: 'nandini.kapoor@example.in',
      date: '2026-08-26',
      status: 'dispatched',
      statusLabel: 'Dispatched',
      statusCode: 3,
      carrier: 'DHL Express Luxury',
      estimatedDelivery: 'August 30, 2026',
      shippingAddress: '18 Koregaon Park Road, Pune, Maharashtra 411001',
      timeline: [
        { title: 'Order Placed & Confirmed', time: 'Aug 26, 11:10 AM', completed: true },
        { title: 'Formulated & Gift-Wrapped in Boutique', time: 'Aug 26, 04:30 PM', completed: true },
        { title: 'Dispatched with Express Courier', time: 'Aug 27, 09:00 AM', completed: true, current: true },
        { title: 'Out for Delivery to Doorstep', time: 'Pending', completed: false },
        { title: 'Delivered', time: 'Pending', completed: false }
      ],
      items: [
        { title: 'Damask Rose & Amber Parfum', qty: 1, price: 4499 }
      ],
      total: 4499
    }
  ],

  faqs: [
    {
      question: 'How do I book an appointment at The Fein Heit Parlour?',
      answer: 'You can book seamlessly through our online Booking page by selecting your desired beauty treatment, preferred master esthetician, and date/time slot. You will receive an instant digital booking voucher.'
    },
    {
      question: 'Are all Fein Heit beauty products organic and cruelty-free?',
      answer: 'Yes, 100%. All our formulas are dermatologically tested, cruelty-free, ethically sourced, and crafted without parabens, phthalates, synthetic fragrances, or harsh sulfates.'
    },
    {
      question: 'How does the Order Tracking System work?',
      answer: 'Upon completing your purchase, a unique Fein Heit Order Tracking ID (e.g. FH-89241) is generated. You can paste this ID into the Track Order page at any time to see real-time updates from formulation to doorstep delivery.'
    },
    {
      question: 'What is your return & exchange policy?',
      answer: 'We offer a 30-day luxury satisfaction guarantee on all boutique cosmetic products. If a product does not suit your skin type, our beauty concierge will arrange a complimentary return or exchange.'
    }
  ]
};
