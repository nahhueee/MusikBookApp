import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoSeccionService {
  apiUrl = environment.apiURL;

  constructor(private http:HttpClient) { }

  //#region OBTENER
  ObtenerTiposSeccion() {
    return this.http.get(this.apiUrl + 'tipos_seccion/select')
       .toPromise()
       .then((result:any) => {return result;})
  }
  //#endregion
}
