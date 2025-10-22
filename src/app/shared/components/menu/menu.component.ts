import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '../../services/menu.service';


export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent implements OnInit{
  @Input() isOpen: boolean = true;
  @Output() closeSidenav = new EventEmitter<void>();

  // Menú definido en el propio componente
  menuItems: MenuItem[] = [];

  constructor(private router: Router, private ms: MenuService) {}

  ngOnInit(): void {
    this.ms.loadMenu().subscribe({
      next: (items) => {
        this.menuItems = items;
        console.log('Menú cargado:', items);
      },
      error: (error) => {
        console.error('Error al cargar el menú:', error);
      }
    });

    // También puedes suscribirte a cambios del menú
    this.ms.menuItems$.subscribe(items => {
      this.menuItems = items;
    });
  }

  


  toggleMenuItem(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  // onMenuItemClick(item: MenuItem): void {
  //   if (item.route) {
  //     console.log('Navegando a:', item.route);
  //     // Aquí puedes agregar la navegación con Router
  //     this.router.navigate([item.route]);
  //   }
    
  //   // En móvil, cerrar el sidenav después de hacer clic
  //   if (window.innerWidth < 768) {
  //     this.closeSidenav.emit();
  //   }
  // }

  closeMenuOnMobile(): void {
    
    if (window.innerWidth < 768) {
      this.closeSidenav.emit();
    }
  }
}
