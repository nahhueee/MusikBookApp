import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-canciones-addmod',
  templateUrl: './canciones-addmod.component.html',
  styleUrls: ['./canciones-addmod.component.scss']
})
export class CancionesAddmodComponent {
  modificando:boolean;
  titulo:string='';

  formulario: FormGroup;

  constructor(){

    //Creamos el formulario para los datos de la cabecera de la cancion
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      tonica: new FormControl(''),
      bpm: new FormControl(''),
    });
  }

  ngOnInit(){

  }
}
