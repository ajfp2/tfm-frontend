import { Routes } from '@angular/router';
import { publicGuard, authGuard } from './shared/guards/auth.guard';


export const routes: Routes = [

    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/componentes/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]  // ← Solo si NO está autenticado
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'config',
        loadComponent: () => import('./config/components/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES),
        canActivate: [authGuard]
    },

    {
        path: '**',
        redirectTo: '/dashboard'
    }
/*
    {
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    },
    {
        path: 'config',
        loadChildren: () => import('./config/config.module').then((m) => m.ConfigModule),
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }*/
];
