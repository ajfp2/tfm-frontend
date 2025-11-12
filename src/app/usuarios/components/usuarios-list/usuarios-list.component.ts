import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule],
  templateUrl: './usuarios-list.component.html',
  styleUrl: './usuarios-list.component.css'
})
export class UsuariosComponent implements OnInit{
    userList: UserDTO[] = [];
    
    constructor(private us: UserService, private toast: ToastService, private router: Router){
      
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    private loadUsers() {
        this.us.getUsers().subscribe({          
            next: (usuarios) => {
                this.toast.info('Usuarios obtenidos correctamente')
                this.userList = usuarios;
                console.log(usuarios);
                
            },
            error: (error) => {
                console.error('Error en el componente:', error.message);
                this.toast.error(error.message, 'ERROR')
            }          
        });
    }

    createUser(): void {
        this.router.navigateByUrl('usuarios/create-user');
    }

    updateUser(id: number | undefined): void {
        if (!id) {
            this.toast.error('El ID de usuario no es válido');
            return;
        }
        this.router.navigateByUrl(`/usuarios/edit-user/${id}`);
    }

    // deletePost(postId: string): void {
    //     let errorResponse: any;
    //     // show confirmation popup
    //     let result = confirm('Confirm delete post with id: ' + postId + ' .');
    //     if (result) {
    //     this.postService.deletePost(postId).subscribe( resp => {
    //         const rowsAffected = resp;
    //         if (rowsAffected.affected > 0) {
    //         this.loadPosts();
    //         }
    //     },
    //     (err: HttpErrorResponse) => {
    //         errorResponse = err.error;
    //         this.sharedService.errorLog(errorResponse);
    //     });
    //     }
    // }

}
