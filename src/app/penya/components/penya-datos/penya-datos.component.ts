import { Component, OnInit } from '@angular/core';
import { Penya } from '../../models/penya.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PenyaService } from '../../services/penya.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-penya-datos',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './penya-datos.component.html',
  styleUrl: './penya-datos.component.css'
})
export class PenyaDatosComponent implements OnInit{

    form: FormGroup;
    penya: Penya | null = null;
    guardando: boolean = false;

    constructor(private ps: PenyaService, private toast: ToastService, private fb: FormBuilder) {
        this.form = this.fb.group({
            nombre: ['', [Validators.required, Validators.maxLength(255)]],
            cif: ['', [Validators.maxLength(20)]],
            direccion: ['', [Validators.maxLength(255)]],
            CP: ['', [Validators.maxLength(10)]],            
            localidad: ['', [Validators.maxLength(100)]],
            provincia: ['', [Validators.maxLength(100)]],
            telefono: ['', [Validators.maxLength(20)]],
            email: ['', [Validators.email, Validators.maxLength(255)]],            
            fecha_alta: [''],
            sede_social: ['', [Validators.maxLength(255)]],
            direccion_sede: ['', [Validators.maxLength(255)]],
            tel_sede: ['', [Validators.maxLength(255)]]
        });
    }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.ps.getPenya().subscribe({
            next: (response) => {
                console.log(response);
                
                if (response.code == 200 && response.data) {
                    
                    this.penya = response.data;
                    if(this.penya){
                        this.form.patchValue({
                            nombre: this.penya.nombre || '',
                            cif: this.penya.cif || '',
                            direccion: this.penya.direccion || '',
                            CP: this.penya.CP || '',
                            localidad: this.penya.localidad || '',
                            provincia: this.penya.provincia || '',
                            telefono: this.penya.telefono || '',
                            email: this.penya.email || '',
                            fecha_alta: this.penya.fecha_alta ? this.penya.fecha_alta.split('T')[0] : '',
                            sede_social: this.penya.sede_social || '',
                            tel_sede: this.penya.tel_sede || '',
                            direccion_sede: this.penya.direccion_sede || ''
                        });
                    }
                }
            },
            error: (error) => {
                console.error('Error al cargar datos:', error);
                this.toast.error('Error al cargar los datos de la peña');
            }
        });
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.guardando = true;

        this.ps.updateDatosGenerales(this.form.value).subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.penya = response.data;
                    this.toast.success('Datos actualizados correctamente');                
                }
                this.guardando = false;
            },
            error: (error) => {
                console.error('Error al guardar:', error);
                this.toast.error(error.error?.message || 'Error al actualizar los datos');
                this.guardando = false;
            }
        });
    }

    cancelar(): void {
        this.cargarDatos();
    }

    // Helper methods para validación
    isFieldInvalid(fieldName: string): boolean {
        const field = this.form.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.form.get(fieldName);
        if (field?.errors) {
        if (field.errors['required']) return 'Este campo es obligatorio';
        if (field.errors['email']) return 'Email no válido';
        if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
        }
        return '';
    }

}
