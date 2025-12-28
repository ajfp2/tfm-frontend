export interface CargoDirectivo {
    id: number;
    cargo: string;
    borrar: boolean;
}


export interface HistorialCargoDirectivo {
    a_temporada: number;
    a_persona: number;
    a_cargo: number;
    
    temporada?: {
        id: number;
        temporada: string;
        abreviatura: string;
        fecha_inicio: string;
        fecha_fin: string | null;
        activa: boolean;
    };
    
    persona?: {
        Id_Persona: number;
        Nombre: string;
        Apellidos: string;
        DNI: string;
        Email: string;
        Movil: string;
    };
    
    cargo?: CargoDirectivo;
}

export interface CargoDirectivoResponse {
  data: CargoDirectivo;
  message?: string;
  code: number;
}

export interface CargosDirectivosResponse {
  data: CargoDirectivo[];
}

export interface CargoDirectivoResponse {
  data: CargoDirectivo;
  message?: string;
}

export interface HistorialCargosResponse {
  data: HistorialCargoDirectivo[];
}

export interface AsignacionResponse {
  message: string;
  data: HistorialCargoDirectivo;
}

export interface CreateCargoDirectivoDTO {
    cargo: string;
    borrar?: boolean;
}

export interface UpdateCargoDirectivoDTO {
    cargo?: string;
    borrar?: boolean;
}

export interface AsignarCargoDTO {
    a_temporada: number;
    a_persona: number;
    a_cargo: number;
}

export interface EliminarAsignacionDTO {
    a_temporada: number;
    a_persona: number;
    a_cargo: number;
}

export interface MiembroJuntaDirectiva {
    cargo: string;
    cargoId: number;
    socioId: number;
    nombreCompleto: string;
    dni: string;
    email: string;
    movil: string;
    temporada: string;
    temporadaId: number;
}

export interface JuntaDirectivaPorTemporada {
    temporada: {
        id: number;
        nombre: string;
        activa: boolean;
    };
    miembros: MiembroJuntaDirectiva[];
}

export interface TemporadaHistorialJunta {
    id: number;
    temporada: string;
    abreviatura: string;
    activa: boolean;
}

export interface JuntaPorTemporada {
    temporada: TemporadaHistorialJunta;
    miembros: MiembroJuntaDirectiva[];
    totalMiembros: number;
}