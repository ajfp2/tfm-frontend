import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CargoDirectivoResponse, CargosDirectivosResponse, CreateCargoDirectivoDTO, UpdateCargoDirectivoDTO } from '../models/junta-directiva.model';

@Injectable({
  providedIn: 'root'
})
export class CargosDirectivoService {

    private apiUrl = `${environment.api_url}/junta-directiva`;

    constructor(private http: HttpClient) { }

    // Obtener todos los tipos cargos 
    getCargos(): Observable<CargosDirectivosResponse> {
        return this.http.get<CargosDirectivosResponse>(this.apiUrl);
    }

    // Obtener los cargos
    getCargosActivos(): Observable<CargosDirectivosResponse> {        
        return this.http.get<CargosDirectivosResponse>(`${this.apiUrl}/activos`);
    }

    // Obtener un cargo
    getCargoById(id: number): Observable<CargoDirectivoResponse> {
        return this.http.get<CargoDirectivoResponse>(`${this.apiUrl}/${id}`);
    }

    // Crear un cargo
    createCargo(data: CreateCargoDirectivoDTO): Observable<CargoDirectivoResponse> {
        return this.http.post<CargoDirectivoResponse>(this.apiUrl, data);
    }

    // Actualizar un cargo
    updateCargo(id: number, data: UpdateCargoDirectivoDTO): Observable<CargoDirectivoResponse> {
        return this.http.put<CargoDirectivoResponse>(`${this.apiUrl}/${id}`, data);
    }

    // Eliminar un cargo
    deleteCargo(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}
