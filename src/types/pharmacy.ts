export type PrescriptionType = 'nenhuma' | 'simples' | 'controlada' | 'antibiotico';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  promotionalPrice?: number;
  image: string;
  inStock: boolean;
  stockQuantity?: number;
  requiresPrescription: boolean;
  prescriptionType?: PrescriptionType;
  dosageOrVolume?: string;
  manufacturer?: string;
  isFeatured: boolean;
  activeIngredient?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
}

export type ThemeColorPreset = 'emerald' | 'blue' | 'red' | 'cyan' | 'purple' | 'orange';

export interface PharmacyInfo {
  name: string;
  tagline: string;
  cnpj: string;
  responsiblePharmacist: string;
  crf: string;
  phone: string;
  whatsappNumber: string; // E.g. "5511999998888" (digits only with country code)
  whatsappDisplay: string; // E.g. "(11) 99999-8888"
  email: string;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressCep: string;
  googleMapsUrl: string;
  openingHoursWeekdays: string;
  openingHoursSaturday: string;
  openingHoursSunday: string;
  prescriptionNotice: string;
  themePreset?: ThemeColorPreset;
  primaryColorHex?: string;
}

export interface DeliverySettings {
  deliveryFee: number;
  freeDeliveryThreshold: number; // Order value to qualify for free delivery
  estimatedDeliveryTime: string;
  deliveryInstructions: string;
  coverageAreas: string[];
  pickupEstimatedTime: string;
  pickupInstructions: string;
}

export type PaymentType = 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'payment_link';

export interface PaymentMethodConfig {
  id: string;
  type: PaymentType;
  name: string;
  description: string;
  instructions: string;
  enabled: boolean;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  pixReceiverName?: string;
  pixQrCodeImage?: string;
  paymentLinkUrl?: string;
  acceptsChangeForCash?: boolean;
}

export interface CarouselBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  categoryFilter?: string;
  discountBadge?: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalItemPrice: number;
  requiresPrescription: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'waiting_payment'
  | 'out_for_delivery'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerCpf?: string;
  fulfillmentType: 'delivery' | 'pickup';
  deliveryAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    referencePoint?: string;
  };
  paymentMethodId: string;
  paymentMethodName: string;
  cashChangeFor?: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  hasPrescriptionItems: boolean;
  prescriptionAcknowledged: boolean;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'pay_on_delivery';
}
