import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '@environments/environment.development';

import { StorageService } from '@shared/services/data/storage/storage.service';

import { AuthResponse } from '../interfaces/auth-response.interface';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;
  const baseUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
      'removeItem',
    ]);

    storageServiceSpy.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

    const initialRequests = httpMock.match(() => true);
    initialRequests.forEach((req) => req.flush(null, { status: 401, statusText: 'Unauthorized' }));
  });

  afterEach(() => {
    const pendingRequests = httpMock.match(() => true);
    pendingRequests.forEach((req) => req.flush(null, { status: 401, statusText: 'Unauthorized' }));

    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with valid credentials', (done) => {
    const mockResponse: AuthResponse = {
      token: 'fake-jwt-token',
      user: {
        id: 'user-1',
        email: 'test@test.com',
        avatarUrl: 'avatar.jpg',
        createdAt: new Date(),
      },
    };

    service.login('test@test.com', 'password123').subscribe({
      next: (result) => {
        expect(result).toBe(true);
        expect(storageService.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
        done();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.com', password: 'password123' });
    req.flush(mockResponse);
  });

  it('should fail login with invalid credentials', (done) => {
    service.login('invalid@test.com', 'wrongpassword').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('Invalid email or password');
        done();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ msg: 'Invalid email or password' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should register successfully with new email', (done) => {
    service.register('new@test.com', 'password123').subscribe({
      next: (result) => {
        expect(result).toBe(true);
        done();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new@test.com', password: 'password123' });
    req.flush({});
  });

  it('should fail registration with existing email', (done) => {
    service.register('existing@test.com', 'password123').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('Email already registered');
        done();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({ msg: 'Email already registered' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should logout and clear auth state', () => {
    service.logout();

    expect(storageService.removeItem).toHaveBeenCalledWith('token');
  });

  it('should return false when token is invalid in checkStatus', (done) => {
    storageService.getItem.and.returnValue(null);

    service.checkStatus().subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should return true when token is valid in checkStatus', (done) => {
    const validToken = 'valid-token';
    storageService.getItem.and.returnValue(validToken);

    const mockResponse: AuthResponse = {
      token: validToken,
      user: {
        id: 'user-1',
        email: 'test@test.com',
        avatarUrl: 'avatar.jpg',
        createdAt: new Date(),
      },
    };

    service.checkStatus().subscribe({
      next: (result) => {
        expect(result).toBe(true);

        const additionalRequests = httpMock.match(() => true);
        additionalRequests.forEach((req) => req.flush(mockResponse));

        done();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/check-status`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
