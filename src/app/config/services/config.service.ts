import { Injectable, signal } from '@angular/core';


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

  private readonly CONFIG_KEY = 'app_config';

  // Configuración por defecto
  private defaultConfig: AppConfig = {
    navbarColor: '#0d6efd',
    userDropdownGradient: {
      from: '#667eea',
      to: '#764ba2'
    },
    appTitle: 'Mi Aplicación',
    appSubTitle: 'Mi SubTitulo',
    appAno: 'Fiestas',
    appLogo: 'https://ui-avatars.com/api/?name=MA&background=ffffff&color=0d6efd&size=40&bold=true'
  };

  // Signal para la configuración reactiva
  config = signal<AppConfig>(this.loadConfig());

  constructor() {
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
}
