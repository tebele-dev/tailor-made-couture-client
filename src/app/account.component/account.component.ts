import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-container">
      <h1>My Account</h1>
      <p>Manage your account settings and preferences.</p>
    </div>
  `,
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  constructor() { }
}