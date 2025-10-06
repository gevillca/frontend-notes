import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

import { StorageService } from '@shared/services/data/storage/storage.service';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Service para gestionar el tema de la aplicación
 *
 * Características:
 * - Soporte para temas light, dark y system (automático)
 * - Persistencia en localStorage
 * - Reactividad con signals de Angular
 * - Sincronización con preferencias del sistema operativo
 * - Eventos personalizados para notificar cambios de tema
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageService = inject(StorageService);
  private readonly storageKey = 'app-theme';

  public readonly theme = signal<Theme>('system');

  public readonly resolvedTheme = signal<ResolvedTheme>('light');

  private mediaQuery: MediaQueryList;

  private readonly saveThemeEffect = effect(() => {
    const currentTheme = this.theme();
    this.storageService.setItem(this.storageKey, currentTheme);
    this.updateResolvedTheme();
  });

  private readonly applyThemeEffect = effect(() => {
    const resolved = this.resolvedTheme();
    this.applyTheme(resolved);
  });

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.setupMediaQueryListener();
    this.loadTheme();
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.updateResolvedTheme();
      }
    });
  }

  private loadTheme(): void {
    const savedTheme = this.storageService.getItem<Theme>(this.storageKey);
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this.theme.set(savedTheme);
    } else {
      this.theme.set('system');
    }
    this.updateResolvedTheme();
  }

  private updateResolvedTheme(): void {
    const currentTheme = this.theme();
    let resolved: ResolvedTheme;

    if (currentTheme === 'system') {
      resolved = this.mediaQuery.matches ? 'dark' : 'light';
    } else {
      resolved = currentTheme as ResolvedTheme;
    }

    this.resolvedTheme.set(resolved);
  }

  private applyTheme(theme: ResolvedTheme): void {
    const root = this.document.documentElement;

    root.classList.remove('app-dark', 'app-light');
    root.classList.add(`app-${theme}`);

    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    // Notification change theme
    this.dispatchThemeChangeEvent(theme);
  }

  private dispatchThemeChangeEvent(theme: ResolvedTheme): void {
    const event = new CustomEvent('theme-changed', {
      detail: { theme },
      bubbles: true,
    });
    this.document.dispatchEvent(event);
  }

  // Métodos públicos para controlar el tema
  public setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  /**
   * Alternate between light and dark themes. If the current theme is 'system',
   * it switches to the opposite of the current system theme.
   *
   */
  public toggleTheme(): void {
    const current = this.theme();
    if (current === 'system') {
      const systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
      this.theme.set(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      this.theme.set(current === 'light' ? 'dark' : 'light');
    }
  }

  public useSystemTheme(): void {
    this.theme.set('system');
  }

  public isDarkMode(): boolean {
    return this.resolvedTheme() === 'dark';
  }

  public isSystemTheme(): boolean {
    return this.theme() === 'system';
  }
}
