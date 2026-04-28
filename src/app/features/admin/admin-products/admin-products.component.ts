import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private toastService = inject(ToastService);

  products: Product[] = [];
  isLoading = true;

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.catalogService.getProducts({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products = res.data.content;
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to fetch products');
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      this.catalogService.deleteProduct(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success('Product deleted successfully');
            this.fetchProducts();
          } else {
            this.toastService.error(res.message || 'Failed to delete product');
          }
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Error deleting product');
        }
      });
    }
  }
}
