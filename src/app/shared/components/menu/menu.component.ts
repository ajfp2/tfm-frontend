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
    isConfigInitialized = false;
    configBD = false;

    constructor(private router: Router, private ms: MenuService, private cs: ConfigService) {}

    ngOnInit(): void {
        // Verificar si la configuración está inicializada
        this.checkConfigurationStatus();

        // Suscribirse a cambios del menú => Visto en PEC- Ecommerce de asig FRONTND
        this.ms.menuItems$.subscribe(items => {
            this.menuItems = items;
        });
    }

    // Verificar el estado de la configuración y cargar menú apropiado
    checkConfigurationStatus(): void {
        this.cs.getConfigApi().subscribe({
            next: (configBD) => {
                this.isConfigInitialized = configBD.modificado;
                
                if (this.isConfigInitialized) {
                    // Configuración inicializada-> Cargar menú completo desde API
                    console.log('Config inicializada - Cargando menú completo desde API');
                    this.loadMenu();
                } else {
                    // Primera vez -> Cargar menú por defecto
                    console.log('Config NO inicializada - Cargando menú por defecto');
                    this.loadDefaultMenu();
                }
            },
            error: (error) => {
                console.error('Error al verificar configuración:', error.message);
                // Si hay error, cargar menú por defecto
                this.loadDefaultMenu();
                this.isConfigInitialized = false;
            }
        });
    }

    loadDefaultMenu() {
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
        console.log("CARGA MENU API");
        
        this.ms.loadMenuAPI().subscribe({
            next: (items) => {
                this.menuItems = items;
            },
            error: (error) => {
                console.error('Error al cargar el menú:', error);
                this.loadDefaultMenu();
            }
        });
    }

    // Recargar menú (llamado desde otros componentes)
    reloadMenu(): void {
        console.log('🔄 Recargando menú...');
        this.checkConfigurationStatus();
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
