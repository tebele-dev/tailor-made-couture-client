import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header.component/header.component';
import { LucideAngularModule, Sparkles, Ruler, Palette, ArrowRight } from 'lucide-angular';
import { FormsModule } from '@angular/forms'; 

interface GarmentOption {
  value: string;
  label: string;
  price: string;
}

@Component({
  selector: 'app-cd-master',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './custom-design-master.component.html',
  styleUrls: ['./custom-design-master.component.scss']
})
export class CustomDesignComponent {
  step = 1;
  garmentType = '';
  activeTab = 'manual';

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

  garmentOptions: GarmentOption[] = [
    { value: "suit", label: "Custom Suit", price: "$899+" },
    { value: "shirt", label: "Tailored Shirt", price: "$149+" },
    { value: "blazer", label: "Premium Blazer", price: "$449+" },
    { value: "trousers", label: "Dress Trousers", price: "$179+" },
    { value: "dress", label: "Evening Dress", price: "$699+" },
    { value: "coat", label: "Overcoat", price: "$599+" },
  ];

  measurements = ["Chest", "Waist", "Hips", "Shoulder Width", "Sleeve Length", "Inseam"];

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  selectGarmentType(type: string): void {
    this.garmentType = type;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}