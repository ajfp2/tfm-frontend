import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./components/usuarios-list/usuarios-list.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'create-user',
    loadComponent: () => import('./components/usuarios-form/usuarios-form.component').then(m => m.UsuariosFormComponent)
  },
  {
    path: 'edit-user/:id',
    loadComponent: () => import('./components/usuarios-form/usuarios-form.component').then(m => m.UsuariosFormComponent)
  },
  {
    path: 'roles',
    loadComponent: () => import('./components/roles/roles.component').then(m => m.RolesComponent)
  }
];