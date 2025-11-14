import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();
    
    private contPeticiones = 0;// Por si hay mas de una petición  simultaneas.

    constructor() { }

    show(): void {
        this.contPeticiones++;
        this.loadingSubject.next(true);
    }

    hide(): void {
        this.contPeticiones--;
        if (this.contPeticiones <= 0) {
            this.contPeticiones = 0;
            this.loadingSubject.next(false);
        }
    }

    reset(): void {
        this.contPeticiones = 0;
        this.loadingSubject.next(false);
    }
}
