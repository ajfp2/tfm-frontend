export class UserDTO {
  id?: string;
  nombre: string;
  apellidos: string;
  usuario: string;
  email: string;
  password?: string;
  telefono: number;
  perfil: number;
  foto?: string;
  estado?: boolean;
  access_token?: string;

  constructor(
    name: string,
    apellidos: string,
    usuario: string,
    email: string,
    telefono: number,
    perfil: number,
    password?: string
  ) {
    this.nombre = name;
    this.apellidos = apellidos;
    this.usuario = usuario;
    this.email = email;
    this.telefono = telefono;
    this.perfil = perfil;
    if (password) this.password = password;
  }
}
