import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

    loading$!: Observable<boolean>;

    constructor(private load:LoaderService){
        this.loading$ = this.load.loading$; // Mover al NgOnInit???
    }

}
