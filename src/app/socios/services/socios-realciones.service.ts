import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormaPago, Municipio, Nacionalidad, Provincia, TipoSocio } from '../models/socio.interface';

@Injectable({
  providedIn: 'root'
})
export class SociosRealcionesService {

    private apiUrl = environment.api_url;

    constructor(private http: HttpClient) { }

    // Nacionalidades Tabla
    getNacionalidades(): Observable<{ data: Nacionalidad[] }> {
        return this.http.get<{ data: Nacionalidad[] }>(`${this.apiUrl}/nacionalidades`);
    }

    // Provincias
    getProvincias(): Observable<{ data: Provincia[] }> {
        return this.http.get<{ data: Provincia[] }>(`${this.apiUrl}/provincias`);
    }

    // Municipios Tabla
    getMunicipios(provinciaId?: number): Observable<{ data: Municipio[] }> {
        const url = provinciaId 
        ? `${this.apiUrl}/municipios?provincia_id=${provinciaId}`
        : `${this.apiUrl}/municipios`;
        return this.http.get<{ data: Municipio[] }>(url);
    }

    // Formas de pago Tabla
    getFormasPago(): Observable<{ data: FormaPago[] }> {
        return this.http.get<{ data: FormaPago[] }>(`${this.apiUrl}/formas-pago`);
    }

    // Tipos de socio Tabla
    getTiposSocio(): Observable<{ data: TipoSocio[] }> {
        return this.http.get<{ data: TipoSocio[] }>(`${this.apiUrl}/tipos-socio`);
    }
}
