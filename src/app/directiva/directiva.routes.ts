import { Routes } from "@angular/router";


export const DIRECTIVA_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'junta-directiva',
        pathMatch: 'full'
    },
    {
        path: 'list',
        loadComponent: () => import('./components/junta-list/junta-list.component').then(m => m.JuntaListComponent)
    },
    {
        path: 'gestionar-cargos',
        loadComponent: () => import('./components/junta-cargos/junta-cargos.component').then(m => m.JuntaCargosComponent)
    },
    {
        path: 'historial-cargos',
        loadComponent: () => import('./components/junta-historial/junta-historial.component').then(m => m.JuntaHistorialComponent)
    }
];