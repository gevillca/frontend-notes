import { InjectionToken } from '@angular/core';

/**
 * Opciones de configuración para notificaciones
 */
export interface NotificationOptions {
  title?: string;
  duration?: number;
  closable?: boolean;
}

/**
 * Contrato para servicios de notificación
 */
export interface NotificationService {
  success(message: string, options?: NotificationOptions): void;
  error(message: string, options?: NotificationOptions): void;
  info(message: string, options?: NotificationOptions): void;
  warn(message: string, options?: NotificationOptions): void;
  clear(): void;
}

/**
 * Token de inyección para NotificationService
 */
export const NOTIFICATION_SERVICE = new InjectionToken<NotificationService>('NotificationService');
