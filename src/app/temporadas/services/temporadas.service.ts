import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Temporada, TemporadaFormData } from '../models/temporada.model';

@Injectable({
  providedIn: 'root'
})
export class TemporadasService {

    private apiUrl = environment.api_url;

    constructor(private http: HttpClient) { }

    /**
     * Obtener todas las temporadas
     */
    getTemporadas(): Observable< { data: Temporada[] } > {
        return this.http.get<{data: Temporada[]}>(`${this.apiUrl}/temporadas`);
    }

    /**
     * Obtener la temporada activa
     */
    getTemporadaActiva(): Observable<any> {
        return this.http.get<{data: Temporada}>(`${this.apiUrl}/temporadas/activa`);
    }

    /**
     * Obtener una temporada por ID
     */
    getTemporada(id: number): Observable<{data: Temporada}> {
        return this.http.get<{data: Temporada}>(`${this.apiUrl}/temporadas/${id}`);
    }

    /**
     * Crear una nueva temporada
     */
    createTemporada(temporada: TemporadaFormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/temporadas`, temporada);
    }

    /**
     * Actualizar una temporada
     */
    updateTemporada(id: number, temporada: TemporadaFormData): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/temporadas/${id}`, temporada);
    }

    /**
     * Eliminar una temporada
     */
    deleteTemporada(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/temporadas/${id}`);
    }

    /**
     * Activar una temporada
     */
    activarTemporada(id: number): Observable<any> {
        return this.http.post<{data: Temporada}>(`${this.apiUrl}/temporadas/${id}/activar`, {});
    }
}
