import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Acorde } from 'src/app/models/Acorde';
import { Cancion } from 'src/app/models/Cancion';
import { DetalleCancion } from 'src/app/models/DetallesCancion';
import { CancionesService } from 'src/app/services/canciones.service';

@Component({
  selector: 'app-cancion-vista',
  templateUrl: './cancion-vista.component.html',
  styleUrls: ['./cancion-vista.component.scss']
})
export class CancionVistaComponent {
  vLetra:boolean = true;
  vAcorde:boolean = true;
 
  cancion:Cancion = new Cancion();
  indiceAcorde: number = 0;
  AcordesCancion: Array<Acorde> = new Array<Acorde>;

  acordeRenglon:string="";

  constructor(
    private cancionService:CancionesService,
    private rutaActiva: ActivatedRoute){
      
    }

  ngAfterViewInit(): void {
    setTimeout(() => {
      //Obtengo el id de la cancion a consultar desde URL
      let idCancion: number = parseInt(this.rutaActiva.snapshot.params['cancion']);
      if(idCancion)
        this.ObtenerCancion(idCancion);
      }, 0);
  }

  ObtenerCancion(idCancion:number){
    this.cancionService.ObtenerCancion(idCancion)
      .then(response => {
        this.cancion = new Cancion(response);

        let _detalle:DetalleCancion = new DetalleCancion(this.cancion.detalles)
        this.AcordesCancion = _detalle.acordes;
      });
  }

  //Obtiene el número de renglones que tiene un parrafo o seccion de la letra
  ObtenerRenglonesTexto(parrafo:any): string[] {
    const lineasTexto: string[] = [];
    const lineas = parrafo!.split('\n');
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (linea !== '') {
        lineasTexto.push(linea);
      }
    }
    return lineasTexto;
  }

  //Obtiene el indice del acorde segun las coordenadas proporcionadas
  //Devuelve: -1 si es que no existe acorde en esa ubicacion
  //Devuelve: <> -1 Significa que hay un acorde en esa ubicacion
  ObtenerIndexUbicacion(seccion:any, renglon:number, cuadro: number):number{
    if(this.cancion.detalles?.acordes){
      let elemento = this.cancion.detalles?.acordes.findIndex(x=> x.ubicacion == `${renglon}-${cuadro}` && x.posSeccion == seccion );
      
      if(elemento!=-1){
        this.indiceAcorde = elemento;
        return elemento;
      }
    }

    this.indiceAcorde = -1;
    return -1;
  }


  //Obtiene el acorde segun las coordenadas proporcionadas para el renglon
  //Devuelve: "" si es que no existe acorde en esa ubicacion
  //Devuelve: un acorde(string) Significa que hay un acorde en esa ubicacion
  ObtenerAcordeRenglon(seccion:any, renglon:number, cuadro: number):any{
    if(this.cancion.detalles?.acordes){
      let elemento = this.cancion.detalles?.acordes.find(x=> x.ubicacion == `${renglon}-${cuadro}` && x.posSeccion == seccion );
      
      if(elemento){
        this.acordeRenglon = elemento.acorde?.toString()!;
        return this.acordeRenglon;
      }

      return "";
    }
  }

  VerAcordeLetra(){
    this.vAcorde=true;
    this.vLetra=true
  }
  VerAcorde(){
    this.vAcorde=true;
    this.vLetra=false;
  }
  VerLetra(){
    this.vLetra=true;
    this.vAcorde=false;
  }
}
