import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import { MenuComponent } from './shared/components/menu/menu.component';
// import { HeaderComponent } from "./shared/components/header/header.component";
// import { ToastComponent } from "./shared/components/toast/toast.component";
// import { AuthService } from './auth/services/auth.service';
// import { LoginComponent } from "./auth/componentes/login/login.component";
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es-ES');



@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  
}



