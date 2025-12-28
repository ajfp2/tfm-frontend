import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PenyaService } from '../../services/penya.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Penya } from '../../models/penya.model';

@Component({
  selector: 'app-penya-banco',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './penya-banco.component.html',
  styleUrl: './penya-banco.component.css'
})
export class PenyaBancoComponent implements OnInit{

    form: FormGroup;
    penya: Penya | null = null;
    guardando: boolean = false;

    ibanValido: boolean | null = null;
    bicDetectado: string = '';

    constructor(private ps: PenyaService, private toast: ToastService, private fb: FormBuilder) {
        this.form = this.fb.group({
            nombre_banco: ['', [Validators.maxLength(255)]],
            user_banco: ['', [Validators.maxLength(100)]],
            pwd_banco: ['', [Validators.maxLength(255)]],
            tarjeta_claves: ['', [Validators.maxLength(25)]],
            iban: ['', [Validators.required, Validators.maxLength(34)]],
            bic: ['', [Validators.maxLength(11)]],
            digitos_control: ['', [Validators.maxLength(4)]],
            sufijo: ['', [Validators.maxLength(3)]]
        });

        // Para validar iban
        this.form.get('iban')?.valueChanges.subscribe(value => {
            if (value) {
                this.validarIban(value);
                this.detectarBIC(value);
            } else {
                this.ibanValido = null;
                this.bicDetectado = '';
            }
        });
    }

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.ps.getPenyaBanco().subscribe({
            next: (response) => {
                if (response.code == 200 && response.data) {
                    this.penya = response.data;
                    if(this.penya){
                        console.log(this.penya);
                        
                        this.form.patchValue({
                            nombre_banco: this.penya.nombre_banco || '',
                            user_banco: this.penya.user_banco || '',
                            pwd_banco: ('pwd_banco' in this.penya) ? this.penya.pwd_banco : '',
                            tarjeta_claves: this.penya.tarjeta_claves || '',
                            iban: this.formatearIban(this.penya.iban || ''),
                            bic: this.penya.bic || '',
                            digitos_control: this.penya.digitos_control || '',
                            sufijo: this.penya.sufijo || '',                            
                        });
                    
                        // Validar IBAN cargado
                        if (this.penya.iban) {
                            this.validarIban(this.penya.iban);
                            this.detectarBIC(this.penya.iban);
                        }
                    }
                }
            },
            error: (error) => {
                console.error('Error al cargar datos:', error);
                this.toast.error('Error al cargar los datos bancarios');
            }
        });
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // Verificar que el IBAN sea válido
        if (!this.ibanValido) {
            this.toast.error('El IBAN no es válido. Por favor, verifica los datos.');
            return;
        }

        this.guardando = true;

        // Limpiar espacios del IBAN antes de enviar
        const datosEnviar = {
            ...this.form.value,
            iban: this.form.value.iban.replace(/\s/g, '')
        };

        this.ps.updateDatosBancarios(datosEnviar).subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.penya = response.data;
                    this.toast.success('Datos bancarios actualizados correctamente');                                
                }
                this.guardando = false;
            },
            error: (error) => {
                console.error('Error al guardar:', error);
                this.toast.error(error.error?.message || 'Error al actualizar los datos bancarios');
                this.guardando = false;
            }
        });
    }

    cancelar(): void {
        this.cargarDatos();
    }

    /**
     * Validar IBAN con Módulo 97
    */
    validarIban(iban: string): void {
        const ibanLimpio = iban.replace(/\s/g, '');
        
        if (ibanLimpio.length < 15) {
            this.ibanValido = false;
            return;
        }

        // Mover los 4 primeros caracteres al final
        const ibanReordenado = ibanLimpio.substring(4) + ibanLimpio.substring(0, 4);
        // Convertir letras a números (A=10, B=11, ..., Z=35)
        let ibanNumerico = '';
        for (let i = 0; i < ibanReordenado.length; i++) {
            const char = ibanReordenado[i];
            if (/[A-Z]/.test(char)) {
                ibanNumerico += (char.charCodeAt(0) - 55).toString();
            } else {
                ibanNumerico += char;
            }
        }
        // Calcular módulo 97
        this.ibanValido = this.mod97(ibanNumerico) === 1;
    }

    /**
     * Calcular módulo 97 para números grandes
     */
    private mod97(numero: string): number {
        let resto = 0;
        for (let i = 0; i < numero.length; i++) {
            resto = (resto * 10 + parseInt(numero[i])) % 97;
        }
        return resto;
    }

    /**
    * Detectar BIC según código de país del IBAN
    */
    detectarBIC(iban: string): void {
        const ibanLimpio = iban.replace(/\s/g, '');
        
        if (ibanLimpio.length < 4) {
            this.bicDetectado = '';
            return;
        }

        const codigoPais = ibanLimpio.substring(0, 2);
        const entidad = ibanLimpio.substring(4, 8);

        // Diccionario de BICs comunes en España
        const bicsEspana: { [key: string]: string } = {
            '2100': 'CAIXESBBXXX', // CaixaBank
            '0182': 'BBVAESMMXXX', // BBVA
            '0049': 'BSCHESMMXXX', // Banco Santander
            '0081': 'BSABESBBXXX', // Banco Sabadell
            '0128': 'BKBKESMMXXX', // Bankinter
            '0075': 'POPUESMMXXX', // Banco Popular (Santander)
            '3058': 'CCRIES2AXXX', // Cajamar
            '0030': 'ESPCESMMXXX', // Banco de España
            '2038': 'CAHMESMMXXX', // Bankia (CaixaBank)
        };

        if (codigoPais === 'ES' && bicsEspana[entidad]) {
            this.bicDetectado = bicsEspana[entidad];
            if (!this.form.value.bic_swift) {
                this.form.patchValue({ bic_swift: this.bicDetectado });
            }
        } else {
            this.bicDetectado = '';
        }
    }

    /**
   * Formatear IBAN con espacios cada 4 caracteres
   */
    formatearIban(iban: string): string {
        if (!iban) return '';
        const ibanLimpio = iban.replace(/\s/g, '');
        return ibanLimpio.match(/.{1,4}/g)?.join(' ') || ibanLimpio;
    }

    /**
     * Formatear IBAN mientras se escribe
     */
    onIbanInput(event: any): void {
        let valor = event.target.value.replace(/\s/g, '').toUpperCase();
        const valorFormateado = this.formatearIban(valor);
        this.form.patchValue({ iban: valorFormateado }, { emitEvent: false });
    }

    /**
    * Obtener código de entidad del IBAN (sin espacios)
    */
    getCodigoEntidad(): string {
        const iban = this.form.value.iban;
        if (!iban || iban.length < 8) return '--';
        return iban.substring(4, 8).replace(/\s/g, '');
    }

    /**
     * Obtener código de país del IBAN
     */
    getCodigoPais(): string {
        const iban = this.form.value.iban;
        if (!iban || iban.length < 2) return '--';
        return iban.substring(0, 2);
    }

    /**
     * Obtener dígitos de control del IBAN
     */
    getDigitosControl(): string {
        const iban = this.form.value.iban;
        if (!iban || iban.length < 4) return '--';
        return iban.substring(2, 4);
    }


    isFieldInvalid(fieldName: string): boolean {
        const field = this.form.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.form.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) return 'Este campo es obligatorio';
            if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
        }
        return '';
    }

}
