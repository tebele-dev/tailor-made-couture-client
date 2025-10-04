import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header.component/header.component';
import { ProductCardComponent, Product } from '../product-card.component/product-card.component';

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

  products: Product[] = [
    {
      id: "1",
      name: "Classic Navy Suit",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
      category: "Suits",
      rating: 4.8,
      isCustom: false,
    },
    {
      id: "2",
      name: "Custom Tailored Shirt",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop",
      category: "Shirts",
      rating: 4.9,
      isCustom: true,
    },
    {
      id: "3",
      name: "Premium Wool Blazer",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
      category: "Blazers",
      rating: 4.7,
      isCustom: false,
    },
    {
      id: "4",
      name: "Custom Wedding Suit",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop",
      category: "Suits",
      rating: 5.0,
      isCustom: true,
    },
    {
      id: "5",
      name: "Business Trousers",
      price: 179.99,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop",
      category: "Trousers",
      rating: 4.6,
      isCustom: false,
    },
    {
      id: "6",
      name: "Custom Evening Dress",
      price: 699.99,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
      category: "Dresses",
      rating: 4.9,
      isCustom: true,
    },
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
  }
}