import { Component } from '@angular/core';
import { HeroComponent } from "../hero.component/hero.component";
import { FeaturedProductsComponent } from "../featured-products.component/featured-products.component";
import { CustomDesignDetailComponent } from "../custom-design-detail.component/custom-design-detail.component";

@Component({
  selector: 'app-home.component',
  imports: [HeroComponent, FeaturedProductsComponent, CustomDesignDetailComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
