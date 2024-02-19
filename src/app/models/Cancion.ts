import { Acorde } from "./Acorde";
import { Categoria } from "./Categoria";
import { DetalleCancion } from "./DetallesCancion";
import { Seccion } from "./Seccion";

export class Cancion{
    id? : number = 0;
    nombre?: string;
    tonica?: string;
    bpm?: number;
    idTipoCancion?: number;

    categoria?:Categoria = new Categoria();
    detalles?:DetalleCancion = new DetalleCancion();
    

    constructor(data?: any) {
      if (data) {
        this.id = data.id;
        this.nombre = data.nombre;
        this.tonica = data.tonica;
        this.bpm = data.bpm;
        this.idTipoCancion = data.idTipoCancion;

        this.categoria = data.categoria
        this.detalles = data.detalles;
      }
    }
  }
