import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MenuComponent } from './shared/components/menu/menu.component';
import { HeaderComponent } from "./shared/components/header/header.component";
import { ToastComponent } from "./shared/components/toast/toast.component";



@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, MenuComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  sidenavOpen = true;

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
    console.log('sidenavOpen Click:', this.sidenavOpen); // DEBUG
  }

  closeSidenav(): void {
    this.sidenavOpen = false;
  }
}



