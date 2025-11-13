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

    constructor(private http: HttpClient) { }

    getUsers(): Observable<UserDTO[]>{
        return this.http.get<UserDTO[]>(`${this.apiUrl}/users`).pipe(
            map( (response: any) => {
                if(response.code !== 200){
                    throw new Error(response.message || 'Error desconocido');
                }
                return response.data;
            }),
            catchError( (error) => {
                console.error(error);
                return throwError( () => new Error('No se han podido obtener los usuarios'));                
            })
        );
    }

    getUserById(userId: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${this.apiUrl}/users/${userId}`)
            .pipe(
                map( (response: any) => {
                    if(response.code !== 200){
                        throw new Error(response.message || 'Error desconocido');
                    }
                    return response.data;
                }),
                catchError( (error) => {
                    console.error(error);
                    return throwError( () => new Error('No se han podido obtener el usuario id:'+userId));
                })
            );
    }
    
    createUser(userData: FormData): Observable<UserDTO> {
        return this.http.post<UserDTO>(`${this.apiUrl}/users`, userData)
            .pipe(catchError( (error) =>{
                return throwError( () => new Error('No se ha podido CREAR el usuario'));
            }));
    }

    updateUser(userId: number, userData: FormData): Observable<UserDTO> {
        return this.http.post<UserDTO>(`${this.apiUrl}/users/${userId}`, userData)
            .pipe(catchError((error) => {
                return throwError( () => new Error('No se ha podido ACTUALIZAR el usuario'));
        }));
    }

    deleteUser(){

    }

    estadoUser(user: UserDTO){
        //activa-user
        return this.http.put<UserDTO>(`${this.apiUrl}/users/activa-user/${user.id}`, {user})
            .pipe(catchError((error) => {
                return throwError( () => new Error('No se ha podido ACTUALIZAR el ESTADO del usuario'));
        }));
    }
}
