import { Paginacion } from "./Paginacion";

export class FiltroCanciones{
  tipo?: number;
  nombre?: number;
  paginacion?: Paginacion = new Paginacion();

  constructor(data?: any) {
    if (data) {
      this.tipo = data.tipo;
      this.nombre = data.nombre;
      this.paginacion = data.paginacion;
    }
  }
}
