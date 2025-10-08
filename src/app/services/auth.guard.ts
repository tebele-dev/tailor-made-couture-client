import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route guard to protect admin routes
 * Only allows access to users with admin role
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Redirect to home page if user is not admin
  return router.parseUrl('/');
};

/**
 * Route guard to protect shopper routes
 * Only allows access to authenticated users
 */
export const shopperGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page if user is not authenticated
  return router.parseUrl('/login');
};

/**
 * Route guard to protect shopper-only routes
 * Only allows access to users with shopper role (not admin)
 */
export const shopperOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated and is a shopper (not admin)
  if (authService.isAuthenticated() && authService.isShopper()) {
    return true;
  }

  // Redirect to home page if user is not a shopper
  return router.parseUrl('/');
};