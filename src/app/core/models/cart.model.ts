export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  cartId: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
}
