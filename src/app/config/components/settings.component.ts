import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppConfig, ConfigBD, ConfigService } from '../services/config.service';
import { ToastService } from '../../shared/services/toast.service';
import { MenuService } from '../../shared/services/menu.service';

@Component({
    selector: 'app-settings',
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})

export class SettingsComponent implements OnInit {
    config: AppConfig = {
        navbarColor: '',
        userDropdownGradient: {
            from: '',
            to: '',
        },
        appTitle: '',
        appSubTitle: '',
        appAno: '',
        appLogo: ''
    };
    previewLogo = '';
    confBD: ConfigBD = {
        id: 1,
        tipo: '',
        ejercicio: '',
        modificado: false
    };

    // Estado de inicialización
    isInitialized = false;
    isFirstTimeSave = false;

    // Valores originales de tipo y ejercicio (para bloquear después de guardar)
    originalTipo = '';
    originalEjercicio = '';

    // Colores predefinidos para selección rápida
    navbarColors = [
        { name: 'Azul', value: '#0d6efd' },
        { name: 'Morado', value: '#6f42c1' },
        { name: 'Verde', value: '#198754' },
        { name: 'Rojo', value: '#dc3545' },
        { name: 'Naranja', value: '#fd7e14' },
        { name: 'Turquesa', value: '#20c997' },
        { name: 'Oscuro', value: '#212529' }
    ];

    gradientPresets = [
        { name: 'Morado', from: '#667eea', to: '#764ba2' },
        { name: 'Océano', from: '#2E3192', to: '#1BFFFF' },
        { name: 'Atardecer', from: '#FF512F', to: '#F09819' },
        { name: 'Bosque', from: '#134E5E', to: '#71B280' },
        { name: 'Rosa', from: '#EC008C', to: '#FC6767' },
        { name: 'Azul', from: '#4776E6', to: '#8E54E9' }
    ];

    constructor(private configService: ConfigService, private toast: ToastService, private ms: MenuService) { }

    ngOnInit(): void {        
        this.config = { ...this.configService.getConfig() };
        this.previewLogo = this.config.appLogo;

        // Verificar si la configuración está inicializada
        this.isInitialized = this.configService.getInitializationStatus();
        
        // Cargar configuración desde BD
        this.loadConfigFromDB();
    }

    // Cargar configuración desde BD    
    loadConfigFromDB(): void {
        this.configService.getConfigApi().subscribe({
            next: (configBD) => {
                this.confBD = configBD;
                console.log("CONF BD", configBD);
                
                // Guardar valores originales
                this.originalTipo = configBD.tipo || '';
                this.originalEjercicio = configBD.ejercicio || '';
                
                // Verificar si está modificado (inicializado)
                this.isInitialized = configBD.modificado;
                
                if (!this.isInitialized) {
                    console.log('Primera vez - Configuración no inicializada');
                    this.isFirstTimeSave = true;
                } else {
                    console.log('Configuración ya inicializada');
                }
            },
            error: (error) => {
                console.error('Error al cargar configuración:', error);
                this.toast.error('Error al cargar la configuración');
            }
        });
    }

    // Guardar configuración
    saveConfig(): void {
        // Validar campos obligatorios en primera configuración
        if (!this.isInitialized) {
            if (!this.config.appSubTitle || this.config.appSubTitle.trim() === '') {
                this.toast.error('Por favor, selecciona el tipo de entidad');
                return;
            }
            
            if (!this.config.appAno || this.config.appAno.trim() === '') {
                this.toast.error('Por favor, selecciona el tipo de ejercicio económico');
                return;
            }
        }

        if (this.isFirstTimeSave || !this.isInitialized) {
            // PRIMERA VEZ - Guardo configuración completa
            this.saveInitialConfiguration();
        } else {
            // CONFIGURACIÓN YA INICIALIZADA - Solo guardo los cambios visuales
            this.saveVisualConfiguration();
        }
    }

    // Guardar configuración inicial (primera vez)
    private saveInitialConfiguration(): void {
        const tipo = this.config.appSubTitle;
        const ejercicio = this.config.appAno;
        
        this.configService.saveInitialConfig(this.config, tipo, ejercicio).subscribe({
            next: (response) => {
                if (response.code == 200 || response) {
                    this.toast.success('¡Configuración inicial guardada correctamente!');
                    
                    // Actualizar estado
                    this.confBD = response.data || response;
                    this.isInitialized = true;
                    this.isFirstTimeSave = false;
                    
                    // Guardar valores originales (para bloquear)
                    this.originalTipo = tipo;
                    this.originalEjercicio = ejercicio;
                    
                    // Recargar el menú completo desde la API
                    this.reloadMenu();
                    
                    // Opcional: Redirigir al dashboard
                    // this.router.navigate(['/dashboard']);
                }
            },
            error: (error) => {
                console.error('Error al guardar configuración inicial:', error);
                this.toast.error('Error al guardar la configuración inicial');
            }
        });
    }

    /**
     * Guardar solo cambios visuales (config ya inicializada)
     */
    private saveVisualConfiguration(): void {
        this.configService.saveConfig(this.config).subscribe({
            next: (response) => {
                if (response.code == 200 || response) {
                    this.toast.success('Configuración actualizada correctamente');
                    this.confBD = response.data || response;
                }
            },
            error: (error) => {
                console.error('Error al guardar configuración:', error);
                this.toast.error('Error al guardar la configuración');
            }
        });
    }

    // Recargar menú completo desde la API
    private reloadMenu(): void {
        console.log('🔄 Recargando menú completo desde API...');
        
        this.ms.loadMenuAPI().subscribe({
            next: (menuItems) => {
                console.log('Menú completo cargado:', menuItems.length, 'items');
                this.toast.success('Menú actualizado correctamente');
            },
            error: (error) => {
                console.error('Error al recargar menú:', error);
                this.toast.warning('Configuración guardada, pero hubo un error al actualizar el menú');
            }
        });
    }


    // Restaurar valores por defecto
    resetToDefault(): void {
        if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
            this.configService.resetToDefault();
            this.config = { ...this.configService.getConfig() };
            this.previewLogo = this.config.appLogo;
            this.toast.info('Configuración restablecida correctamente.');
        }
    }

    // Aplicar color de navbar predefinido
    applyNavbarColor(color: string): void {
        this.config.navbarColor = color;
    }

    // Aplicar gradiente predefinido
    applyGradient(gradient: { from: string; to: string }): void {
        this.config.userDropdownGradient = { ...gradient };
    }

    // Subir el logo
    onLogoFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
        
            // Validar tamaño (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {        
                this.toast.error('El archivo es demasiado grande. El tamaño máximo es 2MB.');
                return;
            }

            // Validar tipo
            if (!file.type.startsWith('image/')) {
                this.toast.error('Por favor selecciona un archivo de imagen válido.');
                return;
            }

            this.configService.uploadLogo(file).subscribe({
                next: (response) => {
                    this.config.appLogo = response.logo;
                    this.previewLogo = response.logo;
                    
                    this.saveConfigAfterLogoUpload();
                    
                    this.toast.success('Logo subido correctamente');
                },
                error: (error) => {
                    console.error('Error al subir logo:', error);
                    this.toast.error('Error al subir el logo. Intenta de nuevo.');
                }
            });
        }
    }

    private saveConfigAfterLogoUpload(): void {
        this.configService.saveConfig(this.config).subscribe({
            next: (response) => {
                console.log('Configuración actualizada con nuevo logo');
            },
            error: (error) => {
                console.error('Error al actualizar configuración:', error);
            }
        });
    }

    // Obtener estilo del gradiente para preview
    getGradientStyle(): string {
        return `linear-gradient(135deg, ${this.config.userDropdownGradient.from} 0%, ${this.config.userDropdownGradient.to} 100%)`;
    }
}
