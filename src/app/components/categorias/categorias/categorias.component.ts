import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Categoria } from 'src/app/models/Categoria';
import { FiltroGeneral } from 'src/app/models/FiltroGeneral';
import { Paginacion } from 'src/app/models/Paginacion';
import { CategoriasService } from 'src/app/services/categorias.service';

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

  constructor(
    private categoriasService:CategoriasService,
    private router: Router){}


  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items por página';
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
    this.router.navigateByUrl("/categorias");
  }
  EditarCategoria(idCategoria:number){
    this.router.navigateByUrl("/categorias/"+ idCategoria);
  }
}
