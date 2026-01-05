import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';

import { DashboardData, SaldoTemporada } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';
import { ToastService } from '../../../shared/services/toast.service';


// Registrar componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit, AfterViewInit {

    @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
    
    private lineChart?: Chart;

    dashboardData: DashboardData | null = null;
    saldosTemporadas: SaldoTemporada[] = [];
    loadingGrafico: boolean = false;
    chartReady: boolean = false;


    public lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Evolución de Saldos por Ejercicio',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('es-ES', { 
                                style: 'currency', 
                                currency: 'EUR' 
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('es-ES', { 
                            style: 'currency', 
                            currency: 'EUR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(value as number);
                    }
                }
            }
        }
    };

    constructor(private ds: DashboardService, private toast: ToastService, private change: ChangeDetectorRef) {}


    // Nos aseguramos que el HTML y el viewChild están listos
    ngAfterViewInit(): void {
        console.log('ngAfterViewInit ejecutado');
        console.log('lineChartRef existe:', !!this.lineChartRef);
        console.log('lineChartRef.nativeElement:', this.lineChartRef?.nativeElement);

        this.chartReady = true;
        this.cargarGraficoSaldos();        
    }

    ngOnInit(): void {
        this.cargarDashboard();        
    }

    cargarDashboard(): void {
        this.ds.getEstadisticas().subscribe({
            next: (response) => {
                if (response.code == 200) {
                    this.dashboardData = response.data;
                }
            },
            error: (error) => {
                console.error('Error al cargar dashboard:', error);
                this.toast.error('Error al cargar las estadísticas del dashboard');                
            }
        });
    }

    // Cargar datos y configurar el gráfico de saldos
    cargarGraficoSaldos(): void {
        this.loadingGrafico = true;

        this.ds.getSaldosTemporadas(4).subscribe({
            next: (response) => {
                if (response.code == 200 && response.data.length > 0) {
                    this.saldosTemporadas = response.data;
                    console.log('Datos cargados:', this.saldosTemporadas.length);
                    console.log('chartReady:', this.chartReady);
                    // Forzamos cambios
                    // this.change.detectChanges();
                    setTimeout(() => {
                        if (this.chartReady) {
                            console.log("Grafff");                            
                            this.configurarGrafico();                            
                        } else {
                            console.warn('Canvas aún no está listo');
                        }
                    }, 200);
                }
                this.loadingGrafico = false;
            },
            error: (error) => {
                console.error('Error al cargar gráfico de saldos:', error);
                this.loadingGrafico = false;
            }
        });
    }

    configurarGrafico(): void {
        // Si el gráfico ya existe, destruirlo
        if (this.lineChart) {
            console.log('Destruyendo otros gráficos');
            this.lineChart.destroy();
        }

        // Verificar que el canvas existe
        if (!this.lineChartRef || !this.lineChartRef.nativeElement) {
            console.error('Canvas no disponible');
            return;
        }

        const ctx = this.lineChartRef.nativeElement.getContext('2d');
        if (!ctx) {
            console.error('No se pudo obtener el contexto 2D del canvas');
            this.toast.error('Error: No se pudo inicializar el gráfico');
            return;
        }

        console.log('Canvas OK, creando gráfico...');

        const labels = this.saldosTemporadas.map(t => t.abreviatura);

        const saldosIniciales = this.saldosTemporadas.map(t => t.saldo_inicial);
        
        const saldosFinales = this.saldosTemporadas.map(t => t.saldo_final);
        
        const saldosMedios = this.saldosTemporadas.map(t => t.saldo_medio);

        const config: ChartConfiguration<'line'> = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: saldosIniciales,
                        label: 'Saldo Inicial',
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        data: saldosFinales,
                        label: 'Saldo Final',
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        data: saldosMedios,
                        label: 'Saldo Medio',
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderDash: [5, 5] // Línea punteada
                    }
                ]
            },
            options: this.lineChartOptions
        };
        try {
            this.lineChart = new Chart(ctx, config);
            console.log('Gráfico creado exitosamente');
        } catch (error) {
            console.error('Error al crear el gráfico:', error);
            this.toast.error('Error al crear el gráfico');
        }

        // this.lineChart = new Chart(ctx, config);         
    }

    // Calcular porcentaje de socios activos
    getPorcentajeSociosActivos(): number {
        if (!this.dashboardData || this.dashboardData.socios.total === 0) {
            return 0;
        }
        return Math.round((this.dashboardData.socios.activos / this.dashboardData.socios.total) * 100 );
    }

    // Calcular porcentaje de hombres
    getPorcentajeHombres(): number {
        if (!this.dashboardData || this.dashboardData.socios.activos === 0) {
            return 0;
        }
        return Math.round((this.dashboardData.socios.hombres / this.dashboardData.socios.activos) * 100);
    }

    // Calcular porcentaje de mujeres
    getPorcentajeMujeres(): number {
        if (!this.dashboardData || this.dashboardData.socios.activos === 0) {
            return 0;
        }
        return Math.round((this.dashboardData.socios.mujeres / this.dashboardData.socios.activos) * 100);
    }

    // Obtener clase de color según porcentaje de cuotas pagadas
    getColorCuotasPagadas(): string {
        if (!this.dashboardData?.cuotas) return 'text-secondary';
        
        const porcentaje = this.dashboardData.cuotas.porcentaje_pagado;
        
        if (porcentaje >= 80) return 'text-success';
        if (porcentaje >= 50) return 'text-warning';
        return 'text-danger';
    }

    // Obtener icono según porcentaje de cuotas pagadas
    getIconoCuotasPagadas(): string {
        if (!this.dashboardData?.cuotas) return 'bi-dash-circle';
        
        const porcentaje = this.dashboardData.cuotas.porcentaje_pagado;
        
        if (porcentaje >= 80) return 'bi-check-circle-fill';
        if (porcentaje >= 50) return 'bi-exclamation-circle-fill';
        return 'bi-x-circle-fill';
    }

    // Formatear nombre completo
    getNombreCompleto(nombre: string, apellidos: string): string {
        return `${nombre} ${apellidos}`;
    }

    recargar(): void {
        this.cargarDashboard();
    }

    ngOnDestroy(): void {
        if (this.lineChart) {
            this.lineChart.destroy();
        }
    }

}
