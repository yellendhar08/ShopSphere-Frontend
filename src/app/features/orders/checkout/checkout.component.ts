import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../../core/models/cart.model';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  cart: Cart | null = null;
  area = '';
  city = '';
  pincode = '';
  isProcessing = false;

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.cart = res.data;
          if (!this.cart?.items || this.cart?.items.length === 0) {
            this.router.navigate(['/customer/cart']);
          }
        }
      }
    });
  }

  onSubmit() {
    if (!this.area.trim() || !this.city.trim() || !this.pincode.trim()) {
      this.toastService.error('Please fill all address fields');
      return;
    }

    const fullAddress = `${this.area.trim()}, ${this.city.trim()} - ${this.pincode.trim()}`;
    this.isProcessing = true;
    this.orderService.startCheckout({ shippingAddress: fullAddress }).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          localStorage.setItem('shopsphere_pending_order', JSON.stringify(res.data));
          this.router.navigate(['/customer/payment']);
        } else {
          this.toastService.error(res.message || 'Checkout failed');
        }
        this.isProcessing = false;
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Error starting checkout');
        this.isProcessing = false;
      }
    });
  }
}
