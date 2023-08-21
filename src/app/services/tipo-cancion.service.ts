import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoCancionService {
  apiUrl = environment.apiURL;

  constructor(private http:HttpClient) { }

  //#region OBTENER
  ObtenerTiposCancion() {
    return this.http.get(this.apiUrl + 'canciones/TipoCancionSelector')
       .toPromise()
       .then((result:any) => {return result;})
  }
  //#endregion
}
