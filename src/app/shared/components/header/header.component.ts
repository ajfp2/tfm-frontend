import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../config/services/config.service';

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

  constructor(public configService: ConfigService, private router: Router) {
    // Reaccionar a cambios en la configuración
    effect(() => {
      const config = this.configService.config();
      this.title = config.appTitle;
      this.subtitle = config.appSubTitle;
      this.appLogo = config.appLogo;
      console.log("EFFECTS- Cargando Configuración ...");
      
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
    // Implementa tu lógica de logout
  }

}
