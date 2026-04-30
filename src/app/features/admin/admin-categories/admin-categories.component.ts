import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private toastService = inject(ToastService);

  categories: Category[] = [];
  newCategoryName: string = '';
  isLoading: boolean = false;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.catalogService.getCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.categories = res.data || [];
        }
      },
      error: (err) => this.toastService.error('Failed to load categories')
    });
  }

  onCreate() {
    if (!this.newCategoryName.trim()) return;

    this.isLoading = true;
    this.catalogService.createCategory(this.newCategoryName.trim()).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Category created successfully');
          this.newCategoryName = '';
          this.loadCategories();
        }
      },
      error: (err) => this.toastService.error('Failed to create category'),
      complete: () => this.isLoading = false
    });
  }
}
