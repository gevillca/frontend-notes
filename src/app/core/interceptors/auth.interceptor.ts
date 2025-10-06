import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '@features/auth/services/auth.service';

/**
 * Auth Interceptor
 * Automatically adds Authorization header with Bearer token to all HTTP requests
 * except for auth endpoints (login, register)
 */
export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = inject(AuthService).token();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
