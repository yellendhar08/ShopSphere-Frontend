import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Product, PagedProducts } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);

  products: Product[] = [];
  categories: Category[] = [];
  
  // URL Params State
  search = '';
  categoryId: number | null = null;
  page = 0;
  size = 10;
  sortBy = 'name';
  
  // Pagination State
  totalPages = 0;

  sortOptions = [
    { label: 'Name A-Z', value: 'name' },
    { label: 'Price Low to High', value: 'priceAsc' },
    { label: 'Price High to Low', value: 'priceDesc' },
    { label: 'Newest', value: 'newest' }
  ];

  ngOnInit() {
    this.catalogService.getCategories().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      this.search = params['search'] || '';
      this.categoryId = params['categoryId'] ? +params['categoryId'] : null;
      this.page = params['page'] ? +params['page'] : 0;
      this.size = params['size'] ? +params['size'] : 10;
      this.sortBy = params['sortBy'] || 'name';

      this.fetchProducts();
    });
  }

  fetchProducts() {
    const params: any = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy
    };
    if (this.search) params.search = this.search;
    if (this.categoryId) params.categoryId = this.categoryId;

    this.catalogService.getProducts(params).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.products = res.data.content;
          this.totalPages = res.data.totalPages;
        }
      }
    });
  }

  updateUrlParams() {
    const queryParams: any = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy
    };
    if (this.search) queryParams.search = this.search;
    if (this.categoryId) queryParams.categoryId = this.categoryId;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onFilterChange() {
    this.page = 0; // reset to first page on filter change
    this.updateUrlParams();
  }

  onCategorySelect(id: number | null) {
    this.categoryId = id;
    this.onFilterChange();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.updateUrlParams();
  }
}
