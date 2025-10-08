import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ErrorHandlerService } from './error-handler.service';

/**
 * Interface representing user cookie preferences
 */
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

/**
 * Service for managing cookie consent and preferences
 * Handles storing and retrieving user cookie preferences
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  // Cookie storage keys
  private readonly COOKIE_CONSENT_KEY = 'tmc_cookie_consent';
  private readonly COOKIE_PREFERENCES_KEY = 'tmc_cookie_preferences';
  
  // Default preferences - necessary cookies are always required
  private defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private errorHandlerService: ErrorHandlerService) {}

  /**
   * Get a cookie value by name
   * @param name - The name of the cookie to retrieve
   * @returns The cookie value or null if not found
   */
  getCookie(name: string): string | null {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (error) {
      this.errorHandlerService.handleError(error, `Failed to read cookie: ${name}`);
      return null;
    }
  }

  /**
   * Set a cookie value
   * @param name - The name of the cookie to set
   * @param value - The value to set
   * @param days - Optional number of days until expiration
   */
  setCookie(name: string, value: string, days?: number): void {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      
      document.cookie = name + "=" + value + expires + "; path=/";
    } catch (error) {
      this.errorHandlerService.handleError(error, `Failed to set cookie: ${name}`);
    }
  }

  /**
   * Delete a cookie by name
   * @param name - The name of the cookie to delete
   */
  deleteCookie(name: string): void {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      this.errorHandlerService.handleError(error, `Failed to delete cookie: ${name}`);
    }
  }

  /**
   * Check if user has given consent for cookies
   * @returns True if user has given consent, false otherwise
   */
  hasCookieConsent(): boolean {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    
    return this.getCookie(this.COOKIE_CONSENT_KEY) === 'true';
  }

  /**
   * Set cookie consent status
   * @param consent - True if user has given consent, false otherwise
   */
  setCookieConsent(consent: boolean): void {
    this.setCookie(this.COOKIE_CONSENT_KEY, consent.toString(), 365); // 1 year expiration
  }

  /**
   * Get user's cookie preferences
   * @returns User's cookie preferences or default preferences
   */
  getCookiePreferences(): CookiePreferences {
    // Only run in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return { ...this.defaultPreferences };
    }
    
    try {
      const preferencesStr = this.getCookie(this.COOKIE_PREFERENCES_KEY);
      if (preferencesStr) {
        return { ...this.defaultPreferences, ...JSON.parse(preferencesStr) };
      }
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to read cookie preferences');
    }
    
    return { ...this.defaultPreferences };
  }

  /**
   * Set user's cookie preferences
   * @param preferences - The user's cookie preferences
   */
  setCookiePreferences(preferences: CookiePreferences): void {
    try {
      this.setCookie(this.COOKIE_PREFERENCES_KEY, JSON.stringify(preferences), 365); // 1 year expiration
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to save cookie preferences');
    }
  }

  /**
   * Accept all cookies and set preferences accordingly
   */
  acceptAllCookies(): void {
    try {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true
      };
      
      this.setCookieConsent(true);
      this.setCookiePreferences(preferences);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to accept all cookies');
    }
  }

  /**
   * Accept only necessary cookies
   */
  acceptNecessaryCookies(): void {
    try {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false
      };
      
      this.setCookieConsent(true);
      this.setCookiePreferences(preferences);
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to accept necessary cookies');
    }
  }

  /**
   * Check if a specific cookie category is allowed
   * @param category - The cookie category to check
   * @returns True if the category is allowed, false otherwise
   */
  isCookieCategoryAllowed(category: keyof CookiePreferences): boolean {
    // Necessary cookies are always allowed
    if (category === 'necessary') {
      return true;
    }
    
    // If no consent given, deny all non-necessary cookies
    if (!this.hasCookieConsent()) {
      return false;
    }
    
    // Check user preferences
    const preferences = this.getCookiePreferences();
    return preferences[category] || false;
  }

  /**
   * Load analytics scripts if allowed by user preferences
   */
  loadAnalytics(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isCookieCategoryAllowed('analytics')) {
      return;
    }
    
    try {
      // In a real implementation, you would load analytics scripts here
      // For example, Google Analytics, etc.
      console.log('Loading analytics scripts...');
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to load analytics scripts');
    }
  }

  /**
   * Load marketing scripts if allowed by user preferences
   */
  loadMarketing(): void {
    if (!isPlatformBrowser(this.platformId) || !this.isCookieCategoryAllowed('marketing')) {
      return;
    }
    
    try {
      // In a real implementation, you would load marketing scripts here
      // For example, Facebook Pixel, Google Ads, etc.
      console.log('Loading marketing scripts...');
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to load marketing scripts');
    }
  }
}