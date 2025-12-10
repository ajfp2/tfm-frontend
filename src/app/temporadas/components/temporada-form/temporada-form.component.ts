import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TemporadasService } from '../../services/temporadas.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-temporada-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './temporada-form.component.html',
  styleUrl: './temporada-form.component.css'
})
export class TemporadaFormComponent implements OnInit{

    temporadaForm!: FormGroup;
    isEditMode: boolean = false;
    idTemp: number | null = null;
    submitted: boolean = false;

    constructor(private ts: TemporadasService, private toast: ToastService, private fb: FormBuilder, private router: Router, private rt: ActivatedRoute) {
        this.crearForm();
    }

    ngOnInit(): void {
        this.rt.params.subscribe(params => {
            if(params['id']){
                this.isEditMode = true;
                this.idTemp = +params['id'];
                this.cargarTemporada(this.idTemp);
            }
        });
    }

    crearForm() {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        
        // Fechas por defecto con hora
        const fechaInicio = new Date(currentYear, 7, 1, 0, 0); // 1 Agosto a las 00:00
        const fechaFin = new Date(nextYear, 6, 31, 23, 59);    // 31 Julio a las 23:59
        
        this.temporadaForm = this.fb.group({
            temporada: [`${currentYear}-${nextYear}`, [Validators.required, Validators.maxLength(50)]],
            abreviatura: [ `${currentYear.toString().slice(-2)}-${nextYear.toString().slice(-2)}`, [Validators.required, Validators.maxLength(5)] ],
            fecha_inicio: [ this.formatearFechas(fechaInicio), [Validators.required] ],
            fecha_fin: [ this.formatearFechas(fechaFin), [Validators.required] ],
            saldo_inicial: [0, [Validators.required, Validators.min(0)] ],
            saldo_final: [0, [Validators.required, Validators.min(0)] ],
            activa: [false],
            cuotaPasada: [false]
        });
    }    

    cargarTemporada(id: number): void {

        this.ts.getTemporada(id).subscribe({
            next: (response) => {
                if (response) {
                    const temporada = response.data;
                
                    // Convertir fechas datetime a formato datetime-local
                    const fechaInicio = temporada.fechaIni ? this.formatearFechas(new Date(temporada.fechaIni)) : '';
                    const fechaFin = temporada.fechaFin ? this.formatearFechas(new Date(temporada.fechaFin)) : '';
                
                    this.temporadaForm.patchValue({
                        temporada: temporada.temporada,
                        abreviatura: temporada.abreviatura,
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin,
                        saldo_inicial: temporada.saldoIni,
                        saldo_final: temporada.saldoFin || 0,
                        activa: temporada.activa,
                        cuotaPasada: temporada.cuotaPasada
                    });
                }
            },
            error: (error) => {
                console.error('Error al cargar temporada:', error);                
                this.toast.error('Error al cargar la temporada');
            }
        });
    }

    grabar(): void {
        this.submitted = true;

        if (this.temporadaForm.invalid) {
            Object.keys(this.temporadaForm.controls).forEach(key => {
                const control = this.temporadaForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
            this.submitted = false;
            return;
        }

        const formData = this.temporadaForm.value;

        const request = this.isEditMode && this.idTemp ? this.ts.updateTemporada(this.idTemp, formData) : this.ts.createTemporada(formData);

        request.subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.toast.success(response.message);
                    this.router.navigate(['/temporadas/list']);
                }
            },
            error: (error) => {
                console.error('Error al guardar temporada:', error);
                this.submitted = false;
                if (error.error?.errors) {
                    // Errores de validación
                    const errores = Object.values(error.error.errors).flat();// aplana el array y crea uno nuevo
                    this.toast.error(errores.join(', ') || 'Error al guardar la temporada');
                } else {
                    this.toast.error(error.error?.message || 'Error al guardar la temporada');
                }
                
            }
        });
    }

    // Para no tener que escribirlo todo 
    get f() { return this.temporadaForm.controls; }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.temporadaForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    getFieldError(fieldName: string): string {
        const field = this.temporadaForm.get(fieldName);
        
        if (field?.hasError('required')) {
            return 'Este campo es obligatorio';
        }
        if (field?.hasError('maxlength')) {
            const maxLength = field.getError('maxlength').requiredLength;
            return `Máximo ${maxLength} caracteres`;
        }
        if (field?.hasError('min')) {
            return 'El valor debe ser mayor o igual a 0';
        }
        
        return '';
    }

    cancelar(): void {
        if (confirm('¿Deseas cancelar? Se perderán los cambios no guardados.')) {
            this.router.navigate(['/temporadas/list']);
        }
    }

    private formatearFechas(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

}
