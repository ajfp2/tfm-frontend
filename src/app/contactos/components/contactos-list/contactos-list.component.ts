import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContactoService } from '../../services/contacto.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Contacto } from '../../models/contacto.model';

@Component({
  selector: 'app-contactos-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contactos-list.component.html',
  styleUrl: './contactos-list.component.css'
})
export class ContactosListComponent implements OnInit{
    contactos: Contacto[] = [];
    contactosFiltrados: Contacto[] = [];
    searchTerm = '';

    constructor(private cs: ContactoService, private toast: ToastService, private router: Router) {}

    ngOnInit(): void {
        this.cargarContactos();
    }

    cargarContactos(): void {
        this.cs.getContactos().subscribe({
            next: (response) => {
                if (response.code === 200) {
                    console.log("resp",response);
                    
                    this.contactos = Array.isArray(response.data) ? response.data : [];
                    this.contactosFiltrados = [...this.contactos];                                    
                }
            },
            error: (error) => {
                console.error('Error al cargar contactos:', error);
                this.toast.error('Error al cargar los contactos');
            }
        });
    }

    buscar(): void {
        if (this.searchTerm.trim() === '') {
            this.contactosFiltrados = [...this.contactos];
            return;
        }

        const termino = this.searchTerm.toLowerCase().trim();
        this.contactosFiltrados = this.contactos.filter(c => 
            c.nom_emp.toLowerCase().includes(termino) ||
            c.dni_cif.toLowerCase().includes(termino) ||
            c.email.toLowerCase().includes(termino) ||
            (c.contacto && c.contacto.toLowerCase().includes(termino))
        );
    }

    limpiarBusqueda(): void {
        this.searchTerm = '';
        this.contactosFiltrados = [...this.contactos];
    }

    verDetalle(id: number): void {
        this.router.navigate(['/contactos/detalle-contacto', id]);
    }

    editar(id: number): void {
        this.router.navigate(['/contactos/editar-contacto', id]);
    }

    nuevo(): void {
        this.router.navigate(['/contactos/crear-contacto']);
    }

    eliminar(contacto: Contacto): void {
        if (!confirm(`¿Estás seguro de eliminar el contacto "${contacto.nom_emp}"?`)) {
            return;
        }

        this.cs.deleteContacto(contacto.id).subscribe({
            next: (response) => {
                if (response.code === 200) {
                    this.toast.success('Contacto eliminado correctamente');
                    this.cargarContactos(); // Recargar lista
                }
            },
            error: (error) => {
                console.error('Error al eliminar contacto:', error);
                this.toast.error('Error al eliminar el contacto');
            }
        });
    }

    formatearTelefono(telefono: number | undefined): string {
        if (!telefono) return '-';
        const tel = telefono.toString();
        if (tel.length === 9) {
            return `${tel.substring(0, 3)} ${tel.substring(3, 6)} ${tel.substring(6)}`;
        }
        return tel;
    }

    getIniciales(nombre: string): string {
        if (!nombre) return '??';
        const palabras = nombre.trim().split(' ');
        if (palabras.length >= 2) {
            return (palabras[0][0] + palabras[1][0]).toUpperCase();
        }
        return nombre.substring(0, 2).toUpperCase();
    }

    recargar(): void {
        this.searchTerm = '';
        this.cargarContactos();
    }
}
