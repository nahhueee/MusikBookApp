import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cancion } from 'src/app/models/Cancion';
import { CancionesService } from 'src/app/services/canciones.service';
import { DisparadorService } from 'src/app/services/disparador.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-cancion-addmod',
  templateUrl: './cancion-addmod.component.html',
  styleUrls: ['./cancion-addmod.component.scss']
})
export class CancionAddmodComponent {
  modificando:boolean;
  titulo:string='';

  formulario: FormGroup;
  cancion:Cancion = new Cancion();

  constructor(
    private cancionService:CancionesService,
    private Notificaciones: NotificacionesService,
    private disparadorService: DisparadorService){

    //Creamos el formulario para los datos de la cabecera de la cancion
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      tonica: new FormControl(''),
      bpm: new FormControl(''),
    });
  }

  ngOnInit(){

  }

  Guardar(){
    if (this.formulario.invalid)
    return;

    this.cancion.nombre =  this.formulario.get('nombre')?.value;
    this.cancion.tonica =  this.formulario.get('tonica')?.value;
    this.cancion.bpm =  this.formulario.get('bpm')?.value;
    this.cancion.idCategoria =  2;
    this.cancion.idTipoCancion =  1;

    //Consulta si existe una cancion con este nombre y el tipo de cancion
    this.cancionService.ConsultarExistencia(this.cancion.nombre, this.cancion.idTipoCancion)
      .then(response => {
        if(response=='NoExiste'){//Si no existe guardamos

          this.cancion.id = 99;
          this.disparadorService.emitirEventoGuardarDetalles(this.cancion.id);

          // this.cancionService.Agregar(this.cancion)
          // .then(response => {
          //   if(response!=-1){
          //     this.cancion.id = response; //Obtenemos el id de la nueva canción
          //     this.Notificaciones.success("Nueva cancion agregada correctamente");

          //     console.log(this.cancion.id)
          //   }else{
          //     this.Notificaciones.error("No se pudo guardar la canción");
          //   }
          // }).catch(err => {
          //   console.log(err);
          // });

        }else{//Si existe informamos
          this.Notificaciones.info("Ya existe una canción de este tipo con el mismo nombre");
        }

      }).catch(err => {
        console.log(err);
      });
  }
}
