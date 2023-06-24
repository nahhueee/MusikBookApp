export class AcordesCancion{
  idSeccion? : number;
  acorde?: string;
  ubicacion?: string;

  constructor(data?: any) {
    if (data) {
      this.idSeccion = data.idSeccion;
      this.acorde = data.acorde;
      this.ubicacion = data.ubicacion;
     }
  }
}
