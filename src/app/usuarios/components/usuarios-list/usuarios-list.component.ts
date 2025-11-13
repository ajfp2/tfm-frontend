import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DefaultImagePipe } from "../../../shared/pipes/default-image.pipe";

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, DefaultImagePipe],
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

    estado_user(user: UserDTO){
        user.estado = !user.estado;
        this.us.estadoUser(user).subscribe({
            next: (userR) => {
                console.log("Estado", userR);
                let sms = 'Desactivado';
                if(userR.estado == true) sms = 'Activado';
                this.toast.info('Usuario '+sms +' correctamente')

                
            },
            error: (error) => {
                console.error('Error en el componente:', error.message);
                this.toast.error(error.message, 'ERROR')
            } 
        });

    }

    deleteUser(id: number | undefined): void {
        // if (!id) {
        //     this.toast.showError('Error: ID de usuario no válido');
        //     return;
        // }

        // // Confirmar eliminación
        // if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        //     this.us.deleteUser(id).subscribe({
        //         next: () => {
        //             this.toast.showSuccess('Usuario eliminado correctamente');
        //             this.loadUsers(); // Recargar lista
        //         },
        //         error: (err) => {
        //             console.error('Error al eliminar:', err);
        //             if (err.status === 403) {
        //                 this.toast.showError(err.error.message || 'No tienes permisos para eliminar este usuario');
        //             } else {
        //                 this.toast.showError('Error al eliminar el usuario');
        //             }
        //         }
        //     });
        // }
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
