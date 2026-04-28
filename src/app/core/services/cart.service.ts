import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Cart, CartItemRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/orders/cart`;
  
  cartCount$ = new BehaviorSubject<number>(0);

  getCart(): Observable<ApiResponse<Cart>> {
    return this.http.get<ApiResponse<Cart>>(this.baseUrl).pipe(
      tap(res => {
        if (res?.data) {
          const count = res.data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
          this.cartCount$.next(count);
        }
      })
    );
  }

  addToCart(request: CartItemRequest): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${this.baseUrl}/items`, request).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  updateItem(itemId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${this.baseUrl}/items/${itemId}`, { quantity }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  removeItem(itemId: number): Observable<ApiResponse<Cart>> {
    return this.http.delete<ApiResponse<Cart>>(`${this.baseUrl}/items/${itemId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  refreshCartCount(): void {
    this.getCart().subscribe();
  }

  clearCartCount(): void {
  this.cartCount$.next(0);
  }
}
