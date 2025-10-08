import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { Product } from '../product-card.component/product-card.component';
import { ErrorHandlerService } from './error-handler.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSig = signal<CartItem[]>(this.readFromStorage());

  readonly items = computed(() => this.itemsSig());
  readonly count = computed(() => this.itemsSig().reduce((acc, it) => acc + it.quantity, 0));
  readonly total = computed(() => this.itemsSig().reduce((acc, it) => acc + it.quantity * it.product.price, 0));

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private errorHandlerService: ErrorHandlerService) {}

  /**
   * Add a product to the cart
   * @param product - The product to add
   * @param quantity - The quantity to add (default: 1)
   */
  add(product: Product, quantity = 1): void {
    try {
      // Validate inputs
      if (!product || quantity <= 0) {
        this.errorHandlerService.showError('Invalid product or quantity');
        return;
      }

      const items = [...this.itemsSig()];
      const idx = items.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        // Update existing item quantity
        const newQuantity = items[idx].quantity + quantity;
        if (newQuantity > 0) {
          items[idx] = { ...items[idx], quantity: newQuantity };
        } else {
          // Remove item if quantity is 0 or less
          items.splice(idx, 1);
        }
      } else {
        // Add new item
        items.push({ product, quantity });
      }
      this.persist(items);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to add item to cart');
    }
  }

  /**
   * Remove a product from the cart
   * @param productId - The ID of the product to remove
   */
  remove(productId: string): void {
    try {
      // Validate input
      if (!productId) {
        this.errorHandlerService.showError('Invalid product ID');
        return;
      }

      const items = this.itemsSig().filter(i => i.product.id !== productId);
      this.persist(items);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to remove item from cart');
    }
  }

  /**
   * Set the quantity of a product in the cart
   * @param productId - The ID of the product
   * @param quantity - The new quantity
   */
  setQuantity(productId: string, quantity: number): void {
    try {
      // Validate inputs
      if (!productId || quantity < 0) {
        this.errorHandlerService.showError('Invalid product ID or quantity');
        return;
      }

      let items = this.itemsSig();
      if (quantity === 0) {
        // Remove item if quantity is 0
        items = items.filter(i => i.product.id !== productId);
      } else {
        // Update quantity or add new item
        const idx = items.findIndex(i => i.product.id === productId);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity };
        } else {
          // This shouldn't happen in normal usage, but handle it gracefully
          this.errorHandlerService.showError('Product not found in cart');
          return;
        }
      }
      this.persist(items);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to update item quantity');
    }
  }

  /**
   * Clear all items from the cart
   */
  clear(): void { 
    try {
      this.persist([]);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to clear cart');
    }
  }

  /**
   * Persist cart items to storage
   * @param items - The cart items to persist
   */
  private persist(items: CartItem[]): void {
    try {
      this.itemsSig.set(items);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('tmc_cart', JSON.stringify(items));
      }
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to save cart data');
    }
  }

  /**
   * Read cart items from storage
   * @returns Array of cart items
   */
  private readFromStorage(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    
    try {
      const raw = localStorage.getItem('tmc_cart');
      if (!raw) return [];
      
      const parsed = JSON.parse(raw);
      
      // Validate the structure of the parsed data
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid cart data format');
      }
      
      // Validate each item in the cart
      const validItems: CartItem[] = [];
      for (const item of parsed) {
        if (item && item.product && typeof item.quantity === 'number' && item.quantity > 0) {
          validItems.push(item);
        }
      }
      
      return validItems;
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to load cart data');
      // Clear invalid data
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('tmc_cart');
      }
      return [];
    }
  }
}

