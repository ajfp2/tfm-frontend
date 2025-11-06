export class UserDTO {
  id?: string;
  nombre: string;
  apellidos: string;
  usuario: string;
  email: string;
  password: string;
  telefono: number;
  perfil: number;
  foto?: string;
  estado?: boolean;
  access_token?: string;

  constructor(
    name: string,
    surname_1: string,
    alias: string,
    email: string,
    password: string,
    telefono: number,
    perfil: number
  ) {
    this.nombre = name;
    this.apellidos = surname_1;
    this.usuario = alias;
    this.email = email;
    this.password = password;
    this.telefono = telefono;
    this.perfil = perfil;
  }
}
