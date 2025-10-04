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
    ],
  },
];

export default NotesRoutes;
