export class Acorde_Seccion{
  acorde?: string;
  ubicacion?: number;
  inputAbierto?: boolean;

  constructor(data?: any) {
    if (data) {
      this.acorde = data.acorde;
      this.ubicacion = data.ubicacion;
      this.inputAbierto = data.inputAbierto;
     }
  }
}
