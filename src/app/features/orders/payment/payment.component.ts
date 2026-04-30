import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { PaymentMode } from '../../../core/models/enums.model';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private cartService = inject(CartService);

  order: Order | null = null;
  selectedMode: PaymentMode = 'COD';
  isProcessing = false;

  ngOnInit() {
    const pendingOrderRaw = localStorage.getItem('shopsphere_pending_order');
    if (pendingOrderRaw) {
      this.order = JSON.parse(pendingOrderRaw);
    } else {
      this.toastService.error('No pending order found.');
      this.router.navigate(['/customer/cart']);
    }
  }

  onPayNow() {
    if (!this.order) return;
    this.isProcessing = true;

    // Step 1: processPayment
    this.orderService.processPayment({ orderId: this.order.id, paymentMode: this.selectedMode }).pipe(
      concatMap((res: any) => {
        if (res.success) {
          // Step 2: placeOrder
          return this.orderService.placeOrder({ orderId: this.order!.id });
        } else {
          throw res;
        }
      })
    ).subscribe({
      next: (res: any) => {
        if (res.success) {
          localStorage.removeItem('shopsphere_pending_order');
          this.cartService.clearCartCount();
          this.toastService.success('Order placed successfully');
          this.router.navigate(['/customer/orders']);
        } else {
          this.toastService.error(res.message || 'Payment processing failed');
          this.isProcessing = false;
        }
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || err.message || 'Payment failed';
        this.toastService.error(errorMsg);
        this.isProcessing = false;
      }
    });
  }
}
