import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { ErrorHandlerService, Notification } from '../services/error-handler.service';

/**
 * Notification component for displaying application notifications
 * Shows success, error, warning, and info messages to the user
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="notification">
      <div 
        *ngFor="let notification of notifications; trackBy: trackById"
        class="notification__item notification__item--{{notification.type}}" 
        role="alert"
        [attr.aria-live]="notification.type === 'error' ? 'assertive' : 'polite'">
        <div class="notification__content">
          <span class="notification__message">{{ notification.message }}</span>
          <button 
            type="button" 
            class="notification__close"
            (click)="removeNotification(notification.id)"
            aria-label="Close notification">
            <lucide-icon [img]="xIcon" class="notification__close-icon"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification {
      &__container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        max-width: 400px;
      }

      &__item {
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid;

        &--success {
          background-color: rgba(237, 247, 237, 0.95);
          border-color: rgba(56, 142, 60, 0.3);
          color: #2e7d32;
        }

        &--error {
          background-color: rgba(253, 237, 237, 0.95);
          border-color: rgba(211, 47, 47, 0.3);
          color: #c62828;
        }

        &--warning {
          background-color: rgba(255, 248, 225, 0.95);
          border-color: rgba(239, 108, 0, 0.3);
          color: #ef6c00;
        }

        &--info {
          background-color: rgba(225, 245, 254, 0.95);
          border-color: rgba(2, 136, 209, 0.3);
          color: #0277bd;
        }
      }

      &__content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      &__message {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
      }

      &__close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }

      &__close-icon {
        width: 16px;
        height: 16px;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  // Icons for UI elements
  xIcon = X;

  // Notifications to display
  notifications: Notification[] = [];

  constructor(private errorHandlerService: ErrorHandlerService) {}

  /**
   * Initialize component and subscribe to notifications
   */
  ngOnInit(): void {
    // The notifications are accessed directly as a signal
    this.notifications = this.errorHandlerService.notifications();
  }

  /**
   * Track notifications by ID for efficient rendering
   * @param index - The index of the notification
   * @param notification - The notification object
   * @returns The notification ID
   */
  trackById(index: number, notification: Notification): string {
    return notification.id;
  }

  /**
   * Remove a notification by ID
   * @param id - The ID of the notification to remove
   */
  removeNotification(id: string): void {
    this.errorHandlerService.removeNotification(id);
  }
}