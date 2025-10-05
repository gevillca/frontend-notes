import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { LoadingInterceptor } from '@core/interceptors/loading.interceptor';
import {
  ConfirmationDialogServiceImpl,
  NOTIFICATION_SERVICE,
  NotificationServiceImpl,
} from '@shared/services/ui';
import { CONFIRMATION_SERVICE } from '@shared/services/ui/confirmation/interface/confirmation.interface';
import ThemePresent from '@shared/theme/presets/theme-preset';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation(),
    ),
    provideHttpClient(withFetch(), withInterceptors([LoadingInterceptor])),
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: ThemePresent, options: { darkModeSelector: '.app-dark' } },
    }),

    MessageService,
    ConfirmationService,
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationServiceImpl,
    },
    {
      provide: CONFIRMATION_SERVICE,
      useClass: ConfirmationDialogServiceImpl,
    },
  ],
};
