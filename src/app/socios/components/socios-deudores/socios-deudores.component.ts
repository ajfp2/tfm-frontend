import { Component } from '@angular/core';
import { SociosService } from '../../services/socios.service';
import { SociosRealcionesService } from '../../services/socios-realciones.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-socios-deudores',
  imports: [],
  templateUrl: './socios-deudores.component.html',
  styleUrl: './socios-deudores.component.css'
})
export class SociosDeudoresComponent {


    constructor(private socioService: SociosService, private relService: SociosRealcionesService, private toast: ToastService, private router: Router){}
    
    crearSocio(): void {
        this.router.navigate(['/socios/crear-socio']);
    }

}
