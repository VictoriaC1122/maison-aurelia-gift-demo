export type DeliveryMethod = "home" | "cvs_711" | "cvs_family";
export type PaymentMethod = "bank_transfer" | "cod";
export type PaymentStatus = "unpaid" | "reported" | "paid" | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "completed"
  | "cancelled";

export type Category = {
  slug: string;
  name: string;
  englishName: string;
  /** 英文版顯示的系列名稱 */
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  coverImage: string;
  sourceFolder: string;
};

export type ProductDetails = {
  netContent?: string;
  nestContent?: string;
  ingredients?: string;
  sweetness?: string;
  howToEnjoy?: string;
  storage?: string;
  shelfLife?: string;
  origin?: string;
  manufacturer?: string;
  allergens?: string;
  nutrition?: string;
};

export type Product = {
  slug: string;
  name: string;
  nameZh: string;
  category: string;
  summary: string;
  summaryEn?: string;
  features: string[];
  featuresEn?: string[];
  price: string;
  priceFrom?: boolean;
  specification: string;
  images: string[];
  placeholder: boolean;
  details?: ProductDetails;
  /** 英文版的商品標示；未填寫的欄位會沿用中文 */
  detailsEn?: ProductDetails;
};

export type ProductsData = {
  categories: Category[];
  products: Product[];
  factoryGallery: string[];
  factoryCaptions?: Record<string, string>;
  factoryCaptionsEn?: Record<string, string>;
};

export type FaqItem = {
  question: string;
  answer: string;
  questionEn?: string;
  answerEn?: string;
};

export type ContactData = {
  name: string;
  title: string;
  phone: string;
  email: string;
  line: string;
  instagram: string;
  address: string;
  businessHours: string;
  notes: string;
};

export type SiteData = {
  brandName: string;
  brandNameZh: string;
  englishSlogan: string;
  chineseSlogan: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  socialLinks: {
    instagram: string;
    line: string;
  };
  company: {
    legalName: string;
    taxId: string;
    foodBusinessRegistrationNo: string;
    productLiabilityInsurance: string;
    address: string;
  };
  shippingPolicy: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    /** 超商取貨運費；null 代表由顧問確認 */
    cvsShippingFee: number | null;
    customNotes: string;
  };
  delivery: Record<DeliveryMethod, boolean>;
  payment: {
    bank_transfer: boolean;
    cod: boolean;
    bankAccount: {
      bankName: string;
      bankCode: string;
      branch: string;
      accountNumber: string;
      accountName: string;
    };
    transferDeadlineDays: number;
  };
};

export type OrderItem = {
  slug: string;
  name: string;
  spec: string;
  quantity: number;
  unitPrice: number | null;
};

export type OrderRecord = {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  lineId: string;
  address: string;
  productName: string;
  category: string;
  quantity: number;
  option: string;
  preferredDeliveryDate: string;
  note: string;
  status: OrderStatus;
  adminNote?: string;
  items?: OrderItem[];
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentLast5?: string;
  quotedTotal?: number | null;
  trackingNumber?: string;
};

export type OrderInput = Omit<OrderRecord, "orderId" | "createdAt" | "status"> & {
  status?: OrderStatus;
};
