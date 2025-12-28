import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearSocioDTO, DarBajaDTO, SocioDeudor, SocioPersona } from '../models/socio.interface';

@Injectable({
  providedIn: 'root'
})
export class SociosService {

    private apiUrl = environment.api_url;
    
    constructor(private http: HttpClient) { }

    /**
     * Listar socios
     * @param tipo 'activos' | 'bajas' | 'todos'
     * @param search Buscar por nombre/apellidos/DNI
     * @param tipoSocio Filtrar por tipo de socio
    */
    getSocios(tipo: string = 'activos', search?: string, tipoSocio?: number): Observable<{ data: SocioPersona[] }> {
        let params = new HttpParams().set('tipo', tipo);
        
        if (search) {
            params = params.set('search', search);
        }        
        if (tipoSocio) {
            params = params.set('tipo_socio', tipoSocio.toString());
        }
        
        return this.http.get<{ data: SocioPersona[] }>(`${this.apiUrl}/socios`, { params });
    }

    /*
     * Obtenemos los socios exentos de pago
    */
    getSociosExentos(): Observable<{ data: SocioPersona[] }> {
        return this.http.get<{ data: SocioPersona[] }>(`${this.apiUrl}/socios/exentos`);
    }

    /**
     * Listar socios DEUDORES
     * @param tipo 'activos' | 'bajas' | 'todos'
     * @param search Buscar por nombre/apellidos/DNI
     * @param tipoSocio Filtrar por tipo de socio
    */
    getSociosDeudores(tipo: string = 'activas', search?: string, tipoSocio?: number): Observable<{ data: SocioDeudor[] }> {
        let params = new HttpParams().set('tipo', tipo);
        
        // if (search) {
        //     params = params.set('search', search);
        // }        
        // if (tipoSocio) {
        //     params = params.set('tipo_socio', tipoSocio.toString());
        // }
        
        return this.http.get<{ data: SocioDeudor[] }>(`${this.apiUrl}/socios/deudores`, { params });
    }

    /**
     * Obtener un socio por Id
    */
    getSocioById(id: number): Observable<{ data: SocioPersona }> {
        return this.http.get<{ data: SocioPersona }>(`${this.apiUrl}/socios/${id}`);
    }

    /**
     * Obtener un socio con su deuda, si la tiene, por Id
    */
    getDeudaSocio(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/socios/${id}/deudas`);
    }
    
    /**
     * Crear socio completo (persona + alta)
    */
    createSocio(socio: CrearSocioDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/socios`, socio);
    }

    /**
     * Actualizar socio
    */
    updateSocio(id: number, socio: Partial<CrearSocioDTO>): Observable<any> {
        return this.http.put(`${this.apiUrl}/socios/${id}`, socio);
    }

    /**
     * Dar de baja a un socio
    */
    darBaja(id: number, datosBaja: DarBajaDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/socios/${id}/baja`, datosBaja);
    }

    /**
     * Reactivar socio
    */
    reactivarSocio(id: number, fechaAlta: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/socios/${id}/reactivar`, { fecha_alta: fechaAlta });
    }

    /**
     * Eliminar socio definitivamente
    */
    deleteSocio(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/socios/${id}`);
    }
}
