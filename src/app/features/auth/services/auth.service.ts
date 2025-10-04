import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { environment } from '@environments/environment.development';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

import { StorageService } from '@shared/services/data/storage/storage.service';

import { AuthResponse } from '../interfaces/auth-response.interface';
import { User } from '../interfaces/user.interface';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(this.storageService.getItem<string>('token'));

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
    return environment.useMockApi
      ? this.loginMock(email, password)
      : this.loginReal(email, password);
  }

  register(email: string, password: string): Observable<boolean> {
    return environment.useMockApi
      ? this.registerMock(email, password)
      : this.registerReal(email, password);
  }

  checkStatus(): Observable<boolean> {
    return of(this.isTokenValid());
  }

  logout() {
    this.clearAuthState();
    this.router.navigate(['/auth/login']);
  }

  private isTokenValid(): boolean {
    const token = this.storageService.getItem<string>('token');

    if (!token) {
      this.clearAuthState();
      return false;
    }

    try {
      const payload = this.decodeToken(token);

      if (payload.exp < Date.now()) {
        this.clearAuthState();
        return false;
      }

      const currentUser = this._user();
      if (currentUser && currentUser.id === payload.userId) {
        this._authStatus.set('authenticated');
        return true;
      }

      this._authStatus.set('authenticated');
      return true;
    } catch {
      this.clearAuthState();
      return false;
    }
  }

  private handleAuthSuccess({ user, token }: AuthResponse): boolean {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);
    this.storageService.setItem('token', token);
    return true;
  }

  private clearAuthState() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    this._token.set(null);
    this.storageService.removeItem('token');
  }

  private decodeToken(token: string): { userId: string; exp: number } {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    return JSON.parse(atob(parts[1]));
  }

  private loginMock(email: string, password: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${environment.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        switchMap((users) => {
          if (users.length === 0) {
            return throwError(() => new Error('Invalid email or password'));
          }

          const user = users[0];
          const token = this.generateMockToken(user.id);
          return of(this.handleAuthSuccess({ user, token }));
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => new Error('Invalid email or password'));
        }),
      );
  }

  private registerMock(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${environment.apiUrl}/users?email=${email}`).pipe(
      switchMap((existingUsers) => {
        if (existingUsers.length > 0) {
          return throwError(() => new Error('Email already registered'));
        }

        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password,
          avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
          createdAt: new Date(),
        };

        return this.http.post<User>(`${environment.apiUrl}/users`, newUser);
      }),
      map(() => {
        return true;
      }),
      catchError((error) => {
        return throwError(() => new Error(error.message));
      }),
    );
  }

  private generateMockToken(userId: string): string {
    const payload = { userId, exp: Date.now() + 86400000 };
    return `mock.${btoa(JSON.stringify(payload))}.signature`;
  }

  private loginReal(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(({ user, token }) => this.handleAuthSuccess({ user, token })),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => new Error('Email o contraseña incorrectos'));
        }),
      );
  }

  private registerReal(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password })
      .pipe(
        map(() => {
          return true;
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || error.message || 'Registration failed';
          return throwError(() => new Error(errorMessage));
        }),
      );
  }
}
