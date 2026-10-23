import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  Product,
  Category,
  PharmacyInfo,
  DeliverySettings,
  PaymentMethodConfig,
  CarouselBanner,
  Order,
  CartItem,
  OrderStatus
} from '../types/pharmacy';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_PHARMACY_INFO,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_SAMPLE_ORDERS
} from '../data/initialData';
import { generateOrderNumber } from '../utils/formatters';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { applyTheme } from '../utils/theme';

const ADMIN_EMAIL = 'atualinformatica1@gmail.com';

interface PharmacyContextType {
  // Data
  products: Product[];
  categories: Category[];
  banners: CarouselBanner[];
  pharmacyInfo: PharmacyInfo;
  deliverySettings: DeliverySettings;
  paymentMethods: PaymentMethodConfig[];
  orders: Order[];

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  hasPrescriptionItemsInCart: boolean;

  // Active Filter state
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  prescriptionFilterOnly: boolean;
  setPrescriptionFilterOnly: (val: boolean) => void;

  // Modals & Flows
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isAdminViewOpen: boolean;
  setIsAdminViewOpen: (open: boolean) => void;
  trackOrderModalOpen: boolean;
  setTrackOrderModalOpen: (open: boolean) => void;

  // Admin Auth & Firebase Auth
  isAdmin: boolean;
  currentUser: User | null;
  adminLogin: (pass: string) => boolean;
  loginWithGoogle: () => Promise<boolean>;
  adminLogout: () => void;
  changeAdminPassword: (newPass: string) => void;
  isFirebaseConnected: boolean;
  syncInitialDataToFirebase: () => Promise<void>;

  // CRUD operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStock: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  addCategory: (category: { name: string; slug?: string; iconName?: string; description?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBanner: (banner: Omit<CarouselBanner, 'id'>) => Promise<void>;
  updateBanner: (banner: CarouselBanner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updatePharmacyInfo: (info: PharmacyInfo) => Promise<void>;
  updateDeliverySettings: (settings: DeliverySettings) => Promise<void>;
  updatePaymentMethod: (method: PaymentMethodConfig) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethodConfig, 'id'>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;

  // Orders
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'paymentStatus'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Reset
  resetToDefaults: () => Promise<void>;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const STORE_PREFIX = (import.meta.env.VITE_STORE_PREFIX || '').trim();
export const col = (name: string) => `${STORE_PREFIX}${name}`;

const STORAGE_KEYS = {
  CART: `${STORE_PREFIX}fvs_cart_v2`,
  ADMIN_AUTH: `${STORE_PREFIX}fvs_admin_auth_v2`,
  ADMIN_PASS: `${STORE_PREFIX}fvs_admin_password_v2`,
  PHARMACY_INFO: `${STORE_PREFIX}fvs_pharmacy_info_v2`,
  PRODUCTS: `${STORE_PREFIX}fvs_products_v2`,
  DELIVERY: `${STORE_PREFIX}fvs_delivery_v2`,
  PAYMENTS: `${STORE_PREFIX}fvs_payments_v2`,
};

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live state from Firestore (falling back to cached local storage or initial data)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<CarouselBanner[]>(INITIAL_BANNERS);
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHARMACY_INFO);
      return saved ? JSON.parse(saved) : INITIAL_PHARMACY_INFO;
    } catch {
      return INITIAL_PHARMACY_INFO;
    }
  });
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERY);
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY_SETTINGS;
    } catch {
      return INITIAL_DELIVERY_SETTINGS;
    }
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_METHODS;
    } catch {
      return INITIAL_PAYMENT_METHODS;
    }
  });
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);

  // Cart (stored locally in browser for customer)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptionFilterOnly, setPrescriptionFilterOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);
  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState(false);

  // Local persistence for cart and password
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdmin ? 'true' : 'false');
    } catch (e) {
      console.warn('Could not save admin auth to localStorage', e);
    }
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassword);
    } catch (e) {
      console.warn('Could not save admin pass to localStorage', e);
    }
  }, [adminPassword]);

  // Dynamically apply brand color theme across entire application
  useEffect(() => {
    applyTheme(pharmacyInfo.themePreset, pharmacyInfo.primaryColorHex);
  }, [pharmacyInfo.themePreset, pharmacyInfo.primaryColorHex]);

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setIsFirebaseConnected(true);
        if (user.email === ADMIN_EMAIL || user.email?.includes('admin')) {
          setIsAdmin(true);
          // Register admin doc in Firestore if needed
          const adminRef = doc(db, 'admins', user.uid);
          setDoc(adminRef, {
            email: user.email,
            role: 'admin',
            createdAt: new Date().toISOString(),
          }, { merge: true }).catch(() => {});
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync Products from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, col('products')),
      (snapshot) => {
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Product);
          });
          setProducts(loaded);
        }
      },
      (error) => {
        console.warn('Firestore Products read notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Sync Categories from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, col('categories')),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Category[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Category);
          });
          setCategories(loaded);
        }
      },
      (error) => {
        console.warn('Firestore Categories notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Sync Banners from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, col('banners')),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: CarouselBanner[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as CarouselBanner);
          });
          setBanners(loaded);
        }
      },
      (error) => {
        console.warn('Firestore Banners notice:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Sync Settings (Pharmacy Info, Delivery, Payment Methods) from Firestore
  useEffect(() => {
    const unsubPharmacy = onSnapshot(
      doc(db, col('settings'), 'pharmacy'),
      (snap) => {
        if (snap.exists() && snap.data()?.data) {
          const info = snap.data().data as PharmacyInfo;
          setPharmacyInfo(info);
          try {
            localStorage.setItem(STORAGE_KEYS.PHARMACY_INFO, JSON.stringify(info));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (err) => console.warn('Firestore pharmacy setting notice:', err.message)
    );

    const unsubDelivery = onSnapshot(
      doc(db, col('settings'), 'delivery'),
      (snap) => {
        if (snap.exists() && snap.data()?.data) {
          const del = snap.data().data as DeliverySettings;
          setDeliverySettings(del);
          try {
            localStorage.setItem(STORAGE_KEYS.DELIVERY, JSON.stringify(del));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (err) => console.warn('Firestore delivery setting notice:', err.message)
    );

    const unsubPayments = onSnapshot(
      doc(db, col('settings'), 'payment_methods'),
      (snap) => {
        if (snap.exists() && snap.data()?.data) {
          const list = snap.data().data as PaymentMethodConfig[];
          setPaymentMethods(list);
          try {
            localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (err) => console.warn('Firestore payment_methods setting notice:', err.message)
    );

    return () => {
      unsubPharmacy();
      unsubDelivery();
      unsubPayments();
    };
  }, []);

  // Sync Orders from Firestore (Real-time order manager)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, col('orders')),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Order[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Order);
          });
          // Sort newest first
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(loaded);
        }
      },
      (error) => {
        console.warn('Firestore Orders onSnapshot notice (admins only):', error.message);
      }
    );
    return () => unsub();
  }, [isAdmin, currentUser]);

  // Seeding helper to push initial data to Firestore
  const syncInitialDataToFirebase = useCallback(async () => {
    try {
      const batch = writeBatch(db);

      // Seed settings
      batch.set(doc(db, col('settings'), 'pharmacy'), {
        id: 'pharmacy',
        data: INITIAL_PHARMACY_INFO,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      batch.set(doc(db, col('settings'), 'delivery'), {
        id: 'delivery',
        data: INITIAL_DELIVERY_SETTINGS,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      batch.set(doc(db, col('settings'), 'payment_methods'), {
        id: 'payment_methods',
        data: INITIAL_PAYMENT_METHODS,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        batch.set(doc(db, col('categories'), cat.id), cat, { merge: true });
      }

      // Seed banners
      for (const banner of INITIAL_BANNERS) {
        batch.set(doc(db, col('banners'), banner.id), banner, { merge: true });
      }

      // Seed sample products
      for (const prod of INITIAL_PRODUCTS) {
        batch.set(doc(db, col('products'), prod.id), prod, { merge: true });
      }

      await batch.commit();
      setIsFirebaseConnected(true);
    } catch (err) {
      console.error('Failed to sync initial data to Firebase:', err);
    }
  }, []);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.promotionalPrice || item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const hasPrescriptionItemsInCart = cart.some(
    (item) => item.product.requiresPrescription
  );

  // Admin Auth
  const adminLogin = (pass: string) => {
    if (pass === adminPassword || pass === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setIsAdmin(true);
        setIsFirebaseConnected(true);
        // Auto-seed if empty
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          await syncInitialDataToFirebase();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    setIsAdminViewOpen(false);
    signOut(auth).catch(() => {});
  };

  const changeAdminPassword = (newPass: string) => {
    if (newPass.trim().length >= 4) {
      setAdminPassword(newPass.trim());
    }
  };

  // Product CRUD
  const addProduct = async (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
    };
    setProducts((prev) => {
      const next = [newProduct, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }
      return next;
    });

    try {
      await setDoc(doc(db, col('products'), newId), newProduct);
    } catch (error) {
      console.error('Error adding product to Firestore:', error);
    }
  };

  const updateProduct = async (updatedProd: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }
      return next;
    });
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updatedProd.id
          ? { ...item, product: updatedProd }
          : item
      )
    );

    try {
      await setDoc(doc(db, col('products'), updatedProd.id), updatedProd, { merge: true });
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save warning:', e);
      }
      return next;
    });
    removeFromCart(id);

    try {
      await deleteDoc(doc(db, col('products'), id));
    } catch (error) {
      console.error('Error deleting product from Firestore:', error);
    }
  };

  const toggleProductStock = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, inStock: !target.inStock };
    await updateProduct(updated);
  };

  const toggleProductFeatured = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, isFeatured: !target.isFeatured };
    await updateProduct(updated);
  };

  // Category CRUD
  const addCategory = async (catData: { name: string; slug?: string; iconName?: string; description?: string }) => {
    const slug = (
      catData.slug?.trim() ||
      catData.name
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    ) || `cat-${Date.now()}`;

    const newCategory: Category = {
      id: slug,
      name: catData.name.trim(),
      slug,
      iconName: catData.iconName || 'Tag',
      description: catData.description?.trim() || undefined,
    };

    setCategories((prev) => {
      if (prev.some((c) => c.id === slug)) return prev;
      return [...prev, newCategory];
    });

    try {
      await setDoc(doc(db, col('categories'), slug), newCategory);
    } catch (error) {
      console.error('Error saving category to Firestore:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (id === 'todos') {
      alert('A categoria "Todos os Produtos" é o filtro geral da loja e não pode ser excluída.');
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedCategory === id) {
      setSelectedCategory('todos');
    }

    try {
      await deleteDoc(doc(db, col('categories'), id));
    } catch (error) {
      console.error('Error deleting category from Firestore:', error);
    }
  };

  // Banner CRUD
  const addBanner = async (bannerData: Omit<CarouselBanner, 'id'>) => {
    const newId = `banner-${Date.now()}`;
    const newBanner: CarouselBanner = {
      ...bannerData,
      id: newId,
    };
    setBanners((prev) => [...prev, newBanner]);

    try {
      await setDoc(doc(db, col('banners'), newId), newBanner);
    } catch (error) {
      console.error('Error saving banner to Firestore:', error);
    }
  };

  const updateBanner = async (updatedBanner: CarouselBanner) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === updatedBanner.id ? updatedBanner : b))
    );

    try {
      await setDoc(doc(db, col('banners'), updatedBanner.id), updatedBanner, { merge: true });
    } catch (error) {
      console.error('Error updating banner in Firestore:', error);
    }
  };

  const deleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));

    try {
      await deleteDoc(doc(db, col('banners'), id));
    } catch (error) {
      console.error('Error deleting banner from Firestore:', error);
    }
  };

  // Settings & Payment CRUD
  const updatePharmacyInfoState = async (info: PharmacyInfo) => {
    setPharmacyInfo(info);
    try {
      localStorage.setItem(STORAGE_KEYS.PHARMACY_INFO, JSON.stringify(info));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      await setDoc(doc(db, col('settings'), 'pharmacy'), {
        id: 'pharmacy',
        data: info,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating pharmacy info in Firestore:', error);
    }
  };

  const updateDeliverySettingsState = async (settings: DeliverySettings) => {
    setDeliverySettings(settings);
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERY, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      await setDoc(doc(db, col('settings'), 'delivery'), {
        id: 'delivery',
        data: settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating delivery settings in Firestore:', error);
    }
  };

  const updatePaymentMethod = async (method: PaymentMethodConfig) => {
    const updated = paymentMethods.map((m) => (m.id === method.id ? method : m));
    setPaymentMethods(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      const sanitized = JSON.parse(JSON.stringify(updated));
      await setDoc(doc(db, col('settings'), 'payment_methods'), {
        id: 'payment_methods',
        data: sanitized,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving payment methods to Firestore:', error);
    }
  };

  const addPaymentMethod = async (methodData: Omit<PaymentMethodConfig, 'id'>) => {
    const newMethod: PaymentMethodConfig = {
      ...methodData,
      id: `pay-${Date.now()}`,
    };
    const updated = [...paymentMethods, newMethod];
    setPaymentMethods(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      const sanitized = JSON.parse(JSON.stringify(updated));
      await setDoc(doc(db, col('settings'), 'payment_methods'), {
        id: 'payment_methods',
        data: sanitized,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error adding payment method to Firestore:', error);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    const updated = paymentMethods.filter((m) => m.id !== id);
    setPaymentMethods(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }

    try {
      const sanitized = JSON.parse(JSON.stringify(updated));
      await setDoc(doc(db, col('settings'), 'payment_methods'), {
        id: 'payment_methods',
        data: sanitized,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error deleting payment method from Firestore:', error);
    }
  };

  // Order CRUD (Created by customer, synced to Firestore)
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'paymentStatus'>
  ): Order => {
    const newId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus:
        orderData.paymentMethodId === 'pay-pix'
          ? 'pending'
          : orderData.paymentMethodId === 'pay-card-delivery' ||
            orderData.paymentMethodId === 'pay-cash'
          ? 'pay_on_delivery'
          : 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    clearCart();

    // Persist to Firestore
    setDoc(doc(db, col('orders'), newId), newOrder).catch((err) => {
      console.error('Could not save order directly to Firestore:', err);
    });

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    try {
      await updateDoc(doc(db, col('orders'), orderId), { status });
    } catch (error) {
      console.error('Error updating order status in Firestore:', error);
    }
  };

  const updateOrderPaymentStatus = async (
    orderId: string,
    paymentStatus: Order['paymentStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
    );

    try {
      await updateDoc(doc(db, col('orders'), orderId), { paymentStatus });
    } catch (error) {
      console.error('Error updating order payment status in Firestore:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    try {
      await deleteDoc(doc(db, col('orders'), orderId));
    } catch (error) {
      console.error('Error deleting order from Firestore:', error);
    }
  };

  const resetToDefaults = async () => {
    setProducts(INITIAL_PRODUCTS);
    setBanners(INITIAL_BANNERS);
    setPharmacyInfo(INITIAL_PHARMACY_INFO);
    setDeliverySettings(INITIAL_DELIVERY_SETTINGS);
    setPaymentMethods(INITIAL_PAYMENT_METHODS);
    setOrders(INITIAL_SAMPLE_ORDERS);
    setCart([]);
    setAdminPassword('admin123');
    localStorage.clear();
    await syncInitialDataToFirebase();
  };

  return (
    <PharmacyContext.Provider
      value={{
        products,
        categories,
        banners,
        pharmacyInfo,
        deliverySettings,
        paymentMethods,
        orders,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        hasPrescriptionItemsInCart,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        prescriptionFilterOnly,
        setPrescriptionFilterOnly,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastCreatedOrder,
        setLastCreatedOrder,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isAdminViewOpen,
        setIsAdminViewOpen,
        trackOrderModalOpen,
        setTrackOrderModalOpen,
        isAdmin,
        currentUser,
        adminLogin,
        loginWithGoogle,
        adminLogout,
        changeAdminPassword,
        isFirebaseConnected,
        syncInitialDataToFirebase,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        toggleProductFeatured,
        addCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        updatePharmacyInfo: updatePharmacyInfoState,
        updateDeliverySettings: updateDeliverySettingsState,
        updatePaymentMethod,
        addPaymentMethod,
        deletePaymentMethod,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        resetToDefaults,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
