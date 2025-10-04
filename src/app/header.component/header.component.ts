import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Correct Lucide Angular imports
import { LucideAngularModule } from 'lucide-angular';
import { Scissors, ShoppingCart, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  mobileMenuOpen = false;

  // Define icons for template use
  scissorsIcon = Scissors;
  shoppingCartIcon = ShoppingCart;
  menuIcon = Menu;
  xIcon = X;

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
}