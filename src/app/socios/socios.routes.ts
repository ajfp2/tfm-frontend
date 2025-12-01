import { Routes } from "@angular/router";


export const SOCIOS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'socios',
        pathMatch: 'full'
    },
    {
        path: 'list',
        loadComponent: () => import('./components/socios-list/socios-list.component').then(m => m.SociosListComponent)
    },
    {
        path: 'deudores',
        loadComponent: () => import('./components/socios-deudores/socios-deudores.component').then(m => m.SociosDeudoresComponent)
    },
    {
        path: 'exentos',
        loadComponent: () => import('./components/socios-exentos/socios-exentos.component').then(m => m.SociosExentosComponent)
    },
    {
        path: 'crear-socio',
        loadComponent: () => import('./components/socios-form/socios-form.component').then(m => m.SociosFormComponent)
    },
    {
        path: 'editar-socio/:id',
        loadComponent: () => import('./components/socios-form/socios-form.component').then(m => m.SociosFormComponent)
    },
    {
        path: 'detalle-socio/:id',
        loadComponent: () => import('./components/socio-detail/socio-detail.component').then(m => m.SocioDetailComponent)
    }
];