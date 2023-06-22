import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltroCanciones } from '../models/FiltroCanciones';

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
  //#endregion
}
