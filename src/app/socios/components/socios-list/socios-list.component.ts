import { Component, OnInit } from '@angular/core';
import { SocioPersona, TipoSocio } from '../../models/socio.interface';
import { SociosService } from '../../services/socios.service';
import { SociosRealcionesService } from '../../services/socios-realciones.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-socios-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './socios-list.component.html',
  styleUrl: './socios-list.component.css'
})
export class SociosListComponent implements OnInit{
    socios: SocioPersona[] = [];
    tiposSocio: TipoSocio[] = [];

    // Filtros para listar y buscar
    tipoVista: string = 'activos'; // Tipos: 'activos' | 'bajas' | 'todos'
    searchTerm: string = '';
    tipoSocioFiltro: number | undefined = undefined;

    constructor(private socioService: SociosService, private relService: SociosRealcionesService, private toast: ToastService, private router: Router){}    

    ngOnInit(): void {
        this.loadTiposSocio();
        this.loadSocios();
    }

    loadTiposSocio(): void {
        this.relService.getTiposSocio().subscribe({
            next: (response) => {
                this.tiposSocio = response.data;
            },
            error: (err) => {
                console.error('Error al cargar tipos de socio:', err);
            }
        });
    }

    loadSocios(): void {
        this.socioService.getSocios(this.tipoVista, this.searchTerm, this.tipoSocioFiltro).subscribe({
            next: (response) => {
                this.socios = response.data;
                console.log('Socios cargados:', this.socios);
            },
            error: (err) => {
                console.error('Error al cargar socios:', err);
                this.toast.error('Error al cargar la lista de socios');
            }
        });
    }

    cambiarVista(tipo: string): void {
        this.tipoVista = tipo;
        this.loadSocios();
    }

    buscar(): void {
        this.loadSocios();
    }

    limpiarFiltros(): void {
        this.searchTerm = '';
        this.tipoSocioFiltro = undefined;
        this.loadSocios();
    }

    crearSocio(): void {
        this.router.navigate(['/socios/crear-socio']);
    }

    verSocio(id: number): void {
        this.router.navigate(['/socios/detalle-socio', id]);
    }

    editarSocio(id: number): void {
        this.router.navigate(['/socios/editar-socio', id]);
    }

    darBaja(socio: SocioPersona): void {
        if (!socio.Id_Persona) return;
        
        const motivo = prompt('Motivo de la baja:');
        if (!motivo) return;
        
        if (confirm(`¿Está seguro de dar de baja a ${socio.Nombre} ${socio.Apellidos}?`)) {
            const fechaBaja = this.obtenerFechaHoraActual();
            this.socioService.darBaja(socio.Id_Persona, {
                fecha_baja: fechaBaja,
                motivo_baja: motivo,
                deudor: false,
                deuda: 0
            }).subscribe({
                next: () => {
                    this.toast.success('Socio dado de baja correctamente');
                    this.loadSocios();
                },
                error: (err) => {
                    console.error('Error al dar de baja:', err);
                    this.toast.error('Error al dar de baja al socio');
                }
            });
        }
    }

    reactivar(socio: SocioPersona): void {
        if (!socio.Id_Persona) return;
        
        if (confirm(`¿Está seguro de reactivar a ${socio.Nombre} ${socio.Apellidos}?`)) {
            const fechaAlta = this.obtenerFechaHoraActual();
            this.socioService.reactivarSocio(socio.Id_Persona, fechaAlta).subscribe({
                next: () => {
                    this.toast.success('Socio reactivado correctamente');
                    this.loadSocios();
                },
                error: (err) => {
                    console.error('Error al reactivar:', err);
                    this.toast.error('Error al reactivar al socio');
                }
            });
        }
    }

    eliminar(socio: SocioPersona): void {
        if (!socio.Id_Persona) return;
        
        if (confirm(`¿Está seguro de ELIMINAR DEFINITIVAMENTE a ${socio.Nombre} ${socio.Apellidos}? Esta acción no se puede deshacer.`)) {
            this.socioService.deleteSocio(socio.Id_Persona).subscribe({
                next: () => {
                    this.toast.success('Socio eliminado definitivamente');
                    this.loadSocios();
                },
                error: (err) => {
                    console.error('Error al eliminar:', err);
                    this.toast.error(err.error?.message || 'Error al eliminar al socio');
                }
            });
        }
    }

    getNombreCompleto(socio: SocioPersona): string {
        return `${socio.Apellidos}, ${socio.Nombre}`;
    }

    getTipoSocioNombre(tipoId: number): string {
        const tipo = this.tiposSocio.find(t => t.id_tipo === tipoId);
        return tipo ? tipo.tipo : 'N/A';
    }

    private obtenerFechaHoraActual(): string {
        const ahora = new Date();        
        const year = ahora.getFullYear();
        const month = String(ahora.getMonth() + 1).padStart(2, '0');
        const day = String(ahora.getDate()).padStart(2, '0');
        const hours = String(ahora.getHours()).padStart(2, '0');
        const minutes = String(ahora.getMinutes()).padStart(2, '0');
        const seconds = String(ahora.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
