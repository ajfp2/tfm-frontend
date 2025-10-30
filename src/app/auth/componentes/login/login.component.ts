import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfigService } from '../../../config/services/config.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    showPassword = false;
    returnUrl: string = '/dashboard';
    appLogo = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private cf: ConfigService, private router: Router, private route: ActivatedRoute, private toastService: ToastService) {
        const config = this.cf.config();
        let regex = /^data:/; regex.test(config.appLogo);
        this.appLogo = (regex) ? config.appLogo : '';
        // Crear formulario
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            remember: [false]
        });

        // Obtener URL de retorno si existe
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

    /**
     * Getter para acceso fácil a los campos del formulario
     */
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Enviar formulario de login
     */
    onLogin(): void {
        // Validar formulario
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            this.toastService.warning('Por favor completa todos los campos correctamente');
            return;
        }

        this.loading = true;

        // Llamar al servicio de autenticación
        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                this.toastService.success(`Bienvenido ${response.user.name}!`, 'Login exitoso');
            
                // Redirigir a la URL de retorno o dashboard
                setTimeout(() => {
                    this.router.navigate([this.returnUrl]);
                }, 500);
            },
            error: (error) => {
                this.loading = false;
                console.error('Error de login:', error);
            
                // Manejar diferentes tipos de errores
                if (error.status === 401) {
                    this.toastService.error('Email o contraseña incorrectos', 'Error de autenticación');
                } else if (error.status === 422) {
                    this.toastService.error('Datos de login inválidos', 'Error de validación');
                } else if (error.status === 0) {
                    this.toastService.error('No se pudo conectar con el servidor', 'Error de conexión');
                } else {
                    this.toastService.error('Ocurrió un error al iniciar sesión', 'Error');
                }
            }
        });
    }

    /**
     * Toggle para mostrar/ocultar contraseña
     */
    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
