import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <h1>My Orders</h1>
      <p>View your order history and track shipments.</p>
    </div>
  `,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  constructor() { }
}