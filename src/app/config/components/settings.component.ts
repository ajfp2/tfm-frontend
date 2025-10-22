import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppConfig, ConfigService } from '../services/config.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  config: AppConfig;
  previewLogo = '';

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

  constructor(private configService: ConfigService, private toast: ToastService) {
    this.config = { ...this.configService.getConfig() };
    this.previewLogo = this.config.appLogo;
  }

  ngOnInit(): void {}

  // Guardar configuración
  saveConfig(): void {
    this.configService.saveConfig(this.config);
    this.toast.success('Configuración Guardada correctamente');
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

      // Leer archivo y convertir a base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.config.appLogo = e.target.result as string;
          this.previewLogo = this.config.appLogo;
          this.toast.success('Logo subido correctamente');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Obtener estilo del gradiente para preview
  getGradientStyle(): string {
    return `linear-gradient(135deg, ${this.config.userDropdownGradient.from} 0%, ${this.config.userDropdownGradient.to} 100%)`;
  }

}
