
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-cd-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './custom-design-detail.component.html',
  styleUrls: ['./custom-design-detail.component.scss']
})
export class CustomDesignDetailComponent {
  sparklesIcon = Sparkles;
  fabricsImage = 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800&h=1000&fit=crop';
}