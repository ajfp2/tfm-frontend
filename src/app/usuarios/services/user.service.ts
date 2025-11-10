import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserDTO } from '../models/user.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.api_url;

    constructor(private http: HttpClient, private toast: ToastService) { }

    getUsers(): Observable<UserDTO[]>{
        return this.http.get<UserDTO[]>(`${this.apiUrl}/users`).pipe(
            map( (response: any) => {
                if(response.code !== 200){
                    throw new Error(response.message || 'Error desconocido');
                }
                return response.data;
            }),
            catchError( (error) => {
                console.error();
                return throwError( () => new Error('No se han podido obtener los usuarios'));
                
            })
        );
    }

    // getUserById(userId: string): Observable<UserDTO> {
    //     return this.http
    //         .get<UserDTO>(this.apiUrl + '/' + userId)
    //         .pipe(catchError(this.toast.error('No se ha podido obtener el usuario')));
    //     }
    // }

    /*register(user: UserDTO): Observable<UserDTO> {
    return this.http
        .post<UserDTO>(this.urlBlogUocApi, user)
        .pipe(catchError(this.sharedService.handleError));
    }

    updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
        return this.http
            .put<UserDTO>(this.urlBlogUocApi + '/' + userId, user)
            .pipe(catchError(this.sharedService.handleError));
    }

    */
}
