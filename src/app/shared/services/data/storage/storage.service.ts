import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Saves a value to localStorage.
   * @param key The key under which to store the value.
   * @param value The value to store, which will be stringified to JSON.
   */
  setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
  }

  /**
   * Retrieves a value from localStorage.
   * @param key The key of the value to retrieve.
   * @returns The parsed value, or null if not found or on error.
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
      console.error('Error al obtener de localStorage', e);
      return null;
    }
  }

  /**
   * Removes an item from localStorage.
   * @param key The key of the item to remove.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
