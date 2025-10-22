import { Component, OnInit } from '@angular/core';
import { Toast } from '../../models/toast.model';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent  implements OnInit{

    toasts: Toast[] = [];
    
    constructor(public ts: ToastService) { }

    ngOnInit(): void {
        this.ts.toasts$.subscribe(toasts => {
            this.toasts = toasts;
        });
    }

    removeToast(id: string): void {
        this.ts.remove(id);
    }

    getToastClasses(type: string): string {
        const baseClasses = 'toast-item';
        const typeClasses: { [key: string]: string } = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        };
        return `${baseClasses} ${typeClasses[type] || ''}`;
    }

    getIconClass(type: string): string {
        const iconClasses: { [key: string]: string } = {
            'success': 'bi-check-circle-fill',
            'error': 'bi-x-circle-fill',
            'warning': 'bi-exclamation-triangle-fill',
            'info': 'bi-info-circle-fill'
        };
        return iconClasses[type] || 'bi-info-circle-fill';
    }


}
