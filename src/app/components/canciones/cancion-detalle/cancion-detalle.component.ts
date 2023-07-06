import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TipoSeccion } from 'src/app/models/TipoSeccion';
import { TipoSeccionService } from 'src/app/services/tipo-seccion.service';
import { CompasComponent } from '../compas/compas.component';
import { Acorde } from 'src/app/models/Acorde';
import { DisparadorService } from 'src/app/services/disparador.service';
import { DetalleCancion } from 'src/app/models/Detalle_Cancion';
import { Seccion } from 'src/app/models/Seccion';

@Component({
  selector: 'app-cancion-detalle',
  templateUrl: './cancion-detalle.component.html',
  styleUrls: ['./cancion-detalle.component.scss']
})
export class CancionDetalleComponent {
  @Input() IdCancion: number | undefined = 0;

  tiposSeccion: TipoSeccion[];
  formulario: FormGroup;

  @ViewChild('inputAcorde') inputAcorde!: ElementRef;
  indiceAcorde: number;
  lastAddedIndex: number = -1; // Variable para almacenar el índice del último input agregado

  detallesCancion: DetalleCancion;
  seccionesCancion: Seccion[] = [];
  seccionesCancionBorrar: Seccion[] = [];
  acordesCancion: Acorde[] = [];

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
        this.Guardar();
      });

      //Arma el formulario de secciones
      this.formulario = this.formBuilder.group({
        secciones: this.formBuilder.array([])
      });

      this.acordesCancion = [{ubicacion: '0-1-2',  acorde: 'B', inputAbierto: false, accion: 'G'}]
      this.seccionesCancion = [{idSeccion: 1, idTipoSeccion: 2, tipoSeccion: 'Verso', letra: 'Quien podrá separarme de ti Dios', accion: 'G'}]
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

    //Llenamos la el form array con los datos de las letras de la cancion obtenidas de la DB
    for (let i = 0; i < this.seccionesCancion.length; i++) {

      const seccion = this.formBuilder.group({
        idSeccion: new FormControl(this.seccionesCancion[i].idSeccion),
        idTipoSeccion: new FormControl(this.seccionesCancion[i].idTipoSeccion),
        tipoSeccion: new FormControl(this.seccionesCancion[i].tipoSeccion),
        letra: new FormControl(this.seccionesCancion[i].letra),
        accion: new FormControl(this.seccionesCancion[i].accion),
      });

      this.secciones.push(seccion);
    }
  }

  //#region MANEJO DE ACORDES EN LA LETRA

  //Abre el input de edicion de acorde en la ubicacion proporcionada
  //Pone el foco en el input abierto
  AbrirInput(seccion:number, renglon:number, cuadro:number, nuevo:boolean) {
    if(nuevo){
      //Tengo que crear un nuevo elemento vacio para poder abrir el input en esa ubicación
      //Le asigamos la accion de I(Insertar) para luego agregarlo a la DB si tiene valor
      this.acordesCancion.push({ubicacion: `${seccion}-${renglon}-${cuadro}`,  acorde: '', inputAbierto: false, accion: 'I'});
    }

    this.acordesCancion[this.ObtenerIndexUbicacion(seccion,renglon,cuadro)].inputAbierto = true;
    setTimeout(() => {
      this.inputAcorde.nativeElement.focus();
    });
  }

  //Cierra el input de edicion de acorde en la ubicacion proporcionada
  CerrarInput(seccion:number, renglon:number, cuadro: number){
    let acorde:string = this.inputAcorde.nativeElement.value;
    let index = this.ObtenerIndexUbicacion(seccion,renglon,cuadro);

    if(acorde && acorde!="-"){
      //Si se escribió un valor actualizamos el acorde en la ubicacion y cerramos el input
      this.acordesCancion[index].acorde = acorde;
      this.acordesCancion[index].inputAbierto = false;

      //Si la accion es distinta de I, significa que ya esta guardado en la DB.
      //Por lo cual, si se cambia el acorde en esta ubicacion le ponemos la accion de M(Modificar)
      if(this.acordesCancion[index].accion != 'I')
        this.acordesCancion[index].accion = 'M';

    }else{
      if(this.acordesCancion[index].accion == 'I'){
        //Como la accion del elemento es I(Insertar), borramos del array el acorde vacio
        this.acordesCancion.splice(this.ObtenerIndexUbicacion(seccion,renglon,cuadro), 1);
      }else{
        //Como ya esta guardado el elemento en DB, procedemos a ponerle la accion B(Borrar)
        //Y ponerle el valor "-" para que el usuario sepa que el acorde se va a eliminar cuando guarde
        this.acordesCancion[index].accion = 'B';
        this.acordesCancion[index].acorde = '-';
        this.acordesCancion[index].inputAbierto = false;
      }
    }
  }

  //Obtiene el indice del acorde segun las coordenadas proporcionadas
  //Devuelve: -1 si es que no existe acorde en esa ubicacion
  //Devuelve: <> -1 Significa que hay un acorde en esa ubicacion
  ObtenerIndexUbicacion(seccion:number, renglon:number, cuadro: number):number{
    if(this.acordesCancion.length>0){
      let elemento = this.acordesCancion.findIndex(x=> x.ubicacion == `${seccion}-${renglon}-${cuadro}` );
      if(elemento!=-1){
        this.indiceAcorde = elemento;
        return elemento;
      }
    }

    this.indiceAcorde = -1;
    return -1;
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
                    idSeccion: new FormControl(0),
                    idTipoSeccion: new FormControl(tipoSeccion.id),
                    tipoSeccion: new FormControl(tipoSeccion.nombre),
                    letra: new FormControl(letraCompas),
                    accion: new FormControl('I'),
                  });

                  this.secciones.push(seccion);
                });
    }else{
      const seccion = this.formBuilder.group({
        idSeccion: new FormControl(0),
        idTipoSeccion: new FormControl(tipoSeccion.id),
        tipoSeccion: new FormControl(tipoSeccion.nombre),
        letra: new FormControl(''),
        accion: new FormControl('I'),
      });

      this.secciones.push(seccion);
    }
  }

  //Borra una seccion de la lista de secciones
  BorrarSeccion(item:number){
    let seccion = this.secciones.controls[item].value;

    //Si la seccion a borrar ya se encuentra guardada en la DB
    //lo agregamos a un array auxiliar para luego borrarla de la DB
    //y que no interfiera en el orden de las secciones
    if(seccion.idSeccion!=0){
      seccion.accion = 'B';
      this.seccionesCancionBorrar.push(seccion);
    }

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
  Guardar(){
    this.detallesCancion = new DetalleCancion();

    //Llenamos el array de secciones con los valores del arrayForm
    this.seccionesCancion = [];
    for (let i = 0; i < this.secciones.controls.length; i++) {
      this.secciones.controls[i].value.orden = i; //Asignamos su orden actual
      this.seccionesCancion.push(new Seccion(this.secciones.controls[i].value));
    }
    //Completamos el array de secciones con las que se van a eliminar
    for (let i = 0; i < this.seccionesCancionBorrar.length; i++) {
      this.seccionesCancionBorrar[i].orden = -1; //Asignamos -1 porque se va a borrar
      this.seccionesCancion.push(new Seccion(this.seccionesCancionBorrar[i]));
    }

    this.detallesCancion.idCancion = this.IdCancion;
    this.detallesCancion.secciones = this.seccionesCancion;
    this.detallesCancion.acordes = this.acordesCancion;

    console.log(this.detallesCancion.secciones)
  }
  //#endregion
}
