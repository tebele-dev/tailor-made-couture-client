import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import type { Product } from '../product-card.component/product-card.component';
import { ProductService } from '../services/product.service';
import { LucideAngularModule } from 'lucide-angular';

interface InventoryItem extends Product {
  stock: number;
  supplier: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  newProduct: Partial<InventoryItem> = {
    name: '',
    price: 0,
    image: '',
    category: '',
    rating: 0,
    stock: 0,
    supplier: '',
    isCustom: false
  };
  editingItem: InventoryItem | null = null;
  showAddForm = false;
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
    this.loadInventory();
  }

  loadInventory(): void {
    // In a real app, this would come from an API
    const products = this.productService.getAllProducts();
    this.inventoryItems = products.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 100) + 10, // Random stock for demo
      supplier: ['Premium Textiles Co.', 'Luxury Fabrics Ltd.', 'Elite Materials Inc.'][Math.floor(Math.random() * 3)],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  }

  get filteredInventory(): InventoryItem[] {
    return this.inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           item.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  // Calculate total stock
  getTotalStock(): number {
    return this.inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  }

  // Calculate inventory value
  getInventoryValue(): string {
    const total = this.inventoryItems.reduce((sum, item) => sum + (item.price * item.stock), 0);
    return total.toFixed(2);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      image: '',
      category: '',
      rating: 0,
      stock: 0,
      supplier: '',
      isCustom: false
    };
    this.editingItem = null;
  }

  addProduct(): void {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    const product: InventoryItem = {
      id: 'prod_' + Date.now(),
      name: this.newProduct.name!,
      price: this.newProduct.price!,
      image: this.newProduct.image || 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop',
      category: this.newProduct.category!,
      rating: this.newProduct.rating || 0,
      isCustom: this.newProduct.isCustom || false,
      stock: this.newProduct.stock || 0,
      supplier: this.newProduct.supplier || '',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    this.inventoryItems.push(product);
    this.resetForm();
    this.showAddForm = false;
  }

  editProduct(item: InventoryItem): void {
    this.editingItem = item;
    this.newProduct = { ...item };
    this.showAddForm = true;
  }

  updateProduct(): void {
    if (!this.editingItem || !this.newProduct.name || !this.newProduct.price || !this.newProduct.category) {
      alert('Please fill in all required fields');
      return;
    }

    const index = this.inventoryItems.findIndex(item => item.id === this.editingItem!.id);
    if (index !== -1) {
      this.inventoryItems[index] = {
        ...this.inventoryItems[index],
        ...this.newProduct,
        lastUpdated: new Date().toISOString().split('T')[0]
      } as InventoryItem;
    }

    this.resetForm();
    this.showAddForm = false;
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
    }
  }

  saveProduct(): void {
    if (this.editingItem) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  cancelEdit(): void {
    this.resetForm();
    this.showAddForm = false;
  }
}