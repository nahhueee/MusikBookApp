import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisparadorService {

  constructor() { }

  $GuardarDetallesCancion = new EventEmitter();

  // Dispara el evento para avisar al componente secciones-cancion de guardar sus detalles
  emitirEventoGuardarDetalles(IdCancion:number) {
    this.$GuardarDetallesCancion.emit(IdCancion);
  }
}
