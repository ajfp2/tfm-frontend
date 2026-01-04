import { HttpClient } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Temporada } from '../../temporadas/models/temporada.model';


export interface ConfigBD {
    id: number;
    tipo: string;
    ejercicio: string;
    modificado: boolean;
    titulo?: string;
    subtitulo?: string;
    logo?: string;
    navbar_color?: string;
    gradient_from?: string;
    gradient_to?: string;
    a_temporada_activa?: number;
    temporada_activa?: Temporada;
}

export interface AppConfig {
    navbarColor: string;
    userDropdownGradient: {
        from: string;
        to: string;
    };
    appTitle: string;
    appSubTitle: string;
    appAno: string;
    appLogo: string;
}


@Injectable({
  providedIn: 'root'
})

export class ConfigService {

    private apiUrl = `${environment.api_url}/configuracion`;

    private readonly CONFIG_INITIALIZED_KEY = 'app_config_initialized';    
    private readonly CONFIG_KEY = 'app_config';

    // Configuración por defecto
    private defaultConfig: AppConfig = {
        navbarColor: '#0d6efd',
        userDropdownGradient: {
            from: '#667eea',
            to: '#764ba2'
        },
        appTitle: 'GestiSOC',
        appSubTitle: 'Entidad',
        appAno: 'Ejercicio',
        appLogo: 'https://ui-avatars.com/api/?name=MA&background=ffffff&color=0d6efd&size=40&bold=true'
    };

    // Signal para la configuración
    config = signal<AppConfig>(this.loadConfig());

    // Otro Signal para saber si la config está inicializada
    isConfigInitialized = signal<boolean>(this.comprobarInicializada());

    constructor(private http: HttpClient) {
        // Aplicar configuración al cargar la app
        effect(() => {
            this.applyConfig();
        });        
    }

    initialize(): void {
        this.syncConfigFromDB();
    }

    /* ================================
    VERIFICACIÓN DE INICIALIZACIÓN
    ==================================*/

    // Verificar si la configuración ya fue inicializada
    private comprobarInicializada(): boolean {
        const initialized = localStorage.getItem(this.CONFIG_INITIALIZED_KEY);
        return initialized === 'true';
    }

    /**
     * Marcar la configuración como inicializada
     */
    private marcarComoInicilizada(): void {
        localStorage.setItem(this.CONFIG_INITIALIZED_KEY, 'true');
        this.isConfigInitialized.set(true);
    }

    // Obtener estado de inicialización (público)
    getInitializationStatus(): boolean {
        return this.isConfigInitialized();
    }


    /* ================================
    LOCALSTORAGE CONFIg
    ==================================*/

    // Cargar configuración desde localStorage
    private loadConfig(): AppConfig {
        const savedConfig = localStorage.getItem(this.CONFIG_KEY);
        if (savedConfig) {
            try {
                return { ...this.defaultConfig, ...JSON.parse(savedConfig) };
            } catch (error) {
                console.error('Error al cargar configuración:', error);
                return this.defaultConfig;
            }
        }
        return this.defaultConfig;
    }

    // Aplicar configuración a la aplicación
    private applyConfig(): void {
        const currentConfig = this.config();
        
        // Actualizar título de la pestaña del navegador
        document.title = currentConfig.appTitle;
        
        // Actualizar variables CSS
        document.documentElement.style.setProperty('--navbar-color', currentConfig.navbarColor);
        document.documentElement.style.setProperty('--gradient-from', currentConfig.userDropdownGradient.from);
        document.documentElement.style.setProperty('--gradient-to', currentConfig.userDropdownGradient.to);
    }

    // Guardar configuración en localStorage
    private saveConfigToLocalStorage(config: AppConfig): void {
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
        this.config.set(config);
    }

    /* ================================
    CONFIGURACIÓN BD
    ==================================*/

    // Comprobar si hay configuración en BD
    getConfigApi(): Observable<ConfigBD> {
        return this.http.get(`${this.apiUrl}/activa`).pipe(
            map((response: any) => {
                if (response.code !== 200) {
                    throw new Error(response.message || 'Error desconocido');
                }
                return response.data;
            }),
            catchError((error) => {
                console.error('Error al obtener configuración:', error);
                return throwError(() => new Error('No se han podido obtener la configuración'));
            })
        );
    }      

    updateConfigApi(id: number, conf: Partial<ConfigBD>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, conf).pipe(
            map((response: any) => {
                if (response.code !== 200) {
                    throw new Error(response.message || 'Error al actualizar');
                }
                return response.data;
            }),
            catchError((error) => {
                console.error('Error al actualizar configuración:', error);
                return throwError(() => new Error('No se ha podido actualizar la configuración'));
            })
        );
    }

    // Actualizar solo configuración visual en la API
    updateVisualConfigApi(id: number, config: {
        titulo?: string;
        subtitulo?: string;
        logo?: string;
        navbar_color?: string;
        gradient_from?: string;
        gradient_to?: string;
    }): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/visual`, config).pipe(
            map((response: any) => {
                if (response.code !== 200) {
                throw new Error(response.message || 'Error al actualizar');
                }
                return response.data;
            }),
            catchError((error) => {
                console.error('Error al actualizar configuración visual:', error);
                return throwError(() => new Error('No se ha podido actualizar la configuración visual'));
            })
        );
    }

    // Actualizar y subir logo al backend
    uploadLogo(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('logo', file);

        return this.http.post(`${this.apiUrl}/upload-logo`, formData).pipe(
            map((response: any) => {
                if (response.code !== 200) {
                    throw new Error(response.message || 'Error al subir logo');
                }
                return response.data;
            }),
            catchError((error) => {
                console.error('Error al subir logo:', error);
                return throwError(() => new Error('No se ha podido subir el logo'));
            })
        );
    }

    // Eliminar logo del backend
    deleteLogo(): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete-logo`).pipe(
            map((response: any) => {
                if (response.code !== 200) {
                    throw new Error(response.message || 'Error al eliminar logo');
                }
                return response.data;
            }),
            catchError((error) => {
                console.error('Error al eliminar logo:', error);
                return throwError(() => new Error('No se ha podido eliminar el logo'));
            })
        );
    }

    // Sincronizar configuración desde BD y actualizar localStorage
    syncConfigFromDB(): void {
        const token = localStorage.getItem('auth_token');
        if (!token) return; // No hacer petición sin token
        
        this.getConfigApi().subscribe({
            next: (configBD) => {
                // Verificar si la configuración está modificada
                if (configBD.modificado) {
                    // Configuración YA inicializada
                    this.marcarComoInicilizada();
                    
                    // Convertir configuración de BD a AppConfig
                    const appConfig: AppConfig = {
                        appTitle: configBD.titulo || this.defaultConfig.appTitle,
                        appSubTitle: this.buildSubtitle(configBD),
                        appAno: this.buildAno(configBD),
                        appLogo: configBD.logo || this.defaultConfig.appLogo,
                        navbarColor: configBD.navbar_color || this.defaultConfig.navbarColor,
                        userDropdownGradient: {
                            from: configBD.gradient_from || this.defaultConfig.userDropdownGradient.from,
                            to: configBD.gradient_to || this.defaultConfig.userDropdownGradient.to
                        }
                    };
                    
                    // Guardar en localStorage y actualizar signal
                    this.saveConfigToLocalStorage(appConfig);
                } else {
                    // Configuración NO inicializada (primera vez)
                    console.log('Configuración no inicializada. Usando valores por defecto.');
                    this.isConfigInitialized.set(false);
                    
                    // Cargar configuración por defecto
                    this.saveConfigToLocalStorage(this.defaultConfig);
                }
            },
            error: (error) => {
                console.error('Error al sincronizar configuración desde BD:', error);
                // Si hay error, se asume que no está inicilizada
                this.isConfigInitialized.set(false);
            }
        });
    }

    /* ================================
    MÉTDOSO PÚBLICOS Y AUXILIARES
    ==================================*/

    /*
     Guarda configuración completa (PRIMERA VEZ)
     Este método lo llamo desde SettingsComponent cuando el usuario administrador guarda por primera vez
    */
    saveInitialConfig(config: AppConfig, tipo: string, ejercicio: string): Observable<any> {
        // Mapear AppConfig + tipo + ejercicio a ConfigBD
        const configBD: Partial<ConfigBD> = {
            tipo: tipo,
            ejercicio: ejercicio,
            titulo: config.appTitle,
            subtitulo: config.appSubTitle,
            logo: config.appLogo,
            navbar_color: config.navbarColor,
            gradient_from: config.userDropdownGradient.from,
            gradient_to: config.userDropdownGradient.to,
            modificado: true  // MARCAR COMO MODIFICADO
        };

        // Guardar en BD
        return this.updateConfigApi(1, configBD).pipe(
            tap((response) => {
                // Marcar como inicializada
                this.marcarComoInicilizada();
                
                // Guardar en localStorage
                this.saveConfigToLocalStorage(config);
                
                console.log('Configuración inicial guardada correctamente');
            })
        );
    }

    // Guardar configuración visual, se llama cuando la configuración ya esta inicializada
    saveConfig(config: AppConfig): Observable<any> {
        // Mapear AppConfig a ConfigBD
        const configBD: Partial<ConfigBD> = {
            titulo: config.appTitle,
            subtitulo: config.appSubTitle,
            logo: config.appLogo,
            navbar_color: config.navbarColor,
            gradient_from: config.userDropdownGradient.from,
            gradient_to: config.userDropdownGradient.to,
        };

        // Guardar en BD
        return this.updateVisualConfigApi(1, configBD).pipe(
            tap((response) => {
                // Guardar en localStorage y actualizar signal
                this.saveConfigToLocalStorage(config);
            })
        );
    }

    // Actualizar configuración parcialmente
    updateConfig(partialConfig: Partial<AppConfig>): void {
        const updatedConfig = { ...this.config(), ...partialConfig };
        this.saveConfigToLocalStorage(updatedConfig);
    }

    // Obtener configuración actual
    getConfig(): AppConfig {
        return this.config();
    }

    // Restaurar configuración por defecto
    resetToDefault(): void {
        this.saveConfigToLocalStorage(this.defaultConfig);
        
        // También actualizar en BD
        const configBD: Partial<ConfigBD> = {
            titulo: this.defaultConfig.appTitle,
            subtitulo: this.defaultConfig.appSubTitle,
            logo: this.defaultConfig.appLogo,
            navbar_color: this.defaultConfig.navbarColor,
            gradient_from: this.defaultConfig.userDropdownGradient.from,
            gradient_to: this.defaultConfig.userDropdownGradient.to,
        };

        this.updateVisualConfigApi(1, configBD).subscribe({
            next: () => console.log('Configuración restablecida en BD'),
            error: (err) => console.error('Error al restablecer en BD:', err)
        });
    }  

    // Construir string de año/temporada   
    private buildAno(configBD: ConfigBD): string {
        if (configBD.temporada_activa?.abreviatura) {
        return `${configBD.ejercicio} ${configBD.temporada_activa.abreviatura}`;
        }
        return configBD.ejercicio || this.defaultConfig.appAno;
    }

    // Construir subtítulo con temporada activaFormato: "Tipo Temporada 25-26"
    private buildSubtitle(configBD: ConfigBD): string {
        const tipo = configBD.tipo || configBD.subtitulo || 'Entidad';
        const ejer = configBD.ejercicio || 'Ejercicio';
        if (configBD.temporada_activa?.abreviatura) {
            return `${tipo} ${ejer} ${configBD.temporada_activa.abreviatura}`;
        }
        
        return tipo;
    }
}
