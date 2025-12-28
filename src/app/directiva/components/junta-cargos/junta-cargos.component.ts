import { Component, OnInit } from '@angular/core';
import { CargosDirectivoService } from '../../services/cargo-directivo.service';
import { HistorialCargoService } from '../../services/historial-cargo.service';
import { SociosService } from '../../../socios/services/socios.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AsignarCargoDTO, CargoDirectivo, HistorialCargoDirectivo, MiembroJuntaDirectiva, TemporadaHistorialJunta } from '../../models/junta-directiva.model';
import { SocioPersona } from '../../../socios/models/socio.interface';
import { CommonModule } from '@angular/common';
import { TemporadasService } from '../../../temporadas/services/temporadas.service';

@Component({
  selector: 'app-junta-cargos',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './junta-cargos.component.html',
  styleUrl: './junta-cargos.component.css'
})
export class JuntaCargosComponent implements OnInit {

    asignarForm!: FormGroup;

    temporadaActual: TemporadaHistorialJunta | null = null;

    cargosDisponibles: CargoDirectivo[] = [];
    sociosActivos: SocioPersona [] = [];
    sociosFiltrados: SocioPersona[] = [];
    
    // Asignaciones actuales
    miembrosActuales: MiembroJuntaDirectiva[] = [];
    
    // Estado form
    isSubmitting: boolean = false;
    
    // Búsqueda de socios
    searchTerm: string = '';

    constructor(private cs: CargosDirectivoService, private hs: HistorialCargoService, private ss: SociosService, private toast: ToastService, private fb: FormBuilder,
        private router: Router, private ts: TemporadasService) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadTemporadaActiva();
        this.loadCargosDisponibles();
        this.loadSociosActivos();        
    }

    // Inicializamos el formulario de asignación
    initForm(): void {
        this.asignarForm = this.fb.group({
            a_cargo: ['', Validators.required],
            a_persona: ['', Validators.required],
            searchSocio: [''] // Campo de búsqueda (no se envía al backend)
        });
    }

    // Cargamos la temporada activa
    loadTemporadaActiva(): void {
        this.ts.getTemporadaActiva().subscribe({
            next: (response) => {
                this.temporadaActual = response.data;
                this.loadMiembrosActuales();
            },
            error: (err) => {
                console.error('Error al cargar temporada activa:', err);
                this.toast.error('Error al cargar la temporada activa');                
            }
        });
    }

    // Cargos disponibles
    loadCargosDisponibles(): void {
        this.cs.getCargos().subscribe({
            next: (response) => {
                this.cargosDisponibles = response.data;
            },
            error: (err) => {
                console.error('Error al cargar cargos:', err);
                this.toast.error('Error al cargar los cargos disponibles');
            }
        });
    }

    // Carga los socios activos que pueden ser de la directiva
    loadSociosActivos(): void {
        this.ss.getSocios('activos').subscribe({
            next: (response) => {
                this.sociosActivos = response.data;
                this.sociosFiltrados = [...this.sociosActivos];
            },
            error: (err) => {
                console.error('Error al cargar socios:', err);
                this.toast.error('Error al cargar los socios');
            }
        });
    }

    // Carga la actual directiva
    loadMiembrosActuales(): void {
        if (!this.temporadaActual) return;
        this.hs.getJuntaPorTemporada(this.temporadaActual.id).subscribe({
            next: (response) => {
                this.miembrosActuales = response.data.map(item => this.mapToMiembro(item));
            },
            error: (err) => {
                console.error('Error al cargar miembros:', err);
                this.toast.error('Error al cargar los miembros actuales');
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

    // Filtro de busqueda de socios
    buscarSocio(event: Event): void {
        const target = event.target as HTMLInputElement;
        const term = target.value.toLowerCase().trim();
        this.searchTerm = term;
        
        if (!term) {
            this.sociosFiltrados = [...this.sociosActivos];
            return;
        }
        
        this.sociosFiltrados = this.sociosActivos.filter(socio => {
            const nombreCompleto = `${socio.Apellidos} ${socio.Nombre}`.toLowerCase();
            const dni = socio.DNI?.toLowerCase() || '';
            
            return nombreCompleto.includes(term) || dni.includes(term);
        });
    }

    // Seleccionar socio
    selectSocio(socioId: number): void {
        this.asignarForm.patchValue({ a_persona: socioId });
    }

    // Obtener nombres del socio seleccionad
    getSocioSeleccionado(): string {
        const socioId = this.asignarForm.get('a_persona')?.value;
        if (!socioId) return 'Ninguno';
        
        const socio = this.sociosActivos.find(s => s.Id_Persona === socioId);
        return socio ? `${socio.Apellidos}, ${socio.Nombre}`: 'Socio no encontrado';
    }

    //Comprobar si el cargo está asignado
    isCargoAsignado(cargoId: number): boolean {
        return this.miembrosActuales.some(m => m.cargoId === cargoId);
    }

    // Comprobar si el socio ya tiene algun cargo
    isSocioEnJunta(socioId: number): boolean {
        return this.miembrosActuales.some(m => m.socioId === socioId);
    }

    // Asignar cargo a socio
    onSubmit(): void {
        if (this.asignarForm.invalid) {
            this.toast.warning('Por favor, complete todos los campos');
            return;
        }

        if (!this.temporadaActual) {
        this.toast.error('No se pudo determinar la temporada activa');
        return;
        }
    
        const cargoId = this.asignarForm.get('a_cargo')?.value;
        const socioId = this.asignarForm.get('a_persona')?.value;
        
        // Validar que el cargo no esté ya asignado
        if (this.isCargoAsignado(cargoId)) {
            this.toast.warning('Este cargo ya está asignado. Elimine la asignación actual primero.');
            return;
        }
        
        const data: AsignarCargoDTO = {
            a_temporada: this.temporadaActual.id,
            a_persona: socioId,
            a_cargo: cargoId
        };
        
        this.isSubmitting = true;
        
        this.hs.asignarCargo(data).subscribe({
            next: (response) => {
                this.toast.success(response.message || 'Cargo asignado correctamente');
                this.asignarForm.reset();
                this.loadMiembrosActuales(); // Recargar lista
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Error al asignar cargo:', err);
                const errorMsg = err.error?.message || 'Error al asignar el cargo';
                this.toast.error(errorMsg);
                this.isSubmitting = false;
            }
        });
    }

    // Quita la asignación de un cargo
    eliminarAsignacion(miembro: MiembroJuntaDirectiva): void {
        if (!confirm(`¿Está seguro de eliminar a ${miembro.nombreCompleto} del cargo de ${miembro.cargo}?`)) {
            return;
        }
        
        const data = {
            a_temporada: miembro.temporadaId,
            a_persona: miembro.socioId,
            a_cargo: miembro.cargoId
        };
        
        this.hs.eliminarAsignacion(data).subscribe({
            next: (response) => {
                this.toast.success(response.message || 'Asignación eliminada correctamente');
                this.loadMiembrosActuales(); // Recargar lista
            },
            error: (err) => {
                console.error('Error al eliminar asignación:', err);
                const errorMsg = err.error?.message || 'Error al eliminar la asignación';
                this.toast.error(errorMsg);
            }
        });
    }

    volver(): void {
        this.router.navigate(['/junta-directiva/list']);
    }

    // Pone las iniciales del socio
    getInitials(nombreCompleto: string): string {
        const parts = nombreCompleto.split(',').map(p => p.trim());
        if (parts.length === 2) {
            const apellidos = parts[0].split(' ');
            const nombre = parts[1].split(' ');
            return `${apellidos[0]?.charAt(0) || ''}${nombre[0]?.charAt(0) || ''}`.toUpperCase();
        }
        return nombreCompleto.substring(0, 2).toUpperCase();
    }

    // Pone una clase css de color según tipo cargo
    getCargoColorClass(cargo: string): string {
        const cargoLower = cargo.toLowerCase();
        
        if (cargoLower.includes('presidente')) return 'bg-primary';
        if (cargoLower.includes('vicepresidente')) return 'bg-info';
        if (cargoLower.includes('secretario')) return 'bg-success';
        if (cargoLower.includes('tesorero')) return 'bg-warning';
        if (cargoLower.includes('vocal')) return 'bg-secondary';
        
        return 'bg-dark';
    }



}
