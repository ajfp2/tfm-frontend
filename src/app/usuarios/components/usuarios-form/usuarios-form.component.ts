import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-form',
  imports: [ ReactiveFormsModule, CommonModule ],
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
    private userId: string | null;

    title: string = 'Crear Usuario';
    icon: string = 'bi bi-person-add';
    constructor(private activatedRoute: ActivatedRoute, private formBuilder: UntypedFormBuilder, private userService: UserService, private toast: ToastService, private router: Router) {
        this.registerUser = new UserDTO('', '', '', '', 0, 2, '');

        this.userId = this.activatedRoute.snapshot.paramMap.get('id');
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
            pefil: this.perfil
        });

    }

    ngOnInit(): void {
        if (this.userId) {
            this.isUpdateMode = true;
            this.title = 'Editar Usuario';
            this.icon = 'person-vcard';

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
}
