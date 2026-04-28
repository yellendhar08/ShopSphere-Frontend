import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  providers: [DatePipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  
  orders: Order[] = [];
  isLoading = true;

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          // Sort newest first
          this.orders = res.data.sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
