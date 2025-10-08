import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProductService, ProductDetail } from '../services/product.service';
import { LucideAngularModule } from 'lucide-angular';

interface FabricOption {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'tertiary';
  image: string;
  priceModifier: number; // Percentage increase/decrease
  description: string;
  swatchColor: string;
}

interface FabricCategory {
  name: string;
  options: FabricOption[];
}

@Component({
  selector: 'app-fabric',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.scss']
})
export class FabricComponent implements OnInit {
  products: ProductDetail[] = [];
  selectedProduct: ProductDetail | null = null;
  fabricCategories: FabricCategory[] = [];
  selectedFabric: { [key: string]: FabricOption } = {};
  searchQuery = '';
  selectedCategory = 'all';
  
  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Suits', label: 'Suits' },
    { value: 'Shirts', label: 'Shirts' },
    { value: 'Blazers', label: 'Blazers' },
    { value: 'Trousers', label: 'Trousers' },
    { value: 'Dresses', label: 'Dresses' }
  ];

  constructor(
    public auth: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initializeFabricOptions();
  }

  loadProducts(): void {
    this.products = this.productService.getAllProducts();
  }

  initializeFabricOptions(): void {
    // In a real app, this would come from an API based on product design
    this.fabricCategories = [
      {
        name: 'Primary Fabric',
        options: [
          {
            id: 'fabric_1',
            name: 'Italian Wool',
            category: 'primary',
            image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400&h=400&fit=crop',
            priceModifier: 0,
            description: 'Premium Italian wool with superior texture and drape',
            swatchColor: '#2c3e50'
          },
          {
            id: 'fabric_2',
            name: 'Cashmere Blend',
            category: 'primary',
            image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400&h=400&fit=crop&grayscale',
            priceModifier: 25,
            description: 'Luxurious cashmere blend for ultimate comfort',
            swatchColor: '#8b4513'
          },
          {
            id: 'fabric_3',
            name: 'Linen',
            category: 'primary',
            image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400&h=400&fit=crop&sat=-100',
            priceModifier: -10,
            description: 'Lightweight linen perfect for summer wear',
            swatchColor: '#f5deb3'
          }
        ]
      },
      {
        name: 'Secondary Fabric',
        options: [
          {
            id: 'fabric_4',
            name: 'Silk Lining',
            category: 'secondary',
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
            priceModifier: 15,
            description: 'Smooth silk lining for enhanced comfort',
            swatchColor: '#fff0f5'
          },
          {
            id: 'fabric_5',
            name: 'Polyester Blend',
            category: 'secondary',
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&grayscale',
            priceModifier: 0,
            description: 'Durable polyester blend lining',
            swatchColor: '#d3d3d3'
          }
        ]
      },
      {
        name: 'Tertiary Fabric',
        options: [
          {
            id: 'fabric_6',
            name: 'Buttonhole Thread',
            category: 'tertiary',
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop',
            priceModifier: 5,
            description: 'Premium thread for buttonholes',
            swatchColor: '#000000'
          },
          {
            id: 'fabric_7',
            name: 'Contrast Fabric',
            category: 'tertiary',
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop&grayscale',
            priceModifier: 10,
            description: 'Contrast fabric for detailing',
            swatchColor: '#dc143c'
          }
        ]
      }
    ];
  }

  get filteredProducts(): ProductDetail[] {
    return this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           product.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  selectProduct(product: ProductDetail): void {
    this.selectedProduct = product;
    // Reset fabric selections when changing products
    this.selectedFabric = {};
  }

  selectFabric(category: string, fabric: FabricOption): void {
    this.selectedFabric[category] = fabric;
  }

  getSelectedFabric(category: string): FabricOption | undefined {
    return this.selectedFabric[category];
  }

  getSelectedFabricCount(): number {
    return Object.keys(this.selectedFabric).length;
  }

  calculateTotalPrice(): number {
    if (!this.selectedProduct) return 0;
    
    let totalPrice = this.selectedProduct.price;
    
    // Add price modifiers from selected fabrics
    Object.values(this.selectedFabric).forEach(fabric => {
      if (fabric) {
        totalPrice += (this.selectedProduct!.price * fabric.priceModifier) / 100;
      }
    });
    
    return totalPrice;
  }

  saveFabricSelection(): void {
    if (this.selectedProduct) {
      alert(`Fabric selection for ${this.selectedProduct.name} has been saved!`);
    }
  }

  cancelSelection(): void {
    this.selectedProduct = null;
    this.selectedFabric = {};
  }
}