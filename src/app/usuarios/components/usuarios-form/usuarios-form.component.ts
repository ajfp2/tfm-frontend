import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { DefaultImagePipe } from "../../../shared/pipes/default-image.pipe";
import { ConfigService } from '../../../config/services/config.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-usuarios-form',
  imports: [ReactiveFormsModule, CommonModule, DefaultImagePipe],
  templateUrl: './usuarios-form.component.html',
  styleUrl: './usuarios-form.component.css'
})
export class UsuariosFormComponent implements OnInit {

    bloqueROL: boolean = false;
    registerUser: UserDTO;

    currentUser: any = null; // guardar user autenticado 

    registerForm!: UntypedFormGroup;
    isValidForm: boolean | null;

    isUpdateMode: boolean;
    userId: number | null;

    // Para manejar las imagenes del usuario.
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    title: string = 'Crear Usuario';
    icon: string = 'bi bi-person-add';
    color: string = 'btn-success';

    constructor(private activatedRoute: ActivatedRoute, private formBuilder: UntypedFormBuilder, private userService: UserService, private authService: AuthService,
        private toast: ToastService, private router: Router) {

        this.registerUser = new UserDTO('', '', '', '', '', 2, '');
        const paramURL = this.activatedRoute.snapshot.paramMap.get('id');
        this.userId = paramURL ? Number(paramURL) : null;
        this.isUpdateMode = !!this.userId;

        this.isValidForm = null;
    }

    ngOnInit(): void {
        // Usuario autenticado
        this.obtenerUsuarioAutenticado();
        
        // Bloqueamos según rol
        this.determinarBloqueoRol();
        
        // Inicilizamos el formutlario
        this.inicializarFormulario();
        
        // Cargar datos modo edición
        if (this.isUpdateMode && this.userId) {
            this.cargarUsuario();
        }
    }
    
    obtenerUsuarioAutenticado(): void {        
        this.currentUser = this.authService.currentUser();
        
        console.log('Usuario autenticado:', this.currentUser);
        
        if (!this.currentUser) {
            console.warn('No hay usuario autenticado');
            this.toast.error('No se pudo verificar tu sesión');
            this.router.navigate(['/login']);
        }
    }

    // Determinar bloqueo según ROL- Solo Admin puede cambiar roles, un usuario no puede cambiar su rol
    determinarBloqueoRol(): void {
        if (!this.currentUser) {
            this.bloqueROL = true;
            return;
        }

        const esAdmin = this.currentUser.perfil === 1 || this.currentUser.perfil === '1';
        
        // NO es admin, siempre bloquear
        if (!esAdmin) {
            this.bloqueROL = true;
            return;
        }

        // Si es admin creando nuevo usuario
        if (!this.isUpdateMode) {
            this.bloqueROL = false;
            return;
        }

        // Si es admin editando su propio perfil
        if (this.userId === this.currentUser.id) {
            this.bloqueROL = true;
            return;
        }

        // Si es admin editando otro usuario
        this.bloqueROL = false;
    }

    // Inicializar formulario
    inicializarFormulario(): void {
        this.registerForm = this.formBuilder.group({
            nombre: ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(25)
            ]],
            apellidos: ['', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(50)
            ]],
            usuario: ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(25)
            ]],
            email: ['', [
                Validators.required,
                Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
            ]],
            telefono: ['', [
                Validators.required,
                Validators.pattern('^[67][0-9]{8}$')
            ]],
            password: [''], 
            perfil: [
                { 
                    value: 2, 
                    disabled: this.bloqueROL 
                }
            ]
        });

        // Validadores de password según modo
        if (!this.isUpdateMode) {
            // Modo creación: password obligatorio
            this.registerForm.get('password')?.setValidators([
                Validators.required,
                Validators.minLength(8)
            ]);
        }
        // En modo edición, password es opcional (solo si se quiere cambiar)

        console.log('📝 Formulario inicializado. bloqueROL:', this.bloqueROL);
    }

    cargarUsuario(): void {
        if (!this.userId) return;

        this.title = 'Editar Usuario';
        this.icon = 'bi bi-person-vcard';
        this.color = 'btn-primary';

        this.userService.getUserById(this.userId).subscribe({
            next: (resp) => {
                this.registerUser = resp;
                
                if (resp.foto) {
                    this.imagePreview = resp.foto;
                }
                
                this.registerForm.patchValue({
                    nombre: resp.nombre,
                    apellidos: resp.apellidos,
                    usuario: resp.usuario,
                    email: resp.email,
                    telefono: resp.telefono,
                    perfil: resp.perfil
                });

                //determinar bloqueo después de cargar datos
                this.determinarBloqueoRol();
                this.actualizarEstadoCampoPerfil();
            },
            error: (err) => {
                this.toast.error('Error al cargar el usuario');
                console.error(err);
                this.router.navigate(['/usuarios/list']);
            }
        });
    }

    actualizarEstadoCampoPerfil(): void {
        const perfilControl = this.registerForm.get('perfil');
        
        if (this.bloqueROL) {
            perfilControl?.disable();
        } else {
            perfilControl?.enable();
        }
        
    }

    register(): void {
        if (this.registerForm.invalid) {
            this.toast.error('Por favor, todos los campos obligatorios');
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isValidForm = true;

        // Usar getRawValue() para incluir campos disabled
        const formValues = this.registerForm.getRawValue();

        const formData = new FormData();
        
        // Copiar todos los campos del formulario
        Object.keys(formValues).forEach(key => {
            const value = formValues[key];
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, value);
            }
        });

        // Añadir img si se ha seleccionado
        if (this.selectedFile) {
            formData.append('foto', this.selectedFile, this.selectedFile.name);
        }

        // Debug: mostrar todos los campos
        console.log('Datos a enviar:');
        formData.forEach((value, key) => {
            console.log(`  ${key}:`, value);
        });

        if (this.isUpdateMode && this.userId) {
            this.actualizarUsuario(formData);
        } else {
            this.crearUsuario(formData);
        }
    }

    private crearUsuario(formData: FormData): void {
        this.userService.createUser(formData).subscribe({
            next: () => {
                this.toast.success('Usuario creado correctamente');
                this.router.navigate(['/usuarios/list']);
            },
            error: (err) => {
                this.toast.error('Error al crear el usuario');
                console.error('Error creación:', err);
                
                // Mostrar errores específicos de validación
                if (err.error?.errors) {
                    Object.keys(err.error.errors).forEach(field => {
                        const messages = err.error.errors[field];
                        console.error(`Campo ${field}:`, messages);
                        this.toast.error(`${field}: ${messages[0]}`);
                    });
                }
            }
        });
    }

    private actualizarUsuario(formData: FormData): void {
        formData.append('_method', 'PUT');

        this.userService.updateUser(this.userId!, formData).subscribe({
            next: () => {
                this.toast.success('Usuario actualizado correctamente');
                
                // Si el usuario editó su propio perfil, actualizar sesión
                if (this.userId === this.currentUser?.id) {
                    // Refrescar Perfil auth???? probarrrr
                    // this.authService.refreshCurrentUser();
                }
                
                this.router.navigate(['/usuarios/list']);
            },
            error: (err) => {
                this.toast.error('Error al actualizar el usuario');
                console.error('Error actualización:', err);
                
                // Mostrar errores específicos
                if (err.error?.errors) {
                    Object.keys(err.error.errors).forEach(field => {
                        const messages = err.error.errors[field];
                        console.error(`Campo ${field}:`, messages);
                        this.toast.error(`${field}: ${messages[0]}`);
                    });
                }
            }
        });
    }

    // Archivo img elegido
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(this.selectedFile.type)) {
                this.toast.error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
                this.selectedFile = null;
                return;
            }
            
            // Validar tamaño (por ejemplo, máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (this.selectedFile.size > maxSize) {
                this.toast.error('La imagen no puede superar los 5MB');
                this.selectedFile = null;
                return;
            }
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.imagePreview = e.target?.result as string;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    // Borrar img elegida
    removeImage(): void {
        this.selectedFile = null;
        this.imagePreview = null;
        
        // Resetear el input file
        const fileInput = document.getElementById('fotoInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    volver(){
        let back = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([back]);
    }

    tieneError(campo: string, error: string): boolean {
        const control = this.registerForm.get(campo);
        return !!(control?.hasError(error) && control?.touched);
    }

    getClaseCampo(campo: string): string {
        const control = this.registerForm.get(campo);
        if (control?.invalid && control?.touched) {
            return 'is-invalid';
        }
        if (control?.valid && control?.touched) {
            return 'is-valid';
        }
        return '';
    }
}
