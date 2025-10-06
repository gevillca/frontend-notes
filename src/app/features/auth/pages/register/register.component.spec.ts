import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';
import { AuthService } from '@features/auth/services/auth.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
    ]);
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: NOTIFICATION_SERVICE,
          useValue: notificationServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.registerForm.invalid).toBeTruthy();
  });

  it('should have valid form when fields are correct', () => {
    component.registerForm.patchValue({ email: 'test@test.com', password: 'password123' });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should call authService.register with form values when form is valid', () => {
    const registerData = { email: 'test@test.com', password: 'password123' };
    component.registerForm.patchValue(registerData);
    authService.register.and.returnValue(of(true));

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(registerData.email, registerData.password);
  });

  it('should not call authService.register when form is invalid', () => {
    component.registerForm.patchValue({ email: 'invalid', password: '123' });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });
});
