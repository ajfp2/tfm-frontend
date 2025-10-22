import { Routes } from '@angular/router';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./components/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'roles',
    loadComponent: () => import('./components/roles/roles.component').then(m => m.RolesComponent)
  }
];