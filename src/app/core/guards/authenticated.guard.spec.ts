import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '@features/auth/services/auth.service';

import { authenticatedGuard } from './authenticated.guard';

describe('authenticatedGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['checkStatus']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withFetch()),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is authenticated', async () => {
    authService.checkStatus.and.returnValue(of(true));

    const result = await TestBed.runInInjectionContext(() => authenticatedGuard({}, []));

    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', async () => {
    authService.checkStatus.and.returnValue(of(false));

    const result = await TestBed.runInInjectionContext(() => authenticatedGuard({}, []));

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
