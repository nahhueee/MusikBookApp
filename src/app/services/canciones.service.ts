import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroCanciones } from '../models/FiltroCanciones';
import { Cancion } from '../models/Cancion';

@Injectable({
  providedIn: 'root'
})
export class CancionesService {
  apiUrl = environment.apiURL;

  constructor(private http:HttpClient) { }

  //#region OBTENER
  ObtenerTotalCanciones(filtro:FiltroCanciones) {
    return this.http.post(this.apiUrl + 'canciones/total/', filtro)
       .toPromise()
       .then((result:any) => {return result;})
  }

  ObtenerCanciones(filtro:FiltroCanciones) {
    return this.http.post(this.apiUrl + 'canciones/', filtro)
       .toPromise()
       .then((result:any) => {return result;});
  }

  ObtenerCancion(cancion:number) {
    return this.http.get(this.apiUrl + `canciones/${cancion}`)
       .toPromise()
       .then((result:any) => {return result;});
  }

  ConsultarExistencia(nombre?:string, tipo?:number) {
    return this.http.post(this.apiUrl + `canciones/existe`, {nombre:nombre, idTipoCancion:tipo})
       .toPromise()
       .then((result:any) => {return result;});
  }
  //#endregion

  //#region ABM
  Agregar(cancion:Cancion){
    return this.http.post(this.apiUrl + 'canciones/agregar', cancion)
    .toPromise()
    .then((result:any) => {return result;});
  }

  Modificar(cancion:Cancion){
    return this.http.put(this.apiUrl + 'canciones/modificar', cancion)
    .toPromise()
    .then((result:any) => {return result;});
  }

  Eliminar(id?:number){
    console.log(id)
    return this.http.delete(this.apiUrl + `canciones/eliminar/${id}`)
        .toPromise()
        .then((result:any) => {return result;});
  }
  //#endregion
}
