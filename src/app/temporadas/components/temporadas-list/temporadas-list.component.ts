import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Temporada } from '../../models/temporada.model';
import { TemporadasService } from '../../services/temporadas.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfigService } from '../../../config/services/config.service';

// import { registerLocaleData } from '@angular/common';
// import localeEs from '@angular/common/locales/es';
// registerLocaleData(localeEs, 'es-ES');

@Component({
  selector: 'app-temporadas-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './temporadas-list.component.html',
  styleUrl: './temporadas-list.component.css'
})
export class TemporadasListComponent implements OnInit{

    temporadas: Temporada[] = [];
    titulo: string = 'Temporadas';
    constructor(private ts: TemporadasService, private toast: ToastService, private cf: ConfigService) {}


    ngOnInit(): void {
        this.cargarTemporadas();
        const conf = this.cf.getConfig();
        if(conf.appAno) this.titulo = conf.appAno;

    }

    cargarTemporadas(): void {
        this.ts.getTemporadas().subscribe({
            next: (response) => {
                if (response) {                 
                    this.temporadas = response.data;
                }
            },
            error: (error) => {
                console.error('Error al cargar temporadas:', error);
                this.toast.error('Error al cargar las temporadas');
            }
        });
    }

    activarTemporada(temporada: Temporada): void {
        if (temporada.activa) {
            this.toast.info('Esta temporada ya está activa');
            return;
        }

        const confirmacion = confirm(
            `¿Deseas activar la temporada ${temporada.temporada}?\n\n` +
            `Esto desactivará la temporada actual.`
        );

        if (!confirmacion) {
            return;
        }

        this.ts.activarTemporada(temporada.id).subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.toast.success(response.message);
                    this.cargarTemporadas(); // Recargar la lista
                }
            },
            error: (error) => {
                console.error('Error al activar temporada:', error);
                this.toast.error(error.error?.message || 'Error al activar la temporada');
            }
        });
    }

    eliminarTemporada(temporada: Temporada): void {
        if (temporada.activa) {
            this.toast.warning('No se puede eliminar la temporada activa');
            return;
        }

        const confirmacion = confirm(
            `¿Estás seguro de que deseas eliminar la temporada ${temporada.temporada}?`
        );

        if (!confirmacion) {
            return;
        }

        this.ts.deleteTemporada(temporada.id).subscribe({
            next: (response) => {
                if (response.code == 200) {                    
                    this.toast.success(response.message || 'Temporada eliminada correctamente');
                    this.cargarTemporadas(); // Recargar la lista
                }
            },
            error: (error) => {
                console.error('Error al eliminar temporada:', error);
                this.toast.error(error.error?.message || 'Error al eliminar la temporada');

            }
        });
    }

}
