import { Component, OnInit } from '@angular/core';
import { SociosService } from '../../services/socios.service';
import { ToastService } from '../../../shared/services/toast.service';
import { SocioPersona } from '../../models/socio.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socios-exentos',
  imports: [CommonModule],
  templateUrl: './socios-exentos.component.html',
  styleUrl: './socios-exentos.component.css'
})
export class SociosExentosComponent implements OnInit{

    socios: SocioPersona[] = [];
    
    constructor(private ss: SociosService, private toast: ToastService, private router: Router) {}
    
    ngOnInit(): void {
        this.cargar_exentos();
    }

    cargar_exentos(){
        this.ss.getSociosExentos().subscribe({
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

    getNombreCompleto(socio: SocioPersona): string {
        return `${socio.Apellidos}, ${socio.Nombre}`;
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

}
