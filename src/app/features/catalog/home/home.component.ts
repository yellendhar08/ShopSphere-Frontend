import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
export class HomeComponent implements OnInit, OnDestroy {
  private catalogService = inject(CatalogService);
  private router = inject(Router);

  featuredProducts: Product[] = [];
  categories: Category[] = [];

  // Carousel Logic
  slides = [
    { image: 'assets/images/slide1.png', categoryId: 2, label: 'Mobiles' },
    { image: 'assets/images/slide2.png', categoryId: 3, label: 'Clothing' },
    { image: 'assets/images/slide3.png', categoryId: 4, label: 'Furniture' }
  ];
  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.fetchFeaturedProducts();
    this.fetchCategories();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  fetchFeaturedProducts() {
    this.catalogService.getFeaturedProducts().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.featuredProducts = res.data;
        }
      }
    });
  }

  fetchCategories() {
    this.catalogService.getCategories().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
      }
    });
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoSlide();
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  onSlideClick(categoryId: number) {
    this.router.navigate(['/customer/products'], {
      queryParams: { categoryId, sortBy: 'newest' }
    });
  }

  getCategoryIcon(name: string): string {
    const icons: { [key: string]: string } = {
      electronics: '💻',
      mobiles: '📱',
      clothing: '👕',
      furniture: '🛋️',
      groceries: '🛒',
      footwear: '👟',
      sports: '⚽',
      books: '📚',
      skincare: '🧴'
    };

    return icons[name.toLowerCase()] || '🏷️';
  }
}
