import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionResponse, AsignarCargoDTO, EliminarAsignacionDTO, HistorialCargosResponse } from '../models/junta-directiva.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialCargoService {

    private apiUrl = `${environment.api_url}/historial-cargos`;

    constructor(private http: HttpClient) { }

    getHistorial(temporadaId?: number): Observable<HistorialCargosResponse> {
        let params = new HttpParams();
        
        if (temporadaId) {
        params = params.set('temporada_id', temporadaId.toString());
        }
        
        return this.http.get<HistorialCargosResponse>(this.apiUrl, { params });
    }

    getJuntaPorTemporada(temporadaId: number): Observable<HistorialCargosResponse> {
        return this.http.get<HistorialCargosResponse>(`${this.apiUrl}/temporada/${temporadaId}`);
    }

    asignarCargo(data: AsignarCargoDTO): Observable<AsignacionResponse> {
        return this.http.post<AsignacionResponse>(this.apiUrl, data);
    }

    eliminarAsignacion(data: EliminarAsignacionDTO): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(this.apiUrl, { body: data });
    }

    getHistorialPorSocio(socioId: number): Observable<HistorialCargosResponse> {
        let params = new HttpParams().set('socio_id', socioId.toString());
        return this.http.get<HistorialCargosResponse>(this.apiUrl, { params });
    }
}
