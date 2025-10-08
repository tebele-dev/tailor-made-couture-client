import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, Sparkles, Ruler, Palette, ArrowRight } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductDetail, FabricOption } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ErrorHandlerService } from '../services/error-handler.service';

interface GarmentOption {
  value: string;
  label: string;
  price: string;
  productId?: string; // Add productId to link to actual product
}

interface MeasurementValue {
  [key: string]: number;
}

interface FabricCategory {
  name: string;
  options: FabricOption[];
}

/**
 * Custom Design Component
 * Allows users to create custom garments with personalized measurements and fabric choices
 */
@Component({
  selector: 'app-cd-master',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './custom-design-master.component.html',
  styleUrls: ['./custom-design-master.component.scss']
})
export class CustomDesignComponent implements OnInit {
  // Component state
  step = 1;
  garmentType = '';
  activeTab = 'manual';
  selectedProduct: ProductDetail | null = null;
  measurementValues: MeasurementValue = {};
  selectedFabric: { [key: string]: FabricOption } = {};
  
  // Validation states
  measurementsValid = false;
  fabricSelectionValid = false;

  sparklesIcon = Sparkles;
  rulerIcon = Ruler;
  paletteIcon = Palette;
  arrowRightIcon = ArrowRight;

  steps = [
    { num: 1, label: "Design", icon: Sparkles },
    { num: 2, label: "Measurements", icon: Ruler },
    { num: 3, label: "Fabric", icon: Palette },
    { num: 4, label: "Review", icon: ArrowRight },
  ];

  garmentOptions: GarmentOption[] = [];

  measurements: string[] = [];
  
  // Fabric categories - will be populated from product-specific options
  fabricCategories: FabricCategory[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cart: CartService,
    private errorHandlerService: ErrorHandlerService
  ) {
    // Initialize garment options from actual products
    this.initializeGarmentOptions();
  }

  ngOnInit(): void {
    // Check if a productId was passed in the query params
    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.selectProductById(params['productId']);
      }
    });
  }

  initializeGarmentOptions(): void {
    // Get all custom products and create garment options
    const customProducts = this.productService.getCustomProducts();
    this.garmentOptions = customProducts.map(product => ({
      value: product.id,
      label: product.name,
      price: `$${product.price.toFixed(2)}+`,
      productId: product.id
    }));
  }

  selectProductById(productId: string): void {
    const product = this.productService.getProductById(productId);
    if (product && product.isCustom) {
      this.selectedProduct = product;
      this.garmentType = productId;
      this.measurements = product.measurements || [];
      // Initialize measurement values
      this.initializeMeasurementValues();
      // Initialize fabric categories from product-specific options
      this.initializeFabricCategories();
      // Set to step 2 (measurements) since we've pre-selected the product
      this.step = 2;
    }
  }

  /**
   * Initialize measurement values with default values
   */
  initializeMeasurementValues(): void {
    if (this.measurements) {
      this.measurements.forEach(measurement => {
        this.measurementValues[measurement] = 0;
      });
      this.measurementsValid = false;
    }
  }

  // Initialize fabric categories from product-specific options
  initializeFabricCategories(): void {
    if (this.selectedProduct && this.selectedProduct.fabricOptions) {
      // Group fabric options by category
      const categories: { [key: string]: FabricOption[] } = {};
      
      this.selectedProduct.fabricOptions.forEach(fabric => {
        if (!categories[fabric.category]) {
          categories[fabric.category] = [];
        }
        categories[fabric.category].push(fabric);
      });
      
      // Convert to FabricCategory array
      this.fabricCategories = Object.keys(categories).map(category => {
        let categoryName = '';
        switch (category) {
          case 'primary':
            categoryName = 'Primary Fabric';
            break;
          case 'secondary':
            categoryName = 'Secondary Fabric';
            break;
          case 'tertiary':
            categoryName = 'Tertiary Fabric';
            break;
          default:
            categoryName = category.charAt(0).toUpperCase() + category.slice(1) + ' Fabric';
        }
        
        return {
          name: categoryName,
          options: categories[category]
        };
      });
    } else {
      // Default fabric categories if none are specified for the product
      this.fabricCategories = [
        {
          name: 'Primary Fabric',
          options: [
            {
              id: 'fabric_1',
              name: 'Italian Wool',
              category: 'primary',
              image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400&h=400&fit=crop',
              priceModifier: 0,
              description: 'Premium Italian wool with superior texture and drape',
              swatchColor: '#2c3e50'
            },
            {
              id: 'fabric_2',
              name: 'Cashmere Blend',
              category: 'primary',
              image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400&h=400&fit=crop&grayscale',
              priceModifier: 25,
              description: 'Luxurious cashmere blend for ultimate comfort',
              swatchColor: '#8b4513'
            }
          ]
        }
      ];
    }
  }

  /**
   * Navigate to the next step in the custom design process
   */
  nextStep(): void {
    // Validate current step before proceeding
    if (!this.canProceedToNextStep()) {
      return;
    }
    
    // If we're moving from step 1 to step 2, set the selected product
    if (this.step === 1 && this.garmentType) {
      const product = this.productService.getProductById(this.garmentType);
      if (product && product.isCustom) {
        this.selectedProduct = product;
        this.measurements = product.measurements || [];
        this.initializeMeasurementValues();
        this.initializeFabricCategories();
      }
    }
    this.step++;
  }

  /**
   * Navigate to the previous step in the custom design process
   */
  prevStep(): void {
    this.step--;
    // If we're going back to step 1, clear the selected product
    if (this.step === 1) {
      this.selectedProduct = null;
    }
  }

  selectGarmentType(type: string): void {
    this.garmentType = type;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Start over the custom design process with a specific product
   * @param productId - The ID of the product to start with
   */
  startOverWithProduct(productId: string): void {
    this.step = 1;
    this.garmentType = '';
    this.selectedProduct = null;
    this.measurementValues = {};
    this.selectedFabric = {};
    this.measurementsValid = false;
    this.fabricSelectionValid = false;
    this.selectProductById(productId);
  }
  
  /**
   * Select a fabric for a specific category
   * @param category - The fabric category
   * @param fabric - The fabric option to select
   */
  selectFabric(category: string, fabric: FabricOption): void {
    this.selectedFabric[category] = fabric;
    // Check if all required fabric categories have been selected
    this.validateFabricSelection();
  }

  /**
   * Get the selected fabric for a specific category
   * @param category - The fabric category
   * @returns The selected fabric option or undefined
   */
  getSelectedFabric(category: string): FabricOption | undefined {
    return this.selectedFabric[category];
  }

  /**
   * Get the count of selected fabrics
   * @returns The number of selected fabrics
   */
  getSelectedFabricCount(): number {
    return Object.keys(this.selectedFabric).length;
  }

  /**
   * Calculate the total price of the custom product
   * @returns The total price including fabric modifiers
   */
  calculateTotalPrice(): number {
    if (!this.selectedProduct) return 0;
    
    let totalPrice = this.selectedProduct.price;
    
    // Add price modifiers from selected fabrics
    Object.values(this.selectedFabric).forEach(fabric => {
      if (fabric) {
        totalPrice += (this.selectedProduct!.price * fabric.priceModifier) / 100;
      }
    });
    
    return totalPrice;
  }
  
  /**
   * Add the custom product to the cart
   */
  addToCart(): void {
    try {
      if (this.selectedProduct) {
        // For now, add the base product; customization data can be attached later
        this.cart.add(this.selectedProduct, 1);
        this.errorHandlerService.showSuccess('Custom item added to cart successfully');
        this.resetCustomDesign();
      }
    } catch (error) {
      this.errorHandlerService.handleError(error, 'Failed to add custom item to cart');
    }
  }
  
  /**
   * Reset the custom design process to initial state
   */
  private resetCustomDesign(): void {
    this.step = 1;
    this.garmentType = '';
    this.selectedProduct = null;
    this.measurementValues = {};
    this.selectedFabric = {};
    this.measurementsValid = false;
    this.fabricSelectionValid = false;
  }
  
  /**
   * Validate measurements to ensure all required values are entered
   * @returns True if all measurements are valid, false otherwise
   */
  private validateMeasurements(): boolean {
    if (!this.measurements || this.measurements.length === 0) {
      this.measurementsValid = true;
      return true;
    }
    
    // Check if all measurements have been entered with valid values
    for (const measurement of this.measurements) {
      const value = this.measurementValues[measurement];
      if (value === undefined || value <= 0) {
        this.measurementsValid = false;
        return false;
      }
    }
    
    this.measurementsValid = true;
    return true;
  }
  
  /**
   * Validate fabric selection to ensure all required categories are selected
   * @returns True if fabric selection is valid, false otherwise
   */
  private validateFabricSelection(): boolean {
    if (!this.fabricCategories || this.fabricCategories.length === 0) {
      this.fabricSelectionValid = true;
      return true;
    }
    
    // Check if all fabric categories have a selection
    for (const category of this.fabricCategories) {
      if (!this.selectedFabric[category.name]) {
        this.fabricSelectionValid = false;
        return false;
      }
    }
    
    this.fabricSelectionValid = true;
    return true;
  }
  
  /**
   * Check if we can proceed to the next step
   * @returns True if we can proceed, false otherwise
   */
  private canProceedToNextStep(): boolean {
    // Step-specific validation
    switch (this.step) {
      case 2: // Measurements step
        return this.validateMeasurements();
      case 3: // Fabric selection step
        return this.validateFabricSelection();
      default:
        return true;
    }
  }
}