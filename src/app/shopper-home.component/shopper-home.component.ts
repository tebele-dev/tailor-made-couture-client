import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../hero.component/hero.component';
import { FeaturedProductsComponent } from '../featured-products.component/featured-products.component';
import { CustomDesignDetailComponent } from '../custom-design-detail.component/custom-design-detail.component';
import { LucideAngularModule, Package, Settings } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeroComponent, 
    FeaturedProductsComponent, 
    CustomDesignDetailComponent,
    LucideAngularModule
  ],
  templateUrl: './shopper-home.component.html',
  styleUrls: ['./shopper-home.component.scss']
})
export class ShopperHomeComponent {
  packageIcon = Package;
  settingsIcon = Settings;
}