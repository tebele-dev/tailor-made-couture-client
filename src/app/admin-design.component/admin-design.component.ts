import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ProductService, ProductDetail, CustomProperty, FabricOption } from '../services/product.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-design',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-design.component.html',
  styleUrls: ['./admin-design.component.scss']
})
export class AdminDesignComponent implements OnInit {
  customConfigs: any[] = [];
  selectedProduct: ProductDetail | null = null;
  newMeasurement = '';
  searchQuery = '';
  selectedCategory = 'all';
  
  // New properties for custom property management
  newCustomProperty: CustomProperty = {
    id: '',
    name: '',
    type: 'text',
    required: false,
    category: 'measurements'
  };
  
  // New product creation form
  newProduct: any = {
    name: '',
    price: 0,
    image: '',
    category: 'Shirts',
    description: '',
    details: {
      material: '',
      color: '',
      size: '',
      care: ''
    }
  };
  
  // Fabric options management
  newFabricOption: FabricOption = {
    id: '',
    name: '',
    category: 'primary',
    image: '',
    priceModifier: 0,
    description: '',
    swatchColor: '#000000'
  };
  
  fabricCategories = [
    { value: 'primary', label: 'Primary Fabric' },
    { value: 'secondary', label: 'Secondary Fabric' },
    { value: 'tertiary', label: 'Tertiary Fabric' }
  ];
  
  propertyTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'selection', label: 'Selection' }
  ];
  
  propertyCategories = [
    { value: 'measurements', label: 'Measurements' },
    { value: 'design', label: 'Design' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'other', label: 'Other' }
  ];
  
  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Suits', label: 'Suits' },
    { value: 'Shirts', label: 'Shirts' },
    { value: 'Blazers', label: 'Blazers' },
    { value: 'Trousers', label: 'Trousers' },
    { value: 'Dresses', label: 'Dresses' }
  ];
  
  // Available product categories for new products
  productCategories = [
    'Suits',
    'Shirts',
    'Blazers',
    'Trousers',
    'Dresses'
  ];
  
  showNewProductForm = false;
  newOption = '';

  constructor(
    public auth: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCustomConfigs();
  }

  loadCustomConfigs(): void {
    // In a real app, this would come from an API
    const products = this.productService.getAllProducts();
    this.customConfigs = products
      .filter(product => product.isCustom)
      .map(product => ({
        id: 'config_' + product.id,
        productId: product.id,
        productName: product.name,
        measurements: product.measurements || [],
        customProperties: product.customProperties || [],
        fabricOptions: product.fabricOptions || [], // Add fabric options
        isActive: true
      }));
  }

  get filteredProducts(): ProductDetail[] {
    const allProducts = this.productService.getAllProducts();
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                           product.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  selectProduct(product: ProductDetail): void {
    this.selectedProduct = product;
    this.showNewProductForm = false;
    // Reset new custom property form
    this.resetCustomPropertyForm();
  }
  
  // Toggle new product form
  toggleNewProductForm(): void {
    this.showNewProductForm = !this.showNewProductForm;
    this.selectedProduct = null;
    this.resetNewProductForm();
  }
  
  // Reset new product form
  resetNewProductForm(): void {
    this.newProduct = {
      name: '',
      price: 0,
      image: '',
      category: 'Shirts',
      description: '',
      details: {
        material: '',
        color: '',
        size: '',
        care: ''
      }
    };
  }
  
  // Create a new custom product
  createNewProduct(): void {
    if (this.newProduct.name && this.newProduct.price > 0) {
      // In a real app, this would save to a backend
      alert(`New custom product "${this.newProduct.name}" would be created!`);
      this.showNewProductForm = false;
      this.resetNewProductForm();
      // Refresh the product list
      this.loadCustomConfigs();
    }
  }

  addMeasurement(): void {
    if (this.newMeasurement.trim() && this.selectedProduct) {
      // In a real app, this would update the product in the backend
      if (!this.selectedProduct.measurements) {
        this.selectedProduct.measurements = [];
      }
      this.selectedProduct.measurements.push(this.newMeasurement.trim());
      this.newMeasurement = '';
      
      // Update the config
      const config = this.customConfigs.find(c => c.productId === this.selectedProduct!.id);
      if (config) {
        config.measurements = this.selectedProduct.measurements;
      }
    }
  }

  removeMeasurement(index: number): void {
    if (this.selectedProduct && this.selectedProduct.measurements) {
      this.selectedProduct.measurements.splice(index, 1);
      
      // Update the config
      const config = this.customConfigs.find(c => c.productId === this.selectedProduct!.id);
      if (config) {
        config.measurements = this.selectedProduct.measurements;
      }
    }
  }

  // Custom Property Management Methods
  addCustomProperty(): void {
    if (this.newCustomProperty.name.trim() && this.selectedProduct) {
      // Generate a unique ID
      this.newCustomProperty.id = 'prop_' + Date.now();
      
      // Initialize options array for selection type
      if (this.newCustomProperty.type === 'selection' && !this.newCustomProperty.options) {
        this.newCustomProperty.options = [];
      }
      
      // Add to product
      if (!this.selectedProduct.customProperties) {
        this.selectedProduct.customProperties = [];
      }
      this.selectedProduct.customProperties.push({ ...this.newCustomProperty });
      
      // Update config
      const config = this.customConfigs.find(c => c.productId === this.selectedProduct!.id);
      if (config) {
        config.customProperties = this.selectedProduct.customProperties;
      }
      
      // Reset form
      this.resetCustomPropertyForm();
    }
  }

  removeCustomProperty(index: number): void {
    if (this.selectedProduct && this.selectedProduct.customProperties) {
      this.selectedProduct.customProperties.splice(index, 1);
      
      // Update config
      const config = this.customConfigs.find(c => c.productId === this.selectedProduct!.id);
      if (config) {
        config.customProperties = this.selectedProduct.customProperties;
      }
    }
  }

  addOption(): void {
    if (this.newOption.trim() && this.newCustomProperty.type === 'selection') {
      if (!this.newCustomProperty.options) {
        this.newCustomProperty.options = [];
      }
      this.newCustomProperty.options.push(this.newOption.trim());
      this.newOption = '';
    }
  }

  removeOption(index: number): void {
    if (this.newCustomProperty.options) {
      this.newCustomProperty.options.splice(index, 1);
    }
  }

  resetCustomPropertyForm(): void {
    this.newCustomProperty = {
      id: '',
      name: '',
      type: 'text',
      required: false,
      category: 'measurements'
    };
    this.newOption = '';
  }

  // Fabric Option Management Methods
  addFabricOption(): void {
    if (this.newFabricOption.name.trim() && this.selectedProduct) {
      // Generate a unique ID
      this.newFabricOption.id = 'fabric_' + Date.now();
      
      // Add to product
      if (!this.selectedProduct.fabricOptions) {
        this.selectedProduct.fabricOptions = [];
      }
      this.selectedProduct.fabricOptions.push({ ...this.newFabricOption });
      
      // Update config
      const config = this.customConfigs.find(c => c.productId === this.selectedProduct!.id);
      if (config) {
        config.fabricOptions = this.selectedProduct.fabricOptions;
      }
      
      // Reset form
      this.resetFabricOptionForm();
    }
  }

  removeFabricOption(index: number): void {
    if (this.selectedProduct && this.selectedProduct.fabricOptions) {
      this.selectedProduct.fabricOptions.splice(index, 1);
      
      // Update config
      const config = this.customConfigs.find(c => c.productId === this.selectedProduct!.id);
      if (config) {
        config.fabricOptions = this.selectedProduct.fabricOptions;
      }
    }
  }

  resetFabricOptionForm(): void {
    this.newFabricOption = {
      id: '',
      name: '',
      category: 'primary',
      image: '',
      priceModifier: 0,
      description: '',
      swatchColor: '#000000'
    };
  }

  toggleConfigActive(config: any): void {
    config.isActive = !config.isActive;
  }

  saveConfig(): void {
    if (this.selectedProduct) {
      // Save custom properties to product service
      if (this.selectedProduct.customProperties) {
        this.productService.updateProductCustomProperties(
          this.selectedProduct.id, 
          this.selectedProduct.customProperties
        );
      }
      
      // Also update measurements if they exist
      if (this.selectedProduct.measurements) {
        // In a real app, we would have a separate method for updating measurements
        console.log(`Updated measurements for blueprint ${this.selectedProduct.id}`);
      }
      
      // Save fabric options if they exist
      if (this.selectedProduct.fabricOptions) {
        // In a real app, we would have a separate method for updating fabric options
        console.log(`Updated fabric options for blueprint ${this.selectedProduct.id}`);
      }
      
      alert(`Blueprint configuration for ${this.selectedProduct.name} has been saved!`);
      this.selectedProduct = null;
    }
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.showNewProductForm = false;
    this.resetCustomPropertyForm();
  }
}