import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { DefaultImagePipe } from "../../../shared/pipes/default-image.pipe";

@Component({
  selector: 'app-usuarios-form',
  imports: [ReactiveFormsModule, CommonModule, DefaultImagePipe],
  templateUrl: './usuarios-form.component.html',
  styleUrl: './usuarios-form.component.css'
})
export class UsuariosFormComponent implements OnInit {

    registerUser: UserDTO;
    nombre: UntypedFormControl;
    apellidos: UntypedFormControl;
    usuario: UntypedFormControl;
    email: UntypedFormControl;
    password: UntypedFormControl;
    telefono: UntypedFormControl;
    perfil: UntypedFormControl;

    registerForm: UntypedFormGroup;
    isValidForm: boolean | null;

    private isUpdateMode: boolean;
    private userId: number | null;

    // Para manejar las imagenes del usuario.
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    title: string = 'Crear Usuario';
    icon: string = 'bi bi-person-add';

    constructor(private activatedRoute: ActivatedRoute, private formBuilder: UntypedFormBuilder, private userService: UserService, private toast: ToastService, private router: Router) {
        this.registerUser = new UserDTO('', '', '', '', 0, 2, '');
        const paramURL = this.activatedRoute.snapshot.paramMap.get('id');
        this.userId = paramURL ? Number(paramURL) : null;
        this.isUpdateMode = false;

        this.isValidForm = null;

        this.nombre = new UntypedFormControl(this.registerUser.nombre, [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
        ]);

        this.apellidos = new UntypedFormControl(this.registerUser.apellidos, [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
        ]);

        this.usuario = new UntypedFormControl(this.registerUser.usuario, [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
        ]);

        this.email = new UntypedFormControl(this.registerUser.email, [
            Validators.required,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]);

        this.password = new UntypedFormControl(this.registerUser.password, [
            Validators.required,
            Validators.minLength(8),
        ]);

        this.telefono = new UntypedFormControl(this.registerUser.telefono, [
            Validators.required,
            Validators.pattern('^[67][0-9]{8}$')
        ]);

        
        this.perfil = new UntypedFormControl(this.registerUser.perfil, [
            Validators.required
        ]);

        this.registerForm = this.formBuilder.group({
            nombre: this.nombre,
            apellidos: this.apellidos,
            usuario: this.usuario,
            telefono: this.telefono,
            email: this.email,
            password: this.password,
            perfil: this.perfil
        });

    }

    ngOnInit(): void {
        if (this.userId) {
            this.isUpdateMode = true;
            this.title = 'Editar Usuario';
            this.icon = 'bi bi-person-vcard';

            // Quitamos la validacion para el modo editar
            this.password.clearValidators();
            this.password.updateValueAndValidity();

            this.userService.getUserById(this.userId).subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.registerUser = resp;
                    
                    this.registerForm.patchValue({
                        nombre: resp.nombre,
                        apellidos: resp.apellidos,
                        usuario: resp.usuario,
                        email: resp.email,
                        telefono: resp.telefono,
                        perfil: resp.perfil                        
                    });
                },
                error: (err) => {
                    this.toast.error('Error al cargar el usuario');
                    console.error(err);
                }
            });

            this.userService.getUserById(this.userId).subscribe(resp => {
                console.log(resp);
                this.registerUser = resp;                
            });

        }
    }

    register(): void {
        // let responseOK: boolean = false;
        // this.isValidForm = false;
        // let errorResponse: any;

        // if (this.registerForm.invalid) {
        // return;
        // }

        // this.isValidForm = true;
        // this.registerUser = this.registerForm.value;

        
        // this.userService.register(this.registerUser)
        // .pipe(finalize(
        // async () => {
        //     await this.sharedService.managementToast(
        //     'registerFeedback',
        //     responseOK,
        //     errorResponse
        //     );
        
        //     if (responseOK) {
        //     // Reset the form
        //     this.registerForm.reset();
        //     // After reset form we set birthDate to today again (is an example)
        //     this.birth_date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
        //     this.router.navigateByUrl('home');
        //     }
        // }
        // ))
        // .subscribe(() => {
        // responseOK = true;
        // },
        // err => {
        // responseOK = false;
        // errorResponse = err.error;
        // const headerInfo: HeaderMenus = {
        //     showAuthSection: false,
        //     showNoAuthSection: true,
        // };
        // this.headerMenusService.headerManagement.next(headerInfo);
        // this.sharedService.errorLog(errorResponse);
        // });
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
}
