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
  description: string;
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
  features: string[];
  price: string;
  priceFrom?: boolean;
  specification: string;
  images: string[];
  placeholder: boolean;
  details?: ProductDetails;
};

export type ProductsData = {
  categories: Category[];
  products: Product[];
  factoryGallery: string[];
  factoryCaptions?: Record<string, string>;
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
    customNotes: string;
  };
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
};

export type OrderInput = Omit<OrderRecord, "orderId" | "createdAt" | "status"> & {
  status?: OrderStatus;
};
