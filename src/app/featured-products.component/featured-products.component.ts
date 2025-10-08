import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';
import { ProductCardComponent, Product } from '../product-card.component/product-card.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent {
  arrowRightIcon = ArrowRight;
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {
    this.featuredProducts = this.productService.getFeaturedProducts();
  }
}