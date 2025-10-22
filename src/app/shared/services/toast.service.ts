import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

    private maxToasts = 3; // Máximo de toasts visibles simultáneamente

    /**
     * Generar ID único para cada toast
     */
    private generateId(): string {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    constructor() {}

    /**
     * Mostrar un toast de éxito
     */
    success(message: string, title: string = 'Éxito', duration: number = 5000): void {
        this.show({ type: 'success', title, message, duration });
    }

    /**
     * Mostrar un toast de error
     */
    error(message: string, title: string = 'Error', duration: number = 7000): void {
        this.show({ type: 'error', title, message, duration });
    }

    /**
     * Mostrar un toast de advertencia
     */
    warning(message: string, title: string = 'Advertencia', duration: number = 6000): void {
        this.show({ type: 'warning', title, message, duration });
    }

    /**
     * Mostrar un toast informativo
     */
    info(message: string, title: string = 'Información', duration: number = 5000): void {
        this.show({ type: 'info', title, message, duration });
    }


    /**
     * Mostrar un toast genérico
     */
    show(options: { type: ToastType; title: string; message: string; duration?: number; }): void {

        let dur = (options.duration !== undefined) ? options.duration : 5000;

        const toast: Toast = {
            id: this.generateId(),
            type: options.type,
            title: options.title,
            message: options.message,
            duration: dur,
            timestamp: new Date()
        };

        // Agregar el toast
        const currentToasts = this.toastsSubject.value;
        const updatedToasts = [toast, ...currentToasts].slice(0, this.maxToasts);
        this.toastsSubject.next(updatedToasts);

        // Auto-remover después de la duración especificada
        if (dur > 0) {
            setTimeout(() => {
                this.remove(toast.id);
            }, toast.duration);
        }
    }

    /**
     * Remover un toast específico
     */
    remove(id: string): void {
        const currentToasts = this.toastsSubject.value;
        const updatedToasts = currentToasts.filter(t => t.id !== id);
        this.toastsSubject.next(updatedToasts);
    }

    /**
     * Limpiar todos los toasts
     */
    clear(): void {
        this.toastsSubject.next([]);
    }    
}
