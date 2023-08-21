import { Paginacion } from "./Paginacion";

export class FiltroGeneral{
  nombre?: number;
  paginacion?: Paginacion = new Paginacion();

  constructor(data?: any) {
    if (data) {
      this.nombre = data.nombre;
      this.paginacion = data.paginacion;
    }
  }
}
