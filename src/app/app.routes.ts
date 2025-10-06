import { Routes } from '@angular/router';

import { authenticatedGuard } from '@core/guards/authenticated.guard';
import { notAuthenticatedGuard } from '@core/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [notAuthenticatedGuard],
    loadChildren: () => import('@features/auth/auth.routes'),
  },
  {
    path: 'notes',
    canMatch: [authenticatedGuard],
    loadChildren: () => import('@features/notes/notes.routes'),
  },
  {
    path: '404',
    loadComponent: () => import('@features/error-page/not-found/not-found.component'),
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
