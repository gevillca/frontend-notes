import { DOCUMENT } from '@angular/common';
import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { StorageService } from '@shared/services/data/storage/storage.service';

import { ThemeService } from './theme.service';

interface MockDocument {
  documentElement: {
    classList: {
      add: jasmine.Spy;
      remove: jasmine.Spy;
    };
    setAttribute: jasmine.Spy;
    style: Record<string, string>;
  };
  dispatchEvent: jasmine.Spy;
}

interface MockMediaQuery extends Partial<MediaQueryList> {
  matches: boolean;
  addEventListener: jasmine.Spy;
  removeEventListener: jasmine.Spy;
}

interface MockStorage {
  getItem: jasmine.Spy;
  setItem: jasmine.Spy;
  removeItem: jasmine.Spy;
}

// Helper function to flush effects in zoneless mode
async function flushEffects(): Promise<void> {
  const appRef = TestBed.inject(ApplicationRef);
  appRef.tick();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ThemeService - Optimized Tests', () => {
  let service: ThemeService;
  let mockStorageService: MockStorage;
  let mockMediaQuery: MockMediaQuery;
  let mockDocument: MockDocument;

  beforeEach(() => {
    mockStorageService = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
    };

    mockMediaQuery = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };

    mockDocument = {
      documentElement: {
        classList: {
          add: jasmine.createSpy('add'),
          remove: jasmine.createSpy('remove'),
        },
        setAttribute: jasmine.createSpy('setAttribute'),
        style: {},
      },
      dispatchEvent: jasmine.createSpy('dispatchEvent'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ThemeService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    spyOn(window, 'matchMedia').and.returnValue(mockMediaQuery as unknown as MediaQueryList);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created with default values', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
    expect(service.theme()).toBe('system');
    expect(service.resolvedTheme()).toBe('light');
  });

  it('should set and persist themes correctly', async () => {
    service = TestBed.inject(ThemeService);
    (mockStorageService.setItem as jasmine.Spy).calls.reset();

    service.setTheme('dark');
    await flushEffects();

    expect(service.theme()).toBe('dark');
    expect(service.resolvedTheme()).toBe('dark');
    expect(mockStorageService.setItem).toHaveBeenCalledWith('app-theme', 'dark');
  });

  it('should toggle themes correctly', async () => {
    service = TestBed.inject(ThemeService);

    service.setTheme('light');
    await flushEffects();

    service.toggleTheme();
    await flushEffects();

    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    await flushEffects();

    expect(service.theme()).toBe('light');
  });

  it('should handle system theme correctly', async () => {
    service = TestBed.inject(ThemeService);

    mockMediaQuery.matches = true;
    service.setTheme('system');
    await flushEffects();

    expect(service.isSystemTheme()).toBe(true);
    expect(service.isDarkMode()).toBe(true);
    expect(service.resolvedTheme()).toBe('dark');
  });

  it('should load theme from storage on initialization', () => {
    mockStorageService.getItem.and.returnValue('dark');
    service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
    expect(mockStorageService.getItem).toHaveBeenCalledWith('app-theme');
  });

  it('should apply theme to document correctly', async () => {
    service = TestBed.inject(ThemeService);

    service.setTheme('dark');
    await flushEffects();

    expect(mockDocument.documentElement.classList.remove).toHaveBeenCalledWith(
      'app-dark',
      'app-light',
    );
    expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith('app-dark');
    expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(mockDocument.dispatchEvent).toHaveBeenCalled();
  });
});
