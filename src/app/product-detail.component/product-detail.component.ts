import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService, ProductDetail } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { LucideAngularModule } from 'lucide-angular';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  product?: ProductDetail;
  selectedImageIndex = 0;
  selectedTab = 'description';

  constructor(
    route: ActivatedRoute, 
    productService: ProductService, 
    private cart: CartService,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {
    const id = route.snapshot.paramMap.get('id');
    if (id) {
      this.product = productService.getProductById(id);
      // Removed automatic redirect for custom products to allow viewing product details first
      // If this is a custom product, user can choose to customize it via the button
    }
  }

  setSelectedImage(index: number): void {
    this.selectedImageIndex = index;
  }

  addToCart(): void {
    try {
      if (this.product) {
        this.cart.add(this.product, 1);
        this.errorHandlerService.showSuccess('Item added to cart successfully');
      }
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to add item to cart');
    }
  }

  setSelectedTab(tab: string): void {
    this.selectedTab = tab;
  }

  getFloor(value: number): number {
    return Math.floor(value);
  }

  // Method to navigate to custom design studio for this product
  customizeProduct(): void {
    try {
      if (this.product) {
        this.router.navigate(['/custom-design'], { queryParams: { productId: this.product.id } });
      }
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to navigate to custom design studio');
    }
  }
}