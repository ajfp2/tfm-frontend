import { Component, OnInit } from '@angular/core';
import { HistorialCargoDirectivo, MiembroJuntaDirectiva } from '../../models/junta-directiva.model';
import { HistorialCargoService } from '../../services/historial-cargo.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemporadasService } from '../../../temporadas/services/temporadas.service';

@Component({
  selector: 'app-junta-list',
  imports: [CommonModule],
  templateUrl: './junta-list.component.html',
  styleUrl: './junta-list.component.css'
})
export class JuntaListComponent implements OnInit{

    miembros: MiembroJuntaDirectiva[] = [];
    temporadaActual: string = 'Tempo 25-26';
    temporadaId: number | null = null;

    constructor(private hs: HistorialCargoService, private ts: TemporadasService, private toast: ToastService, private router: Router) {}

    ngOnInit(): void {
        this.loadTemporadaActiva();
    }

    loadTemporadaActiva(): void {
        this.ts.getTemporadaActiva().subscribe({
            next: (response) => {
                this.temporadaActual = response.data.temporada;
                this.temporadaId = response.data.id;
                this.loadJuntaActual(response.data.id);
            },
            error: (err) => {
                console.error('Error al cargar temporada activa:', err);
                this.toast.error('Error al cargar la temporada activa');
            }
        });
    }

    loadJuntaActual(tempID: number): void {        
        this.hs.getJuntaPorTemporada(tempID).subscribe({
            next: (response) => {
                if (response.data && response.data.length > 0) {
                    this.miembros = response.data.map(item => this.mapToMiembro(item));
                } else {
                    this.toast.warning('No hay cargos asignados en la temporada actual');
                }                
            },
            error: (err) => {
                console.error('Error al cargar junta directiva:', err);
                this.toast.error('Error al cargar la junta directiva');
            }
        });
    }

    private mapToMiembro(item: HistorialCargoDirectivo): MiembroJuntaDirectiva {
        return {
            cargo: item.cargo?.cargo || 'Sin cargo',
            cargoId: item.a_cargo,
            socioId: item.a_persona,
            nombreCompleto: item.persona ? `${item.persona.Apellidos}, ${item.persona.Nombre}` : 'Socio no encontrado',
            dni: item.persona?.DNI || '',
            email: item.persona?.Email || '',
            movil: item.persona?.Movil || '',
            temporada: item.temporada?.temporada || '',
            temporadaId: item.a_temporada
        };
    }

    gestionarJunta(): void {
        this.router.navigate(['/junta-directiva/gestionar-cargos']);
    }

    verHistorial(): void {
        this.router.navigate(['/junta-directiva/historial-cargos']);
    }

    getInitials(nombreCompleto: string): string {
        const parts = nombreCompleto.split(',').map(p => p.trim());
        if (parts.length === 2) {
            const apellidos = parts[0].split(' ');
            const nombre = parts[1].split(' ');
            return `${apellidos[0]?.charAt(0) || ''}${nombre[0]?.charAt(0) || ''}`.toUpperCase();
        }
        return nombreCompleto.substring(0, 2).toUpperCase();
    }

    getCargoColorClass(cargo: string): string {
        const cargoM = cargo.toLowerCase();

        if (cargoM.includes('vicepresidente')) return 'bg-info';
        if (cargoM.includes('presidente')) return 'bg-primary';        
        if (cargoM.includes('secretario')) return 'bg-success';
        if (cargoM.includes('tesorero')) return 'bg-warning';
        if (cargoM.includes('vocal')) return 'bg-secondary';
        
        return 'bg-dark';
    }

    isCargoImportante(cargo: string): boolean {
        const cargoMinus = cargo.toLowerCase();
        return cargoMinus.includes('presidente') || cargoMinus.includes('secretario') || cargoMinus.includes('tesorero');
    }

    hayCargosImportantes(): boolean {
        return this.miembros.some(m => this.isCargoImportante(m.cargo));
    }

    hayOtrosCargos(): boolean {
        return this.miembros.some(m => !this.isCargoImportante(m.cargo));
    }

    getMiembrosImportantes(): MiembroJuntaDirectiva[] {
        return this.miembros.filter(m => this.isCargoImportante(m.cargo));
    }

    getOtrosMiembros(): MiembroJuntaDirectiva[] {
        return this.miembros.filter(m => !this.isCargoImportante(m.cargo));
    }



}
