import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('AuthService', () => {
  let service: AuthService;
  let platformId: Object;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(AuthService);
    platformId = TestBed.inject(PLATFORM_ID);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have demo accounts', () => {
    expect(service.demoAccounts.length).toBeGreaterThan(0);
  });

  it('should validate email format correctly', () => {
    // Since isValidEmail is private, we'll test it indirectly through login
    service.login('invalid-email', 'password').catch(error => {
      expect(error.message).toBe('Please enter a valid email address');
    });
  });

  it('should reject login with missing credentials', () => {
    service.login('', 'password').catch(error => {
      expect(error.message).toBe('Email and password are required');
    });

    service.login('user@example.com', '').catch(error => {
      expect(error.message).toBe('Email and password are required');
    });
  });

  it('should authenticate valid admin user', (done) => {
    service.login('admin@tailormade.com', 'admin123').then(user => {
      expect(user).toBeTruthy();
      expect(user.email).toBe('admin@tailormade.com');
      expect(user.role).toBe('admin');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.isAdmin()).toBe(true);
      expect(service.isShopper()).toBe(false);
      done();
    }).catch(error => {
      done.fail(error);
    });
  });

  it('should authenticate valid shopper user', (done) => {
    service.login('customer@tailormade.com', 'customer123').then(user => {
      expect(user).toBeTruthy();
      expect(user.email).toBe('customer@tailormade.com');
      expect(user.role).toBe('shopper');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.isAdmin()).toBe(false);
      expect(service.isShopper()).toBe(true);
      done();
    }).catch(error => {
      done.fail(error);
    });
  });

  it('should reject invalid credentials', () => {
    service.login('wrong@example.com', 'wrongpassword').catch(error => {
      expect(error.message).toBe('Invalid credentials');
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  it('should logout user', (done) => {
    service.login('customer@tailormade.com', 'customer123').then(() => {
      expect(service.isAuthenticated()).toBe(true);
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
      done();
    }).catch(error => {
      done.fail(error);
    });
  });

  it('should check user roles correctly', (done) => {
    service.login('admin@tailormade.com', 'admin123').then(() => {
      expect(service.hasRole('admin')).toBe(true);
      expect(service.hasRole('shopper')).toBe(false);
      expect(service.hasAnyRole(['admin', 'shopper'])).toBe(true);
      done();
    }).catch(error => {
      done.fail(error);
    });
  });

  it('should return correct home route based on user role', (done) => {
    service.login('admin@tailormade.com', 'admin123').then(() => {
      expect(service.getHomeRoute()).toBe('/admin');
      done();
    }).catch(error => {
      done.fail(error);
    });

    // Test shopper route after admin test
    service.logout();
    service.login('customer@tailormade.com', 'customer123').then(() => {
      expect(service.getHomeRoute()).toBe('/home');
      done();
    }).catch(error => {
      done.fail(error);
    });
  });
});