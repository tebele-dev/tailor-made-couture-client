import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Package, Users, Clipboard, Settings, Shirt, BarChart, UserPlus, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
  packageIcon = Package;
  usersIcon = Users;
  clipboardIcon = Clipboard;
  settingsIcon = Settings;
  shirtIcon = Shirt;
  barChartIcon = BarChart;
  userPlusIcon = UserPlus;
  shoppingCartIcon = ShoppingCart;
}