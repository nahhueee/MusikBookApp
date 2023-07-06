export class Categoria{
  id?: number;
  nombre?: string;
  color?: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.nombre = data.nombre;
      this.color = data.color;
    }
  }
}
