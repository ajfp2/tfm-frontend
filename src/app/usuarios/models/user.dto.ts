export class UserDTO {
  id?: number;
  nombre: string;
  apellidos: string;
  usuario: string;
  email: string;
  password?: string;
  telefono: string;
  perfil: number;
  foto?: string;
  fotoFile?: File; // Lo utilizare para archivo temporal de la img del usuario.
  estado?: boolean;
  access_token?: string;

  constructor(
    name: string,
    apellidos: string,
    usuario: string,
    email: string,
    telefono: string,
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
