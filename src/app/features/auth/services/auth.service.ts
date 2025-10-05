import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.development';
import { catchError, map, Observable, of } from 'rxjs';

import { StorageService } from '@shared/services/data/storage/storage.service';

import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private storageService = inject(StorageService);
  private baseUrl = `${environment.apiUrl}/auth`;

  private _authStatus = signal<AuthStatus>('checking');

  private _user = signal<User | null>(null);
  private _token = signal<string | null>(this.storageService.getItem('token'));

  checkStatusResource = rxResource({
    stream: () => this.checkStatus(),
  });

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';

    return this._user() ? 'authenticated' : 'not-authenticated';
  });

  user = computed<User | null>(() => {
    return this._user();
  });

  token = computed<string | null>(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, {
        email,
        password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => {
          this.clearAuthState();
          const errorMessage = error.error?.msg || 'Email or password incorrect';
          throw new Error(errorMessage);
        }),
      );
  }

  register(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, {
        email,
        password,
      })
      .pipe(
        map(() => true),
        catchError((error) => {
          const errorMessage = error.error?.msg || 'Error register user';
          throw new Error(errorMessage);
        }),
      );
  }

  checkStatus(): Observable<boolean> {
    const token = this.storageService.getItem('token');

    if (!token) {
      this.clearAuthState();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${this.baseUrl}/check-status`, {}).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      catchError(() => {
        this.clearAuthState();
        return of(false);
      }),
    );
  }

  logout() {
    this.clearAuthState();
    this.router.navigate(['/auth/login']);
  }

  private clearAuthState() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    this.storageService.removeItem('token');
  }

  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    this.storageService.setItem('token', token);
    return true;
  }
}
