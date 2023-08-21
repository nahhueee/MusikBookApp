import { Paginacion } from "./Paginacion";

export class FiltroCanciones{
  idTipoCancion?: number;
  idCategoria?: number;
  nombre?: number;
  paginacion?: Paginacion = new Paginacion();

  constructor(data?: any) {
    if (data) {
      this.idTipoCancion = data.idTipoCancion;
      this.idCategoria = data.idCategoria;
      this.nombre = data.nombre;
      this.paginacion = data.paginacion;
    }
  }
}
