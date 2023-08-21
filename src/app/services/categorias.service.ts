import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/Categoria';
import { FiltroGeneral } from '../models/FiltroGeneral';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  apiUrl = environment.apiURL;

  constructor(private http:HttpClient) { }

  //#region OBTENER
  ObtenerTotalCategorias(filtro:FiltroGeneral) {
    return this.http.post(this.apiUrl + 'categorias/ObtenerTotal/', filtro)
       .toPromise()
       .then((result:any) => {return result;});
  }

  ObtenerCategorias(filtro:FiltroGeneral) {
    return this.http.post(this.apiUrl + 'categorias/ObtenerTodas', filtro)
       .toPromise()
       .then((result:any) => {return result;});
  }

  ObtenerCategoriasSelector() {
    return this.http.get(this.apiUrl + 'categorias/ObtenerSelector')
       .toPromise()
       .then((result:any) => {return result;});
  }

  ObtenerCancion(cancion:number) {
    return this.http.get(this.apiUrl + `categorias/ObtenerUna?id=${cancion}`)
       .toPromise()
       .then((result:any) => {return result;});
  }

  ConsultarExistencia(nombre?:string, tipo?:number) {
    return this.http.get(this.apiUrl + `categorias/ExisteCategoria?nombre=${nombre}`)
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
