// Store Types for Verdleaf Eco Store

export interface StoreOrder {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPoints: number;
  totalETH: string;
  paymentMethod: 'points' | 'crypto';
  transactionHash?: string;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

export interface PurchaseRequest {
  productId: string;
  quantity: number;
  paymentMethod: 'points' | 'crypto';
  walletAddress?: string;
  shippingAddress?: ShippingAddress;
}

export interface PurchaseResponse {
  success: boolean;
  orderId?: string;
  message: string;
  transactionHash?: string;
  newPointsBalance?: number;
  error?: string;
}

export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  productId: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

// Store statistics for dashboard
export interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalCarbonOffset: number;
  topCategories: { category: string; count: number }[];
  recentOrders: StoreOrder[];
}
