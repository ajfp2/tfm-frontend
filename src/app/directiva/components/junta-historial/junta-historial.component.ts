import { Component, OnInit } from '@angular/core';
import { HistorialCargoService } from '../../services/historial-cargo.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { HistorialCargoDirectivo, JuntaPorTemporada, MiembroJuntaDirectiva, TemporadaHistorialJunta } from '../../models/junta-directiva.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemporadasService } from '../../../temporadas/services/temporadas.service';


@Component({
  selector: 'app-junta-historial',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './junta-historial.component.html',
  styleUrl: './junta-historial.component.css'
})

export class JuntaHistorialComponent implements OnInit {   
    temporadasDisponibles: TemporadaHistorialJunta[] = [];
    temporadaSeleccionada: number = 0;
    juntaActual: JuntaPorTemporada | null = null;

    constructor(private hs: HistorialCargoService, private router: Router, private toast: ToastService, private ts: TemporadasService) {}

    ngOnInit(): void {
        this.loadTemporadas();
        // this.loadJuntaTemporada(this.temporadaSeleccionada);
    }

    loadTemporadas(){
        this.ts.getTemporadas().subscribe({
            next: (response) => {                
                this.temporadasDisponibles = response.data;
                const temporadaActiva = this.temporadasDisponibles.find(t => t.activa);

                if (temporadaActiva) {
                    this.temporadaSeleccionada = temporadaActiva.id;
                    this.loadJuntaTemporada(temporadaActiva.id);
                } else if (this.temporadasDisponibles.length > 0) {                    
                    const ultima = this.temporadasDisponibles[this.temporadasDisponibles.length - 1];
                    this.temporadaSeleccionada = ultima.id;
                    this.loadJuntaTemporada(ultima.id);
                } else {
                    this.toast.warning('No hay temporadas disponibles');                    
                }
            },
            error: (err) => {
                console.error('Error al cargar temporadas:', err);
                this.toast.error('Error al cargar las Temporadas');
            }
        });
    }

    loadJuntaTemporada(temporadaId: number): void {
        this.hs.getJuntaPorTemporada(temporadaId).subscribe({
            next: (response) => {
                const temporada = this.temporadasDisponibles.find(t => t.id == temporadaId);
                
                if (temporada) {
                    this.juntaActual = {
                        temporada: temporada,
                        miembros: response.data.map(item => this.mapToMiembro(item)),
                        totalMiembros: response.data.length
                    };
                } else this.toast.info("Temps no coinciden");
            },
            error: (err) => {
                console.error('Error al cargar junta:', err);
                this.toast.error('Error al cargar la junta directiva');
            }
        });
    }

    cambioTemporada(): void {
        if(this.temporadaSeleccionada){
            console.log("TEMP SEL", this.temporadaSeleccionada);
            
            this.loadJuntaTemporada(this.temporadaSeleccionada);
        }
        
    }

    private mapToMiembro(item: HistorialCargoDirectivo): MiembroJuntaDirectiva {
        return {
            cargo: item.cargo?.cargo || 'Sin cargo',
            cargoId: item.a_cargo,
            socioId: item.a_persona,
            nombreCompleto: item.persona ? `${item.persona.Apellidos}, ${item.persona.Nombre}`: 'Socio no encontrado',
            dni: item.persona?.DNI || '',
            email: item.persona?.Email || '',
            movil: item.persona?.Movil || '',
            temporada: item.temporada?.temporada || '',
            temporadaId: item.a_temporada
        };
    }

    volver(): void {
        this.router.navigate(['/junta-directiva/list']);
    }

    irAGestionar(): void {
        this.router.navigate(['/junta-directiva/gestionar-cargos']);
    }

    getInitials(nombreCompleto: string): string {
        if (!nombreCompleto) return '??';
        
        const parts = nombreCompleto.split(',').map(p => p.trim());
        if (parts.length === 2) {
        const apellidos = parts[0].split(' ');
        const nombre = parts[1].split(' ');
        return `${apellidos[0]?.charAt(0) || ''}${nombre[0]?.charAt(0) || ''}`.toUpperCase();
        }
        return nombreCompleto.substring(0, 2).toUpperCase();
    }

    getCargoColorClass(cargo: string): string {
        const cargoLower = cargo.toLowerCase();
        
        if (cargoLower.includes('presidente')) return 'bg-primary';
        if (cargoLower.includes('vicepresidente')) return 'bg-info';
        if (cargoLower.includes('secretario')) return 'bg-success';
        if (cargoLower.includes('tesorero')) return 'bg-warning';
        if (cargoLower.includes('vocal')) return 'bg-secondary';
        
        return 'bg-dark';
    }

    isCargoImportante(cargo: string): boolean {
        const cargoLower = cargo.toLowerCase();
        return cargoLower.includes('presidente') ||
            cargoLower.includes('secretario') ||
            cargoLower.includes('tesorero');
    }

    getMiembrosImportantes(junta: JuntaPorTemporada): MiembroJuntaDirectiva[] {
        return junta.miembros.filter(m => this.isCargoImportante(m.cargo));
    }

    getOtrosMiembros(junta: JuntaPorTemporada): MiembroJuntaDirectiva[] {
        return junta.miembros.filter(m => !this.isCargoImportante(m.cargo));
    }

    hayCargosImportantes(junta: JuntaPorTemporada): boolean {
        return junta.miembros.some(m => this.isCargoImportante(m.cargo));
    }

    hayOtrosCargos(junta: JuntaPorTemporada): boolean {
        return junta.miembros.some(m => !this.isCargoImportante(m.cargo));
    }

}
