import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { ErrorHandlerService } from './error-handler.service';
import { PLATFORM_ID } from '@angular/core';

describe('CartService', () => {
  let service: CartService;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;
  let mockProduct: any;

  beforeEach(() => {
    const errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError', 'showError']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: ErrorHandlerService, useValue: errorHandlerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(CartService);
    errorHandlerService = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;

    // Mock product for testing
    mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      category: 'test',
      rating: 4.5
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    expect(service.items().length).toBe(0);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('should add product to cart', () => {
    service.add(mockProduct, 2);
    expect(service.items().length).toBe(1);
    expect(service.count()).toBe(2);
    expect(service.total()).toBe(200);
  });

  it('should handle invalid product or quantity when adding', () => {
    service.add(null as any, 1);
    expect(errorHandlerService.showError).toHaveBeenCalledWith('Invalid product or quantity');

    service.add(mockProduct, 0);
    expect(errorHandlerService.showError).toHaveBeenCalledWith('Invalid product or quantity');

    service.add(mockProduct, -1);
    expect(errorHandlerService.showError).toHaveBeenCalledWith('Invalid product or quantity');
  });

  it('should increase quantity when adding existing product', () => {
    service.add(mockProduct, 1);
    service.add(mockProduct, 2);
    expect(service.items().length).toBe(1);
    expect(service.count()).toBe(3);
    expect(service.total()).toBe(300);
  });

  it('should remove product from cart', () => {
    service.add(mockProduct, 2);
    expect(service.count()).toBe(2);

    service.remove('1');
    expect(service.items().length).toBe(0);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('should handle invalid product ID when removing', () => {
    service.remove('');
    expect(errorHandlerService.showError).toHaveBeenCalledWith('Invalid product ID');
  });

  it('should set quantity of product', () => {
    service.add(mockProduct, 1);
    service.setQuantity('1', 5);
    expect(service.count()).toBe(5);
    expect(service.total()).toBe(500);
  });

  it('should remove item when setting quantity to zero', () => {
    service.add(mockProduct, 3);
    service.setQuantity('1', 0);
    expect(service.items().length).toBe(0);
    expect(service.count()).toBe(0);
  });

  it('should handle invalid parameters when setting quantity', () => {
    service.setQuantity('', 1);
    expect(errorHandlerService.showError).toHaveBeenCalledWith('Invalid product ID or quantity');

    service.setQuantity('1', -1);
    expect(errorHandlerService.showError).toHaveBeenCalledWith('Invalid product ID or quantity');
  });

  it('should clear all items from cart', () => {
    service.add(mockProduct, 2);
    service.add({...mockProduct, id: '2'}, 1);

    expect(service.items().length).toBe(2);
    expect(service.count()).toBe(3);

    service.clear();
    expect(service.items().length).toBe(0);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  it('should calculate correct total with multiple items', () => {
    const product1 = {...mockProduct, id: '1', price: 100};
    const product2 = {...mockProduct, id: '2', price: 50};

    service.add(product1, 1); // 100
    service.add(product2, 2); // 100

    expect(service.total()).toBe(200);
  });
});