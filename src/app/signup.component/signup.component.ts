import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = false;

  constructor(private auth: AuthService, private router: Router, private errorHandlerService: ErrorHandlerService) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    
    try {
      // Basic validation
      if (!this.name || !this.email || !this.password || !this.confirmPassword) {
        this.errorHandlerService.showError('All fields are required');
        return;
      }
      
      if (this.password !== this.confirmPassword) {
        this.errorHandlerService.showError('Passwords do not match');
        return;
      }
      
      if (this.password.length < 6) {
        this.errorHandlerService.showError('Password must be at least 6 characters');
        return;
      }
      
      // For demo purposes, we'll use the same login method but with name
      await this.auth.login(this.email, this.password);
      // Update the user name in the service
      if (this.auth.user()) {
        // In a real app, this would be handled by the backend
        const updatedUser = { ...this.auth.user()!, name: this.name };
        this.auth['currentUserSig'].set(updatedUser);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('tmc_user', JSON.stringify(updatedUser));
        }
      }
      this.success = true;
      this.errorHandlerService.showSuccess('Account created successfully! Redirecting to homepage...');
      // Redirect to home after a short delay
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (e) {
      this.errorHandlerService.handleError(e, 'Signup failed. Please try again.');
      this.error = 'Signup failed. Please try again.';
    }
  }
}