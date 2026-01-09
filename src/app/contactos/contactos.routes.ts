import { Routes } from "@angular/router";


export const CONTACTOS_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'contactos',
        pathMatch: 'full'
    },
    {
        path: 'list',
        loadComponent: () => import('./components/contactos-list/contactos-list.component').then(m => m.ContactosListComponent)
    },
    {
        path: 'crear-contacto',
        loadComponent: () => import('./components/contactos-form/contactos-form.component').then(m => m.ContactosFormComponent)
    },
    {
        path: 'editar-contacto/:id',
        loadComponent: () => import('./components/contactos-form/contactos-form.component').then(m => m.ContactosFormComponent)
    },
    // {
    //     path: 'detalle-socio/:id',
    //     loadComponent: () => import('./components/socio-detail/socio-detail.component').then(m => m.SocioDetailComponent)
    // }
];