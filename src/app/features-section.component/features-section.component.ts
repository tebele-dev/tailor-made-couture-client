import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles, ShieldCheck, Truck } from 'lucide-angular';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class FeaturesSectionComponent {
  features = [
    {
      icon: Sparkles,
      title: "Premium Fabrics",
      description: "Sourced from the finest mills worldwide for exceptional quality",
    },
    {
      icon: ShieldCheck,
      title: "Perfect Fit Guaranteed",
      description: "Expert tailoring ensures your garment fits flawlessly",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Your custom pieces delivered within 14-21 business days",
    },
  ];

  sparklesIcon = Sparkles;
  shieldCheckIcon = ShieldCheck;
  truckIcon = Truck;
}