import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

/**
 * Interface representing a user notification
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // in milliseconds, 0 for persistent
  timestamp?: Date; // when the notification was created
}

/**
 * Service for handling application errors and user notifications
 * Provides consistent error handling and user feedback patterns across the application
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  // Maximum number of notifications to keep in memory
  private readonly MAX_NOTIFICATIONS = 10;
  
  // Default durations for different notification types
  private readonly DEFAULT_DURATION = 5000; // 5 seconds
  private readonly ERROR_DURATION = 8000; // 8 seconds for errors
  private readonly SUCCESS_DURATION = 3000; // 3 seconds for success
  
  // Signal to hold current notifications
  private notificationsSig = signal<Notification[]>([]);

  // Readonly computed property for notifications
  readonly notifications = this.notificationsSig.asReadonly();

  /**
   * Handle an error and show appropriate user feedback
   * @param error - The error to handle
   * @param userMessage - Optional custom message to show to user
   */
  handleError(error: unknown, userMessage?: string): void {
    console.error('Application Error:', error);
    
    // Default error message
    let message = 'An unexpected error occurred. Please try again.';
    
    // Customize message based on error type
    if (userMessage) {
      message = userMessage;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    this.showNotification({ 
      id: `error_${Date.now()}`,
      type: 'error', 
      message,
      duration: this.ERROR_DURATION
    });
  }

  /**
   * Show a success message to the user
   * @param message - The success message to show
   * @param duration - Optional duration in milliseconds (default: 3000)
   */
  showSuccess(message: string, duration: number = this.SUCCESS_DURATION): void {
    this.showNotification({ 
      id: `success_${Date.now()}`,
      type: 'success', 
      message,
      duration
    });
  }

  /**
   * Show an error message to the user
   * @param message - The error message to show
   */
  showError(message: string): void {
    this.showNotification({ 
      id: `error_${Date.now()}`,
      type: 'error', 
      message,
      duration: this.ERROR_DURATION
    });
  }

  /**
   * Show a warning message to the user
   * @param message - The warning message to show
   */
  showWarning(message: string): void {
    this.showNotification({ 
      id: `warning_${Date.now()}`,
      type: 'warning', 
      message 
    });
  }

  /**
   * Show an info message to the user
   * @param message - The info message to show
   */
  showInfo(message: string): void {
    this.showNotification({ 
      id: `info_${Date.now()}`,
      type: 'info', 
      message 
    });
  }

  /**
   * Add a notification to the notifications list
   * @param notification - The notification to add
   */
  private showNotification(notification: Notification): void {
    // Add timestamp if not provided
    const notificationWithTimestamp = {
      ...notification,
      timestamp: notification.timestamp || new Date()
    };
    
    this.notificationsSig.update(notifications => {
      // Add new notification
      let updatedNotifications = [...notifications, notificationWithTimestamp];
      
      // Limit the number of notifications
      if (updatedNotifications.length > this.MAX_NOTIFICATIONS) {
        updatedNotifications = updatedNotifications.slice(-this.MAX_NOTIFICATIONS);
      }
      
      return updatedNotifications;
    });
    
    // Auto-remove notification after duration if specified
    const duration = notification.duration || this.DEFAULT_DURATION;
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notificationWithTimestamp.id);
      }, duration);
    }
  }

  /**
   * Remove a notification by ID
   * @param id - The ID of the notification to remove
   */
  removeNotification(id: string): void {
    this.notificationsSig.update(notifications => 
      notifications.filter(notification => notification.id !== id)
    );
  }
  
  /**
   * Get the count of current notifications
   * @returns The number of active notifications
   */
  getNotificationCount(): number {
    return this.notificationsSig().length;
  }
  
  /**
   * Get notifications by type
   * @param type - The type of notifications to retrieve
   * @returns Array of notifications of the specified type
   */
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notificationsSig().filter(notification => notification.type === type);
  }
  
  /**
   * Check if there are any error notifications
   * @returns True if there are error notifications, false otherwise
   */
  hasErrors(): boolean {
    return this.getNotificationsByType('error').length > 0;
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.notificationsSig.set([]);
  }
}