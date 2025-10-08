import { TestBed } from '@angular/core/testing';
import { ErrorHandlerService, Notification } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService]
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty notifications', () => {
    expect(service.notifications().length).toBe(0);
    expect(service.getNotificationCount()).toBe(0);
  });

  it('should add and remove notifications', () => {
    // Add a notification
    service.showSuccess('Test message');
    expect(service.notifications().length).toBe(1);
    expect(service.getNotificationCount()).toBe(1);

    // Remove the notification
    const notificationId = service.notifications()[0].id;
    service.removeNotification(notificationId);
    expect(service.notifications().length).toBe(0);
    expect(service.getNotificationCount()).toBe(0);
  });

  it('should handle different notification types', () => {
    service.showSuccess('Success message');
    service.showError('Error message');
    service.showWarning('Warning message');
    service.showInfo('Info message');

    expect(service.notifications().length).toBe(4);
    expect(service.getNotificationsByType('success').length).toBe(1);
    expect(service.getNotificationsByType('error').length).toBe(1);
    expect(service.getNotificationsByType('warning').length).toBe(1);
    expect(service.getNotificationsByType('info').length).toBe(1);
  });

  it('should check for error notifications', () => {
    expect(service.hasErrors()).toBeFalse();

    service.showError('Test error');
    expect(service.hasErrors()).toBeTrue();

    // Clear notifications
    service.clearNotifications();
    expect(service.hasErrors()).toBeFalse();
  });

  it('should clear all notifications', () => {
    service.showSuccess('Message 1');
    service.showError('Message 2');
    service.showWarning('Message 3');

    expect(service.notifications().length).toBe(3);

    service.clearNotifications();
    expect(service.notifications().length).toBe(0);
  });

  it('should handle errors with different input types', () => {
    // String error
    service.handleError('String error', 'Custom message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Custom message');

    service.clearNotifications();

    // Error object
    service.handleError(new Error('Error object'), 'Custom message 2');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Custom message 2');

    service.clearNotifications();

    // Error object without custom message
    service.handleError(new Error('Error object only'));
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Error object only');
  });

  it('should limit the number of notifications', () => {
    // Add more notifications than the maximum
    for (let i = 0; i < 15; i++) {
      service.showInfo(`Message ${i}`);
    }

    // Should be limited to MAX_NOTIFICATIONS (10)
    expect(service.notifications().length).toBe(10);
    
    // Latest notifications should be kept
    const notifications = service.notifications();
    expect(notifications[0].message).toBe('Message 5');
    expect(notifications[9].message).toBe('Message 14');
  });

  it('should add timestamps to notifications', () => {
    service.showSuccess('Test message');
    const notification = service.notifications()[0];
    
    expect(notification.timestamp).toBeTruthy();
    expect(notification.timestamp instanceof Date).toBeTrue();
  });
});