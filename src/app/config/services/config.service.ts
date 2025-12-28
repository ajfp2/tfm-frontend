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
    
    private readonly CONFIG_KEY = 'app_config';

    // Configuración por defecto
    private defaultConfig: AppConfig = {
        navbarColor: '#0d6efd',
        userDropdownGradient: {
            from: '#667eea',
            to: '#764ba2'
        },
        appTitle: 'Sistema de Gestión',
        appSubTitle: 'Peña',
        appAno: 'Ejercicio',
        appLogo: 'https://ui-avatars.com/api/?name=MA&background=ffffff&color=0d6efd&size=40&bold=true'
    };

    // Signal para la configuración reactiva
    config = signal<AppConfig>(this.loadConfig());

    constructor(private http: HttpClient) {
        // Aplicar configuración al cargar
        effect(() => {
            this.applyConfig();
        });        
    }

    initialize(): void {
        this.syncConfigFromDB();
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
    BD CONFIG
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
    
    // Update toda la config
    updateConfigApi_OLD(id: number, conf: ConfigBD): Observable<ConfigBD> {
        return this.http.put<ConfigBD>(`${this.apiUrl}/${id}`, conf)
            .pipe(catchError((error) => {
                return throwError( () => new Error('No se ha podido ACTUALIZAR la configuración'));
        }));
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

    /**
    * Actualizar y subir logo al backend
    */
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

    /**
    * Eliminar logo del backend
    */
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
                // Mapear configuración de BD a AppConfig
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
            },
            error: (error) => {
                console.error('Error al sincronizar configuración desde BD:', error);
            }
        });
    }

    /* ================================
    MÉTDOSO PÚBLICOS Y AUXILIARES
    ==================================*/

    // Guardar configuración completa (BD + localStorage)
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
        const tipo = configBD.tipo || configBD.subtitulo || 'Peña';
        
        if (configBD.temporada_activa?.abreviatura) {
            return `${tipo} Temporada ${configBD.temporada_activa.abreviatura}`;
        }
        
        return tipo;
    }
}
