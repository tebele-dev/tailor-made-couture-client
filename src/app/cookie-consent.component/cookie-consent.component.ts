import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Cookie } from 'lucide-angular';
import { CookieService, CookiePreferences } from '../services/cookie.service';

/**
 * Cookie consent component for managing user cookie preferences
 * Displays a banner for cookie consent and a detailed preferences dialog
 */
@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  // Icons for UI elements
  cookieIcon = Cookie;
  closeIcon = X;
  
  // Component state
  showBanner = false;
  showPreferences = false;
  
  // User cookie preferences
  preferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  };

  constructor(private cookieService: CookieService) {}

  /**
   * Initialize component and check if user has already given consent
   */
  ngOnInit(): void {
    // Show banner only if user hasn't given consent yet
    this.showBanner = !this.cookieService.hasCookieConsent();
    
    // Load existing preferences if they exist
    if (this.cookieService.hasCookieConsent()) {
      this.preferences = this.cookieService.getCookiePreferences();
    }
  }

  /**
   * Accept all cookies and hide the consent banner
   */
  acceptAll(): void {
    this.cookieService.acceptAllCookies();
    this.showBanner = false;
    this.showPreferences = false;
    
    // Load scripts based on preferences
    this.cookieService.loadAnalytics();
    this.cookieService.loadMarketing();
  }

  /**
   * Accept only necessary cookies and hide the consent banner
   */
  acceptNecessary(): void {
    this.cookieService.acceptNecessaryCookies();
    this.showBanner = false;
    this.showPreferences = false;
  }

  /**
   * Save user's cookie preferences and hide the consent UI
   */
  savePreferences(): void {
    this.cookieService.setCookieConsent(true);
    this.cookieService.setCookiePreferences(this.preferences);
    this.showBanner = false;
    this.showPreferences = false;
    
    // Load scripts based on preferences
    if (this.preferences.analytics) {
      this.cookieService.loadAnalytics();
    }
    
    if (this.preferences.marketing) {
      this.cookieService.loadMarketing();
    }
  }

  /**
   * Open the detailed cookie preferences dialog
   */
  openPreferences(): void {
    this.showPreferences = true;
    this.showBanner = false;
  }

  /**
   * Close the cookie preferences dialog
   */
  closePreferences(): void {
    this.showPreferences = false;
    
    // If user hasn't given consent yet, show the banner again
    if (!this.cookieService.hasCookieConsent()) {
      this.showBanner = true;
    }
  }

  /**
   * Toggle a cookie preference category
   * @param category - The cookie category to toggle
   */
  togglePreference(category: keyof CookiePreferences): void {
    // Necessary cookies cannot be disabled
    if (category === 'necessary') {
      return;
    }
    
    this.preferences[category] = !this.preferences[category];
  }
}