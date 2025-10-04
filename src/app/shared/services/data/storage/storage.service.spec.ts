import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService - Zoneless Compatible', () => {
  let service: StorageService;
  let store: Record<string, string>;
  let mockLocalStorage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(), // 🚀 Zoneless provider
        StorageService,
      ],
    });

    service = TestBed.inject(StorageService);

    // Mock localStorage completo para zoneless testing
    store = {};
    mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index: number): string | null => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
      get length() {
        return Object.keys(store).length;
      },
    } as Storage;

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
  });

  afterEach(() => {
    store = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store an item JSON-stringified in localStorage', () => {
    const key = 'testKey';
    const value = { data: 'testValue' };

    service.setItem(key, value);

    // Verificamos que el método de localStorage fue llamado con el valor "stringified"
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should retrieve and parse an item from localStorage', () => {
    const key = 'testKey';
    const value = { data: 'testValue' };

    // Preparamos el mock store con el valor ya "stringified"
    store[key] = JSON.stringify(value);

    const result = service.getItem(key);

    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('should return null if item does not exist in localStorage', () => {
    const key = 'nonExistentKey';

    const result = service.getItem(key);

    expect(localStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('should return null if JSON is invalid', () => {
    const key = 'invalidJsonKey';
    store[key] = '{ "data": "testValue"'; // JSON inválido (falta '}')

    // Spy on console.error to suppress error output during test
    spyOn(console, 'error');

    const result = service.getItem(key);

    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener de localStorage',
      jasmine.any(SyntaxError),
    );
  });

  it('should remove an item from localStorage', () => {
    const key = 'testKey';
    const value = { data: 'testValue' };

    service.setItem(key, value);
    expect(service.getItem(key)).toEqual(value);

    service.removeItem(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    expect(service.getItem(key)).toBeNull();
  });

  it('should handle storage errors gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    const key = 'testKey';
    const value = { data: 'testValue' };

    // Mock localStorage.setItem to throw an error
    (localStorage.setItem as jasmine.Spy).and.throwError('Storage quota exceeded');

    service.setItem(key, value);

    expect(consoleSpy).toHaveBeenCalledWith('Error al guardar en localStorage', jasmine.any(Error));
  });

  it('should handle retrieval errors gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    const key = 'testKey';

    // Mock localStorage.getItem to throw an error
    (localStorage.getItem as jasmine.Spy).and.throwError('Storage access denied');

    const result = service.getItem(key);

    expect(consoleSpy).toHaveBeenCalledWith('Error al obtener de localStorage', jasmine.any(Error));
    expect(result).toBeNull();
  });
});
