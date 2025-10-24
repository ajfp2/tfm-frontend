// Modelo de usuario
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

// Respuesta del login desde Laravel
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user: User;
}

// Token almacenado
export interface AuthToken {
  token: string;
  expiresAt?: Date;
}

// Estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}