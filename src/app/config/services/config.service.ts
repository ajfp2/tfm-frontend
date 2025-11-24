import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';


export interface ConfigBD {
  id?: number;
  tipo: string;
  ejercicio: string;
  modificado: boolean;
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


  private apiUrl = environment.api_url;
  
  private readonly CONFIG_KEY = 'app_config';

  // Configuración por defecto
  private defaultConfig: AppConfig = {
    navbarColor: '#0d6efd',
    userDropdownGradient: {
      from: '#667eea',
      to: '#764ba2'
    },
    appTitle: 'Mi Aplicación',
    appSubTitle: '',
    appAno: '',
    appLogo: 'https://ui-avatars.com/api/?name=MA&background=ffffff&color=0d6efd&size=40&bold=true'
  };

  // Signal para la configuración reactiva
  config = signal<AppConfig>(this.loadConfig());

  constructor(private http: HttpClient) {
    // Aplicar configuración al cargar
    this.applyConfig();
  }

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

  // Guardar configuración en localStorage
  saveConfig(config: AppConfig): void {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
    this.config.set(config);
    this.applyConfig();
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

  // Restaurar configuración por defecto
  resetToDefault(): void {
    this.saveConfig(this.defaultConfig);
  }

  // Obtener configuración actual
  getConfig(): AppConfig {
    return this.config();
  }

  // Actualizar configuración parcialmente
  updateConfig(partialConfig: Partial<AppConfig>): void {
    const updatedConfig = { ...this.config(), ...partialConfig };
    this.saveConfig(updatedConfig);
  }

  // Comprobar si hay configuración en BD
  getConfigApi():Observable<ConfigBD> {
    return this.http.get(`${this.apiUrl}/configuracion/activa`).pipe(
      map( (response: any) => {
        console.log(response);
        
          if(response.code !== 200){
              throw new Error(response.message || 'Error desconocido');
          }
          return response.data;
      }),
      catchError( (error) => {
          console.error(error);
          return throwError( () => new Error('No se han podido obtener la configuración'));                
      })
    );
  }

  updateConfigApi(id: number, conf: ConfigBD): Observable<ConfigBD> {
      return this.http.put<ConfigBD>(`${this.apiUrl}/configuracion/${id}`, conf)
          .pipe(catchError((error) => {
              return throwError( () => new Error('No se ha podido ACTUALIZAR la configuración'));
      }));
  }
}
