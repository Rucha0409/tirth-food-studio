// Tirth - The Food Studio: Local Unified Database & Service Layer
// Persists to localStorage, simulating a production database with complete CRUD and reporting

export interface MenuItem {
  id: string;
  name: string;
  nameDevnagari: string;
  description: string;
  descriptionDevnagari: string;
  price: number;
  category: 'everyday' | 'customize' | 'special';
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  isSpecial: boolean;
  rating: number;
  reviewsCount: number;
  timeToPrepare: number; // in minutes
  isPreorder: boolean;
  isFastFood: boolean;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid';
  paymentMethod: 'UPI' | 'Card' | 'COD';
  paymentId?: string;
  timeSlot: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'COD';
  status: 'Success' | 'Failed';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}

export interface Subscription {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  planType: 'Weekly' | 'Monthly';
  mealType: 'Veg Thali' | 'Special Thali';
  price: number;
  startDate: string;
  timeSlot: string;
  status: 'Active' | 'Completed' | 'Paused';
  daysRemaining: number;
  createdAt: string;
}

export interface AdminSettings {
  isAcceptingOrders: boolean;
  announcementText: string;
  deliveryCharge: number;
  freeDeliveryAbove: number;
  taxPercent: number;
}

// EXACT MAHARASHTRIAN DISHES & PRICING SEEDS MATCHING SCREENSHOT
const SEED_MENU: MenuItem[] = [
  {
    id: 'f1',
    name: 'Poli',
    nameDevnagari: 'पोळी',
    description: 'Fresh, soft hand-rolled wheat poli brushed with refined oil.',
    descriptionDevnagari: 'गव्हाची मऊ पोळी, हलके तेल लावलेली.',
    price: 17,
    category: 'customize',
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviewsCount: 420,
    timeToPrepare: 5,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f2',
    name: 'Bhakri',
    nameDevnagari: 'भाकरी',
    description: 'Traditional hot hand-patted Jowar/Bajri bhakri roasted on iron tawa.',
    descriptionDevnagari: 'चुलीवरची खमंग आणि मऊ ज्वारी/बाजरीची भाकरी.',
    price: 27,
    category: 'customize',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviewsCount: 310,
    timeToPrepare: 8,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f3',
    name: 'Bharli Vangi',
    nameDevnagari: 'भरली वांगी',
    description: 'Stuffed brinjals slow-cooked in a rich gravy spiced with Goda Masala.',
    descriptionDevnagari: 'शेंगदाणे, तीळ आणि सुक्या खोबऱ्याचे सारण भरलेली गावरान वांगी.',
    price: 40,
    category: 'customize',
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviewsCount: 285,
    timeToPrepare: 10,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f4',
    name: 'Palak Khichdi',
    nameDevnagari: 'पालक खिचडी',
    description: 'Comforting, healthy spinach and lentil rice cooked with traditional spices.',
    descriptionDevnagari: 'मऊ सुगंधी पालक आणि डाळ-तांदळाची पौष्टिक खिचडी, तूप टाकून.',
    price: 40,
    category: 'customize',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviewsCount: 194,
    timeToPrepare: 12,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f5',
    name: 'Papad',
    nameDevnagari: 'पापड',
    description: 'Crisp roasted traditional Urad dal papad.',
    descriptionDevnagari: 'भाजलेला कुरकुरीत उडीद डाळीचा पापड.',
    price: 10,
    category: 'customize',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviewsCount: 95,
    timeToPrepare: 3,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f6',
    name: 'Limbe God Lonche',
    nameDevnagari: 'लिंबू गोड लोणचे',
    description: 'Traditional sweet and sour oil-free lemon pickle spiced with cardamom.',
    descriptionDevnagari: 'आजीच्या हातचे पारंपरिक पाचक गोड-आंबट लिंबाचे लोणचे.',
    price: 10,
    category: 'customize',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviewsCount: 120,
    timeToPrepare: 3,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f7',
    name: 'Daily Tiffin Box',
    nameDevnagari: 'रोजचा डबा',
    description: 'Complete wholesome daily meal cooked with homely masalas: 3 Soft Polis, daily Bhaji, Rice, comforting Amti, Papad, Lonche.',
    descriptionDevnagari: 'संपूर्ण डबा: ३ मऊ पोळ्या, आजची भाजी, भात, कटाची आमटी, पापड आणि लोणचे.',
    price: 150,
    category: 'everyday',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviewsCount: 512,
    timeToPrepare: 15,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'f8',
    name: 'Poli Bhaji Combo',
    nameDevnagari: 'पोळी भाजी कॉम्बो',
    description: 'Wholesome budget meal: 3 Soft Polis served with the daily special vegetable bhaji.',
    descriptionDevnagari: 'झटपट जेवण: ३ मऊ पोळ्या आणि ताज्या भाजीची वाटी.',
    price: 90,
    category: 'everyday',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviewsCount: 220,
    timeToPrepare: 10,
    isFastFood: true,
    isPreorder: false
  },
  {
    id: 'p1',
    name: 'Ukadiche Modak',
    nameDevnagari: 'उकडीचे मोदक',
    description: 'Steamed rice flour dumplings filled with grated coconut & organic jaggery.',
    descriptionDevnagari: 'पारंपरिक वाफवलेले कळीचे मोदक, आत खोबरे-गुळ सारण.',
    price: 100,
    category: 'special',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: true,
    rating: 5.0,
    reviewsCount: 680,
    timeToPrepare: 30,
    isFastFood: false,
    isPreorder: true
  },
  {
    id: 'p2',
    name: 'Rava Sheera',
    nameDevnagari: 'रवा शिरा',
    description: 'Sweet, fragrant semolina halwa loaded with saffron, cardamoms, raisins, and cashews.',
    descriptionDevnagari: 'मऊ सुगंधी केशर-इलायची युक्त मऊ रवा शिरा.',
    price: 60,
    category: 'special',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviewsCount: 145,
    timeToPrepare: 15,
    isFastFood: false,
    isPreorder: true
  },
  {
    id: 'p3',
    name: 'Special Butter Pav Bhaji',
    nameDevnagari: 'पावभाजी',
    description: 'Thick spiced vegetable mash cooked in real butter, served with 2 toasted soft butter pavs.',
    descriptionDevnagari: 'खमंग बटरमध्ये शिजवलेली भाजी, बारीक कांदा आणि गरमागरम २ बटर पाव.',
    price: 120,
    category: 'special',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: false,
    rating: 4.9,
    reviewsCount: 390,
    timeToPrepare: 20,
    isFastFood: false,
    isPreorder: true
  },
  {
    id: 'p4',
    name: 'Fragrant Veg Biryani',
    nameDevnagari: 'बिर्याणी',
    description: 'Slow-cooked aromatic basmati rice layered with spiced vegetables, whole spices, and herbs. Served with Raita.',
    descriptionDevnagari: 'सुगंधी बासमती तांदळाची मसालेदार दम बिर्याणी, कोशिंबिरीसह.',
    price: 150,
    category: 'special',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60',
    isAvailable: true,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviewsCount: 285,
    timeToPrepare: 25,
    isFastFood: false,
    isPreorder: true
  }
];

const SEED_COUPONS: Coupon[] = [
  { code: 'SATVIK10', discountPercent: 10, maxDiscount: 50, minOrder: 150, description: 'Get 10% OFF on fresh Satvik orders above ₹150' },
  { code: 'FESTIVE20', discountPercent: 20, maxDiscount: 100, minOrder: 300, description: 'Get 20% OFF on our Special Utsav meals above ₹300' },
  { code: 'TIRTHFREE', discountPercent: 100, maxDiscount: 40, minOrder: 120, description: 'Get ₹40 off on your first homely order' }
];

const DEFAULT_SETTINGS: AdminSettings = {
  isAcceptingOrders: true,
  announcementText: '✨ तीर्थ सात्विक डबा आणि मराठमोळे पदार्थ आता एका क्लिकवर उपलब्ध! ✨',
  deliveryCharge: 30,
  freeDeliveryAbove: 299,
  taxPercent: 5
};

// HELPER STATE PERSISTENCE FUNCTIONS
const IS_CLIENT = typeof window !== 'undefined';

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!IS_CLIENT) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (!IS_CLIENT) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
  }
}

// INITIALIZE DATABASE
export function initializeDB(): void {
  if (!IS_CLIENT) return;
  
  // Force reset seed menu if it is the old version or contains broken/salad images
  const existingMenu = localStorage.getItem('tirth_menu');
  if (existingMenu) {
    try {
      const parsed = JSON.parse(existingMenu);
      // Reset if old seed indices ('m1'), or if old fast food seed name 'Spiced Misal Pav Special'
      // OR if any item has broken/salad image URLs or old description
      if (parsed.length > 0 && (
        parsed[0].id === 'm1' || 
        parsed[0].name === 'Spiced Misal Pav Special' ||
        parsed[0].category === 'Fast Food' ||
        parsed[0].category === 'Preorders' ||
        !('isPreorder' in parsed[0]) ||
        parsed.some((item: any) => 
          item.imageUrl.includes('photo-1601050690597-df056fb4ce78') ||
          item.imageUrl.includes('photo-1605441994615-28b36c35af73') ||
          (item.name === 'Poli' && item.imageUrl.includes('photo-1505253716362-afaea1d3d1af')) || // salad image
          item.description.includes('cold-pressed oils') ||
          item.description.includes('deep-fried')
        )
      )) {
        localStorage.removeItem('tirth_menu');
        localStorage.removeItem('tirth_orders'); // Clear stale orders too
      }
    } catch (e) {
      localStorage.removeItem('tirth_menu');
    }
  }

  if (!localStorage.getItem('tirth_menu')) {
    setStorageItem('tirth_menu', SEED_MENU);
  }
  if (!localStorage.getItem('tirth_coupons')) {
    setStorageItem('tirth_coupons', SEED_COUPONS);
  }
  if (!localStorage.getItem('tirth_settings')) {
    setStorageItem('tirth_settings', DEFAULT_SETTINGS);
  }
  if (!localStorage.getItem('tirth_orders')) {
    setStorageItem('tirth_orders', []);
  }
  if (!localStorage.getItem('tirth_subscriptions')) {
    setStorageItem('tirth_subscriptions', []);
  }
}

// CALL INIT RIGHT AWAY
initializeDB();

// DB SERVICE METHODS
export const dbService = {
  // MENU CRUD
  getMenu(): MenuItem[] {
    initializeDB();
    return getStorageItem<MenuItem[]>('tirth_menu', SEED_MENU);
  },

  saveMenu(menu: MenuItem[]): void {
    setStorageItem('tirth_menu', menu);
  },

  addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
    const menu = this.getMenu();
    const newItem: MenuItem = {
      ...item,
      id: 'm_' + Math.random().toString(36).substr(2, 9)
    };
    menu.push(newItem);
    this.saveMenu(menu);
    return newItem;
  },

  updateMenuItem(updatedItem: MenuItem): MenuItem {
    const menu = this.getMenu();
    const index = menu.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      menu[index] = updatedItem;
      this.saveMenu(menu);
    }
    return updatedItem;
  },

  deleteMenuItem(id: string): void {
    const menu = this.getMenu();
    const filtered = menu.filter(i => i.id !== id);
    this.saveMenu(filtered);
  },

  // ORDERS
  getOrders(): Order[] {
    initializeDB();
    return getStorageItem<Order[]>('tirth_orders', []);
  },

  saveOrders(orders: Order[]): void {
    setStorageItem('tirth_orders', orders);
  },

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: 'TRTH-' + Math.floor(100000 + Math.random() * 900000).toString(),
      status: 'Pending',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Save payment details if paid
    if (newOrder.paymentStatus === 'Paid') {
      this.createPayment({
        orderId: newOrder.id,
        amount: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        status: 'Success'
      });
    }

    // Trigger sound alert in browser
    if (IS_CLIENT) {
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav');
        audio.volume = 0.5;
        audio.play();
      } catch (e) { 
        console.warn('Audio notification blocked by autoplay policy:', e);
      }
    }

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      if (paymentStatus) {
        orders[index].paymentStatus = paymentStatus;
      }
      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  // SUBSCRIPTIONS
  getSubscriptions(): Subscription[] {
    initializeDB();
    return getStorageItem<Subscription[]>('tirth_subscriptions', []);
  },

  createSubscription(subData: Omit<Subscription, 'id' | 'createdAt' | 'status' | 'daysRemaining'>): Subscription {
    const subs = this.getSubscriptions();
    const newSub: Subscription = {
      ...subData,
      id: 'SUB-' + Math.floor(100000 + Math.random() * 900000).toString(),
      status: 'Active',
      daysRemaining: subData.planType === 'Weekly' ? 6 : 26, // Excludes Sundays usually
      createdAt: new Date().toISOString()
    };
    subs.unshift(newSub);
    setStorageItem('tirth_subscriptions', subs);
    return newSub;
  },

  updateSubscriptionDays(subId: string): void {
    const subs = this.getSubscriptions();
    const index = subs.findIndex(s => s.id === subId);
    if (index !== -1 && subs[index].daysRemaining > 0) {
      subs[index].daysRemaining -= 1;
      if (subs[index].daysRemaining === 0) {
        subs[index].status = 'Completed';
      }
      setStorageItem('tirth_subscriptions', subs);
    }
  },

  // PAYMENTS
  getPayments(): Payment[] {
    initializeDB();
    return getStorageItem<Payment[]>('tirth_payments', []);
  },

  createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>): Payment {
    const payments = this.getPayments();
    const newPayment: Payment = {
      ...paymentData,
      id: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString()
    };
    payments.unshift(newPayment);
    setStorageItem('tirth_payments', payments);
    return newPayment;
  },

  // COUPONS
  getCoupons(): Coupon[] {
    initializeDB();
    return getStorageItem<Coupon[]>('tirth_coupons', SEED_COUPONS);
  },

  validateCoupon(code: string, cartTotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code!' };
    }
    if (cartTotal < coupon.minOrder) {
      return { valid: false, error: `Minimum order total to apply this coupon is ₹${coupon.minOrder}` };
    }
    return { valid: true, coupon };
  },

  // SETTINGS
  getSettings(): AdminSettings {
    initializeDB();
    return getStorageItem<AdminSettings>('tirth_settings', DEFAULT_SETTINGS);
  },

  saveSettings(settings: AdminSettings): void {
    setStorageItem('tirth_settings', settings);
  },

  // METRICS & ANALYSIS
  getMetrics() {
    const orders = this.getOrders().filter(o => o.status !== 'Cancelled');
    const todayStr = new Date().toISOString().split('T')[0];
    
    const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    const itemsCount: { [key: string]: { name: string; count: number; category: string } } = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!itemsCount[i.menuItem.id]) {
          itemsCount[i.menuItem.id] = { name: i.menuItem.name, count: 0, category: i.menuItem.category };
        }
        itemsCount[i.menuItem.id].count += i.quantity;
      });
    });

    const topSelling = Object.values(itemsCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      todayOrdersCount: todayOrders.length,
      totalRevenue: revenue,
      todayRevenue,
      topSelling,
      pendingOrdersCount: this.getOrders().filter(o => o.status === 'Pending' || o.status === 'Preparing').length
    };
  }
};
