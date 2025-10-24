import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../config/services/config.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../services/toast.service';

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Output() toggleSidenavEvent = new EventEmitter<void>();

  title = 'Proyecto Almedia';
  subtitle = 'Curso 2025-2026';
  appLogo = '';
  userDropdownOpen = false;

  // Datos del usuario
  currentUser = {
    name: 'Alfonso Ferrando',
    email: 'alfonso.ferrando@almedia.org',
    avatar: 'https://ui-avatars.com/api/?name=Alfonso+Ferrando&background=0D8ABC&color=fff&size=128'
  };

  constructor(public configService: ConfigService, private router: Router, private authS: AuthService, private toastS: ToastService) {
    // Reaccionar a cambios en la configuración
    effect(() => {
      const config = this.configService.config();
      this.title = config.appTitle;
      this.subtitle = config.appSubTitle;
      this.appLogo = config.appLogo;
      console.log("EFFECTS- Cargando Configuración ...");
      
    });

    // Reaccionar a cambios en el usuario autenticado
    effect(() => {
      const user = this.authS.currentUser();
      if (user) {
        this.currentUser = {
          name: user.name,
          email: user.email,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=128`
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


  onNotifications() {
    console.log('Notificaciones clicked');
    // Implementa tu lógica de notificaciones
  }

  onTasks() {
    console.log('Tasks clicked');
    // Implementa tu lógica de configuración
  }

  onProfile() {
    console.log('Mi perfil clicked');
    this.closeUserDropdown();
    // Implementa tu lógica de perfil
  }

  onHelp() {
    console.log('Ayuda clicked');
    this.closeUserDropdown();
    // Implementa tu lógica de ayuda
  }

  onLogout() {
    console.log('Cerrar sesión clicked');
    this.closeUserDropdown();
    
    // Llamar al servicio de logout
    this.authS.logout().subscribe({
      next: () => {
        this.toastS.info('Sesión cerrada correctamente', 'Hasta pronto');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        // Aunque falle, el AuthService ya limpió los datos locales
      }
    });

  }

}
