import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TipoSeccion } from 'src/app/models/TipoSeccion';
import { TipoSeccionService } from 'src/app/services/tipo-seccion.service';
import { CompasComponent } from '../compas/compas.component';

@Component({
  selector: 'app-letras',
  templateUrl: './letras.component.html',
  styleUrls: ['./letras.component.scss']
})
export class LetrasComponent {
  tiposSeccion: TipoSeccion[];
  formulario: FormGroup;

  Compas:number = 0; //Usado para setear caracteres segun el compas seleccionado

  dialogConfig = new MatDialogConfig(); //Configuraciones del modal compaces

  constructor(
    private dialog: MatDialog,
    private tipoSeccionService:TipoSeccionService,
    private fb: FormBuilder){
      this.formulario = this.fb.group({
        secciones: this.fb.array([])
      });
  }

  //Obtiene el array contenido en el formulario
  get secciones(): FormArray {
    return this.formulario.get('secciones') as FormArray;
  }

  ngOnInit(){
    this.ObtenerTiposSeccion();

    //Configuraciones del modal elegir compas
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.height = "auto";
    this.dialogConfig.width = "300px";
  }

  ObtenerTiposSeccion(){
    this.tipoSeccionService.ObtenerTiposSeccion()
      .then(response => {
        this.tiposSeccion = new Array<TipoSeccion>();

        for (let i = 0; i < response.length; i++) {
          this.tiposSeccion.push(new TipoSeccion(response[i]));
        }
      });
  }

  //Añade un nuevo campo de seccion a la lista de secciones
  AnadirSeccion(tipoSeccion:TipoSeccion) {
    if(tipoSeccion.nombre == "INTRO" || tipoSeccion.nombre == "INTERLUDIO"){
      this.dialog.open(CompasComponent, this.dialogConfig)
                .afterClosed()
                .subscribe((CompasSeleccionado:number) => {
                  if(CompasSeleccionado==0) return;

                  let letraCompas:string = "";
                  if(CompasSeleccionado==16) letraCompas = "_ _ _ _ _ _ _ _ \n_ _ _ _ _ _ _ _";
                  if(CompasSeleccionado==8) letraCompas = "_ _ _ _ _ _ _ _ ";
                  if(CompasSeleccionado==4) letraCompas = "_ _ _ _ ";

                  const seccion = this.fb.group({
                    idTipo: new FormControl(tipoSeccion.id),
                    tipo: new FormControl(tipoSeccion.nombre),
                    letra: new FormControl(letraCompas),
                  });

                  this.secciones.push(seccion);
                });
    }else{
      const seccion = this.fb.group({
        idTipo: new FormControl(tipoSeccion.id),
        tipo: new FormControl(tipoSeccion.nombre),
        letra: new FormControl(''),
      });

      this.secciones.push(seccion);
    }
  }

  //Borra una seccion de la lista de secciones
  BorrarSeccion(item:number){
   this.secciones.removeAt(item)
  }

  //Intercambia la posicion del item por el item que esta a su izquierda en el array
  SubirItem(item:number){
    let aux = this.secciones.controls[item];
    this.secciones.controls[item] = this.secciones.controls[item-1];
    this.secciones.controls[item-1] = aux;
  }

  // Intercambia la posicion del item por el item que esta a su derecha en el array
  BajarItem(item:number){
    let aux = this.secciones.controls[item];
    this.secciones.controls[item] = this.secciones.controls[item+1];
    this.secciones.controls[item+1] = aux;
  }
}
