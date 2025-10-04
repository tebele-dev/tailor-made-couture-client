import { Routes } from '@angular/router';
import { HomeComponent } from './home.component/home.component';
import { CartComponent } from './cart.component/cart.component';
import { CustomDesignComponent } from './custom-design-master.component/custom-design-master.component';
import { ProductsComponent } from './products.component/products.component';
import { NotFoundComponent } from './not-found.component/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'cart', component: CartComponent },
  { path: 'custom-design', component: CustomDesignComponent },
  { path: 'products', component: ProductsComponent },
  { path: '**', component: NotFoundComponent }
];



