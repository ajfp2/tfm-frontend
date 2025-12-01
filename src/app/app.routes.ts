import { Routes } from '@angular/router';
import { publicGuard, authGuard } from './shared/guards/auth.guard';


export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/componentes/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]
    },
    

    // Rutas protegidas- todas las demas
    {
        path: '',
        loadComponent: () => import('./shared/components/main/main.component').then(m => m.MainComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'socios',
                loadChildren: () => import('./socios/socios.routes').then(m => m.SOCIOS_ROUTES)
            },
            {
                path: 'config',
                loadComponent: () => import('./config/components/settings.component').then(m => m.SettingsComponent)
            },
            {
                path: 'usuarios',
                loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
