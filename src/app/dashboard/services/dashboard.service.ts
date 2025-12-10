import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    private apiUrl = environment.api_url + '/dashboard';

    constructor(private http: HttpClient) { }

    /**
     * Obtener estadísticas generales del dashboard
    */
    getEstadisticas(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    /**
     * Obtener evolución de altas/bajas por meses
     * @param meses Número de meses hacia atrás (por defecto 12)
    */
    getEvolucion(meses: number = 12): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/evolucion`, {
        params: { meses: meses.toString() }
        });
    }

    /**
     * Obtener estadísticas por tipo de socio
    */
    getTiposSocio(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/tipos-socio`);
    }

    /**
     * Obtener saldos de las últimas N temporadas
     * @param limit Número de temporadas (por defecto 5)
    */
    getSaldosTemporadas(limit: number = 5): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/saldos-temporadas`, {
            params: { limit: limit.toString() }
        });
    }
}
