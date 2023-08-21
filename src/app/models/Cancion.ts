import { Acorde } from "./Acorde";
import { DetalleCancion } from "./DetallesCancion";
import { Seccion } from "./Seccion";

export class Cancion{
    id? : number = 0;
    nombre?: string;
    tonica?: string;
    bpm?: number;
    idCategoria?: number;
    idTipoCancion?: number;

    // acordes: Array<Acorde> = new Array<Acorde>();
    // secciones: Array<Seccion> = new Array<Seccion>();

    detalles?:DetalleCancion = new DetalleCancion();

    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.tonica = data.tonica;
        this.bpm = data.bpm;
        this.idCategoria = data.idCategoria;
        this.idTipoCancion = data.idTipoCancion;

        this.detalles = data.detalles;
      }
    }
  }
