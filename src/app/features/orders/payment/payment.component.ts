import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { concatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

declare var Razorpay: any;

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
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private ngZone = inject(NgZone);

  order: Order | null = null;
  selectedMode: 'COD' | 'PREPAID' = 'COD';
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
    if (!this.order || this.isProcessing) return;

    if (this.selectedMode === 'COD') {
      this.processCOD();
    } else {
      this.openRazorpay();
    }
  }

  processCOD() {
    this.isProcessing = true;
    this.orderService.processPayment({ orderId: this.order!.id, paymentMode: 'COD' }).pipe(
      concatMap((res: any) => {
        if (res.success) {
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
          this.toastService.success('Order placed successfully!');
          this.router.navigate(['/customer/orders']);
        } else {
          this.toastService.error(res.message || 'Order failed');
          this.isProcessing = false;
        }
      },
      error: (err: any) => {
        this.toastService.error(err.error?.message || 'Payment failed');
        this.isProcessing = false;
      }
    });
  }

  openRazorpay() {
    if (!this.order) return;

    const options = {
      key: environment.razorpayKey,
      amount: this.order.totalAmount * 100, // Razorpay uses paise
      currency: 'INR',
      name: 'ShopSphere',
      description: `Order #${this.order.id}`,
      image: 'assets/images/logo.png',
      handler: (response: any) => {
        this.ngZone.run(() => {
          // Payment successful — call backend
          this.isProcessing = true;
          this.orderService.processPayment({ orderId: this.order!.id, paymentMode: 'PREPAID' as any }).pipe(
            concatMap((res: any) => {
              if (res.success) {
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
                this.toastService.success('Payment successful! Order placed.');
                this.router.navigate(['/customer/orders']);
              } else {
                this.toastService.error(res.message || 'Order failed');
                this.isProcessing = false;
              }
            },
            error: (err: any) => {
              this.toastService.error(err.error?.message || 'Order failed after payment');
              this.isProcessing = false;
            }
          });
        });
      },
      prefill: {
        name: 'ShopSphere Customer',
        email: '',
        contact: ''
      },
      theme: {
        color: '#FF6B00'
      },
      modal: {
        ondismiss: () => {
          this.toastService.error('Payment cancelled.');
          this.isProcessing = false;
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
