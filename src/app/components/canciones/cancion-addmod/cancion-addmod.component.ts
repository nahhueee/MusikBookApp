import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Acorde } from 'src/app/models/Acorde';
import { Cancion } from 'src/app/models/Cancion';
import { Categoria } from 'src/app/models/Categoria';
import { Seccion } from 'src/app/models/Seccion';
import { TipoCancion } from 'src/app/models/TipoCancion';
import { CancionesService } from 'src/app/services/canciones.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DisparadorService } from 'src/app/services/disparador.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { TipoCancionService } from 'src/app/services/tipo-cancion.service';
import { CancionDetalleComponent } from '../cancion-detalle/cancion-detalle.component';

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

  categorias: Categoria[];
  tiposCancion: TipoCancion[];

  //Referencia al componente que contiene las secciones y acordes de la canción
  @ViewChild(CancionDetalleComponent, { static: false }) ComponenteDetallesCancion: CancionDetalleComponent;

  constructor(
    private cancionService:CancionesService,
    private Notificaciones: NotificacionesService,
    private disparadorService: DisparadorService,
    private categoriasService: CategoriasService,
    private tiposCancionService:TipoCancionService,
    private router: Router,
    private rutaActiva: ActivatedRoute){

    //Creamos el formulario para los datos de la cabecera de la cancion
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      tonica: new FormControl(''),
      bpm: new FormControl(''),
      idCategoria: new FormControl(''),
      idTipo: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(){
    this.ObtenerCategorias();
    this.ObtenerTiposCancion();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      //Obtengo el tipo de cancion a cargar desde la URL
      let parametro: number = parseInt(this.rutaActiva.snapshot.params['tipo']);
      if(parametro)
        this.formulario.get('idTipo')?.setValue(parametro);

      //Obtengo el id de la cancion a consultar desde URL
      let idCancion: number = parseInt(this.rutaActiva.snapshot.params['cancion']);
      if(idCancion)
        this.ObtenerCancion(idCancion);
    }, 0);
  }

  ObtenerCategorias(){
    this.categoriasService.ObtenerCategoriasSelector()
      .then(response => {
        this.categorias = new Array<Categoria>();

        for (let i = 0; i < response.length; i++) {
          this.categorias.push(new Categoria(response[i]));
        }
      });
  }

  ObtenerTiposCancion(){
    this.tiposCancionService.ObtenerTiposCancion()
      .then(response => {
        this.tiposCancion = new Array<TipoCancion>();

        for (let i = 0; i < response.length; i++) {
          this.tiposCancion.push(new TipoCancion(response[i]));
        }
      });
  }

  ObtenerCancion(idCancion:number){
    this.cancionService.ObtenerCancion(idCancion)
      .then(response => {
        this.cancion.id = idCancion;
        this.formulario.get('nombre')?.setValue(response.nombre);
        this.formulario.get('tonica')?.setValue(response.tonica);
        this.formulario.get('bpm')?.setValue(response.bpm);
        this.formulario.get('idCategoria')?.setValue(response.idCategoria);

        //Envia al componente cancion-detalle los acordes y secciones
        this.ComponenteDetallesCancion.ActualizarArray(response.detalles);
      });
  }

  Guardar(){
    if (this.formulario.invalid)
    return;

    this.cancion.nombre =  this.formulario.get('nombre')?.value;
    this.cancion.tonica =  this.formulario.get('tonica')?.value;
    this.cancion.bpm =  this.formulario.get('bpm')?.value;
    this.cancion.idCategoria = this.formulario.get('idCategoria')?.value;
    this.cancion.idTipoCancion = this.formulario.get('idTipo')?.value;
    
    if(this.cancion.id==0){ //Insertamos una nueva cancion

      //Consulta si existe una cancion con este nombre y el tipo de cancion
      this.cancionService.ConsultarExistencia(this.cancion.nombre, this.cancion.idTipoCancion)
      .then(response => {
        if(response==false){//Si no existe guardamos
          //Le indicamos al componente hijo que tiene que guardar, la cancion y sus detalles
          this.ComponenteDetallesCancion.GuardarDetalles(this.cancion, false);
        }else{//Si existe informamos
          this.Notificaciones.info("Ya existe una canción de este tipo con el mismo nombre");
        }

      }).catch(err => {
        console.log(err);
      });

    }else{ //Modificamos la cancion
      this.ComponenteDetallesCancion.GuardarDetalles(this.cancion, true);
    }
    
  }

  //Recibe del componente cancion-detalle el id de la nueva cancion guardada
  CancionGuardada(idCancion:number){
    //Cambiamos la URL con el nuevo ID y buscamos sus detalles actualizados
    this.router.navigateByUrl(`/canciones/${this.cancion.idTipoCancion}/${idCancion}`);
    this.ObtenerCancion(idCancion);
  }

  Cancelar(){
    this.router.navigateByUrl("/canciones/");
  }
}
