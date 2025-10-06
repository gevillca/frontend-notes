import { Routes } from '@angular/router';

import { MainLayoutComponent } from '@shared/layouts/main-layout/main-layout.component';

export const NotesRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@features/notes/pages/note/note.component'),
      },
      {
        path: 'archived',
        loadComponent: () => import('@features/notes/pages/archived/archived.component'),
      },
      {
        path: 'tag/:tag',
        loadComponent: () => import('@features/notes/pages/tag/tag.component'),
      },
    ],
  },
];

export default NotesRoutes;
