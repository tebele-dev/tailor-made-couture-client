import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header.component/header.component';
import { LucideAngularModule, ShoppingBag } from 'lucide-angular';
import { CartService } from '../services/cart.service';

/**
 * Cart component for displaying and managing shopping cart items
 * Allows users to view, update quantities, and remove items from their cart
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  // Icon for empty cart display
  shoppingBagIcon = ShoppingBag;
  
  // Reactive references to cart data
  cartItems;
  total;

  constructor(private cart: CartService) {
    this.cartItems = this.cart.items;
    this.total = this.cart.total;
  }

  /**
   * Update the quantity of a cart item
   * @param productId - The ID of the product to update
   * @param qty - The new quantity
   */
  updateQty(productId: string, qty: number): void { 
    this.cart.setQuantity(productId, Math.max(1, Number(qty))); 
  }

  /**
   * Remove an item from the cart
   * @param productId - The ID of the product to remove
   */
  remove(productId: string): void { 
    this.cart.remove(productId); 
  }
}