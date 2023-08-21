import { EventEmitter, Injectable } from '@angular/core';
import { Cancion } from '../models/Cancion';
import { Seccion } from '../models/Seccion';
import { Acorde } from '../models/Acorde';

@Injectable({
  providedIn: 'root'
})
export class DisparadorService {

  constructor() { }

  $GuardarDetallesCancion = new EventEmitter();
  $ActualizarDetalleCancion = new EventEmitter();

  // Dispara el evento para avisar al componente secciones-cancion de guardar la cancion
  emitirEventoGuardarCancion(cancion:Cancion) {
    console.log("Emitido")
    this.$GuardarDetallesCancion.emit(cancion);
  }

  // Dispara el evento para avisar al componente secciones-cancion de actualizar sus datos
  emitirEventoActualizarDetalle(detalle:[]) {
    this.$ActualizarDetalleCancion.emit(detalle);
  }
}
