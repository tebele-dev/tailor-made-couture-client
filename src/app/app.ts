import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component/header.component';
import { FooterComponent } from './footer.component/footer.component';
import { CookieConsentComponent } from './cookie-consent.component/cookie-consent.component';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { CookieService } from './services/cookie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CookieConsentComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent implements OnInit {
  title = 'tailor-made-couture-client';

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Hydrate user from storage
    this.auth.hydrateFromStorage();
    
    // Load analytics if allowed
    this.cookieService.loadAnalytics();
  }
}