import { InjectionToken } from '@angular/core';

export interface NotificationOptions {
  title?: string;
  duration?: number;
  closable?: boolean;
}

/**
 * Configuration options for notifications
 */
export interface Notification {
  /*
   * Shows a success notification
     @param message - The notification message to display
     @param options - Optional configuration for the notification
   */
  success(message: string, options?: NotificationOptions): void;

  /*
   * Shows an error notification
    @param message - The notification message to display
    @param options - Optional configuration for the notification
   */
  error(message: string, options?: NotificationOptions): void;

  /*
   * Shows an info notification
    @param message - The notification message to display
    @param options - Optional configuration for the notification
   */
  info(message: string, options?: NotificationOptions): void;

  /*
   * Shows a warning notification
    @param message - The notification message to display
    @param options - Optional configuration for the notification
   */
  warn(message: string, options?: NotificationOptions): void;

  /*  * Clears all notifications
   */
  clear(): void;
}

/**
 * Injection token for NotificationService
 */
export const NOTIFICATION_SERVICE = new InjectionToken<Notification>('Notification');
