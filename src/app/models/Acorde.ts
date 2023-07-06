export class Acorde{
  acorde?: string;
  ubicacion?: string;
  inputAbierto?: boolean;
  accion?: string = '';

  constructor(data?: any) {
    if (data) {
      this.acorde = data.acorde;
      this.ubicacion = data.ubicacion;
      this.inputAbierto = data.inputAbierto;
      this.accion = data.accion;
     }
  }
}
