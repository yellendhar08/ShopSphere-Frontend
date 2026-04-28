import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;

  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  get imageUrl(): string {
    return this.product?.imageUrl || 'https://placehold.co/400x300?text=No+Image';
  }

  get isOutOfStock(): boolean {
    return !this.product || this.product.stock <= 0;
  }

  onCardClick() {
    if (this.product && this.product.id) {
      this.router.navigate(['/products', this.product.id]);
    }
  }

  addToCart(event: Event) {
    event.stopPropagation();
    
    if (this.isOutOfStock) return;

    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.cartService.addToCart({ productId: this.product.id, quantity: 1 }).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.toastService.success('Added to cart!');
            } else {
              this.toastService.error(res.message || 'Failed to add to cart');
            }
          },
          error: (err: any) => {
            this.toastService.error(err.error?.message || 'Error adding to cart');
          }
        });
      }
    });
  }
}
