import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearSocioDTO, FormaPago, Municipio, Nacionalidad, Provincia, TipoSocio } from '../../models/socio.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { SociosService } from '../../services/socios.service';
import { SociosRealcionesService } from '../../services/socios-realciones.service';

@Component({
  selector: 'app-socios-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socios-form.component.html',
  styleUrl: './socios-form.component.css'
})

export class SociosFormComponent implements OnInit{

    socioForm!: FormGroup;
    isUpdateMode: boolean = false;
    socioId: number | null = null;
    isLoading: boolean = false;

    // Para las tablas Relacionadas a socios
    tiposSocio: TipoSocio[] = [];
    nacionalidades: Nacionalidad[] = [];
    provincias: Provincia[] = [];
    municipios: Municipio[] = [];
    municipiosFiltrados: Municipio[] = [];
    formasPago: FormaPago[] = [];

    // IBAN
    ibanParte1: string = '';
    ibanParte2: string = '';
    ibanParte3: string = '';
    ibanParte4: string = '';
    ibanParte5: string = '';
    ibanParte6: string = '';
    ibanValido: boolean = false;
    ibanError: string = '';

    constructor(
        private fb: FormBuilder,
        private socioService: SociosService,
        private auxSocioService: SociosRealcionesService,
        private toast: ToastService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.createForm();
    }

    private agregarHoraActual(fecha: string): string {
        // Crear objeto Date con la fecha seleccionada
        const fechaObj = new Date(fecha + 'T00:00:00');
        
        // Obtener fecha y hora actual
        const ahora = new Date();
        
        // Establecer la hora actual a la fecha seleccionada
        fechaObj.setHours(ahora.getHours());
        fechaObj.setMinutes(ahora.getMinutes());
        fechaObj.setSeconds(ahora.getSeconds());    
            
        // Devolver en formato ISO (YYYY-MM-DDTHH:mm:ss)
        return fechaObj.toISOString().slice(0, 19).replace('T', ' ');
        // Alternativa si Laravel espera formato ISO completo:
        // return fechaObj.toISOString();
    }

    ngOnInit(): void {
        this.loadTablasAuxiliares();
    
        // Verificar si es create o update
        const paramURL = this.route.snapshot.paramMap.get('id');
        if (paramURL) {
            this.isUpdateMode = true;
            this.socioId = Number(paramURL);
            this.loadSocio(this.socioId);
        }
    }

    createForm(): void {
        this.socioForm = this.fb.group({
            // Datos personales
            Nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            Apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            DNI: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]],
            Movil: ['', [Validators.pattern(/^[67][0-9]{8}$/)]],
            Email: ['', [Validators.email, Validators.maxLength(150)]],
            Talla: [''],
            Sexo: [''],
            FNac: [''],
        
            // Dirección
            Direccion: ['', Validators.maxLength(100)],
            CP: ['', [Validators.pattern(/^[0-9]{5}$/)]],
            Provincia: [''],
            Poblacion: [''],
            Pais: [''],
            Nacionalidad: [''],
        
            // Datos bancarios
            IBAN: ['', [Validators.pattern(/^ES[0-9]{22}$/)]],
            BIC: ['', Validators.maxLength(11)],
            
            // Datos de alta
            fk_tipoSocio: ['', Validators.required],
            fecha_alta: [new Date().toISOString().split('T')[0], Validators.required],
            n_carnet: [0],
            sin_correspondencia: [false],
            c_carta: [false],
            c_email: [true],
            formaPago: ['', Validators.required],
            fichaMadrid: [false]
        });

        // Listener para cambiar municipios cuando cambia la provincia
        this.socioForm.get('Provincia')?.valueChanges.subscribe((provinciaId) => {
            if (provinciaId) {
                this.loadMunicipiosPorProvincia(provinciaId);
                this.socioForm.patchValue({ Poblacion: '' });
            } else {
                this.municipiosFiltrados = [];
            }
        });
    }

    loadTablasAuxiliares(): void {
        // Tipos de socio
        this.auxSocioService.getTiposSocio().subscribe({
            next: (response) => {
                this.tiposSocio = response.data;
            },
            error: (err) => console.error('Error al cargar tipos de socio:', err)
        });

        // Nacionalidades
        this.auxSocioService.getNacionalidades().subscribe({
            next: (response) => {
                this.nacionalidades = response.data;
                // Establecer España por defecto
                if (!this.isUpdateMode) {
                const espana = this.nacionalidades.find(n => n.id === 60);
                if (espana) {
                    this.socioForm.patchValue({ 
                    Pais: espana.id,
                    Nacionalidad: espana.id
                    });
                }
                }
            },
            error: (err) => console.error('Error al cargar nacionalidades:', err)
        });

        // Provincias
        this.auxSocioService.getProvincias().subscribe({
            next: (response) => {
                this.provincias = response.data;
            },
            error: (err) => console.error('Error al cargar provincias:', err)
        });

        // Municipios (todos inicialmente)
        this.auxSocioService.getMunicipios().subscribe({
            next: (response) => {
                this.municipios = response.data;
            },
            error: (err) => console.error('Error al cargar municipios:', err)
        });

        // Formas de pago
        this.auxSocioService.getFormasPago().subscribe({
            next: (response) => {
                this.formasPago = response.data;
                // Establecer Banco por defecto
                if (!this.isUpdateMode) {
                    this.socioForm.patchValue({ formaPago: 1 });
                }
            },
            error: (err) => console.error('Error al cargar formas de pago:', err)
        });
    }

    loadMunicipiosPorProvincia(provinciaId: number): void {
        this.auxSocioService.getMunicipios(provinciaId).subscribe({
            next: (response) => {
                this.municipiosFiltrados = response.data;
            },
            error: (err) => console.error('Error al cargar municipios:', err)
        });
    }

    loadSocio(id: number): void {
        this.socioService.getSocioById(id).subscribe({
            next: (response) => {
                const socio = response.data;
                console.log('Socio cargado:', socio);
                
                // Cargar municipios antes de hacer patchValue
                if (socio.Provincia) {
                    this.loadMunicipiosPorProvincia(socio.Provincia);
                }

                // Separar IBAN en partes si tiene
                if (socio.IBAN) {
                    this.separarIBAN(socio.IBAN);
                }
                
                // Rellenamos el formulario
                this.socioForm.patchValue({
                    // Datos personales
                    Nombre: socio.Nombre,
                    Apellidos: socio.Apellidos,
                    DNI: socio.DNI,
                    Movil: socio.Movil,
                    Email: socio.Email,
                    Talla: socio.Talla,
                    Sexo: socio.Sexo,
                    FNac: socio.FNac ? socio.FNac.split('T')[0] : '',
                
                    // Dirección
                    Direccion: socio.Direccion,
                    CP: socio.CP,
                    Provincia: socio.Provincia,
                    Poblacion: socio.Poblacion,
                    Pais: socio.Pais,
                    Nacionalidad: socio.Nacionalidad,
                
                    // Datos bancarios
                    IBAN: socio.IBAN || '',
                    BIC: socio.BIC || '',
                
                    // Datos de alta (si existe)
                    fk_tipoSocio: socio.alta?.fk_tipoSocio || '',
                    fecha_alta: socio.alta?.fecha_alta ? socio.alta.fecha_alta.split('T')[0] : '',
                    n_carnet: socio.alta?.n_carnet || 0,
                    sin_correspondencia: socio.alta?.sin_correspondencia || false,
                    c_carta: socio.alta?.c_carta || true,
                    c_email: socio.alta?.c_email || true,
                    formaPago: socio.alta?.formaPago || '',
                    fichaMadrid: socio.alta?.fichaMadrid || true
                });
            },
            error: (err) => {
                console.error('Error al cargar socio:', err);
                this.toast.error('Error al cargar los datos del socio');
                this.router.navigate(['/socios/list']);
            }
        });
    }

    grabar(): void {
        if (this.socioForm.invalid) {
            this.socioForm.markAllAsTouched();// para marcar como touched los controles del form
            this.toast.error('Por favor completa todos los campos obligatorios');
            return;
        }

        if (this.ibanParte1 || this.ibanParte2 || this.ibanParte3 || this.ibanParte4 || this.ibanParte5 || this.ibanParte6) {
            if (!this.ibanValido) {
                this.toast.error('El IBAN es inválido o está incompleto');
                return;
            }
        }

        this.isLoading = true;
        const formData = this.socioForm.value as CrearSocioDTO;

        if (formData.fecha_alta) {
            formData.fecha_alta = this.agregarHoraActual(formData.fecha_alta);
        }

        if (this.isUpdateMode && this.socioId) {
            // Actualizar
            this.socioService.updateSocio(this.socioId, formData).subscribe({
                next: () => {
                    this.toast.success('Socio actualizado correctamente');
                    this.router.navigate(['/socios/list']);
                },
                error: (err) => {
                    console.error('Error al actualizar:', err);
                    this.toast.error(err.error?.message || 'Error al actualizar el socio');
                    this.isLoading = false;
                }
            });
        } else {
            // Crear
            this.socioService.createSocio(formData).subscribe({
                next: () => {
                    this.toast.success('Socio creado correctamente');
                    this.router.navigate(['/socios/list']);
                },
                error: (err) => {
                    console.error('Error al crear:', err);
                    this.toast.error(err.error?.message || 'Error al crear el socio');
                    this.isLoading = false;
                }
            });
        }
    }

    cancelar(): void {
        if (confirm('¿Está seguro de cancelar? Los cambios no se guardarán.')) {
            this.router.navigate(['/socios/list']);
        }
    }

    // Getters para validaciones y no tener que escribir todo.
    get f() {
        return this.socioForm.controls;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.socioForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getErrorMessage(fieldName: string): string {
        const field = this.socioForm.get(fieldName);

        if (!field || !field.errors) return '';

        if (field.errors['required']) return 'Este campo es obligatorio';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
        if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
        if (field.errors['email']) return 'Email inválido';
        if (field.errors['pattern']) {
        if (fieldName === 'DNI') return 'Formato DNI inválido (ej: 12345678A)';
        if (fieldName === 'Movil') return 'Teléfono inválido (debe empezar por 6 o 7)';
        if (fieldName === 'CP') return 'Código postal inválido (5 dígitos)';
        if (fieldName === 'IBAN') return 'IBAN inválido (ej: ES1234567890123456789012)';
        }
        
        return 'Campo inválido';
    }

    // Separar un IBAN completo en 6 partes     
    separarIBAN(iban: string): void {
        // Limpiar el IBAN de espacios
        iban = iban.replace(/\s/g, '');
        
        if (iban.length === 24) {
            this.ibanParte1 = iban.substring(0, 4);   // ES12
            this.ibanParte2 = iban.substring(4, 8);   // 3456
            this.ibanParte3 = iban.substring(8, 12);  // 7890
            this.ibanParte4 = iban.substring(12, 16); // 1234
            this.ibanParte5 = iban.substring(16, 20); // 5678
            this.ibanParte6 = iban.substring(20, 24); // 9012
            
            this.validarIBANCompleto();
        }
    }

    //  Manejar el input de cada parte del IBAN
    onIbanInput(parte: number, event: any): void {
        const input = event.target as HTMLInputElement;
        let valor = input.value.toUpperCase();
        
        // Limitar a 4 caracteres
        if (valor.length > 4) {
            valor = valor.substring(0, 4);
        }
        
        // Asignar a la parte correspondiente
        switch(parte) {
            case 1:
                // Primera parte debe empezar con ES
                if (valor.length >= 2 && !valor.startsWith('ES')) {
                    valor = 'ES' + valor.substring(2);
                }
                this.ibanParte1 = valor;
            break;
            case 2:
                this.ibanParte2 = valor;
            break;
            case 3:
                this.ibanParte3 = valor;
            break;
            case 4:
                this.ibanParte4 = valor;
            break;
            case 5:
                this.ibanParte5 = valor;
            break;
            case 6:
                this.ibanParte6 = valor;
            break;
        }
        
        // Actualizar el input
        input.value = valor;
        
        // Si tiene 4 caracteres pasa al otro input
        if (valor.length === 4 && parte < 6) {
            const nextInput = document.getElementById(`iban-parte-${parte + 1}`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
        
        // Validar IBAN completo cuando se completen todas las partes
        if (this.ibanParte1.length === 4 && this.ibanParte2.length === 4 && this.ibanParte3.length === 4 && 
            this.ibanParte4.length === 4 && this.ibanParte5.length === 4 && this.ibanParte6.length === 4) {
            this.validarIBANCompleto();
        } else {
            this.ibanValido = false;
            this.ibanError = '';
        }
    }

    //  Manejar teclas especiales (backspace, flechas)
    onIbanKeydown(parte: number, event: KeyboardEvent): void {
        const input = event.target as HTMLInputElement;
        
        // Si presiona backspace en un input vacío, ir al anterior
        if (event.key === 'Backspace' && input.value.length === 0 && parte > 1) {
            event.preventDefault();
            const prevInput = document.getElementById(`iban-parte-${parte - 1}`) as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
                // Ponemos el cursor al final
                prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
            }
        }
        
        // Flechas izquierda/derecha para navegar entre inputs
        if (event.key === 'ArrowLeft' && input.selectionStart === 0 && parte > 1) {
            const prevInput = document.getElementById(`iban-parte-${parte - 1}`) as HTMLInputElement;
            if (prevInput) {
                prevInput.focus();
                prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
            }
        }
        
        if (event.key === 'ArrowRight' && input.selectionStart === input.value.length && parte < 6) {
            const nextInput = document.getElementById(`iban-parte-${parte + 1}`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
                nextInput.setSelectionRange(0, 0);
            }
        }
    }

    // Validar IBAN completo usando el algoritmo de validación
    validarIBANCompleto(): void {
        const ibanCompleto = this.ibanParte1 + this.ibanParte2 + this.ibanParte3 + this.ibanParte4 + this.ibanParte5 + this.ibanParte6;
        
        // Validar que tenga 24 caracteres
        if (ibanCompleto.length !== 24) {
            this.ibanValido = false;
            this.ibanError = 'El IBAN debe tener 24 caracteres';
            // Limpiar el IBAN del formulario
            this.socioForm.patchValue({ IBAN: '' });
            return;
        }
        
        // Validar que empiece con ES
        if (!ibanCompleto.startsWith('ES')) {
            this.ibanValido = false;
            this.ibanError = 'El IBAN debe empezar con ES';
            // Limpiar el IBAN del formulario
            this.socioForm.patchValue({ IBAN: '' });
            return;
        }
        
        // Algoritmo de validación IBAN (Módulo 97)
        if (this.validarIBANModulo97(ibanCompleto)) {
            this.ibanValido = true;
            this.ibanError = '';
            
            // ACTUALIZAMOS EL CAMPO DEL FORMULARIO
            this.socioForm.patchValue({
                IBAN: ibanCompleto
            });
            
            console.log('IBAN válido guardado en el formulario:', ibanCompleto);
            
            // Buscar BIC automáticamente
            this.buscarBIC(ibanCompleto);
            
        } else {
            this.ibanValido = false;
            this.ibanError = 'IBAN inválido. Verifica los dígitos de control.';
            
            // Limpiar el IBAN del formulario
            this.socioForm.patchValue({
                IBAN: ''
            });
        }
        }

    // Validar IBAN usando el algoritmo Módulo 97
    validarIBANModulo97(iban: string): boolean {
        // Mover los 4 primeros caracteres al final
        const reordenado = iban.substring(4) + iban.substring(0, 4);
        
        // Reemplazar letras por números (A=10, B=11, ..., Z=35)
        let numerico = '';
        for (let i = 0; i < reordenado.length; i++) {
            const char = reordenado[i];
            if (char >= 'A' && char <= 'Z') {
                numerico += (char.charCodeAt(0) - 55).toString();
            } else {
                numerico += char;
            }
        }
        
        // Calcular módulo 97
        let resto = 0;
        for (let i = 0; i < numerico.length; i++) {
            resto = (resto * 10 + parseInt(numerico[i])) % 97;
        }
        
        return resto === 1;
    }


    buscarBIC(iban: string): void {
        // Los caracteres 5-8 del IBAN español son el código de entidad
        const codigoEntidad = iban.substring(4, 8);
        
        // Diccionario básico de BICs comunes en España
        const bicsPorEntidad: { [key: string]: string } = {
        '2100': 'CAIXESBBXXX', // CaixaBank
        '0049': 'BSCHESMMXXX', // Banco Santander
        '0128': 'BKBKESMMXXX', // Bankinter
        '0182': 'BBVAESMMXXX', // BBVA
        '0081': 'BSABESBBXXX', // Banco Sabadell
        '0073': 'OPENESMMXXX', // Open Bank
        '1465': 'INGDESMMXXX', // ING
        '0238': 'PASCESMMXXX', // Banco Pastor
        '0030': 'ESPCESMMXXX', // Banco Español de Crédito
        '2038': 'CAHMESMMXXX', // Bankia (ahora CaixaBank)
        '0075': 'POPUESMMXXX', // Banco Popular (ahora Santander)
        };
        
        const bic = bicsPorEntidad[codigoEntidad];
        
        if (bic) {
            this.socioForm.patchValue({
                BIC: bic
            });
            this.toast.success(`BIC detectado automáticamente: ${bic}`);
        } else this.toast.error(`No se encontró BIC para el código de entidad: ${codigoEntidad}`);
    }


    limpiarIBAN(): void {
        this.ibanParte1 = '';
        this.ibanParte2 = '';
        this.ibanParte3 = '';
        this.ibanParte4 = '';
        this.ibanParte5 = '';
        this.ibanParte6 = '';
        this.ibanValido = false;
        this.ibanError = '';

        this.socioForm.patchValue({
            IBAN: '',
            BIC: ''
        });

        const firstInput = document.getElementById('iban-parte-1') as HTMLInputElement;
        if (firstInput) {
            firstInput.focus();
        }
    }

    limpiarBIC(): void {
        this.socioForm.patchValue({
            BIC: ''
        });
    }
}
