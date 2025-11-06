import { Component } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
    userList: UserDTO[] = [];
    
    constructor(private us: UserService){

    }

    getListUser() {
        
    }

}
