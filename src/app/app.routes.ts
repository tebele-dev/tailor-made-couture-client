import { Routes } from '@angular/router';
import { CartComponent } from './cart.component/cart.component';
import { CustomDesignComponent } from './custom-design-master.component/custom-design-master.component';
import { ProductsComponent } from './products.component/products.component';
import { NotFoundComponent } from './not-found.component/not-found.component';
import { AboutComponent } from './about.component/about.component';
import { ProductDetailComponent } from './product-detail.component/product-detail.component';
import { LoginComponent } from './login.component/login.component';
import { SignupComponent } from './signup.component/signup.component';
import { InventoryComponent } from './inventory.component/inventory.component';
import { AdminDesignComponent } from './admin-design.component/admin-design.component';
import { FabricComponent } from './fabric.component/fabric.component';
import { CheckoutComponent } from './checkout.component/checkout.component';
import { AddressBookComponent } from './address-book.component/address-book.component';
import { ShopperHomeComponent } from './shopper-home.component/shopper-home.component';
import { AdminHomeComponent } from './admin-home.component/admin-home.component';
import { AccountComponent } from './account.component/account.component';
import { OrdersComponent } from './orders.component/orders.component';
import { EveryviewComponent } from './everyview.component/everyview.component';
import { adminGuard, shopperOnlyGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ShopperHomeComponent },
  { path: 'admin', component: AdminHomeComponent, canActivate: [adminGuard] },
  { path: 'cart', component: CartComponent, canActivate: [shopperOnlyGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [shopperOnlyGuard] },
  { path: 'address-book', component: AddressBookComponent, canActivate: [shopperOnlyGuard] },
  { path: 'account', component: AccountComponent, canActivate: [shopperOnlyGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [shopperOnlyGuard] },
  { path: 'everyview', component: EveryviewComponent },
  { path: 'custom-design', component: CustomDesignComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'inventory', component: InventoryComponent, canActivate: [adminGuard] },
  { path: 'admin-design', component: AdminDesignComponent, canActivate: [adminGuard] },
  { path: 'fabric', component: FabricComponent, canActivate: [adminGuard] },
  { path: '**', component: NotFoundComponent }
];