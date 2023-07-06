export class Seccion{
    idSeccion?: number;
    idTipoSeccion?: number;
    tipoSeccion?: string;
    letra?: string;
    accion?: string;
    orden?: number

    constructor(data?: any) {
      if (data) {
        this.idSeccion = data.idSeccion;
        this.idTipoSeccion = data.idTipoSeccion;
        this.tipoSeccion = data.tipoSeccion;
        this.letra = data.letra;
        this.accion = data.accion;
        this.orden = data.orden;
      }
    }
  }
