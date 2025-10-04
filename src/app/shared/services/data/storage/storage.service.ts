import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Guarda un valor en localStorage.
   * @param key La clave bajo la cual se guardará el valor.
   * @param value El valor a guardar. Se convertirá a JSON.
   */
  setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
  }

  /**
   * Obtiene un valor desde localStorage.
   * @param key La clave del valor a obtener.
   * @returns El valor parseado desde JSON, o null si no se encuentra o hay un error.
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
   * Elimina un valor de localStorage.
   * @param key La clave del valor a eliminar.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
