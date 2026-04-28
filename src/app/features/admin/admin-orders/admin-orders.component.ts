import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { OrderStatus } from '../../../core/models/enums.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  providers: [DatePipe],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  allOrders: any[] = [];
  filteredOrders: any[] = [];
  isLoading = true;
  
  statusFilter = '';
  
  statusOptions: OrderStatus[] = [
    'DRAFT', 'CHECKOUT', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'FAILED'
  ];

  editingOrderId: number | null = null;
  editStatusValue = '';

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.adminService.getAllOrders().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allOrders = res.data;
          // Sort newest first
          this.allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          this.applyFilter();
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to fetch orders');
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    if (this.statusFilter) {
      this.filteredOrders = this.allOrders.filter(o => o.status === this.statusFilter);
    } else {
      this.filteredOrders = [...this.allOrders];
    }
  }

  onFilterChange() {
    this.applyFilter();
  }

  startEdit(order: any) {
    this.editingOrderId = order.id;
    this.editStatusValue = order.status;
  }

  cancelEdit() {
    this.editingOrderId = null;
    this.editStatusValue = '';
  }

  updateStatus(orderId: number) {
    if (!this.editStatusValue) return;

    this.adminService.updateOrderStatus(orderId, this.editStatusValue).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Order status updated successfully');
          this.fetchOrders(); // Refresh the list
          this.editingOrderId = null;
        } else {
          this.toastService.error(res.message || 'Failed to update status');
        }
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Error updating status');
      }
    });
  }
}
