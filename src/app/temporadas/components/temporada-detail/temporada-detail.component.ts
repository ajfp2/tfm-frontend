import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Temporada } from '../../models/temporada.model';
import { TemporadasService } from '../../services/temporadas.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-temporada-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './temporada-detail.component.html',
  styleUrl: './temporada-detail.component.css'
})
export class TemporadaDetailComponent implements OnInit{

    temporada: Temporada | null = null;

    constructor(private ts: TemporadasService, private toast: ToastService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = +params['id'];
            if (id) {
                this.cargarTemporada(id);
            }
        });
    }

    cargarTemporada(id: number): void {
        this.ts.getTemporada(id).subscribe({
            next: (response) => {
                if (response) {
                    this.temporada = response.data;
                }
            },
            error: (error) => {
                console.error('Error al cargar temporada:', error);
                this.toast.error(error.error?.message || 'Error al cargar la temporada');
            }
        });
    }

    activarTemporada(): void {
        if (!this.temporada) return;

        if (this.temporada.activa) {
            this.toast.warning('Esta temporada ya está activa');            
            return;
        }

        const confirmacion = confirm(
            `¿Deseas activar la temporada ${this.temporada.temporada}?\n\n` +
            `Esto desactivará la temporada actual.`
        );

        if (!confirmacion) return;

        this.ts.activarTemporada(this.temporada.id).subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.toast.info(response.message);
                    this.cargarTemporada(this.temporada!.id); // Recargamos datos
                }
            },
            error: (error) => {
                this.toast.error(error.error?.message || 'Error al activar la temporada');
            }
        });
    }

    eliminarTemporada(): void {
        if (!this.temporada) return;

        if (this.temporada.activa) {
            this.toast.warning('No se puede eliminar la temporada activa');
            return;
        }

        const confirmacion = confirm(
            `¿Estás seguro de que deseas eliminar la temporada ${this.temporada.temporada}?\n\n` +
            `Esta acción no se puede deshacer.`
        );

        if (!confirmacion) return;

        this.ts.deleteTemporada(this.temporada.id).subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.toast.success(response.message);
                    this.router.navigate(['/temporadas/list']);
                }
            },
            error: (error) => {
                const mensaje = error.error?.message || 'Error al eliminar la temporada';
                this.toast.error(mensaje);
            }
        });
    }

    calcularDuracionDias(): number {
        if (!this.temporada) return 0;
        
        const inicio = new Date(this.temporada.fechaIni);
        const fin = new Date(this.temporada.fechaFin);
        const diferencia = fin.getTime() - inicio.getTime();
        
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }

    calcularDuracionMeses(): number {
        if (!this.temporada) return 0;
        
        const inicio = new Date(this.temporada.fechaIni);
        const fin = new Date(this.temporada.fechaFin);
        
        let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
        meses += fin.getMonth() - inicio.getMonth();
        
        return meses;
    }

    estaEnCurso(): boolean {
        if (!this.temporada) return false;
        
        const ahora = new Date();
        const inicio = new Date(this.temporada.fechaIni);
        const fin = new Date(this.temporada.fechaFin);
        
        return ahora >= inicio && ahora <= fin;
    }

    yaTermino(): boolean {
        if (!this.temporada) return false;
        
        const ahora = new Date();
        const fin = new Date(this.temporada.fechaFin);
        
        return ahora > fin;
    }

    noHaComenzado(): boolean {
        if (!this.temporada) return false;
        
        const ahora = new Date();
        const inicio = new Date(this.temporada.fechaIni);
        
        return ahora < inicio;
    }

}
