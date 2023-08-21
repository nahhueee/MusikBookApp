import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TipoSeccion } from 'src/app/models/TipoSeccion';
import { TipoSeccionService } from 'src/app/services/tipo-seccion.service';
import { CompasComponent } from '../compas/compas.component';
import { Acorde } from 'src/app/models/Acorde';
import { DisparadorService } from 'src/app/services/disparador.service';
import { Seccion } from 'src/app/models/Seccion';
import { ActivatedRoute } from '@angular/router';
import { Cancion } from 'src/app/models/Cancion';
import { CancionesService } from 'src/app/services/canciones.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { DetalleCancion } from 'src/app/models/DetallesCancion';

@Component({
  selector: 'app-cancion-detalle',
  templateUrl: './cancion-detalle.component.html',
  styleUrls: ['./cancion-detalle.component.scss']
})
export class CancionDetalleComponent {
  seccionesCancion: Seccion[] = [];
  acordesCancion: Acorde[] = [];

  @Output() cancionGuardada = new EventEmitter();

  tiposSeccion: TipoSeccion[];
  formulario: FormGroup;

  @ViewChild('inputAcorde') inputAcorde!: ElementRef;
  indiceAcorde: number;
  lastAddedIndex: number = -1; // Variable para almacenar el índice del último input agregado

  seccionesCancionBorrar: Seccion[] = [];
  
  //Configuraciones del modal compaces
  dialogConfig = new MatDialogConfig();

  constructor(
    private dialog: MatDialog,
    private tipoSeccionService:TipoSeccionService,
    private formBuilder: FormBuilder,
    private disparadorService: DisparadorService,
    private rutaActiva: ActivatedRoute,
    private cancionService:CancionesService,
    private Notificaciones: NotificacionesService){

      //Arma el formulario de secciones
      this.formulario = this.formBuilder.group({
        secciones: this.formBuilder.array([])
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

  ActualizarArray(_detalles:DetalleCancion){
    this.seccionesCancion = _detalles.secciones;
    this.acordesCancion = _detalles.acordes;
    console.log(_detalles)

    //Llenamos la el form array con los datos de las letras de la cancion obtenidas de la DB
    for (let i = 0; i < this.seccionesCancion.length; i++) {

      const seccion = this.formBuilder.group({
        posicion: new FormControl(this.seccionesCancion[i].posicion),
        idTipoSeccion: new FormControl(this.seccionesCancion[i].idTipoSeccion),
        tipoSeccion: new FormControl(this.seccionesCancion[i].tipoSeccion),
        letra: new FormControl(this.seccionesCancion[i].letra),
        accion: new FormControl('G'),
        cambioPosicion: new FormControl(false),
        id: this.seccionesCancion[i].id,
        idCancion: this.seccionesCancion[i].idCancion
      });

      this.secciones.push(seccion);
    }
  }

  //#region MANEJO DE ACORDES EN LA LETRA

  //Abre el input de edicion de acorde en la ubicacion proporcionada
  //Pone el foco en el input abierto
  AbrirInput(idseccion:number, seccion:number, renglon:number, cuadro:number, nuevo:boolean) {
    if(nuevo){
      //Tengo que crear un nuevo elemento vacio para poder abrir el input en esa ubicación
      //Le asigamos la accion de I(Insertar) para luego agregarlo a la DB si tiene valor
      this.acordesCancion.push({idSeccion:idseccion, posSeccion:seccion, ubicacion: `${renglon}-${cuadro}`,  acorde: '', inputAbierto: false, accion: 'I'});
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
      // let elemento = this.acordesCancion.findIndex(x=> x.ubicacion == `${seccion}-${renglon}-${cuadro}` );
      let elemento = this.acordesCancion.findIndex(x=> x.ubicacion == `${renglon}-${cuadro}` && x.posSeccion == seccion );

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

  ObtenerProximaPosicion():number{
    var mayor = 0;

    if(this.secciones.controls.length===0){
      return mayor;
    }else{
      for(var i = 0; i < this.secciones.controls.length; i++){
        if (this.secciones.controls[i].value.posicion > mayor)
        {
            mayor = this.secciones.controls[i].value.posicion;
        }
      }
    }
    
    return mayor + 1;
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
                    posicion: new FormControl(this.ObtenerProximaPosicion()),
                    idTipoSeccion: new FormControl(tipoSeccion.id),
                    tipoSeccion: new FormControl(tipoSeccion.nombre),
                    letra: new FormControl(letraCompas),
                    accion: new FormControl('I'),
                    cambioPosicion: new FormControl(false),
                    id: new FormControl(0),
                    idCancion: new FormControl(0),
                  });

                  this.secciones.push(seccion);
                });
    }else{
      const seccion = this.formBuilder.group({
        posicion: new FormControl(this.ObtenerProximaPosicion()),
        idTipoSeccion: new FormControl(tipoSeccion.id),
        tipoSeccion: new FormControl(tipoSeccion.nombre),
        letra: new FormControl(''),
        accion: new FormControl('I'),
        cambioPosicion: new FormControl(false),
        id: new FormControl(0),
        idCancion: new FormControl(0),
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
    if(seccion.id!=0){
      seccion.accion = 'B';
      this.seccionesCancionBorrar.push(seccion);

      //Pongo en estado B(Baja) los acordes relacionados a esta seccion guardada
      this.acordesCancion.forEach(acorde => {
        if (acorde.idSeccion === (seccion.id)) {
          acorde.accion = "B";
        }
      });
    }else{
      
      //Si la seccion no esta guardada en la DB
      //Elimino del array acordes, todos los que esten asociados a 
      //la posicion de esta seccion
      this.acordesCancion.forEach(acorde => {
        if (acorde.posSeccion === (item)) {
          this.acordesCancion = this.acordesCancion.filter(x=> x.posSeccion != item)
        }
      });
    }

    this.secciones.removeAt(item)
  }

  //Intercambia la posición del item por el item que esta a su izquierda en el array
  SubirItem(item:number){
    let aux = this.secciones.controls[item];

    this.secciones.controls[item] = this.secciones.controls[item-1];
    this.secciones.controls[item-1] = aux;

    //Indicamos que las secciones cambiaron de posicion
    this.secciones.controls[item].value.cambioPosicion = true;
    this.secciones.controls[item].value.accion = "M"

    this.secciones.controls[item-1].value.cambioPosicion = true;
    this.secciones.controls[item-1].value.accion = "M"
  }

  // Intercambia la posición del item por el item que esta a su derecha en el array
  BajarItem(item:number){
    let aux = this.secciones.controls[item];

    this.secciones.controls[item] = this.secciones.controls[item+1];
    this.secciones.controls[item+1] = aux;

    //Indicamos que las secciones cambiaron de posicion
    this.secciones.controls[item].value.cambioPosicion = true;
    this.secciones.controls[item].value.accion = "M"

    this.secciones.controls[item+1].value.cambioPosicion = true;
    this.secciones.controls[item+1].value.accion = "M"
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

  //Revisa que la letra de una seccion que ya esta guardada fue modificada para luego actualizarña
  LetraActualizada(seccion:number, posicion:number) {
    if(seccion!=0){
      this.secciones.controls[posicion].value.accion = 'M';
    }
  }
  //#endregion

  //#region GUARDADO DE DATOS
  GuardarDetalles(cancion:Cancion, modificar:boolean){
    
    //Llenamos el array de secciones con los valores del arrayForm
    this.seccionesCancion = [];
    
    for (let i = 0; i < this.secciones.controls.length; i++) {
      //Si la seccion cambió de posicion la ponemos para modificar
      if(this.secciones.controls[i].value.cambioPosicion){this.secciones.controls[i].value.accion = "M"} 

      this.seccionesCancion.push(new Seccion(this.secciones.controls[i].value));
    }
    //Completamos el array de secciones con las que se van a eliminar
    for (let i = 0; i < this.seccionesCancionBorrar.length; i++) {
      this.seccionesCancionBorrar[i].posicion = -1; //Asignamos -1 porque se va a borrar
      this.seccionesCancion.push(new Seccion(this.seccionesCancionBorrar[i]));
    }

    var detallesCancion = new DetalleCancion();
    detallesCancion.acordes = this.acordesCancion;
    detallesCancion.secciones = this.seccionesCancion;

    cancion.detalles = detallesCancion;

    if(!modificar){
      this.NuevaCancion(cancion);
    }else{
      this.ModificarCancion(cancion);
    }
  }

  NuevaCancion(cancion:Cancion){
    this.cancionService.Agregar(cancion)
    .then(response => {
      if(response>0){
        this.seccionesCancion = [];
        this.acordesCancion = [];
        this.secciones.controls = [];
        this.seccionesCancionBorrar = [];

        //INFORMAR AL PADRE DEL GUARDADO 
        this.cancionGuardada.emit(response);
        this.Notificaciones.success("Nueva cancion agregada correctamente");
      }
    }).catch(err => {
      this.Notificaciones.error("No se pudo guardar la canción");
      console.log(err);
  });
  }

  ModificarCancion(cancion:Cancion){
    this.cancionService.Modificar(cancion)
    .then(response => {
      if(response==true){
        this.seccionesCancion = [];
        this.acordesCancion = [];
        this.secciones.controls = [];
        this.seccionesCancionBorrar = [];

        //INFORMAR AL PADRE DEL GUARDADO 
        this.cancionGuardada.emit(cancion.id);
        this.Notificaciones.success("Canción modificada correctamente");
      }
    }).catch(err => {
      this.Notificaciones.error("No se pudo guardar la canción");
      console.log(err);
  });
  }
  //#endregion
}
