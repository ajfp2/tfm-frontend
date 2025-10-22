import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface MenuItem {
  id?: number;
  label: string;
  icon?: string;
  route?: string;
  order?: number;
  children?: MenuItem[];
  expanded?: boolean;
}

interface MenuResponse {
  menuItems: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  // Menú por defecto (fallback si falla la carga del JSON)
  private defaultMenu: MenuItem[] = [
    {
      id: 1,
      label: 'Dashboard',
      icon: 'bi-house-door',
      route: '/dashboard',
      order: 1
    },
    {
      id: 5,
      label: 'Configuración',
      icon: 'bi-gear',
      route: '/config',
      order: 5
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Cargar menú desde archivo JSON
   * En el futuro, cambiar la URL a tu API backend
   */
  loadMenu(): Observable<MenuItem[]> {
    // Ruta al archivo JSON en la carpeta public
    return this.http.get<MenuResponse>('/data/menu.json').pipe(
      map(response => {
        const sortedMenu = this.sortMenuItems(response.menuItems);
        this.menuItemsSubject.next(sortedMenu);
        return sortedMenu;
      }),
      catchError(error => {
        console.error('Error al cargar el menú:', error);
        console.warn('Usando menú por defecto');
        this.menuItemsSubject.next(this.defaultMenu);
        return of(this.defaultMenu);
      })
    );
  }

  /**
   * Obtener menú actual (síncrono)
   */
  getMenuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  /**
   * Ordenar items del menú recursivamente por el campo 'order'
   */
  private sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        ...item,
        children: item.children ? this.sortMenuItems(item.children) : undefined
      }));
  }

  /**
   * Buscar un item del menú por ID (útil para permisos)
   */
  findMenuItemById(id: number, items?: MenuItem[]): MenuItem | null {
    const searchItems = items || this.menuItemsSubject.value;
    
    for (const item of searchItems) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItemById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Filtrar menú por permisos del usuario
   * (Preparado para cuando implementes autenticación)
   */
  filterMenuByPermissions(allowedIds: number[]): MenuItem[] {
    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => !item.id || allowedIds.includes(item.id))
        .map(item => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined
        }))
        .filter(item => !item.children || item.children.length > 0);
    };

    return filterItems(this.menuItemsSubject.value);
  }

  /**
   * Simular carga desde API (para preparar el futuro backend)
   */
  loadMenuFromAPI(): Observable<MenuItem[]> {
    // Cuando tengas backend, cambiar a:
    // return this.http.get<MenuResponse>('https://tu-api.com/api/menu')
    
    return this.http.get<MenuResponse>('/data/menu.json').pipe(
      map(response => response.menuItems),
      tap(items => this.menuItemsSubject.next(this.sortMenuItems(items))),
      catchError(error => {
        console.error('Error al cargar desde API:', error);
        return of(this.defaultMenu);
      })
    );
  }
}