import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paginacion } from 'src/app/models/Paginacion';
import {Router} from "@angular/router";

import { CategoriasService } from 'src/app/services/categorias.service';
import { Categoria } from 'src/app/models/Categoria';
import { FiltroGeneral } from 'src/app/models/FiltroGeneral';
import { CategoriasAddmodComponent } from '../categorias-addmod/categorias-addmod.component';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { EliminarComponent } from '../../eliminar/eliminar.component';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {
  txtBusqueda:string="";
  categorias: Categoria[] =[];
  
  displayedColumns: string[] = ['nombre', 'color', 'id']; //Columnas a mostrar
  dataSource = new MatTableDataSource<Categoria>(this.categorias); //Data source de la tabla

  @ViewChild(MatPaginator) paginator: MatPaginator; //Para manejar el Paginador del front
  @ViewChild(MatSort) sort: MatSort; //Para manejar el Reordenar del front
  dialogConfig = new MatDialogConfig(); //Creamos un modal para las operaciones ABM
  
  constructor(
    private categoriasService:CategoriasService,
    private Notificaciones:NotificacionesService,
    private dialog: MatDialog){}

  ngOnInit(){
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.height = "auto";
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items por página';
    setTimeout(() => {
      this.Buscar();
    }, 0.5);
  }

  Buscar(event?: PageEvent){
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

    let filtro: FiltroGeneral = new FiltroGeneral({
      nombre: this.txtBusqueda,
      paginacion: paginacion
    })

    // Obtiene el total de categorias
    this.categoriasService.ObtenerTotalCategorias(filtro)
      .then(res => {
        this.paginator.length = res;

        // Busca las categorias en base a la pagina seleccionada
        // y los filtros elegidos, como el nombre 
        this.categoriasService.ObtenerCategorias(filtro)
        .then(response => {

          //Llenamos la tabla con los resultados
          this.categorias = [];
          for (let i = 0; i < response.length; i++) {
            this.categorias.push(new Categoria(response[i]));
          }
          this.dataSource = new MatTableDataSource<Categoria>(this.categorias);

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

  NuevaCategoria(){
    this.dialogConfig.width = "400px";
    this.dialogConfig.data = {categoria:''};
    this.dialog.open(CategoriasAddmodComponent, this.dialogConfig)
                .afterClosed()
                .subscribe((actualizar:boolean) => {
                  if (actualizar)
                  this.Buscar(); //Recarga la tabla
                });;
  }
  
  EditarCategoria(idCategoria:number){
    this.dialogConfig.width = "400px";
          this.dialogConfig.data = {categoria:idCategoria} //Pasa como dato el id de cliente
          this.dialog.open(CategoriasAddmodComponent, this.dialogConfig)
                  .afterClosed()
                  .subscribe((actualizar:boolean) => {
                    if (actualizar)
                      this.Buscar(); //Recarga la tabla
                  });
  }

  EliminarCategoria(idCategoria:number){
    this.dialogConfig.width = "400px";
          this.dialogConfig.data = {categoria:idCategoria} //Pasa como dato el id de cliente
          this.dialog.open(EliminarComponent, this.dialogConfig)
                  .afterClosed()
                  .subscribe((confirmado:boolean) => {
                    if (confirmado){ //Si confirma eliminacion

                      this.categoriasService.Eliminar(idCategoria)
                      .then(response => {
                        if(response){
                          this.Notificaciones.success("Categoria eliminada correctamente");
                          this.Buscar();
                        }else{
                          this.Notificaciones.error("No se pudo eliminar la categoria");
                        }
                      }).catch(err => {
                        console.log(err);
                      });

                    }
                  });
    
  }

  SetearColorBar(color?:string){
    return { backgroundColor:color }
  }
  SetearColorP(color?:string){
    return { border:'1px solid ' + color }
  }
}
