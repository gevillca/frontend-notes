import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@features/auth/services/auth.service';

export const authenticatedGuard: CanMatchFn = async (_route, _segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
