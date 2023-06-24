import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TipoSeccion } from 'src/app/models/TipoSeccion';
import { TipoSeccionService } from 'src/app/services/tipo-seccion.service';
import { CompasComponent } from '../compas/compas.component';
import { AcordesCancion } from 'src/app/models/Acordes_Cancion';

@Component({
  selector: 'app-secciones-cancion',
  templateUrl: './secciones-cancion.component.html',
  styleUrls: ['./secciones-cancion.component.scss']
})
export class SeccionesCancionComponent {
  @ViewChild('inputAcorde') inputAcorde!: ElementRef;

  tiposSeccion: TipoSeccion[];
  formulario: FormGroup;

  formAcordeSeccion: FormGroup;
  acordesCancion: AcordesCancion[];
  indiceAcorde: number;
  tamanioInput: number = 4;

  //Configuraciones del modal compaces
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private tipoSeccionService:TipoSeccionService,
    private formBuilder: FormBuilder){
      this.formulario = this.formBuilder.group({
        secciones: this.formBuilder.array([])
      });

      this.acordesCancion = [{
        idSeccion: 0, ubicacion: '1-2', acorde: 'B#'
      }]
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

  AjustarTamanioInput() {
    const inputElement = this.inputAcorde.nativeElement as HTMLInputElement;
    this.tamanioInput = inputElement.value.length;
  }

  ExisteAcorde(seccion:number, renglon:number, cuadro: number):boolean{
    let elemento = this.acordesCancion.findIndex(x=> x.idSeccion == seccion && x.ubicacion == `${renglon}-${cuadro}` );
    if(elemento!=-1){
      this.indiceAcorde = elemento;

      let tamanioAcorde = this.acordesCancion[this.indiceAcorde].acorde?.length;
      this.tamanioInput = tamanioAcorde == undefined ? 4 : tamanioAcorde + 2;
      return true;
    }else{
      this.indiceAcorde = -1;
      return false;
    }
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

                  const seccion = this.formBuilder.group({
                    idTipo: new FormControl(tipoSeccion.id),
                    tipo: new FormControl(tipoSeccion.nombre),
                    letra: new FormControl(letraCompas),
                  });

                  this.secciones.push(seccion);
                });
    }else{
      const seccion = this.formBuilder.group({
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


  ObtenerRenglonesTexto(parrafo:string): string[] {
    const lineasTexto: string[] = [];
    const lineas = parrafo!.split('\n');
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (linea !== '') {
        lineasTexto.push(linea);
      }
    }
    return lineasTexto;
  }

}

