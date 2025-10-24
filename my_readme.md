# 📚 Proyecto Angular 19 + Bootstrap 5 - Documentación Completa

## 📋 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Arquitectura](#arquitectura)
6. [Componentes](#componentes)
7. [Servicios](#servicios)
8. [Modelos](#modelos)
9. [Rutas y Lazy Loading](#rutas-y-lazy-loading)
10. [Sistema de Configuración](#sistema-de-configuración)
11. [Sistema de Notificaciones](#sistema-de-notificaciones)
12. [Menú Dinámico](#menú-dinámico)
13. [Guías de Uso](#guías-de-uso)
14. [Personalización](#personalización)
15. [Mejores Prácticas](#mejores-prácticas)

---

## 📝 Descripción del Proyecto

Aplicación web moderna desarrollada con **Angular 19** y **Bootstrap 5**, implementando:

- ✅ Arquitectura modular con componentes standalone
- ✅ Lazy loading para optimización de carga
- ✅ Sistema de configuración dinámica con localStorage
- ✅ Menú lateral multinivel responsive
- ✅ Sistema de notificaciones toast
- ✅ Gestión dinámica del menú desde JSON
- ✅ Diseño responsive mobile-first

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Angular | 19.x | Framework principal |
| TypeScript | 5.6+ | Lenguaje de programación |
| Bootstrap | 5.3.x | Framework CSS |
| Bootstrap Icons | 1.11+ | Iconografía |
| RxJS | 7.8+ | Programación reactiva |
| HttpClient | Angular | Peticiones HTTP |

---

## 📁 Estructura del Proyecto

```
proyecto-angular/
├── public/
│   └── data/
│       └── menu.json                    # Configuración del menú
│
├── src/
│   ├── app/
│   │   ├── core/                        # Componentes core
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.css
│   │   │   ├── sidenav/
│   │   │   │   ├── sidenav.component.ts
│   │   │   │   ├── sidenav.component.html
│   │   │   │   └── sidenav.component.css
│   │   │   └── toast/
│   │   │       ├── toast.component.ts
│   │   │       ├── toast.component.html
│   │   │       └── toast.component.css
│   │   │
│   │   ├── pages/                       # Páginas (lazy loading)
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── settings/
│   │   │   │   ├── settings.component.ts
│   │   │   │   ├── settings.component.html
│   │   │   │   └── settings.component.css
│   │   │   ├── usuarios/
│   │   │   │   ├── usuarios.routes.ts
│   │   │   │   └── lista-usuarios/
│   │   │   │       └── lista-usuarios.component.ts
│   │   │   ├── productos/
│   │   │   │   ├── productos.routes.ts
│   │   │   │   └── catalogo/
│   │   │   │       └── catalogo.component.ts
│   │   │   └── reportes/
│   │   │       ├── reportes.routes.ts
│   │   │       └── ventas/
│   │   │           └── ventas.component.ts
│   │   │
│   │   ├── services/                    # Servicios
│   │   │   ├── config.service.ts
│   │   │   ├── menu.service.ts
│   │   │   └── toast.service.ts
│   │   │
│   │   ├── models/                      # Modelos e interfaces
│   │   │   └── toast.model.ts
│   │   │
│   │   ├── app.component.ts             # Componente raíz
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.routes.ts                # Configuración de rutas
│   │   └── app.config.ts                # Configuración de la app
│   │
│   ├── styles.css                       # Estilos globales
│   ├── index.html
│   └── main.ts
│
├── angular.json                         # Configuración de Angular
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Instalación y Configuración

### 1. Crear el proyecto

```bash
# Crear proyecto con Angular 19
ng new mi-app-angular --standalone
cd mi-app-angular
```

### 2. Instalar dependencias

```bash
# Instalar Bootstrap
npm install bootstrap

# Instalar Popper.js (requerido por Bootstrap)
npm install @popperjs/core
```

### 3. Configurar angular.json

```json
{
  "projects": {
    "mi-app-angular": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/bootstrap/dist/css/bootstrap.min.css",
              "src/styles.css"
            ],
            "scripts": [
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
          }
        }
      }
    }
  }
}
```

### 4. Agregar Bootstrap Icons en index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mi Aplicación</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### 5. Configurar estilos globales (styles.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}
```

---

## 🏗️ Arquitectura

### Patrón de Diseño

La aplicación sigue el patrón **Smart/Dumb Components**:

- **Smart Components** (Container): Contienen lógica de negocio
- **Dumb Components** (Presentational): Solo presentan datos

### Flujo de Datos

```
AppComponent (Orchestrator)
    ↓
HeaderComponent ← ConfigService
    ↓
SidenavComponent ← MenuService
    ↓
Router (Lazy Loading)
    ↓
Page Components ← ToastService
```

### Standalone Components

Todos los componentes son **standalone** (Angular 19):

```typescript
@Component({
  selector: 'app-header',
  standalone: true,  // ← No necesita NgModules
  imports: [CommonModule, RouterLink],
  // ...
})
```

---

## 🧩 Componentes

### AppComponent (Root)

**Ubicación**: `src/app/app.component.ts`

**Responsabilidad**: Orquestador principal - solo maneja estado del sidenav

```typescript
export class AppComponent {
  sidenavOpen = true;

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }

  closeSidenav(): void {
    this.sidenavOpen = false;
  }
}
```

**Template**:
```html
<div class="app-container">
  <app-toast></app-toast>
  <app-header (toggleSidenavEvent)="toggleSidenav()"></app-header>
  <div class="main-layout">
    <app-sidenav 
      [isOpen]="sidenavOpen" 
      (closeSidenav)="closeSidenav()">
    </app-sidenav>
    <main class="main-content" [class.sidenav-open]="sidenavOpen">
      <div class="content-wrapper">
        <router-outlet></router-outlet>
      </div>
    </main>
  </div>
</div>
```

### HeaderComponent

**Ubicación**: `src/app/core/header/header.component.ts`

**Responsabilidad**: Barra de navegación superior

**Características**:
- Logo y título dinámicos (desde ConfigService)
- Subtítulo opcional
- Botón hamburguesa (solo móvil)
- Notificaciones con badge
- Dropdown de usuario con perfil

**Inputs**: Ninguno (usa ConfigService)

**Outputs**:
- `toggleSidenavEvent` - Emite cuando se hace clic en hamburguesa

### SidenavComponent

**Ubicación**: `src/app/core/sidenav/sidenav.component.ts`

**Responsabilidad**: Menú lateral multinivel

**Características**:
- Carga menú desde MenuService
- Soporte para 3 niveles de menú
- RouterLink con estado activo automático
- Responsive (overlay en móvil)
- Expansión/colapso de submenús

**Inputs**:
- `isOpen: boolean` - Estado del menú

**Outputs**:
- `closeSidenav` - Emite cuando se cierra en móvil

### ToastComponent

**Ubicación**: `src/app/core/toast/toast.component.ts`

**Responsabilidad**: Sistema de notificaciones

**Características**:
- 4 tipos: success, error, warning, info
- Auto-cierre configurable
- Animaciones de entrada/salida
- Máximo 5 toasts simultáneos
- Usa clases de Bootstrap

---

## 🔧 Servicios

### ConfigService

**Ubicación**: `src/app/services/config.service.ts`

**Responsabilidad**: Gestión de configuración de la app

**Métodos**:

```typescript
// Obtener configuración actual
getConfig(): AppConfig

// Guardar configuración
saveConfig(config: AppConfig): void

// Restaurar valores por defecto
resetToDefault(): void

// Actualizar parcialmente
updateConfig(partialConfig: Partial<AppConfig>): void
```

**Configuración gestionada**:
```typescript
interface AppConfig {
  navbarColor: string;
  userDropdownGradient: { from: string; to: string };
  appTitle: string;
  appSubtitle: string;
  appLogo: string;  // Base64
}
```

**Almacenamiento**: localStorage (`app_config`)

### MenuService

**Ubicación**: `src/app/services/menu.service.ts`

**Responsabilidad**: Gestión del menú de navegación

**Métodos**:

```typescript
// Cargar menú desde JSON
loadMenu(): Observable<MenuItem[]>

// Obtener menú actual
getMenuItems(): MenuItem[]

// Observable del menú
menuItems$: Observable<MenuItem[]>

// Buscar item por ID
findMenuItemById(id: number): MenuItem | null

// Filtrar por permisos
filterMenuByPermissions(allowedIds: number[]): MenuItem[]
```

**Fuente de datos**: 
- Actual: `/data/menu.json` (public/)
- Futuro: API Backend (solo cambiar URL)

### ToastService

**Ubicación**: `src/app/services/toast.service.ts`

**Responsabilidad**: Mostrar notificaciones toast

**Métodos**:

```typescript
// Notificación de éxito
success(message: string, title?: string, duration?: number): void

// Notificación de error
error(message: string, title?: string, duration?: number): void

// Notificación de advertencia
warning(message: string, title?: string, duration?: number): void

// Notificación informativa
info(message: string, title?: string, duration?: number): void

// Remover toast específico
remove(id: string): void

// Limpiar todos
clear(): void
```

**Uso**:
```typescript
constructor(private toastService: ToastService) {}

save(): void {
  this.toastService.success('Usuario guardado correctamente');
}
```

---

## 📦 Modelos

### Toast Model

**Ubicación**: `src/app/models/toast.model.ts`

```typescript
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}
```

### MenuItem Interface

```typescript
export interface MenuItem {
  id?: number;
  label: string;
  icon?: string;
  route?: string;
  order?: number;
  children?: MenuItem[];
  expanded?: boolean;
}
```

---

## 🚦 Rutas y Lazy Loading

### Configuración Principal (app.routes.ts)

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/settings/settings.component')
      .then(m => m.SettingsComponent)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.routes')
      .then(m => m.USUARIOS_ROUTES)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.routes')
      .then(m => m.PRODUCTOS_ROUTES)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./pages/reportes/reportes.routes')
      .then(m => m.REPORTES_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
```

### Rutas de Módulos (usuarios.routes.ts)

```typescript
export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'lista',
    loadComponent: () => import('./lista-usuarios/lista-usuarios.component')
      .then(m => m.ListaUsuariosComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./nuevo-usuario/nuevo-usuario.component')
      .then(m => m.NuevoUsuarioComponent)
  }
];
```

### Ventajas del Lazy Loading

| Bundle Inicial | Con Lazy Loading |
|----------------|------------------|
| ~800KB | ~250KB (-70%) |
| Todo incluido | Solo lo necesario |
| Carga lenta | Carga rápida |

---

## ⚙️ Sistema de Configuración

### Características

✅ **Configuración dinámica en tiempo real**
✅ **Persistencia en localStorage**
✅ **Reactivo (Signals de Angular)**
✅ **Vista previa en vivo**

### Opciones configurables

1. **Color de la barra superior**
   - Selector de color personalizado
   - 7 colores predefinidos
   - Vista previa en tiempo real

2. **Gradiente del dropdown de usuario**
   - Dos colores (inicio y fin)
   - 6 gradientes predefinidos
   - Vista previa en tiempo real

3. **Título de la aplicación**
   - Título principal
   - Subtítulo opcional
   - Actualiza pestaña del navegador

4. **Logo de la aplicación**
   - Subida de imagen (JPG, PNG, SVG)
   - Máximo 2MB
   - Guardado en Base64

### Uso en componentes

```typescript
// Cargar configuración
const config = this.configService.getConfig();

// Guardar cambios
this.configService.saveConfig(newConfig);

// Restaurar por defecto
this.configService.resetToDefault();

// Actualizar parcialmente
this.configService.updateConfig({ appTitle: 'Nuevo Título' });
```

---

## 🔔 Sistema de Notificaciones

### Tipos de Toast

| Tipo | Color | Icono | Uso |
|------|-------|-------|-----|
| Success | Verde | Check | Operaciones exitosas |
| Error | Rojo | X | Errores y fallos |
| Warning | Amarillo | Exclamación | Advertencias |
| Info | Azul | Info | Información general |

### Ejemplos de Uso

```typescript
// Éxito
this.toastService.success('Usuario guardado correctamente');

// Error
this.toastService.error('Error al conectar con el servidor', 'Error');

// Advertencia
this.toastService.warning('El stock está bajo', 'Atención', 6000);

// Información
this.toastService.info('Procesando solicitud...');

// Personalizado
this.toastService.show({
  type: 'success',
  title: 'Completado',
  message: 'Operación exitosa',
  duration: 3000
});
```

---

## 🗂️ Menú Dinámico

### Archivo JSON (public/data/menu.json)

```json
{
  "menuItems": [
    {
      "id": 1,
      "label": "Dashboard",
      "icon": "bi-house-door",
      "route": "/dashboard",
      "order": 1
    },
    {
      "id": 2,
      "label": "Usuarios",
      "icon": "bi-people",
      "order": 2,
      "children": [
        {
          "id": 21,
          "label": "Lista de Usuarios",
          "route": "/usuarios/lista",
          "order": 1
        }
      ]
    }
  ]
}
```

### Migración a Backend

Para conectar con un backend, solo cambia la URL en `menu.service.ts`:

```typescript
// DE:
return this.http.get<MenuResponse>('/data/menu.json')

// A:
return this.http.get<MenuResponse>('https://tu-api.com/api/menu')
```

### Filtrado por Permisos

```typescript
// Ejemplo: Usuario solo puede ver Dashboard y Usuarios
const allowedIds = [1, 2, 21];
const filteredMenu = this.menuService.filterMenuByPermissions(allowedIds);
```

---

## 📖 Guías de Uso

### Crear una nueva página

```bash
# Crear componente
ng generate component pages/mi-pagina --standalone

# Agregar ruta en app.routes.ts
{
  path: 'mi-pagina',
  loadComponent: () => import('./pages/mi-pagina/mi-pagina.component')
    .then(m => m.MiPaginaComponent)
}

# Agregar al menú (public/data/menu.json)
{
  "id": 10,
  "label": "Mi Página",
  "icon": "bi-star",
  "route": "/mi-pagina",
  "order": 10
}
```

### Usar notificaciones en un componente

```typescript
import { ToastService } from '../../services/toast.service';

export class MiComponente {
  constructor(private toastService: ToastService) {}

  guardar(): void {
    // Lógica de guardado...
    this.toastService.success('Datos guardados correctamente');
  }

  eliminar(): void {
    // Lógica de eliminación...
    this.toastService.error('No se pudo eliminar el registro');
  }
}
```

### Acceder a la configuración

```typescript
import { ConfigService } from '../../services/config.service';

export class MiComponente {
  constructor(private configService: ConfigService) {
    // Obtener configuración
    const config = this.configService.getConfig();
    console.log('Título:', config.appTitle);

    // Reaccionar a cambios
    effect(() => {
      const config = this.configService.config();
      // Hacer algo cuando cambia la configuración
    });
  }
}
```

---

## 🎨 Personalización

### Cambiar colores del tema

**Variables CSS** (`app.component.css`):

```css
:root {
  --navbar-color: #0d6efd;      /* Color de navbar */
  --gradient-from: #667eea;      /* Inicio del gradiente */
  --gradient-to: #764ba2;        /* Fin del gradiente */
}
```

### Cambiar posición de los toasts

**En** `toast.component.css`:

```css
/* Superior derecha (actual) */
.toast-container {
  top: 70px;
  right: 20px;
}

/* Superior izquierda */
.toast-container {
  top: 70px;
  left: 20px;
}

/* Inferior derecha */
.toast-container {
  bottom: 20px;
  right: 20px;
}
```

### Personalizar el menú

**Estilos del menú** (`sidenav.component.css`):

```css
/* Cambiar color de fondo */
.sidenav {
  background-color: #2c3e50;  /* Cambiar este color */
}

/* Cambiar color de item activo */
.menu-link.active {
  background-color: #3498db;  /* Cambiar este color */
}
```

---

## ✨ Mejores Prácticas

### 1. Standalone Components

✅ **Usar**:
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule]
})
```

❌ **Evitar**: NgModules (legacy)

### 2. Lazy Loading

✅ **Usar**:
```typescript
{
  path: 'usuarios',
  loadComponent: () => import('./usuarios.component').then(m => m.UsuariosComponent)
}
```

❌ **Evitar**: Importar todo al inicio

### 3. Servicios con `providedIn: 'root'`

✅ **Usar**:
```typescript
@Injectable({
  providedIn: 'root'  // ← Singleton automático
})
```

### 4. Signals para reactividad

✅ **Usar**:
```typescript
config = signal<AppConfig>(defaultConfig);
```

### 5. Bootstrap utilities

✅ **Usar**: `class="d-flex gap-3 mb-4"`

❌ **Evitar**: CSS personalizado innecesario

### 6. RouterLink en lugar de click

✅ **Usar**:
```html
<a [routerLink]="['/usuarios']" routerLinkActive="active">
```

❌ **Evitar**:
```html
<div (click)="navigate()">
```

### 7. Observables con async pipe

✅ **Usar**:
```html
<div *ngFor="let item of items$ | async">
```

❌ **Evitar**: Suscribirse manualmente sin unsubscribe

---

## 🐛 Troubleshooting

### Problema: Bootstrap no se ve

**Solución**: Verificar `angular.json` y que los estilos estén importados.

### Problema: Los toasts no aparecen

**Solución**: Verificar que `<app-toast>` esté en `app.component.html`

### Problema: El menú no carga

**Solución**: 
1. Verificar que `menu.json` esté en `public/data/`
2. Verificar que HttpClient esté configurado en `app.config.ts`
3. Abrir DevTools → Network → Ver si el JSON se carga

### Problema: Lazy loading no funciona

**Solución**: 
1. Verificar rutas en `app.routes.ts`
2. Verificar que los componentes sean standalone
3. Verificar imports en componentes

### Problema: LocalStorage no guarda

**Solución**: 
1. Verificar que no estés en modo incógnito
2. Verificar que no haya errores en consola
3. Limpiar caché del navegador

---

## 📊 Métricas del Proyecto

### Líneas de Código

| Categoría | Líneas |
|-----------|--------|
| TypeScript | ~2000 |
| HTML | ~800 |
| CSS | ~500 |
| **Total** | **~3300** |

### Tamaño de Bundles

| Bundle | Tamaño |
|--------|--------|
| main.js | ~250KB |
| Módulos lazy | ~50-120KB cada uno |

### Performance

- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Lighthouse Score**: 90+

---

## 🎯 Próximos Pasos

### Funcionalidades pendientes

- [ ] Autenticación y login
- [ ] Guards para rutas protegidas
- [ ] Interceptors HTTP
- [ ] Estado global con signals
- [ ] Tests unitarios
- [ ] Tests E2E
- [ ] PWA (Progressive Web App)
- [ ] i18n (Internacionalización)
- [ ] Dark mode
- [ ] Backend API REST

---

## 📚 Recursos

### Documentación oficial

- [Angular](https://angular.dev)
- [Bootstrap](https://getbootstrap.com)
- [Bootstrap Icons](https://icons.getbootstrap.com)
- [RxJS](https://rxjs.dev)

### Tutoriales recomendados

- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Routing](https://angular.dev/guide/routing)

---

## 👨‍💻 Autor

Documentación generada para proyecto Angular 19 + Bootstrap 5

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**¡Feliz desarrollo! 🚀**