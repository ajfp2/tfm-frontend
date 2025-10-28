import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from '../../../auth/componentes/login/login.component';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterOutlet, HeaderComponent, MenuComponent, ToastComponent, LoginComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

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
