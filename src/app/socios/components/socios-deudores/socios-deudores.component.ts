import { Component, OnInit } from '@angular/core';
import { SociosService } from '../../services/socios.service';
import { SociosRealcionesService } from '../../services/socios-realciones.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { SocioDeudor } from '../../models/socio.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socios-deudores',
  imports: [CommonModule],
  templateUrl: './socios-deudores.component.html',
  styleUrl: './socios-deudores.component.css'
})
export class SociosDeudoresComponent implements OnInit{

    socios: SocioDeudor[] = [];
    // tiposSocio: TipoSocio[] = [];

    // Filtros para listar y buscar
    tipoVista: string = 'activa'; // Tipos: 'activa' | 'inactiva' | 'todas'
    searchTerm: string = '';
    tipoSocioFiltro: number | undefined = undefined;

    constructor(private socioService: SociosService, private relService: SociosRealcionesService, private toast: ToastService, private router: Router){}

    ngOnInit(): void {
        this.loadSociosDeudores();
    }

    loadSociosDeudores(): void {
        this.socioService.getSociosDeudores(this.tipoVista, this.searchTerm, this.tipoSocioFiltro).subscribe({
            next: (response) => {
                console.log(response);

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
        this.loadSociosDeudores();
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

    darBaja(socio: SocioDeudor): void {
        if (!socio.Id_Persona) return;
        
        const motivo = prompt('Motivo de la baja:');
        if (!motivo) return;
        
        if (confirm(`¿Está seguro de dar de baja a ${socio.nombre_completo}?`)) {
            const fechaBaja = this.obtenerFechaHoraActual();
            this.socioService.darBaja(socio.Id_Persona, {
                fecha_baja: fechaBaja,
                motivo_baja: motivo,
                deudor: false,
                deuda: 0
            }).subscribe({
                next: () => {
                    this.toast.success('Socio dado de baja correctamente');
                    this.loadSociosDeudores();
                },
                error: (err) => {
                    console.error('Error al dar de baja:', err);
                    this.toast.error('Error al dar de baja al socio');
                }
            });
        }
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
