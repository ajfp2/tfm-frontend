import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ContactoCreateDto, ContactoResponse } from '../models/contacto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

    private apiUrl = `${environment.api_url}/contactos`;

    constructor(private http: HttpClient) {}

    // Obtener todos los contactos con búsquedas
    getContactos(search?: string): Observable<ContactoResponse> {
        let params = new HttpParams();
        
        if (search && search.trim() !== '') {
            params = params.set('search', search.trim());
        }
        
        return this.http.get<ContactoResponse>(this.apiUrl, { params });
    }

    // Obtener contacto por ID    
    getContacto(id: number): Observable<ContactoResponse> {
        return this.http.get<ContactoResponse>(`${this.apiUrl}/${id}`);
    }

    // Crear un nuevo contacto
    createContacto(contacto: ContactoCreateDto): Observable<ContactoResponse> {
        return this.http.post<ContactoResponse>(this.apiUrl, contacto);
    }

    // Actualizar un contacto existente
    updateContacto(id: number, contacto: Partial<ContactoCreateDto>): Observable<ContactoResponse> {
        return this.http.put<ContactoResponse>(`${this.apiUrl}/${id}`, contacto);
    }

    // Eliminar un contacto
    deleteContacto(id: number): Observable<ContactoResponse> {
        return this.http.delete<ContactoResponse>(`${this.apiUrl}/${id}`);
    }

    // Valiar CIF: Formato: 1 letra + 8 dígitos
    validarCIF(cif: string): boolean {
        if (!cif || cif.length !== 9) {
            return false;
        }

        // Formato: Letra + 8 números
        const cifRegex = /^[A-Z][0-9]{8}$/;
        if (!cifRegex.test(cif.toUpperCase())) {
            return false;
        }

        // Validación del dígito de control (simplificada)
        const letra = cif.charAt(0).toUpperCase();
        const numeros = cif.substring(1, 9);
        
        // Letras válidas para CIF
        const letrasValidas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'N', 'P', 'Q', 'R', 'S', 'U', 'V', 'W'];
        
        return letrasValidas.includes(letra);
    }

    // Validar IBAN--> Formato español: ES + 2 dígitos + 20 dígitos => 24 total
    validarIBAN(iban: string): boolean {
        if (!iban) {
            return true; 
        }

        // borrar espacios
        const ibanLimpio = iban.replace(/\s/g, '').toUpperCase();

        // Longitud según país (España: 24 caracteres)
        if (ibanLimpio.length !== 24) {
            return false;
        }

        // Formato: 2 letras (país) + 2 dígitos (control) + hasta 30 alfanuméricos
        const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
        if (!ibanRegex.test(ibanLimpio)) {
            return false;
        }

        // Algoritmo de validación de dígitos de control
        // Mover los 4 primeros caracteres al final
        const reordenado = ibanLimpio.substring(4) + ibanLimpio.substring(0, 4);
        
        // Convertir letras a números (A=10, B=11, ..., Z=35)
        let numerico = '';
        for (let i = 0; i < reordenado.length; i++) {
            const char = reordenado.charAt(i);
            if (char >= 'A' && char <= 'Z') {
                numerico += (char.charCodeAt(0) - 55).toString();
            } else {
                numerico += char;
            }
        }
        
        // Calcular módulo 97
        let resto = 0;
        for (let i = 0; i < numerico.length; i++) {
            resto = (resto * 10 + parseInt(numerico.charAt(i))) % 97;
        }
        
        return resto === 1;
    }

    // Formatear IBAN con espacios
    formatearIBAN(iban: string): string {
        if (!iban) return '';
        
        const ibanLimpio = iban.replace(/\s/g, '').toUpperCase();
        
        // Añadir espacios cada 4 caracteres
        return ibanLimpio.match(/.{1,4}/g)?.join(' ') || ibanLimpio;
    }

    // Validar código postal español
    validarCP(cp: string): boolean {
        if (!cp || cp.length !== 5) {
            return false;
        }
        
        // Debe ser 5 dígitos
        const cpRegex = /^[0-9]{5}$/;
        return cpRegex.test(cp);
    }
}
