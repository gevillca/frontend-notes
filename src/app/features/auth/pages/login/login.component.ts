import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { NOTIFICATIONS_MESSAGES } from '@shared/services/ui/notification/constants/notification-messages.constants';
import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly notificationService = inject(NOTIFICATION_SERVICE);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    const loginData = this.loginForm.value;

    console.log('Login attempt with data:', loginData);
    this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_ARCHIVED);
  }
}
