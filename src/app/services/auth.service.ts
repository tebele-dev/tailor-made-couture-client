import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Interface representing a user
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'shopper';
}

/**
 * Service for managing user authentication and authorization
 * Handles user login, logout, and role-based access control
 * Persists user data to localStorage for browser environments
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal to hold current user data
  private currentUserSig = signal<User | null>(null);

  // Computed properties for user data
  readonly user = computed(() => this.currentUserSig());
  readonly isAuthenticated = computed(() => !!this.currentUserSig());
  readonly userRole = computed(() => this.currentUserSig()?.role || null);

  // Demo accounts for each role
  demoAccounts = [
    { email: 'admin@tailormade.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
    { email: 'customer@tailormade.com', password: 'customer123', name: 'Customer User', role: 'shopper' as const }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns True if email is valid, false otherwise
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Authenticate a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to user object on success, rejecting on failure
   */
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Validate inputs
      if (!email || !password) {
        reject(new Error('Email and password are required'));
        return;
      }

      if (!this.isValidEmail(email)) {
        reject(new Error('Please enter a valid email address'));
        return;
      }

      // Check if credentials match any demo account
      const account = this.demoAccounts.find(acc => acc.email === email && acc.password === password);
      
      if (account) {
        const user: User = { 
          id: 'u_' + Date.now(),
          email: account.email, 
          name: account.name,
          role: account.role
        };
        
        try {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('tmc_user', JSON.stringify(user));
          }
          this.currentUserSig.set(user);
          resolve(user);
        } catch (error) {
          reject(new Error('Failed to save user data'));
        }
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  }

  /**
   * Log out the current user
   */
  logout(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('tmc_user');
      }
      this.currentUserSig.set(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Hydrate user data from storage on application startup
   */
  hydrateFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      const raw = localStorage.getItem('tmc_user');
      if (raw) {
        const userData = JSON.parse(raw);
        // Ensure role is set for existing users
        if (!userData.role) {
          userData.role = 'shopper';
        }
        this.currentUserSig.set(userData); 
      }
    } catch (error) {
      console.error('Error hydrating user from storage:', error);
      // Clear invalid data
      localStorage.removeItem('tmc_user');
    }
  }

  /**
   * Check if user has a specific role
   * @param role - The role to check for
   * @returns True if user has the specified role, false otherwise
   */
  hasRole(role: User['role']): boolean {
    return this.userRole() === role;
  }

  /**
   * Check if user has any of the specified roles
   * @param roles - Array of roles to check for
   * @returns True if user has any of the specified roles, false otherwise
   */
  hasAnyRole(roles: User['role'][]): boolean {
    const currentUserRole = this.userRole();
    return currentUserRole !== null && roles.includes(currentUserRole);
  }

  /**
   * Check if user has admin privileges
   * @returns True if user is an admin, false otherwise
   */
  isAdmin(): boolean {
    return this.userRole() === 'admin';
  }

  /**
   * Check if user is a shopper
   * @returns True if user is a shopper, false otherwise
   */
  isShopper(): boolean {
    return this.userRole() === 'shopper';
  }

  /**
   * Get the appropriate home route for the current user
   * @returns The route path for the user's home page
   */
  getHomeRoute(): string {
    if (this.isAdmin()) {
      return '/admin';
    } else {
      // Always return home for shoppers and unauthenticated users
      return '/home';
    }
  }

}

