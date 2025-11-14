import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu.interface';
import { ConfigService } from '../../../config/services/config.service';


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
  configBD = false;

  constructor(private router: Router, private ms: MenuService, private cs: ConfigService) {
  }

  ngOnInit(): void {
    this.cs.getConfigApi().subscribe({
      next: (conf) => {          
        let cf = conf;
        this.configBD = conf.modificado;

        if(this.configBD) this.loadMenu();
        else this.loadMenuDefault();       
      },
      error: (error) => {
        console.error('Error en el componente:', error.message);
        this.loadMenuDefault();
        this.configBD = false;          
      }
    })
  }

  loadMenuDefault() {
    this.ms.loadMenuDefault().subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (error) => {
        console.error('Error al cargar el menú:', error);
      }
    });
  }

  loadMenu(): void {
    this.ms.loadMenuAPI().subscribe({
      next: (items) => {
        this.menuItems = items;
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


  closeMenuOnMobile(): void {    
    if (window.innerWidth < 768) {
      this.closeSidenav.emit();
    }
  }
}
