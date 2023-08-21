import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  apiUrl = environment.apiURL;

  constructor(private http:HttpClient) { }

  //#region OBTENER
  // ObtenerTotalCategorias(filtro:FiltroGral) {
  //   return this.http.post(this.apiUrl + 'rubros/total/', filtro)
  //      .toPromise()
  //      .then((result:any) => {return result;});
  // }

  // ObtenerCategorias(filtro:FiltroGral) {
  //   return this.http.post(this.apiUrl + 'rubros/', filtro)
  //      .toPromise()
  //      .then((result:any) => {return result;});
  // }

  ObtenerCategoriasSelector() {
    return this.http.get(this.apiUrl + 'categorias/ObtenerSelector')
       .toPromise()
       .then((result:any) => {return result;});
  }

  ObtenerCategoria(categoria:number) {
    return this.http.get(this.apiUrl + `categorias/${categoria}`)
       .toPromise()
       .then((result:any) => {return result;});
  }
  //#endregion


  //#region ABM
  Agregar(categoria:Categoria){
    return this.http.post(this.apiUrl + 'categorias/agregar', categoria)
    .toPromise()
    .then((result:any) => {return result;});
  }

  Modificar(categoria:Categoria){
    return this.http.put(this.apiUrl + 'categorias/modificar', categoria)
    .toPromise()
    .then((result:any) => {return result;});
  }

  Eliminar(id?:number){
    return this.http.delete(this.apiUrl + `categorias/eliminar/${id}`)
       .toPromise()
       .then((result:any) => {return result;});
  }
  //#endregion
}
