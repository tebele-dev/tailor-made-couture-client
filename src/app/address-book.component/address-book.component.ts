import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MapPin, Plus, Edit, Trash2 } from 'lucide-angular';
import { AuthService, User } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

/**
 * Interface representing a shipping address
 */
export interface Address {
  id?: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * Address book component for managing user shipping addresses
 * Allows users to add, edit, delete, and set default shipping addresses
 */
@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit {
  // Icons for UI elements
  mapPinIcon = MapPin;
  plusIcon = Plus;
  editIcon = Edit;
  trashIcon = Trash2;

  // Authenticated user data
  user: User | null = null;
  
  // Address management state
  addresses: Address[] = [];
  editingAddress: Address | null = null;
  isAddingNew = false;

  // Form model for new/editing address
  newAddress: Address = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  };

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService) {}

  /**
   * Initialize component with user data and load saved addresses
   */
  ngOnInit(): void {
    this.user = this.authService.user();
    this.loadAddresses();
  }

  /**
   * Load user's saved addresses (in a real app, this would come from a service)
   */
  loadAddresses(): void {
    // Load mock data for demonstration
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
      },
      {
        id: '2',
        fullName: 'John Doe',
        street: '456 Park Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        country: 'United States',
        isDefault: false
      }
    ];
  }

  /**
   * Begin adding a new address
   */
  addNewAddress(): void {
    try {
      this.isAddingNew = true;
      this.editingAddress = null;
      this.resetForm();
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to initialize new address form');
    }
  }

  /**
   * Begin editing an existing address
   * @param address - The address to edit
   */
  editAddress(address: Address): void {
    try {
      this.editingAddress = address;
      this.isAddingNew = false;
      
      // Populate the form with the address data
      this.newAddress = { ...address };
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to load address for editing');
    }
  }

  /**
   * Save the current address (either new or updated)
   */
  saveAddress(): void {
    try {
      // Validate required fields
      if (!this.newAddress.fullName || !this.newAddress.street || 
          !this.newAddress.city || !this.newAddress.state || 
          !this.newAddress.zipCode) {
        this.errorHandlerService.showError('Please fill in all required address fields');
        return;
      }
      
      if (this.editingAddress) {
        // Update existing address
        const index = this.addresses.findIndex(addr => addr.id === this.editingAddress!.id);
        if (index !== -1) {
          this.addresses[index] = { ...this.newAddress, id: this.editingAddress.id };
          this.errorHandlerService.showSuccess('Address updated successfully');
        }
      } else {
        // Add new address
        const newAddr: Address = {
          ...this.newAddress,
          id: `addr_${Date.now()}`
        };
        
        // If this is the first address or marked as default, make it the default
        if (this.addresses.length === 0 || this.newAddress.isDefault) {
          // Remove default from other addresses
          this.addresses = this.addresses.map(addr => ({ ...addr, isDefault: false }));
          newAddr.isDefault = true;
        }
        
        this.addresses.push(newAddr);
        this.errorHandlerService.showSuccess('Address added successfully');
      }
      
      this.cancelEdit();
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to save address. Please try again.');
    }
  }

  /**
   * Delete an address by ID
   * @param id - The ID of the address to delete
   */
  deleteAddress(id: string): void {
    try {
      this.addresses = this.addresses.filter(addr => addr.id !== id);
      
      // If we deleted the default address and there are others, make the first one default
      if (this.addresses.length > 0 && !this.addresses.some(addr => addr.isDefault)) {
        this.addresses[0].isDefault = true;
      }
      
      this.errorHandlerService.showSuccess('Address deleted successfully');
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to delete address. Please try again.');
    }
  }

  /**
   * Set an address as the default shipping address
   * @param id - The ID of the address to set as default
   */
  setDefault(id: string): void {
    try {
      this.addresses = this.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      
      this.errorHandlerService.showSuccess('Default address updated successfully');
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to set default address. Please try again.');
    }
  }

  /**
   * Cancel the current editing or adding operation
   */
  cancelEdit(): void {
    try {
      this.isAddingNew = false;
      this.editingAddress = null;
      this.resetForm();
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to cancel editing');
    }
  }

  /**
   * Reset the address form to initial state
   */
  resetForm(): void {
    this.newAddress = {
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    };
  }
}