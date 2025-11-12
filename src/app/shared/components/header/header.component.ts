import { Component, effect, EventEmitter, Output } from '@angular/core';
import { Event, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../config/services/config.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Output() toggleSidenavEvent = new EventEmitter<void>();

  title = 'Proyecto Almedia';
  subtitle = 'Mi Peña';
  appLogo = '';
  userDropdownOpen = false;
  ano = '25-26';

  // Datos del usuario
  currentUser = {
    id: 1,
    nombre: 'Alfonso Ferrando',
    email: 'alfonso.ferrando@almedia.org',
    foto: 'https://ui-avatars.com/api/?name=Alfonso+Ferrando&background=0D8ABC&color=fff&size=128'
  };

  constructor(public configService: ConfigService, private router: Router, private authS: AuthService, private toast: ToastService) {
    // Reaccionar a cambios en la configuración
    effect(() => {
      const config = this.configService.config();
      this.title = config.appTitle;
      this.subtitle = config.appSubTitle;
      this.ano = config.appAno;
      this.appLogo = config.appLogo;
      // console.log("EFFECTS- Cargando Configuración ...");
      
    });

    // Reaccionar a cambios en el usuario autenticado
    effect(() => {
      const user = this.authS.currentUser();
      // console.log("EFFECTS- Cargando User ...", user);
      if (user) {
        this.currentUser = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          foto: user.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=0D8ABC&color=fff&size=128`
        };
      }
    });

    console.log("CONS- Configuración cargada");
  }

  toggleSidenav() {
    console.log('Botón hamburguesa móvil click');
    this.toggleSidenavEvent.emit();
}
  
  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  closeUserDropdown() {
    this.userDropdownOpen = false;
  }


  onNotifications(event: MouseEvent) {
    event.preventDefault();
    console.log('Notificaciones clicked');
  
  }

  onTasks(event: MouseEvent) {
    event.preventDefault();
    console.log('Tasks clicked');
    
  }

  onProfile(event: MouseEvent) {
    event.preventDefault();
    this.closeUserDropdown();

    if (!this.currentUser) {
        this.toast.error('El ID de usuario no es válido');
        return;
    }
    this.router.navigateByUrl(`/usuarios/edit-user/${this.currentUser.id}`);
    
  }

  onHelp(event: MouseEvent) {
    console.log('Ayuda clicked');
    event.preventDefault();
    this.closeUserDropdown();
    
  }

  onLogout(event: MouseEvent) {
    console.log('Cerrar sesión click');
    event.preventDefault();
    this.closeUserDropdown();
    
    // Llama al servicio de logout
    this.authS.logout().subscribe({
      next: () => {
        this.toast.info('Sesión cerrada correctamente', 'Hasta pronto');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        // Aunque falle, el AuthService y limpió los datos locales
      }
    });

  }

}
