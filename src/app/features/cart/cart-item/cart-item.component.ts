import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../../core/models/cart.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() cartUpdated = new EventEmitter<void>();

  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  get imageUrl(): string {
    return this.item?.imageUrl || 'https://placehold.co/400x300?text=No+Image';
  }

  increaseQuantity() {
    this.cartService.updateItem(this.item.id, this.item.quantity + 1).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastService.success('Cart updated');
          this.cartUpdated.emit();
        } else {
          this.toastService.error(res.message || 'Update failed');
        }
      },
      error: (err: any) => this.toastService.error(err.error?.message || 'Error updating cart')
    });
  }

  decreaseQuantity() {
    if (this.item.quantity <= 1) {
      this.removeItem();
    } else {
      this.cartService.updateItem(this.item.id, this.item.quantity - 1).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastService.success('Cart updated');
            this.cartUpdated.emit();
          } else {
            this.toastService.error(res.message || 'Update failed');
          }
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Error updating cart')
      });
    }
  }

  removeItem() {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeItem(this.item.id).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastService.success('Item removed from cart');
            this.cartUpdated.emit();
          } else {
            this.toastService.error(res.message || 'Removal failed');
          }
        },
        error: (err: any) => this.toastService.error(err.error?.message || 'Error removing item')
      });
    }
  }
}
