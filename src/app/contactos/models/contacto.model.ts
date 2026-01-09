// Modelo de Contacto/Proveedor

import { Municipio, Nacionalidad, Provincia } from '../../socios/models/socio.interface';

export interface Contacto {
    id: number;
    nom_emp: string;
    dni_cif: string;
    telefono: number;
    fax?: number;
    email: string;
    direccion: string;
    cp: string;
    poblacion: number;
    provincia: number;
    pais: number;
    contacto?: string;
    IBAN?: string;
    BIC?: string;
    created_at?: string;
    updated_at?: string;
    municipio?: Municipio;
    provincia_relacion?: Provincia;
    pais_relacion?: Nacionalidad;
}

// DTO para CRUD contacto
export interface ContactoCreateDto {
    nom_emp: string;
    dni_cif: string;
    telefono: number;
    fax?: number;
    email: string;
    direccion: string;
    cp: string;
    poblacion: number;
    provincia: number;
    pais: number;
    contacto?: string;
    IBAN?: string;
    BIC?: string;
}

// Respuesta de la API
export interface ContactoResponse {
    code: number;
    message: string;
    data: Contacto | Contacto[];
}

export interface DatosInicialesResponse {
  paises: { data: Nacionalidad[] };
  provincias: { data: Provincia[] }; 
  municipios: { data: Municipio[] };
  contacto?: ContactoResponse;
}