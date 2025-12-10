import { Routes } from "@angular/router";


export const TEMPORADAS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'temporadas',
        pathMatch: 'full'
    },
    {
        path: 'list',
        loadComponent: () => import('./components/temporadas-list/temporadas-list.component').then(m => m.TemporadasListComponent)
    },
    {
        path: 'crear-temp',
        loadComponent: () => import('./components/temporada-form/temporada-form.component').then(m => m.TemporadaFormComponent)
    },
    {
        path: 'editar-temp/:id',
        loadComponent: () => import('./components/temporada-form/temporada-form.component').then(m => m.TemporadaFormComponent)
    },
    {
        path: 'detalle-temp/:id',
        loadComponent: () => import('./components/temporada-detail/temporada-detail.component').then(m => m.TemporadaDetailComponent)
    }
];