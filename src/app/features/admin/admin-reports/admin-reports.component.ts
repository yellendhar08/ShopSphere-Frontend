import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css'
})
export class AdminReportsComponent implements OnInit {
  private adminService = inject(AdminService);

  isLoading = true;
  totalOrders = 0;
  totalRevenue = 0;
  averageOrderValue = 0;
  statusCounts: { [key: string]: number } = {};
  statusKeys: string[] = [];

  ngOnInit() {
    this.adminService.getReports().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.calculateStats(res.data);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  calculateStats(orders: any[]) {
    this.totalOrders = orders.length;
    
    // Group by status
    orders.forEach(order => {
      const s = order.status;
      if (this.statusCounts[s]) {
        this.statusCounts[s]++;
      } else {
        this.statusCounts[s] = 1;
      }
    });
    this.statusKeys = Object.keys(this.statusCounts);

    // Total revenue from DELIVERED orders
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
    this.totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Average order value over all non-failed/cancelled orders
    const validOrders = orders.filter(o => o.status !== 'FAILED' && o.status !== 'CANCELLED');
    if (validOrders.length > 0) {
      const validTotal = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      this.averageOrderValue = validTotal / validOrders.length;
    } else {
      this.averageOrderValue = 0;
    }
  }
}
