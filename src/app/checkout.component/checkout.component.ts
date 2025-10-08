import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ShoppingCart, MapPin, CreditCard, Check } from 'lucide-angular';
import { CartService, CartItem } from '../services/cart.service';
import { AuthService, User } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

/**
 * Interface representing a shipping address
 */
interface Address {
  id?: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

/**
 * Interface representing a payment method
 */
interface PaymentMethod {
  id?: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
  isDefault?: boolean;
}

/**
 * Checkout component for processing orders
 * Handles multi-step checkout process including shipping, payment, and order confirmation
 */
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  // Icons for UI elements
  shoppingCartIcon = ShoppingCart;
  mapPinIcon = MapPin;
  creditCardIcon = CreditCard;
  checkIcon = Check;

  // Checkout process state
  currentStep = 1;
  totalSteps = 4;

  // Cart data
  cartItems: CartItem[] = [];
  cartTotal = 0;

  // Authenticated user data
  user: User | null = null;

  // Shipping addresses
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  newAddress: Address = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  };

  // Payment methods
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;
  newPaymentMethod: PaymentMethod = {
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nameOnCard: ''
  };

  // Form validation states
  addressFormSubmitted = false;
  paymentFormSubmitted = false;

  // Order confirmation data
  orderNumber = '';
  orderDate = new Date();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  /**
   * Initialize component with cart data, user data, and saved addresses/payment methods
   */
  ngOnInit(): void {
    // Load cart data
    this.cartItems = this.cartService.items();
    this.cartTotal = this.cartService.total();

    // Load user data
    this.user = this.authService.user();

    // Load saved addresses and payment methods
    this.loadSavedData();
  }

  /**
   * Load saved user data (in a real app, this would come from a service)
   */
  loadSavedData(): void {
    // Load saved addresses
    this.addresses = [
      {
        id: '1',
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        isDefault: true
      }
    ];

    // Load saved payment methods
    this.paymentMethods = [
      {
        id: '1',
        cardNumber: '**** **** **** 1234',
        expiryMonth: '12',
        expiryYear: '2027',
        cvv: '***',
        nameOnCard: 'John Doe',
        isDefault: true
      }
    ];

    // Set default selections
    this.selectedAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0] || null;
    this.selectedPaymentMethod = this.paymentMethods.find(pm => pm.isDefault) || this.paymentMethods[0] || null;
  }

  /**
   * Navigate to the next step in the checkout process
   */
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  /**
   * Navigate to the previous step in the checkout process
   */
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Navigate to a specific step in the checkout process
   * @param step - The step number to navigate to
   */
  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  /**
   * Select a shipping address
   * @param address - The address to select
   */
  selectAddress(address: Address): void {
    this.selectedAddress = address;
  }

  /**
   * Add a new shipping address
   */
  addNewAddress(): void {
    this.addressFormSubmitted = true;
    
    try {
      // Validate required fields
      if (!this.newAddress.fullName || !this.newAddress.street || 
          !this.newAddress.city || !this.newAddress.state || 
          !this.newAddress.zipCode) {
        this.errorHandlerService.showError('Please fill in all required address fields');
        return;
      }
      
      // Additional validation for zip code (US format)
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(this.newAddress.zipCode)) {
        this.errorHandlerService.showError('Please enter a valid ZIP code');
        return;
      }
      
      // Create new address with unique ID
      const newAddr: Address = {
        ...this.newAddress,
        id: `addr_${Date.now()}`,
        isDefault: this.addresses.length === 0
      };
      
      // Add to addresses list and select it
      this.addresses.push(newAddr);
      this.selectedAddress = newAddr;
      
      // Reset form and validation state
      this.newAddress = {
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      };
      this.addressFormSubmitted = false;
      
      // Show success message
      this.errorHandlerService.showSuccess('Address added successfully');
      
      // Proceed to next step
      this.nextStep();
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to add address. Please try again.');
    }
  }

  /**
   * Select a payment method
   * @param paymentMethod - The payment method to select
   */
  selectPaymentMethod(paymentMethod: PaymentMethod): void {
    this.selectedPaymentMethod = paymentMethod;
  }

  /**
   * Add a new payment method
   */
  addNewPaymentMethod(): void {
    this.paymentFormSubmitted = true;
    
    try {
      // Validate required fields
      if (!this.newPaymentMethod.cardNumber || !this.newPaymentMethod.expiryMonth || 
          !this.newPaymentMethod.expiryYear || !this.newPaymentMethod.cvv || 
          !this.newPaymentMethod.nameOnCard) {
        this.errorHandlerService.showError('Please fill in all required payment fields');
        return;
      }
      
      // Validate card number (simple validation)
      const cleanCardNumber = this.newPaymentMethod.cardNumber.replace(/\D/g, '');
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        this.errorHandlerService.showError('Please enter a valid card number');
        return;
      }
      
      // Validate CVV
      if (this.newPaymentMethod.cvv.length < 3 || this.newPaymentMethod.cvv.length > 4) {
        this.errorHandlerService.showError('Please enter a valid CVV');
        return;
      }
      
      // Validate expiry date
      const expiryMonth = parseInt(this.newPaymentMethod.expiryMonth, 10);
      const expiryYear = parseInt(this.newPaymentMethod.expiryYear, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (isNaN(expiryMonth) || isNaN(expiryYear) || 
          expiryMonth < 1 || expiryMonth > 12 ||
          expiryYear < currentYear || 
          (expiryYear === currentYear && expiryMonth < currentMonth)) {
        this.errorHandlerService.showError('Please enter a valid expiry date');
        return;
      }
      
      // Additional validation for cardholder name
      if (this.newPaymentMethod.nameOnCard.length < 2) {
        this.errorHandlerService.showError('Please enter a valid cardholder name');
        return;
      }
      
      // Create new payment method with masked card number
      const newPM: PaymentMethod = {
        ...this.newPaymentMethod,
        id: `pm_${Date.now()}`,
        cardNumber: `**** **** **** ${cleanCardNumber.slice(-4)}`,
        isDefault: this.paymentMethods.length === 0
      };
      
      // Add to payment methods list and select it
      this.paymentMethods.push(newPM);
      this.selectedPaymentMethod = newPM;
      
      // Reset form and validation state
      this.newPaymentMethod = {
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        nameOnCard: ''
      };
      this.paymentFormSubmitted = false;
      
      // Show success message
      this.errorHandlerService.showSuccess('Payment method added successfully');
      
      // Proceed to next step
      this.nextStep();
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to add payment method. Please try again.');
    }
  }

  /**
   * Place the order and generate confirmation
   */
  placeOrder(): void {
    try {
      // Validate that we have required data
      if (!this.selectedAddress) {
        this.errorHandlerService.showError('Please select a shipping address');
        return;
      }
      
      if (!this.selectedPaymentMethod) {
        this.errorHandlerService.showError('Please select a payment method');
        return;
      }
      
      if (this.cartItems.length === 0) {
        this.errorHandlerService.showError('Your cart is empty');
        return;
      }
      
      // Generate unique order number
      this.orderNumber = `ORD-${Date.now()}`;
      this.orderDate = new Date();
      
      // In a real application, you would process the payment here
      // For this demo, we'll just simulate a successful payment
      
      // Clear cart after successful order
      this.cartService.clear();
      
      // Show success message
      this.errorHandlerService.showSuccess('Order placed successfully! Thank you for your purchase.');
      
      // Move to confirmation step
      this.nextStep();
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to place order. Please try again.');
    }
  }

  /**
   * Format a card number for display
   * @param cardNumber - The card number to format
   * @returns Formatted card number with spaces
   */
  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

  /**
   * Calculate the subtotal of items in the cart
   * @returns Subtotal amount
   */
  getCartSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  /**
   * Get the shipping cost
   * @returns Shipping cost
   */
  getShippingCost(): number {
    return 15.00; // Flat rate shipping
  }

  /**
   * Calculate the tax amount
   * @returns Tax amount
   */
  getTaxAmount(): number {
    return (this.getCartSubtotal() + this.getShippingCost()) * 0.08; // 8% tax
  }

  /**
   * Calculate the total order amount
   * @returns Total order amount
   */
  getOrderTotal(): number {
    return this.getCartSubtotal() + this.getShippingCost() + this.getTaxAmount();
  }
}