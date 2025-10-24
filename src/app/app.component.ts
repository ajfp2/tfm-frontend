import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MenuComponent } from './shared/components/menu/menu.component';
import { HeaderComponent } from "./shared/components/header/header.component";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { AuthService } from './auth/services/auth.service';
import { LoginComponent } from "./auth/componentes/login/login.component";



@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, MenuComponent, ToastComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  sidenavOpen = true;
  // authenticated = false;

  // constructor(private authS: AuthService){
  //   this.authenticated = this.authS.isAuthenticated();
  // }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
    console.log('sidenavOpen Click:', this.sidenavOpen); // DEBUG
  }

  closeSidenav(): void {
    this.sidenavOpen = false;
  }
}



