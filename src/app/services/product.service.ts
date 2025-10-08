import { Injectable } from '@angular/core';
import type { Product } from '../product-card.component/product-card.component';

/**
 * Interface representing a fabric option for custom products
 */
export interface FabricOption {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'tertiary';
  image: string;
  priceModifier: number; // Percentage increase/decrease
  description: string;
  swatchColor: string;
}

/**
 * Interface representing detailed product information
 */
export interface ProductDetail extends Product {
  description: string;
  images: string[];
  details: {
    material: string;
    color: string;
    size: string;
    care: string;
  };
  measurements?: string[];
  customProperties?: CustomProperty[];
  fabricOptions?: FabricOption[];
}

/**
 * Interface representing a custom property for editable products
 */
export interface CustomProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'selection';
  required: boolean;
  options?: string[]; // For selection type
  defaultValue?: any;
  category: 'measurements' | 'design' | 'fabric' | 'other';
}

/**
 * Product service for managing product data
 * Provides methods to retrieve product information and manage product-related data
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  getAllProducts(): ProductDetail[] {
    return [
      {
        id: "1",
        name: "Classic Navy Suit",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop&grayscale"
        ],
        category: "Suits",
        rating: 4.8,
        isCustom: false,
        description: "A timeless navy suit tailored for confidence and comfort. Crafted from premium Italian wool with a classic fit that flatters any body type. Perfect for business meetings, formal events, or weddings.",
        details: {
          material: "100% Italian Wool",
          color: "Navy Blue",
          size: "Regular, Slim, Athletic",
          care: "Dry clean only"
        }
      },
      {
        id: "2",
        name: "Custom Tailored Shirt",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&grayscale",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&sat=-100"
        ],
        category: "Shirts",
        rating: 4.9,
        isCustom: true,
        description: "Perfectly fitted shirt with premium cotton and customizable details. Choose from a variety of collar styles, cuff options, and fabric patterns to create a shirt that's uniquely yours.",
        details: {
          material: "100% Egyptian Cotton",
          color: "White, Blue, Pink, Striped",
          size: "S, M, L, XL, XXL",
          care: "Machine wash cold, tumble dry low"
        },
        measurements: ["Chest", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Neck Size"],
        customProperties: [
          {
            id: "prop_1",
            name: "Collar Style",
            type: "selection",
            required: true,
            options: ["Classic", "Button-Down", "Spread", "Mandarin"],
            defaultValue: "Classic",
            category: "design"
          },
          {
            id: "prop_2",
            name: "Cuff Style",
            type: "selection",
            required: true,
            options: ["Single", "Double", "French"],
            defaultValue: "Single",
            category: "design"
          },
          {
            id: "prop_3",
            name: "Pocket Style",
            type: "selection",
            required: false,
            options: ["None", "Classic", "Patched"],
            defaultValue: "None",
            category: "design"
          }
        ],
        fabricOptions: [
          {
            id: "fabric_1",
            name: "Egyptian Cotton",
            category: "primary",
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
            priceModifier: 0,
            description: "Premium Egyptian cotton with superior softness",
            swatchColor: "#ffffff"
          },
          {
            id: "fabric_2",
            name: "Pima Cotton",
            category: "primary",
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&grayscale",
            priceModifier: 15,
            description: "Luxurious Pima cotton for enhanced comfort",
            swatchColor: "#f0f0f0"
          }
        ]
      },
      {
        id: "3",
        name: "Premium Wool Blazer",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop&grayscale"
        ],
        category: "Blazers",
        rating: 4.7,
        isCustom: false,
        description: "Soft-shouldered blazer crafted from fine merino wool. Features a modern slim fit with classic styling elements that make it versatile for both professional and casual settings.",
        details: {
          material: "100% Merino Wool",
          color: "Charcoal Gray",
          size: "36R, 38R, 40R, 42R, 44R",
          care: "Dry clean only"
        }
      },
      {
        id: "4",
        name: "Custom Wedding Suit",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop&grayscale",
          "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop&sat=-100"
        ],
        category: "Suits",
        rating: 5.0,
        isCustom: true,
        description: "Hand-finished suit with bespoke options for your big day. Every detail is customizable to ensure you look and feel your best on your wedding day.",
        details: {
          material: "Premium Italian Wool Blend",
          color: "Black, Navy, Charcoal, Ivory",
          size: "Bespoke fit",
          care: "Dry clean only"
        },
        measurements: ["Chest", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Inseam", "Neck Size"],
        customProperties: [
          {
            id: "prop_4",
            name: "Lapel Style",
            type: "selection",
            required: true,
            options: ["Notch", "Peak", "Shawl"],
            defaultValue: "Notch",
            category: "design"
          },
          {
            id: "prop_5",
            name: "Button Style",
            type: "selection",
            required: true,
            options: ["Single-Breasted", "Double-Breasted"],
            defaultValue: "Single-Breasted",
            category: "design"
          },
          {
            id: "prop_6",
            name: "Vest Included",
            type: "boolean",
            required: false,
            defaultValue: false,
            category: "design"
          }
        ],
        fabricOptions: [
          {
            id: "fabric_3",
            name: "Italian Wool",
            category: "primary",
            image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop",
            priceModifier: 0,
            description: "Premium Italian wool with superior texture and drape",
            swatchColor: "#2c3e50"
          },
          {
            id: "fabric_4",
            name: "Cashmere Blend",
            category: "primary",
            image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop&grayscale",
            priceModifier: 25,
            description: "Luxurious cashmere blend for ultimate comfort",
            swatchColor: "#8b4513"
          }
        ]
      },
      {
        id: "5",
        name: "Business Trousers",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&grayscale",
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&sat=-100"
        ],
        category: "Trousers",
        rating: 4.6,
        isCustom: false,
        description: "Wrinkle-resistant trousers with a clean, tapered silhouette. Made from a blend of wool and synthetic fibers for durability and comfort throughout the workday.",
        details: {
          material: "Wool/Polyester Blend",
          color: "Black, Navy, Charcoal",
          size: "30-32, 32-32, 34-32, 36-32, 38-32",
          care: "Machine wash cold, tumble dry low"
        }
      },
      {
        id: "6",
        name: "Custom Evening Dress",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop&grayscale",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop&sat=-100"
        ],
        category: "Dresses",
        rating: 4.9,
        isCustom: true,
        description: "Graceful evening dress with tailored fit and flowing drape. Perfect for galas, cocktail parties, or special occasions where you want to make a statement.",
        details: {
          material: "Silk Chiffon and Satin",
          color: "Black, Navy, Burgundy, Gold",
          size: "Bespoke fit",
          care: "Dry clean only"
        },
        measurements: ["Bust", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Dress Length"],
        customProperties: [
          {
            id: "prop_7",
            name: "Neckline Style",
            type: "selection",
            required: true,
            options: ["V-Neck", "Sweetheart", "Off-the-Shoulder", "Halter"],
            defaultValue: "V-Neck",
            category: "design"
          },
          {
            id: "prop_8",
            name: "Sleeve Style",
            type: "selection",
            required: true,
            options: ["Sleeveless", "Cap Sleeve", "Short Sleeve", "Long Sleeve"],
            defaultValue: "Sleeveless",
            category: "design"
          },
          {
            id: "prop_9",
            name: "Back Design",
            type: "selection",
            required: false,
            options: ["Closed", "Open Back", "Keyhole"],
            defaultValue: "Closed",
            category: "design"
          }
        ],
        fabricOptions: [
          {
            id: "fabric_5",
            name: "Silk Chiffon",
            category: "primary",
            image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop",
            priceModifier: 0,
            description: "Lightweight silk chiffon with beautiful drape",
            swatchColor: "#ffffff"
          },
          {
            id: "fabric_6",
            name: "Satin",
            category: "primary",
            image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop&grayscale",
            priceModifier: 20,
            description: "Luxurious satin with elegant sheen",
            swatchColor: "#ffd700"
          }
        ]
      },
    ];
  }

  getFeaturedProducts(): ProductDetail[] {
    return [
      {
        id: "1",
        name: "Signature Navy Suit",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop"
        ],
        category: "Suits",
        rating: 4.8,
        isCustom: false,
        description: "A timeless navy suit tailored for confidence and comfort.",
        details: {
          material: "100% Italian Wool",
          color: "Navy Blue",
          size: "Regular, Slim, Athletic",
          care: "Dry clean only"
        }
      },
      {
        id: "2",
        name: "Custom Shirt Collection",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&grayscale"
        ],
        category: "Shirts",
        rating: 4.9,
        isCustom: true,
        description: "Perfectly fitted shirt with premium cotton and customizable details.",
        details: {
          material: "100% Egyptian Cotton",
          color: "White, Blue, Pink, Striped",
          size: "S, M, L, XL, XXL",
          care: "Machine wash cold, tumble dry low"
        },
        measurements: ["Chest", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Neck Size"],
        customProperties: [
          {
            id: "prop_1",
            name: "Collar Style",
            type: "selection",
            required: true,
            options: ["Classic", "Button-Down", "Spread", "Mandarin"],
            defaultValue: "Classic",
            category: "design"
          }
        ],
        fabricOptions: [
          {
            id: "fabric_1",
            name: "Egyptian Cotton",
            category: "primary",
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
            priceModifier: 0,
            description: "Premium Egyptian cotton with superior softness",
            swatchColor: "#ffffff"
          }
        ]
      },
      {
        id: "3",
        name: "Premium Wool Blazer",
        price: 449.99,
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop"
        ],
        category: "Blazers",
        rating: 4.7,
        isCustom: false,
        description: "Soft-shouldered blazer crafted from fine merino wool.",
        details: {
          material: "100% Merino Wool",
          color: "Charcoal Gray",
          size: "36R, 38R, 40R, 42R, 44R",
          care: "Dry clean only"
        }
      },
      {
        id: "6",
        name: "Evening Dress",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&h=1000&fit=crop&grayscale"
        ],
        category: "Dresses",
        rating: 4.9,
        isCustom: true,
        description: "Graceful evening dress with tailored fit and flowing drape.",
        details: {
          material: "Silk Chiffon and Satin",
          color: "Black, Navy, Burgundy, Gold",
          size: "Bespoke fit",
          care: "Dry clean only"
        },
        measurements: ["Bust", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Dress Length"],
        customProperties: [
          {
            id: "prop_7",
            name: "Neckline Style",
            type: "selection",
            required: true,
            options: ["V-Neck", "Sweetheart", "Off-the-Shoulder", "Halter"],
            defaultValue: "V-Neck",
            category: "design"
          }
        ],
        fabricOptions: [
          {
            id: "fabric_5",
            name: "Silk Chiffon",
            category: "primary",
            image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop",
            priceModifier: 0,
            description: "Lightweight silk chiffon with beautiful drape",
            swatchColor: "#ffffff"
          }
        ]
      },
    ];
  }

  getProductById(id: string): ProductDetail | undefined {
    return this.getAllProducts().find(p => p.id === id);
  }

  /**
   * Update custom properties for a product
   * @param productId - The ID of the product to update
   * @param customProperties - The new custom properties
   */
  updateProductCustomProperties(productId: string, customProperties: CustomProperty[]): void {
    const products = this.getAllProducts();
    const product = products.find(p => p.id === productId);
    if (product) {
      product.customProperties = customProperties;
      // In a real app, this would save to a backend
      console.log(`Updated custom properties for product ${productId}`);
    }
  }
  
  /**
   * Get custom properties by category
   * @param product - The product to get properties for
   * @param category - The category to filter by
   * @returns Array of custom properties in the specified category
   */
  getCustomPropertiesByCategory(product: ProductDetail, category: string): CustomProperty[] {
    return product.customProperties?.filter(prop => prop.category === category) || [];
  }
  
  /**
   * Check if a product has any properties in a category
   * @param product - The product to check
   * @param category - The category to check for
   * @returns True if the product has properties in the category, false otherwise
   */
  hasCustomPropertiesInCategory(product: ProductDetail, category: string): boolean {
    return product.customProperties?.some(prop => prop.category === category) || false;
  }
  
  /**
   * Get all ready-to-wear products
   * @returns Array of ready-to-wear products
   */
  getReadyToWearProducts(): ProductDetail[] {
    return this.getAllProducts().filter(product => !product.isCustom);
  }
  
  /**
   * Get all custom products
   * @returns Array of custom products
   */
  getCustomProducts(): ProductDetail[] {
    return this.getAllProducts().filter(product => product.isCustom);
  }
}