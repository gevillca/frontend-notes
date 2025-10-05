import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service for showing confirmation dialogs
 * This interface provides a consistent API across different dialog implementations

 */
export interface Confirmation {
  /**
   * Shows a delete confirmation dialog
   * @param message - The confirmation message to display
   * @returns Observable that emits true if confirmed, false if rejected
   */
  confirmDelete(message?: string): Observable<boolean>;

  /**
   * Shows an archive confirmation dialog
   * @param message - The confirmation message to display
   * @returns Observable that emits true if confirmed, false if rejected
   */
  confirmArchive(message?: string): Observable<boolean>;
}

/**
 * Injection token for Confirmation service
 */
export const CONFIRMATION_SERVICE = new InjectionToken<Confirmation>('Confirmation');
