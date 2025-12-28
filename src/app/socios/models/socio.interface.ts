export interface SocioPersona {
    Id_Persona?: number;
    Nombre: string;
    Apellidos: string;
    DNI: string;
    Movil?: string;
    Email?: string;
    Talla?: string;
    Sexo?: 'H' | 'M' | 'Otro';
    FNac?: string;
    Direccion?: string;
    CP?: string;
    Poblacion?: number;
    Provincia?: number;
    Pais?: number;
    Nacionalidad?: number;
    IBAN?: string;
    BIC?: string;
    
    // Relaciones a otras tablas
    municipio?: Municipio;
    provincia?: Provincia;
    pais?: Nacionalidad;
    nacionalidad?: Nacionalidad;
    alta?: SocioAlta;
    baja?: SocioBaja;
}

export interface SocioAlta {
    a_Persona: number;
    nsocio: number;
    fk_tipoSocio: number;
    fecha_alta: string;
    n_carnet?: number;
    sin_correspondencia: boolean;
    c_carta: boolean;
    c_email: boolean;
    formaPago: number;
    fichaMadrid: boolean;
    
    // Relaciones a otras tablas
    tipo_socio?: TipoSocio;
    formaPago_rel?: FormaPago;
}

export interface SocioBaja {
    a_Persona: number;
    nsocio: number;
    fk_tipoSocio: number;
    fecha_alta: string;
    fecha_baja: string;
    motivo_baja: string;
    deudor: boolean;
    deuda: number;
    n_carnet?: number;
    sin_correspondencia: boolean;
    c_carta: boolean;
    c_email: boolean;
    formaPago: number;
    fichaMadrid: boolean;
    
    // Relaciones a otras tablas
    tipo_socio?: TipoSocio;
    formaPago_rel?: FormaPago;
}

export interface TipoSocio {
    id_tipo: number;
    tipo: string;
    descripcion: string;
    exentos_pago: boolean;
}

export interface Nacionalidad {
    id: number;
    pais: string;
    nacionalidad: string;
    codigo?: string;
}

export interface Provincia {
    id: number;
    provincia: string;
    pais?: number;
}

export interface Municipio {
    id: number;
    municipio: string;
    provincia: number;
}

export interface FormaPago {
    id: number;
    forma: string;
}

// Interface para crear socio de alta con todo
export interface CrearSocioDTO {
    // Datos de la persona
    Nombre: string;
    Apellidos: string;
    DNI: string;
    Movil?: string;
    Email?: string;
    Talla?: string;
    Sexo?: 'H' | 'M' | 'Otro';
    FNac?: string;
    Direccion?: string;
    CP?: string;
    Poblacion?: number;
    Provincia?: number;
    Pais?: number;
    Nacionalidad?: number;
    IBAN?: string;
    BIC?: string;
    
    // Datos de socio de alta
    fk_tipoSocio: number;
    fecha_alta: string;
    n_carnet?: number;
    sin_correspondencia?: boolean;
    c_carta?: boolean;
    c_email?: boolean;
    formaPago: number;
    fichaMadrid?: boolean;
}

// Interface para dar de baja
export interface DarBajaDTO {
    fecha_baja: string;
    motivo_baja: string;
    deudor?: boolean;
    deuda?: number;
}

// Interfaz Socio Deudor para list socios deudores
export interface SocioDeudor {
    Id_Persona: number;
    nsocio: number;
    nombre_completo: string;
    fecha_alta: string;
    tipo_socio: string;
    Email?: string;
    Movil?: string;
    total_deuda?: number;
}

// Para la vista detalle del socio la parte de las deudas
export interface DeudaTemporada {
    temporada_id: number;
    temporada: string;
    activa: boolean;
    importe_cuota: number;
    cuota_pagada: boolean;
    importe_pendiente: number;
    exento: boolean;
    estado: string;
}

// Para la vista detalle del socio la parte de las deudas
export interface ResumenDeuda {
    total_deuda: number;
    total_pagado: number;
    temporadas_con_deuda: number;
}

// Para la vista detalle del socio la parte de las deudas
export interface DatosDeuda {
    socio: {
        id_persona: number;
        numero_socio: number;
        nombre_completo: string;
        tipo_socio: string;
    };
    resumen: ResumenDeuda;
    deudas_por_temporada: DeudaTemporada[];
}