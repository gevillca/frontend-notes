import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start and stop loading', () => {
    expect(service.isLoading()).toBe(false);

    service.start();
    expect(service.isLoading()).toBe(true);

    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle multiple concurrent requests', () => {
    service.start();
    service.start();
    expect(service.isLoading()).toBe(true);

    service.stop();
    expect(service.isLoading()).toBe(true); // Still loading

    service.stop();
    expect(service.isLoading()).toBe(false); // Now stopped
  });
});
