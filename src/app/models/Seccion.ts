export class Seccion{
    posicion?: number;
    idTipoSeccion?: number;
    tipoSeccion?: string;
    letra?: string;
    accion?: string;
    cambioPosicion?: boolean;
    
    id?:number;
    idCancion?:number;

    constructor(data?: any) {
      if (data) {
        this.posicion = data.posicion;
        this.idTipoSeccion = data.idTipoSeccion;
        this.tipoSeccion = data.tipoSeccion;
        this.letra = data.letra;
        this.accion = data.accion;
        this.cambioPosicion = data.cambioPosicion;
       
        this.id = data.id;
        this.idCancion = data.idCancion;
      }
    }
  }
