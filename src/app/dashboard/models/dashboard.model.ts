import { Temporada } from "../../temporadas/models/temporada.model";


export interface DashboardData {
    temporada_activa: Temporada | null;
    socios: EstadisticasSocios;
    deuda: EstadisticasDeuda;
    cuotas: EstadisticasCuotas | null;
    actividad_reciente: ActividadReciente;
}

export interface EstadisticasSocios {
    total: number;
    activos: number;
    bajas: number;
    deudores: number;
    hombres: number;
    mujeres: number;
}

export interface EstadisticasDeuda {
    total: number;
    cantidad_deudores: number;
}

export interface EstadisticasCuotas {
    total: number;
    pagadas: number;
    pendientes: number;
    porcentaje_pagado: number;
    importe: {
        total: number;
        pagado: number;
        pendiente: number;
    };
}

export interface ActividadReciente {
    ultimas_altas: UltimaAlta[];
    ultimas_bajas: UltimaBaja[];
}

export interface UltimaAlta {
    a_Persona: number;
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_alta: string;
    n_carnet: string;
}

export interface UltimaBaja {
    a_Persona: number;
    nombre: string;
    apellidos: string;
    dni: string;
    fecha_baja: string;
    motivo_baja: string;
    deudor: boolean;
    deuda: number;
}

export interface EvolucionMensual {
    year: number;
    month: number;
    total: number;
}

export interface TipoSocioEstadistica {
    tipo: string;
    total: number;
}

export interface SaldoTemporada {
  temporada: string;
  abreviatura: string;
  saldo_inicial: number;
  saldo_final: number;
  saldo_medio: number;
  ingresos: number;
  gastos: number;
}