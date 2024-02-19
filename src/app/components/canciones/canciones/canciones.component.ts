import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cancion } from 'src/app/models/Cancion';
import { FiltroCanciones } from 'src/app/models/FiltroCanciones';
import { Paginacion } from 'src/app/models/Paginacion';
import { CancionesService } from 'src/app/services/canciones.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-canciones',
  templateUrl: './canciones.component.html',
  styleUrls: ['./canciones.component.scss']
})
export class CancionesComponent {
  txtBusqueda:string="";
  canciones: Cancion[] =[];
  cancionTipo: number;

  displayedColumns: string[] = ['nombre', 'tonica', 'bpm', 'categoria', 'id']; //Columnas a mostrar
  dataSource = new MatTableDataSource<Cancion>(this.canciones); //Data source de la tabla

  @ViewChild(MatPaginator) paginator: MatPaginator; //Para manejar el Paginador del front
  @ViewChild(MatSort) sort: MatSort; //Para manejar el Reordenar del front

  constructor(
    private cancionesService:CancionesService,
    private router: Router){}


  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items por página';
  }

  Buscar(event?: PageEvent, tipoCancion?:any){
    console.log("Hola Cancion")
    this.cancionTipo = tipoCancion.id;

    if (!event) {
      event = new PageEvent();
      event.pageIndex = 0;
      event.pageSize = this.paginator.pageSize;
    }

    let paginacion: Paginacion = new Paginacion({
      pagina: event.pageIndex + 1,
      total: event.length,
      tamanioPagina: event.pageSize
    });

    let filtroCanciones: FiltroCanciones = new FiltroCanciones({
      idTipoCancion: tipoCancion.id,
      nombre: this.txtBusqueda,
      paginacion: paginacion
    })

    // Obtiene el total de canciones
    this.cancionesService.ObtenerTotalCanciones(filtroCanciones)
      .then(res => {
        this.paginator.length = res;

        // Busca las canciones en base a la pagina seleccionada
        // y los filtros elegidos, como el nombre y el tipo
        this.cancionesService.ObtenerCanciones(filtroCanciones)
        .then(response => {

          console.log(response)
          //Llenamos la tabla con los resultados
          this.canciones = [];
          for (let i = 0; i < response.length; i++) {
            this.canciones.push(new Cancion(response[i]));
          }
          this.dataSource = new MatTableDataSource<Cancion>(this.canciones);

          //DT de la tabla va a ser igual a lo que ordenamos con Sort
          this.dataSource.sort = this.sort;

        }).catch(err => {
          console.log(err);
        });

      }).catch(err => {
        console.log(err);
      });
  }

  LimpiarBusqueda(){
    this.txtBusqueda = "";
    this.Buscar();
  }

  NuevaCancion(){
    this.router.navigateByUrl("/canciones/"+ this.cancionTipo + "/");
  }
  EditarCancion(idCancion:number){
    this.router.navigateByUrl("/canciones/"+ this.cancionTipo + "/" + idCancion);
  }
  VerCancion(idCancion:number){
    //this.router.navigateByUrl("/canciones/vista/"+ idCancion, '_blank');
    window.open('/cancion/vista/'+ idCancion, '_blank');
  }


  SetearColorBar(color?:string){
    return { backgroundColor:color }
  }
  SetearColorP(color?:string){
    return { border:'1px solid ' + color }
  }
}
