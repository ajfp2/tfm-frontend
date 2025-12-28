import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PenyaDatosBancarios, PenyaDatosGenerales } from '../models/penya.model';

@Injectable({
  providedIn: 'root'
})
export class PenyaService {

    private apiUrl = `${environment.api_url}/penya`;
    
    constructor(private http: HttpClient) { }

    /**
     * Obtener datos de la peña (único registro)
     */
    getPenya(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    /**
     * Obtener datos de la peña (único registro)
     */
    getPenyaBanco(): Observable<any> {
        return this.http.get<any>(`${ this.apiUrl }/show-banco`);
    }

    /**
     * Actualizar datos generales de la peña
     */
    updateDatosGenerales(datos: PenyaDatosGenerales): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/datos-generales`, datos);
    }

    /**
     * Actualizar datos bancarios de la peña
     */
    updateDatosBancarios(datos: PenyaDatosBancarios): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/datos-bancarios`, datos);
    }
}
