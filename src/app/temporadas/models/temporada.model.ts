export interface Temporada {
    saldo_inicial: any;
    id: number;
    temporada: string; // Ej: "2024-2025"
    abreviatura: string; // Ej: "24-25"
    fechaIni: string; // Formato: YYYY-MM-DD HH:mm:ss (datetime)
    fechaFin: string; // Formato: YYYY-MM-DD HH:mm:ss (datetime)
    saldoIni: number;
    saldoFin: number;
    activa: boolean;
    cuotaPasada: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface TemporadaFormData {
    temporada: string;
    abreviatura: string;
    fechaIni: string;
    fechaFin: string;
    saldoIni: number;
    saldoFin?: number;
    activa: boolean;
    cuotaPasada: boolean;
}



