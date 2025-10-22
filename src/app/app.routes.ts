import { Routes } from '@angular/router';


export const routes: Routes = [

    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'config',
        loadComponent: () => import('./config/components/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.USUARIOS_ROUTES)
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
