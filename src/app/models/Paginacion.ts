export class Paginacion{
  pagina?: number;
  tamanioPagina?: number;
  total?: number;

  constructor(data?: any) {
    if (data) {
      this.pagina = data.pagina;
      this.tamanioPagina = data.tamanioPagina;
      this.total = data.total;
    }
  }
}
