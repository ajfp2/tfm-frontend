import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contacto, ContactoResponse, DatosInicialesResponse } from '../../models/contacto.model';
import { ContactoService } from '../../services/contacto.service';
import { SociosRealcionesService } from '../../../socios/services/socios-realciones.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Municipio, Nacionalidad, Provincia } from '../../../socios/models/socio.interface';

@Component({
    selector: 'app-contactos-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './contactos-form.component.html',
    styleUrl: './contactos-form.component.css'
})
export class ContactosFormComponent implements OnInit{

    contactoForm!: FormGroup;
    isEditMode = false;
    contactoId: number | null = null;
    submitted = false;

    // Título e icono dinámicos
    title = 'Nuevo Contacto';
    icon = 'bi-plus-circle';

    // Datos auxiliares
    paises: Nacionalidad[] = [];
    provincias: Provincia[] = [];
    municipios: Municipio[] = [];
    municipiosFiltrados: Municipio[] = [];

    // Loading de selects
    loadingDatosAuxiliares = false;

    private contactoTemporal: Contacto | null = null;

    constructor(private fb: FormBuilder, private cs: ContactoService, private sas: SociosRealcionesService, 
        private toast: ToastService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        // Verificar si es modo edición
        const id = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!id;
        this.contactoId = id ? +id : null;

        if (this.isEditMode) {
            this.title = 'Editar Contacto';
            this.icon = 'bi-pencil-square';
        }

        // Inicializamos el form
        this.inicializarFormulario();

        // Cargamos datos auxiliares (selects) y datos contacto en paralelo método forkJOIN
        this.cargarDatosIniciales();
    }

    // Cargar datos auxiliares y contacto en paralelo
    cargarDatosIniciales(): void {
        this.loadingDatosAuxiliares = true;

        // Crear observables para cargar en paralelo con los datos  explicitos para que los response no de error.
        const requests: { 
            paises: Observable<{ data: Nacionalidad[] }>, 
            provincias: Observable<{ data: Provincia[] }>, 
            municipios: Observable<{ data: Municipio[] }>,
            contacto?: Observable<ContactoResponse>
        } = {
            paises: this.sas.getNacionalidades(),
            provincias: this.sas.getProvincias(),
            municipios: this.sas.getMunicipios()
        };

        // Si es modo editarn, también cargo el contacto
        if (this.isEditMode && this.contactoId) {
            requests.contacto = this.cs.getContacto(this.contactoId);
        }        
        /*
        *    NOTA: Combina múltiples observables (como llamadas HTTP) y espera a que todos se completen,
        *    emitiendo un único array con el último valor de cada uno, para luego activarlo y recibir esa respuesta combinada con .subscribe(), 
        *    ideal para obtener datos de varias fuentes en paralelo y manejarlos juntos.
        */
       // TODO: Cambiar en SOCIOS las peticiones combinadas
       // Ejecutar todas las peticiones en paralelo
        forkJoin(requests).subscribe({
            next: (responses: DatosInicialesResponse) => {
                this.paises = responses.paises?.data || [];
                this.provincias = responses.provincias?.data || [];
                this.municipios = responses.municipios?.data || [];

                // Cargar países, elegimos españa por defecto
                if (!this.isEditMode && this.paises.length > 0) {
                    const espana = this.paises.find(p => 
                        p.pais?.toLowerCase() === 'españa' ||
                        p.nacionalidad?.toLowerCase() === 'española'
                    );
                    
                    if (espana) {
                        this.contactoForm.patchValue({ pais: espana.id });
                    }
                }                

                // Si es edición, cargar datos del contacto DESPUÉS de tener los municipios
                if (this.isEditMode && responses.contacto) {
                    if (responses.contacto.code === 200 && !Array.isArray(responses.contacto.data)) {
                        const contacto = responses.contacto.data;
                        this.contactoTemporal = contacto;
                        
                        // Filtrar municipios por provincia
                        if (contacto.provincia) {
                            this.filtrarMunicipiosPorProvincia(contacto.provincia);
                        }

                        // Rellenar formulario
                        this.contactoForm.patchValue({
                            nom_emp: contacto.nom_emp,
                            dni_cif: contacto.dni_cif,
                            telefono: contacto.telefono,
                            fax: contacto.fax || '',
                            email: contacto.email,
                            direccion: contacto.direccion,
                            cp: contacto.cp,
                            poblacion: contacto.poblacion,
                            provincia: contacto.provincia,
                            pais: contacto.pais,
                            contacto: contacto.contacto || '',
                            IBAN: contacto.IBAN || '',
                            BIC: contacto.BIC || ''
                        });
                    }
                }
                this.loadingDatosAuxiliares = false;
            },
            error: (error) => {
                console.error('Error al cargar datos:', error);
                this.toast.error('Error al cargar los datos necesarios');
                
                if (this.isEditMode) {
                    this.router.navigate(['/contactos/list']);
                }
                
                this.loadingDatosAuxiliares = false;
            }
        });
    }

    // Inicializar formulario
    inicializarFormulario(): void {
        this.contactoForm = this.fb.group({
            nom_emp: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
            dni_cif: ['', [Validators.required, Validators.pattern(/^[A-Z][0-9]{8}$/i)]],
            telefono: ['', [Validators.required, Validators.pattern(/^[67][0-9]{8}$/)]],
            fax: ['', [Validators.pattern(/^[89][0-9]{8}$/)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
            direccion: ['', [Validators.required, Validators.maxLength(100)]],
            cp: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
            poblacion: ['', Validators.required],
            provincia: ['', Validators.required],
            pais: ['', Validators.required],
            contacto: ['', [Validators.maxLength(100)]],
            IBAN: ['', [Validators.minLength(24), Validators.maxLength(24), Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/i)]],
            BIC: ['', [Validators.minLength(8), Validators.maxLength(11), Validators.pattern(/^[A-Z0-9]+$/i)]]
        });

        // Listener para filtrar municipios según provincia seleccionada
        this.contactoForm.get('provincia')?.valueChanges.subscribe(provinciaId => {
            if (provinciaId) {
                this.filtrarMunicipiosPorProvincia(+provinciaId);
                
                // Reset municipio solo si NO estamos cargando el contacto inicial
                if (!this.loadingDatosAuxiliares && this.contactoForm.get('poblacion')?.value) {
                    const poblacionActual = this.contactoForm.get('poblacion')?.value;
                    const existeEnFiltrados = this.municipiosFiltrados.some(m => m.id === +poblacionActual);
                
                    if (!existeEnFiltrados) {
                        this.contactoForm.patchValue({ poblacion: '' });
                    }
                }
            }
        });
    }

    // Filtrar municipios por provincia
    filtrarMunicipiosPorProvincia(provinciaId: number): void {
        this.municipiosFiltrados = this.municipios.filter(
            m => m.provincia === provinciaId
        );
    }

    // Guardar contacto    
    guardar(): void {
        this.submitted = true;

        if (this.contactoForm.invalid) {
            this.toast.error('Por favor, completa todos los campos obligatorios');
            this.marcarCamposComoTocados();
            return;
        }

        // Validar CIF
        const cif = this.contactoForm.get('dni_cif')?.value;
        if (!this.cs.validarCIF(cif)) {
            this.toast.error('El CIF no es válido');
            this.contactoForm.get('dni_cif')?.setErrors({ invalidCIF: true });
            return;
        }

        // Validar IBAN si está rellenado
        const iban = this.contactoForm.get('IBAN')?.value;
        if (iban && !this.cs.validarIBAN(iban)) {
            this.toast.error('El IBAN no es válido');
            this.contactoForm.get('IBAN')?.setErrors({ invalidIBAN: true });
            return;
        }

        const formData = this.contactoForm.value;

        // Convertir strings vacíos a null para campos opcionales
        if (!formData.fax) formData.fax = null;
        if (!formData.contacto) formData.contacto = null;
        if (!formData.IBAN) formData.IBAN = null;
        if (!formData.BIC) formData.BIC = null;

        if (this.isEditMode && this.contactoId) {
            this.actualizarContacto(formData);
        } else {
            this.crearContacto(formData);
        }
    }

    // Crear contacto
    private crearContacto(data: any): void {
        this.cs.createContacto(data).subscribe({
            next: (response) => {
                if (response.code === 201 || response.code === 200) {
                    this.toast.success('Contacto creado correctamente');
                    this.router.navigate(['/contactos/list']);
                }
            },
            error: (error) => {
                console.error('Error al crear contacto:', error);
                this.toast.error('Error al crear el contacto');
                this.mostrarErroresValidacion(error);
            }
        });
    }

    // Actualizar contacto
    private actualizarContacto(data: any): void {
        this.cs.updateContacto(this.contactoId!, data).subscribe({
            next: (response) => {
                if (response.code === 200) {
                    this.toast.success('Contacto actualizado correctamente');
                    this.router.navigate(['/contactos-list']);
                }
            },
            error: (error) => {
                console.error('Error al actualizar contacto:', error);
                this.toast.error('Error al actualizar el contacto');
                this.mostrarErroresValidacion(error);
            }
        });
    }

    // Mostrar errores de validación del backend
    private mostrarErroresValidacion(error: any): void {
        if (error.error?.errors) {
            Object.keys(error.error.errors).forEach(field => {
                const messages = error.error.errors[field];
                if (Array.isArray(messages) && messages.length > 0) {
                    this.toast.error(`${field}: ${messages[0]}`);
                }
            });
        }
    }

    // Marcar todos los campos como tocados para mostrar errores
    private marcarCamposComoTocados(): void {
        Object.keys(this.contactoForm.controls).forEach(key => {
            this.contactoForm.get(key)?.markAsTouched();
        });
    }

    //Cancelar y volver
    cancelar(): void {
        if (this.contactoForm.dirty) {
            if (confirm('¿Descartar los cambios realizados?')) {
                this.router.navigate(['/contactos/list']);
            }
        } else {
            this.router.navigate(['/contactos/list']);
        }
    }

    // Verificar si un campo tiene error
    tieneError(campo: string, error: string): boolean {
        const control = this.contactoForm.get(campo);
        return !!(control?.hasError(error) && (control?.touched || this.submitted));
    }

    // Obtener clase CSS para loos campos
    getClaseCampo(campo: string): string {
        const control = this.contactoForm.get(campo);
        if (!control) return '';

        if (this.submitted || control.touched) {
            return control.invalid ? 'is-invalid' : (control.valid ? 'is-valid' : '');
        }
        return '';
    }

    // Formatear IBAN mientras se escribe
    formatearIBAN(event: any): void {
        const input = event.target as HTMLInputElement;
        let valor = input.value.replace(/\s/g, '').toUpperCase();
        
        // Formatear con espacios cada 4 caracteres
        if (valor.length > 0) {
            valor = valor.match(/.{1,4}/g)?.join(' ') || valor;
        }
        
        this.contactoForm.patchValue({ IBAN: valor }, { emitEvent: false });
        input.value = valor;
    }

    // Formatear teléfono mientras se escribe
    formatearTelefono(campo: string, event: any): void {
        const input = event.target as HTMLInputElement;
        let valor = input.value.replace(/\s/g, '');
        
        // Formatear: XXX XXX XXX
        if (valor.length > 3 && valor.length <= 6) {
            valor = valor.substring(0, 3) + ' ' + valor.substring(3);
        } else if (valor.length > 6) {
            valor = valor.substring(0, 3) + ' ' + valor.substring(3, 6) + ' ' + valor.substring(6, 9);
        }
        
        input.value = valor;
    }

}
