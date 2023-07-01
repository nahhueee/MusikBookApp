import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TipoSeccion } from 'src/app/models/TipoSeccion';
import { TipoSeccionService } from 'src/app/services/tipo-seccion.service';
import { CompasComponent } from '../compas/compas.component';
import { AcordesCancion } from 'src/app/models/Acordes_Cancion';
import { DisparadorService } from 'src/app/services/disparador.service';

@Component({
  selector: 'app-cancion-detalle',
  templateUrl: './cancion-detalle.component.html',
  styleUrls: ['./cancion-detalle.component.scss']
})
export class CancionDetalleComponent {
  @Input() IdCancion: number | undefined;

  tiposSeccion: TipoSeccion[];
  formulario: FormGroup;

  @ViewChild('inputAcorde') inputAcorde!: ElementRef;
  acordesCancion: AcordesCancion[];
  indiceAcorde: number;

  //Configuraciones del modal compaces
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private tipoSeccionService:TipoSeccionService,
    private formBuilder: FormBuilder,
    private disparadorService: DisparadorService){

      // Se suscribe al evento del disparador para guardar detalles de la canción
      this.disparadorService.$GuardarDetallesCancion.subscribe((parametro) => {
        this.IdCancion = parametro;
        console.log(this.IdCancion)
      });

      //Arma el formulario de secciones
      this.formulario = this.formBuilder.group({
        secciones: this.formBuilder.array([])
      });

      this.acordesCancion = [{
        ubicacion: '0-1-2', acorde: 'B#', inputAbierto: false
      },{
        ubicacion: '0-0-5', acorde: 'D#', inputAbierto: false
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

  //#region MANEJO DE ACORDES EN LA LETRA

  //Abre el input de edicion de acorde en la ubicacion proporcionada
  //Pone el foco en el input abierto
  AbrirInput(seccion:number, renglon:number, cuadro:number, nuevo:boolean) {
    if(nuevo){
      //Tengo que crear un nuevo elemento vacio para poder abrir el input en esa ubicación
      this.acordesCancion.push({ubicacion: `${seccion}-${renglon}-${cuadro}`,  acorde: '', inputAbierto: false});
    }

    this.acordesCancion[this.ObtenerIndexUbicacion(seccion,renglon,cuadro)].inputAbierto = true;
    setTimeout(() => {
      this.inputAcorde.nativeElement.focus();
    });
  }

  //Cierra el input de edicion de acorde en la ubicacion proporcionada
  CerrarInput(seccion:number, renglon:number, cuadro: number){
    let acorde:string = this.inputAcorde.nativeElement.value;

    if(acorde){
      //Si se escribió un valor actualizamos el acorde en la ubicacion y cerramos el input
      let index = this.ObtenerIndexUbicacion(seccion,renglon,cuadro);
      this.acordesCancion[index].acorde = acorde;
      this.acordesCancion[index].inputAbierto = false;
    }else{
      //Si el valor esta vacio borramos el elemento, para no tener acordes vacios
      this.acordesCancion.splice(this.ObtenerIndexUbicacion(seccion,renglon,cuadro), 1);
    }
  }

  //Obtiene el indice del acorde segun las coordenadas proporcionadas
  //Devuelve: -1 si es que no existe acorde en esa ubicacion
  //Devuelve: <> -1 Significa que hay un acorde en esa ubicacion
  ObtenerIndexUbicacion(seccion:number, renglon:number, cuadro: number):number{
    let elemento = this.acordesCancion.findIndex(x=> x.ubicacion == `${seccion}-${renglon}-${cuadro}` );
    if(elemento!=-1){
      this.indiceAcorde = elemento;
      return elemento;
    }else{
      this.indiceAcorde = -1;
      return -1;
    }
  }
  //#endregion

  //#region MANEJO DE SECCIONES DE LA LETRA

  //Obtiene el listado del tipo de secciones que se pueden agregar a la letra
  ObtenerTiposSeccion(){
    this.tipoSeccionService.ObtenerTiposSeccion()
      .then(response => {
        this.tiposSeccion = new Array<TipoSeccion>();

        for (let i = 0; i < response.length; i++) {
          this.tiposSeccion.push(new TipoSeccion(response[i]));
        }
      });
  }

  //Añade un nuevo campo de sección a la lista de secciones
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

  //Intercambia la posición del item por el item que esta a su izquierda en el array
  SubirItem(item:number){
    let aux = this.secciones.controls[item];
    this.secciones.controls[item] = this.secciones.controls[item-1];
    this.secciones.controls[item-1] = aux;
  }

  // Intercambia la posición del item por el item que esta a su derecha en el array
  BajarItem(item:number){
    let aux = this.secciones.controls[item];
    this.secciones.controls[item] = this.secciones.controls[item+1];
    this.secciones.controls[item+1] = aux;
  }

  //Obtiene el número de renglones que tiene un parrafo o seccion de la letra
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

  //#endregion

  //#region GUARDADO DE DATOS

  //#endregion
}
