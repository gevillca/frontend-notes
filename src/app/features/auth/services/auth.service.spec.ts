import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StorageService } from '@shared/services/data/storage/storage.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
      'removeItem',
    ]);

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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with valid credentials', (done) => {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'test@test.com',
        password: 'password123',
        avatarUrl: 'avatar.jpg',
        createdAt: new Date(),
      },
    ];

    service.login('test@test.com', 'password123').subscribe({
      next: (result) => {
        expect(result).toBe(true);
        expect(storageService.setItem).toHaveBeenCalledWith('token', jasmine.any(String));
        done();
      },
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/users?email=test@test.com&password=password123'),
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fail login with invalid credentials', (done) => {
    service.login('invalid@test.com', 'wrongpassword').subscribe({
      error: (error) => {
        expect(error.message).toBe('Invalid email or password');
        done();
      },
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/users?email=invalid@test.com&password=wrongpassword'),
    );
    req.flush([]);
  });

  it('should register successfully with new email', (done) => {
    const newUser = {
      id: 'user-123',
      email: 'new@test.com',
      password: 'password123',
      avatarUrl: 'avatar.jpg',
      createdAt: new Date(),
    };

    service.register('new@test.com', 'password123').subscribe({
      next: (result) => {
        expect(result).toBe(true);
        done();
      },
    });

    // First request to check if user exists
    const checkReq = httpMock.expectOne((request) =>
      request.url.includes('/users?email=new@test.com'),
    );
    checkReq.flush([]);

    // Second request to create user
    const createReq = httpMock.expectOne((request) => request.url.includes('/users'));
    expect(createReq.request.method).toBe('POST');
    createReq.flush(newUser);
  });

  it('should fail registration with existing email', (done) => {
    const existingUser = [
      {
        id: 'user-1',
        email: 'existing@test.com',
        password: 'password123',
        avatarUrl: 'avatar.jpg',
        createdAt: new Date(),
      },
    ];

    service.register('existing@test.com', 'password123').subscribe({
      error: (error) => {
        expect(error.message).toBe('Email already registered');
        done();
      },
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/users?email=existing@test.com'),
    );
    req.flush(existingUser);
  });

  it('should logout and clear auth state', () => {
    service.logout();

    expect(storageService.removeItem).toHaveBeenCalledWith('token');
  });

  it('should return false when token is invalid in checkStatus', () => {
    storageService.getItem.and.returnValue(null);

    service.checkStatus().subscribe((result) => {
      expect(result).toBe(false);
    });
  });

  it('should return true when token is valid in checkStatus', () => {
    const validToken =
      'mock.' + btoa(JSON.stringify({ userId: '123', exp: Date.now() + 10000 })) + '.signature';
    storageService.getItem.and.returnValue(validToken);

    service.checkStatus().subscribe((result) => {
      expect(result).toBe(true);
    });
  });
});
