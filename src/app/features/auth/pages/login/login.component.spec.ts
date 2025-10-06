import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';
import { AuthService } from '@features/auth/services/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NOTIFICATION_SERVICE, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    component.loginForm.patchValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should have valid form when fields are correct', () => {
    component.loginForm.patchValue({ email: 'test@test.com', password: 'password123' });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login with form values when form is valid', () => {
    const loginData = { email: 'test@test.com', password: 'password123' };
    component.loginForm.patchValue(loginData);
    authService.login.and.returnValue(of(true));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(loginData.email, loginData.password);
  });

  it('should not call authService.login when form is invalid', () => {
    component.loginForm.patchValue({ email: 'invalid', password: '123' });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });
});
