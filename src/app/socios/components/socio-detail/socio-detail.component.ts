import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DarBajaDTO, DatosDeuda, SocioPersona } from '../../models/socio.interface';
import { SociosService } from '../../services/socios.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-socio-detail',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './socio-detail.component.html',
  styleUrl: './socio-detail.component.css'
})

export class SocioDetailComponent implements OnInit{
    
    socio: SocioPersona | null = null;
    id_socio: number | null = null;

    // Datos para el modal de baja
    datosBaja: DarBajaDTO = {
        fecha_baja: '',
        motivo_baja: '',
        deudor: false,
        deuda: 0
    };

    // Datos de deudas
    datosDeuda: DatosDeuda | null = null;


    constructor(private socioService: SociosService, private route: ActivatedRoute, private router: Router, private toast: ToastService, private location: Location) {}
    
    ngOnInit(): void {
        const paramURL = this.route.snapshot.paramMap.get('id');
        if (paramURL) {
            this.id_socio = Number(paramURL);
            this.loadSocio(this.id_socio);
            this.loadDeudaSocio(this.id_socio);
        } else {
            this.toast.error('ID de socio no válido');
            this.router.navigate(['/socios/list']);
        }
    }

    loadSocio(id: number){
        this.socioService.getSocioById(id).subscribe({
            next: (response) => {
                this.socio = response.data;
                console.log('Socio cargado:', this.socio);
            },
            error: (err) => {
                console.error('Error al cargar socio:', err);
                this.toast.error('Error al cargar los datos del socio');
                this.router.navigate(['/socios/list']);
            }
        });
    }

    loadDeudaSocio(id: number): void {

        this.socioService.getDeudaSocio(id).subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.datosDeuda = response.data;
                    console.log('Deudas cargadas:', this.datosDeuda);
                }
            },
            error: (err) => {
                console.error('Error al cargar deudas:', err);
                // No mostramos error si no hay deudas, solo lo registramos
            }
        });
    }

    editarSocio(): void {
        if (this.id_socio) {
            this.router.navigate(['/socios/editar-socio', this.id_socio]);
        }
    }

    darBaja(): void {
        if (!this.socio || !this.socio.Id_Persona) return;

        this.datosBaja = {
            fecha_baja: '',
            motivo_baja: '',
            deudor: false,
            deuda: 0
        };

        const modalElement = document.getElementById('modalBajaSocio');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }

    /**
     * Confirmar la baja desde el modal
    */
    confirmarBaja(): void {
        if (!this.socio || !this.socio.Id_Persona) return;
        
        // Validaciones
        if (!this.datosBaja.motivo_baja.trim()) {
            this.toast.error('El motivo de la baja es obligatorio');
            return;
        }
        
        if (this.datosBaja.deudor && (!this.datosBaja.deuda || this.datosBaja.deuda <= 0)) {
            this.toast.error('Si es deudor, debe introducir un importe válido');
            return;
        }
        
        // Añadir fecha y hora actual
        this.datosBaja.fecha_baja = this.obtenerFechaHoraActual();
        
        // Si no es deudor, asegurar que la deuda es 0
        if (!this.datosBaja.deudor) {
            this.datosBaja.deuda = 0;
        }
        
        // Cerrar modal
        const modalElement = document.getElementById('modalDarBaja');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
        
        // Ejecutar la baja
        this.socioService.darBaja(this.socio.Id_Persona, this.datosBaja).subscribe({
            next: () => {
                this.toast.success('Socio dado de baja correctamente');
                this.router.navigate(['/socios/list']);
            },
            error: (err) => {
                console.error('Error al dar de baja:', err);
                this.toast.error(err.error?.message || 'Error al dar de baja al socio');
            }
        });
    }

    reactivar(): void {
        if (!this.socio || !this.socio.Id_Persona) return;
        
        if (confirm(`¿Está seguro de reactivar a ${this.socio.Nombre} ${this.socio.Apellidos}?`)) {
            const fechaAltaConHora = this.obtenerFechaHoraActual();
            
            this.socioService.reactivarSocio(this.socio.Id_Persona, fechaAltaConHora).subscribe({
                next: () => {
                    this.toast.success('Socio reactivado correctamente');
                    this.loadSocio(this.socio!.Id_Persona!);
                },
                error: (err) => {
                    console.error('Error al reactivar:', err);
                    this.toast.error('Error al reactivar al socio');
                }
            });
        }
    }

    eliminar(): void {
        if (!this.socio || !this.socio.Id_Persona) return;
        
        if (confirm(`¿Está seguro de ELIMINAR DEFINITIVAMENTE a ${this.socio.Nombre} ${this.socio.Apellidos}? Esta acción no se puede deshacer.`)) {
            this.socioService.deleteSocio(this.socio.Id_Persona).subscribe({
                next: () => {
                    this.toast.success('Socio eliminado definitivamente');
                    this.router.navigate(['/socios/list']);
                },
                error: (err) => {
                    console.error('Error al eliminar:', err);
                    this.toast.error(err.error?.message || 'Error al eliminar al socio');
                }
            });
        }
    }

    volver(): void {
        // this.router.navigate(['/socios/list']);
        this.location.back();
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

    getNombreCompleto(): string {
        if (!this.socio) return '';
        return `${this.socio.Apellidos}, ${this.socio.Nombre}`;
    }

    getEdad(): number | null {
        if (!this.socio || !this.socio.FNac) return null;
        
        const fechaNac = new Date(this.socio.FNac);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        return edad;
    }

    formatearIBAN(iban: string | undefined): string {
        if (!iban) return 'N/A';
        // Formatear IBAN: ES12 3456 7890 1234 5678 9012
        return iban.match(/.{1,4}/g)?.join(' ') || iban;
    }

    isActivo(): boolean {
        return !!this.socio?.alta;
    }

    isBaja(): boolean {
        return !!this.socio?.baja;
    }

    getEstadoBadgeClass(estado: string): string {
        switch (estado) {
        case 'PAGADO':
            return 'bg-success';
        case 'PENDIENTE':
            return 'bg-danger';
        case 'EXENTO':
            return 'bg-warning';
        default:
            return 'bg-secondary';
        }
    }

    // Verificar si tiene deudas pendientes
    tieneDeudas(): boolean {
        return this.datosDeuda !== null && this.datosDeuda.resumen.total_deuda > 0;
    }

}
