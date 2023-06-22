export class TipoCancion{
  id?: number;
  nombre?: string;
  activo?: boolean;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.nombre = data.nombre;
      this.activo = data.activo;
    }
  }
}
