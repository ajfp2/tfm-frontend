import { Routes } from "@angular/router";


export const PENYA_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'penya',
        pathMatch: 'full'
    },
    {
        path: 'basico',
        loadComponent: () => import('./components/penya-datos/penya-datos.component').then(m => m.PenyaDatosComponent)
    },
    {
        path: 'banco',
        loadComponent: () => import('./components/penya-banco/penya-banco.component').then(m => m.PenyaBancoComponent)
    }
    // {
    //     path: 'editar-temp/:id',
    //     loadComponent: () => import('./components/temporada-form/temporada-form.component').then(m => m.TemporadaFormComponent)
    // },
    // {
    //     path: 'detalle-temp/:id',
    //     loadComponent: () => import('./components/temporada-detail/temporada-detail.component').then(m => m.TemporadaDetailComponent)
    // }
];