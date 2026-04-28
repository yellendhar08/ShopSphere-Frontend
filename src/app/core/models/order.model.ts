import { OrderStatus, PaymentMode } from './enums.model';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  paymentMode: PaymentMode;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutRequest {
  shippingAddress: string;
}

export interface PaymentRequest {
  orderId: number;
  paymentMode: PaymentMode;
}

export interface PlaceOrderRequest {
  orderId: number;
}
