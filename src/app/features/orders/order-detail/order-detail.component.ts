import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderStatus } from '../../../core/models/enums.model';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  providers: [DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  order: Order | null = null;
  isLoading = true;

  timelineStatuses: OrderStatus[] = [
    'CHECKOUT', 'PLACED', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED'
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchOrder(+id);
      }
    });
  }

  fetchOrder(id: number) {
    this.isLoading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.order = res.data;
        } else {
          this.toastService.error('Order not found');
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load order details');
        this.isLoading = false;
      }
    });
  }

  isStatusReached(targetStatus: OrderStatus): boolean {
    if (!this.order) return false;
    if (this.order.status === 'CANCELLED' || this.order.status === 'FAILED') return false;

    const currentIndex = this.timelineStatuses.indexOf(this.order.status);
    const targetIndex = this.timelineStatuses.indexOf(targetStatus);
    
    // If the target index is less than or equal to current index, it's reached
    return targetIndex !== -1 && currentIndex !== -1 && targetIndex <= currentIndex;
  }
}
