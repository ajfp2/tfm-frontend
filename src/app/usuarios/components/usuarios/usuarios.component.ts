import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
    userList: UserDTO[] = [];
    
    constructor(private us: UserService, private toast: ToastService){
      
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    private loadUsers() {
        this.us.getUsers().subscribe({          
            next: (usuarios) => {
                this.toast.success('Usuarios obtenidos correctamente')
                this.userList = usuarios;
            },
            error: (error) => {
                console.error('Error en el componente:', error.message);
                this.toast.error(error.message, 'ERROR')
            }          
        });
    }

}
