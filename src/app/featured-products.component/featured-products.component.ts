import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';
import { ProductCardComponent, Product } from '../product-card.component/product-card.component';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent {
  arrowRightIcon = ArrowRight;
  
  featuredProducts: Product[] = [
    {
      id: "1",
      name: "Signature Navy Suit",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
      category: "Suits",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Custom Shirt Collection",
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
    },
    {
      id: "4",
      name: "Evening Dress",
      price: 699.99,
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
      category: "Dresses",
      rating: 4.9,
      isCustom: true,
    },
  ];
}