import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router, private errorHandlerService: ErrorHandlerService) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    try {
      // Validate required fields
      if (!this.email || !this.password) {
        this.errorHandlerService.showError('Please enter both email and password');
        return;
      }
      
      await this.auth.login(this.email, this.password);
      this.errorHandlerService.showSuccess('Login successful!');
      
      // Redirect based on user role
      if (this.auth.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
    } catch (e) {
      this.errorHandlerService.handleError(e, 'Login failed. Please check your credentials and try again.');
      this.error = 'Login failed';
    }
  }
}




