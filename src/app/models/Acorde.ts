export class Acorde{
  idSeccion?: number;
  acorde?: string;
  ubicacion?: string;
  posSeccion?: number;
  inputAbierto?: boolean;
  accion?: string = '';

  constructor(data?: any) {
    if (data) {
      this.idSeccion = data.idSeccion;
      this.acorde = data.acorde;
      this.ubicacion = data.ubicacion;
      this.inputAbierto = data.inputAbierto;
      this.accion = data.accion;
      this.posSeccion = data.posSeccion;
     }
  }
}
