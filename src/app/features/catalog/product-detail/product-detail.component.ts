import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  product: Product | null = null;
  quantity = 1;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProductDetails(+id);
      }
    });
  }

  fetchProductDetails(id: number) {
    this.catalogService.getProductById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.product = res.data;
          this.quantity = 1;
        } else {
          this.toastService.error('Product not found');
          this.router.navigate(['/products']);
        }
      },
      error: () => {
        this.toastService.error('Failed to load product details');
        this.router.navigate(['/products']);
      }
    });
  }

  get imageUrl(): string {
    return this.product?.imageUrl || 'https://placehold.co/400x300?text=No+Image';
  }

  get isOutOfStock(): boolean {
    return !this.product || this.product.stock <= 0;
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product || this.isOutOfStock) return;

    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.cartService.addToCart({ productId: this.product!.id, quantity: this.quantity }).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.toastService.success('Added to cart successfully!');
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
