import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, LoginCredentials, LoginResponse, User } from '../models/auth.model';
import { Observable, tap, catchError, throwError, map, of, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.api_url;
  
    // Claves para localStorage
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';
    
    // Estado de autenticación con signals
    private authStateSignal = signal<AuthState>({
        isAuthenticated: false,
        user: null,
        token: null
    });
    
    // Exposición pública del estado
    public authState = this.authStateSignal.asReadonly();
    
    // Computed signals
    public isAuthenticated = computed(() => this.authState().isAuthenticated);
    public currentUser = computed(() => this.authState().user);
    public token = computed(() => this.authState().token);

    constructor(private http: HttpClient, private router: Router) {
        // Cargar estado de autenticación al iniciar
        this.loadAuthState();
    }

    // Login - Autenticar usuario
    login(credentials: LoginCredentials): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                // Guardar token y usuario
                console.log(response);
                
                this.setAuthData(response.token, response.user);
                console.log('Login exitoso:', response.user);
            }),
            catchError(error => {
                console.error('Error en login:', error);
                return throwError(() => error);
            })
        );
    }

    // Logout - Cerrar sesión
    logout(): Observable<any> {
        const token = this.token();

        // Limpiamos todos los datos de localstorage
        this.clearAuthData();
        
        if (!token) {            
            this.router.navigate(['/login']);
            return of(null);
        }

        return this.http.post(`${this.apiUrl}/logout`, {}, { headers: this.getAuthHeaders() }).pipe(
            tap((res) => console.log('Logout exitoso en el servidor', res) ),
            catchError(error => {
                console.error('No se pudo invalidar token en servidor:', error);
                return of(null);
            }),
            finalize(() => this.router.navigate(['/login'] ))
        );
    }


    getProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
            tap(user => {
                // Actualizar usuario en el estado
                this.updateUser(user);
            }),
            catchError(error => {
                console.error('Error al obtener perfil:', error);
                return throwError(() => error);
            })
        );
    }

    // Verificar si el token es válido
    verifyToken(): Observable<boolean> {
        const token = this.token();        
        if (!token) {
            return new Observable(observer => {
                observer.next(false);
                observer.complete();
            });
        }

        return this.http.get<{ valid: boolean }>(`${this.apiUrl}/verify-token`).pipe(
            map(response => response.valid),
            catchError(() => {
                this.clearAuthData();
                return new Observable<boolean>(observer => {
                    observer.next(false);
                    observer.complete();
                });
            })
        );
    }

    // Refrescar token
    refreshToken(): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {}).pipe(
            tap(response => {
                this.setAuthData(response.token, response.user);
            }),
            catchError(error => {
                console.error('Error al refrescar token:', error);
                this.clearAuthData();
                return throwError(() => error);
            })
        );
    }

    // Guardar datos de autenticación
    private setAuthData(token: string, user: User): void {
        // Guardar en localStorage
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        
        // Actualizar estado
        this.authStateSignal.set({
            isAuthenticated: true,
            user: user,
            token: token
        });
    }

    // Actualizar solo el usuario
    private updateUser(user: User): void {
        const currentState = this.authState();
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        
        this.authStateSignal.set({
        ...currentState,
        user: user
        });
    }

    // Limpiar datos de autenticación
    private clearAuthData(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        
        this.authStateSignal.set({
            isAuthenticated: false,
            user: null,
            token: null
        });
    }

    // Cargar estado de autenticación desde localStorage
    private loadAuthState(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.authStateSignal.set({
                    isAuthenticated: true,
                    user: user,
                    token: token
                });
                console.log('Estado de autenticación cargado:', user.name);
            } catch (error) {
                console.error('Error al cargar estado de autenticación:', error);
                this.clearAuthData();
            }
        }
    }

    // Obtener headers con autenticación
    getAuthHeaders(): HttpHeaders {
        const token = this.token();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }
}
