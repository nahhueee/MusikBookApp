import { Component, EventEmitter, Output } from '@angular/core';
import { TipoCancion } from 'src/app/models/TipoCancion';
import { TipoCancionService } from 'src/app/services/tipo-cancion.service';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.scss']
})
export class SeleccionComponent {
  tiposCancion: TipoCancion[];
  @Output() respuesta = new EventEmitter(); //Metodo para devolver el TipoDeCancion

  constructor(private tiposCancionService:TipoCancionService){ }

  ngOnInit(): void {
    this.ObtenerTiposCancion();
  }

  ObtenerTiposCancion(){
    this.tiposCancionService.ObtenerTiposCancion()
      .then(response => {
        this.tiposCancion = new Array<TipoCancion>();

        for (let i = 0; i < response.length; i++) {
          this.tiposCancion.push(new TipoCancion(response[i]));
        }

        //Marco como activo el primer elemento
        this.tiposCancion[0].activo = true;
        //Emito el tipo de cancion n° 1
        this.respuesta.emit(1)
      });
  }

  Buscar(tipoCancion:any){
    //Pongo en estado inactivo todos los elementos
    this.tiposCancion.map(e=> e.activo = false);

    //Activo el elemento seleccionado
    let indice = this.tiposCancion.findIndex(x=> x.id == tipoCancion);
    this.tiposCancion[indice].activo = true;

    //Emito el tipo de cancion elegido
    this.respuesta.emit(tipoCancion)
  }
}
