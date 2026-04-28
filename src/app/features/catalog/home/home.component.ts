import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private catalogService = inject(CatalogService);
  
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  ngOnInit() {
    this.catalogService.getFeaturedProducts().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.featuredProducts = res.data;
        }
      }
    });

    this.catalogService.getCategories().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
      }
    });
  }
}
