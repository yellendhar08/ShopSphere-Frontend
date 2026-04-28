import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private toastService = inject(ToastService);

  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: Category[] = [];
  isSubmitting = false;
  isLoading = true;

  ngOnInit() {
    this.initForm();
    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProduct(this.productId);
      } else {
        this.isLoading = false;
      }
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      isFeatured: [false]
    });
  }

  loadCategories() {
    this.catalogService.getCategories().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
      }
    });
  }

  loadProduct(id: number) {
    this.catalogService.getProductById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const p = res.data;
          this.productForm.patchValue({
            name: p.name,
            description: p.description,
            imageUrl: p.imageUrl,
            price: p.price,
            stock: p.stock,
            categoryId: p.categoryId,
            isFeatured: p.isFeatured
          });
        } else {
          this.toastService.error('Product not found');
          this.router.navigate(['/admin/products']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load product details');
        this.isLoading = false;
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.catalogService.updateProduct(this.productId, formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success('Product updated successfully');
            this.router.navigate(['/admin/products']);
          } else {
            this.toastService.error(res.message || 'Update failed');
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Error updating product');
          this.isSubmitting = false;
        }
      });
    } else {
      this.catalogService.createProduct(formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastService.success('Product created successfully');
            this.router.navigate(['/admin/products']);
          } else {
            this.toastService.error(res.message || 'Creation failed');
          }
          this.isSubmitting = false;
        },
        error: (err) => {
          this.toastService.error(err.error?.message || 'Error creating product');
          this.isSubmitting = false;
        }
      });
    }
  }

  isInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
