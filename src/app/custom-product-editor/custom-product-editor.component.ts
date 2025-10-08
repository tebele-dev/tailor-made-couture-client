import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDetail, CustomProperty } from '../services/product.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-custom-product-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-product-editor.component.html',
  styleUrls: ['./custom-product-editor.component.scss']
})
export class CustomProductEditorComponent implements OnInit {
  @Input() product!: ProductDetail;
  
  // Local copy of custom properties for editing
  editableProperties: any = {};
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.initializeEditableProperties();
  }
  
  initializeEditableProperties(): void {
    if (this.product.customProperties) {
      for (const prop of this.product.customProperties) {
        // Set default value or empty value based on type
        if (prop.defaultValue !== undefined) {
          this.editableProperties[prop.id] = prop.defaultValue;
        } else {
          switch (prop.type) {
            case 'text':
              this.editableProperties[prop.id] = '';
              break;
            case 'number':
              this.editableProperties[prop.id] = 0;
              break;
            case 'boolean':
              this.editableProperties[prop.id] = false;
              break;
            case 'selection':
              this.editableProperties[prop.id] = prop.options?.[0] || '';
              break;
          }
        }
      }
    }
  }
  
  getPropertyByCategory(category: string): CustomProperty[] {
    return this.productService.getCustomPropertiesByCategory(this.product, category);
  }
  
  isAnyPropertyInCategory(category: string): boolean {
    return this.productService.hasCustomPropertiesInCategory(this.product, category);
  }
  
  onSubmit(): void {
    // In a real app, this would send the data to a service
    console.log('Custom product data submitted:', this.editableProperties);
    alert('Custom product configuration saved!');
  }
}