export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  categoryName: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  categoryId: number;
}

export interface PagedProducts {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
