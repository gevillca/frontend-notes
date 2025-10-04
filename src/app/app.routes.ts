import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes'),
  },
  {
    path: 'notes',
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
