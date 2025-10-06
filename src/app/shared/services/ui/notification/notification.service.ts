import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

import { Notification, NotificationOptions } from './interface/notification.interface';

export type NotificationType = 'success' | 'error' | 'info' | 'warn';

export type NotificationIcon =
  | 'pi pi-check'
  | 'pi pi-times'
  | 'pi pi-info-circle'
  | 'pi pi-exclamation-triangle';

/**
 * Default duration and icon configuration for each notification type
 */
const NOTIFICATION_DEFAULT_CONFIG = {
  success: { duration: 3000, icon: 'pi pi-check' },
  error: { duration: 5000, icon: 'pi pi-times' },
  info: { duration: 4000, icon: 'pi pi-info-circle' },
  warn: { duration: 4500, icon: 'pi pi-exclamation-triangle' },
} as const;

/**
 * Service for displaying toast notifications throughout the application
 * Uses PrimeNG MessageService for consistent user feedback
 */
@Injectable({ providedIn: 'root' })
export class NotificationServiceImpl implements Notification {
  private readonly messageService = inject(MessageService);

  success(message: string, options?: NotificationOptions): void {
    this.show('success', message, options);
  }

  error(message: string, options?: NotificationOptions): void {
    this.show('error', message, options);
  }

  info(message: string, options?: NotificationOptions): void {
    this.show('info', message, options);
  }

  warn(message: string, options?: NotificationOptions): void {
    this.show('warn', message, options);
  }

  clear(): void {
    this.messageService.clear();
  }

  /**
   * Centralizes notification display logic to avoid duplication (DRY)
   * Merges default config with user-provided options
   */
  private show(
    type: keyof typeof NOTIFICATION_DEFAULT_CONFIG,
    message: string,
    options?: NotificationOptions,
  ): void {
    const config = NOTIFICATION_DEFAULT_CONFIG[type];

    this.messageService.add({
      severity: type,
      summary: message,
      life: options?.duration ?? config.duration,
      icon: config.icon,
      closable: options?.closable ?? true,
      key: 'br',
    });
  }
}
