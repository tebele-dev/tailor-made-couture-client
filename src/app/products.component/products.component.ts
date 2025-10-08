import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent, Product } from '../product-card.component/product-card.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  sortBy = 'featured';
  activeTab = 'all';
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private productService: ProductService) {
    this.products = this.productService.getAllProducts();
    this.applyFiltersAndSorting();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.applyFiltersAndSorting();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    this.applyFiltersAndSorting();
  }

  private applyFiltersAndSorting(): void {
    let working = [...this.products];

    // Filter by product type
    if (this.activeTab === 'ready') {
      working = working.filter(p => !p.isCustom);
    } else if (this.activeTab === 'custom') {
      working = working.filter(p => p.isCustom);
    }

    // Apply sorting
    if (this.sortBy === 'price-low') {
      working.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-high') {
      working.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'rating') {
      working.sort((a, b) => b.rating - a.rating);
    }

    this.filteredProducts = working;
  }
}