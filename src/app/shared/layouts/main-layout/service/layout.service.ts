import { computed, effect, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { LayoutConfig, LayoutState, MenuChangeEvent } from '../interfaces/layouts.interface';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  _config: LayoutConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
  };

  _state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  layoutConfig = signal<LayoutConfig>(this._config);

  layoutState = signal<LayoutState>(this._state);

  private configUpdate = new Subject<LayoutConfig>();
  private overlayOpen = new Subject<void>();

  private menuSource = new Subject<MenuChangeEvent>();

  private resetSource = new Subject<boolean>();

  menuSource$ = this.menuSource.asObservable();

  resetSource$ = this.resetSource.asObservable();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  theme = computed(() => (this.layoutConfig()?.darkTheme ? 'light' : 'dark'));

  isSidebarActive = computed(
    () => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive,
  );

  isDarkTheme = computed(() => this.layoutConfig().darkTheme);

  getPrimary = computed(() => this.layoutConfig().primary);

  getSurface = computed(() => this.layoutConfig().surface);

  isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

  transitionComplete = signal<boolean>(false);

  private initialized = false;

  private readonly syncConfigEffect = effect(() => {
    const config = this.layoutConfig();
    if (config) {
      this.onConfigUpdate();
    }
  });

  private readonly darkModeTransitionEffect = effect(() => {
    const config = this.layoutConfig();

    if (!this.initialized || !config) {
      this.initialized = true;
      return;
    }

    this.handleDarkModeTransition(config);
  });

  private handleDarkModeTransition(config: LayoutConfig): void {
    if (
      'startViewTransition' in document &&
      typeof (document as Document & { startViewTransition?: unknown }).startViewTransition ===
        'function'
    ) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(config: LayoutConfig): void {
    (
      document as Document & {
        startViewTransition: (callback: () => void) => { finished: Promise<void> };
      }
    )
      .startViewTransition(() => {
        this.toggleDarkMode(config);
      })
      .finished.then(() => {
        this.onTransitionEnd();
      })
      .catch(() => {
        this.onTransitionEnd();
      });
  }

  toggleDarkMode(config?: LayoutConfig): void {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.layoutState.update((prev) => ({
        ...prev,
        overlayMenuActive: !this.layoutState().overlayMenuActive,
      }));

      if (this.layoutState().overlayMenuActive) {
        this.overlayOpen.next();
      }
    }

    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive,
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuMobileActive: !this.layoutState().staticMenuMobileActive,
      }));

      if (this.layoutState().staticMenuMobileActive) {
        this.overlayOpen.next();
      }
    }
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this._config = { ...this.layoutConfig() };
    this.configUpdate.next(this.layoutConfig());
  }

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}
