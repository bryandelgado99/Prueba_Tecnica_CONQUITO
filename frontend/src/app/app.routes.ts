import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/persons',
    pathMatch: 'full'
  },
  {
    path: 'persons',
    loadComponent: () => import('@views/persons-list').then(c => c.PersonListComponent)
  },
  {
    path: '**',
    redirectTo: '/persons'
  }
];
