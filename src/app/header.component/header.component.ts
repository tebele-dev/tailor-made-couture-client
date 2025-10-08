import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

// Correct Lucide Angular imports
import { LucideAngularModule, Scissors, ShoppingCart, Menu, X, ChevronDown } from 'lucide-angular';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  mobileMenuOpen = false;
  userMenuOpen = false;

  // Define icons for template use
  scissorsIcon = Scissors;
  shoppingCartIcon = ShoppingCart;
  menuIcon = Menu;
  xIcon = X;
  chevronDownIcon = ChevronDown;

  // Computed properties
  cartCount;
  isAuthenticated;
  user;

  constructor(
    public cart: CartService, 
    public auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      this.auth.hydrateFromStorage(); 
    }
    this.cartCount = this.cart.count;
    this.isAuthenticated = this.auth.isAuthenticated;
    this.user = this.auth.user;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  // Computed property for mobile menu icon
  get mobileMenuIcon() {
    return this.mobileMenuOpen ? this.xIcon : this.menuIcon;
  }

  logoutAndGoHome(): void {
    this.auth.logout();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  openUserMenu(): void {
    this.userMenuOpen = true;
  }

  toggleUserMenuOnFocus(): void {
    this.userMenuOpen = true;
  }

  closeUserMenuOnBlur(): void {
    // Add a small delay to allow for menu item selection
    setTimeout(() => {
      this.userMenuOpen = false;
    }, 150);
  }


}