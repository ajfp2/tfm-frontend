export interface Penya {
    id_penya: number;
  
    // Datos generales
    nombre: string;
    cif?: string;
    direccion?: string;
    CP?: string;
    localidad?: string;
    provincia?: string;
    telefono?: string;
    email?: string;
    
    // Datos bancarios
    nombre_banco?: string;
    user_banco?: string;
    pwd_banco?: string;
    tarjeta_claves?: string;
    digitos_control?: string;
    sufijo?: string;
    iban: string;
    bic?: string;    
    
    // Sede social
    sede_social?: string;
    direccion_sede?: string;
    tel_sede?: string;
    
    // Timestamps
    fecha_alta?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PenyaDatosGenerales {
    nombre: string;
    cif?: string;
    direccion?: string;
    CP?: string;
    localidad?: string;
    provincia?: string;
    telefono?: string;
    email?: string;
    fecha_alta?: string;

  // Sede social
    sede_social?: string;
    direccion_sede?: string;
    tel_sede?: string;
}

export interface PenyaDatosBancarios {
    nombre_banco?: string;
    user_banco?: string;
    pwd_banco?: string;
    tarjeta_claves?: string;
    digitos_control?: string;
    sufijo?: string;
    iban: string;
    bic?: string; 
}
