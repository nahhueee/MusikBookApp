import { Component, Inject  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/models/Categoria';
import { CategoriasService } from 'src/app/services/categorias.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-categorias-addmod',
  templateUrl: './categorias-addmod.component.html',
  styleUrls: ['./categorias-addmod.component.scss']
})
export class CategoriasAddmodComponent {
  modificando:boolean;
  titulo:string='';

  formulario: FormGroup;
  categoria:Categoria = new Categoria();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriasService:CategoriasService,
    private Notificaciones:NotificacionesService
  ) {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      color: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.modificando = this.data.categoria!='' ? true : false; //Si recibo una categoria está modificando
    this.titulo= this.modificando == true ? 'Modificar Categoria' : 'Agregar Nueva Categoria';

    if(this.modificando){
      this.ObtenerCategoria();
    }
  }

  ObtenerCategoria(){
    this.categoriasService.ObtenerCategoria(this.data.categoria)
      .then(response => {
        this.categoria = new Categoria(response);
        this.formulario.get('nombre')?.setValue(this.categoria.nombre);
        this.formulario.get('color')?.setValue(this.categoria.color);
      }).catch(err => {
        console.log(err);
      });
  }

  Agregar(){
    this.categoria.nombre =  this.formulario.get('nombre')?.value;
    this.categoria.color =  this.formulario.get('color')?.value;

    this.categoriasService.ConsultarExistencia(this.categoria.nombre)
      .then(response => {
        if(response==false){//Si no existe guardamos

          this.categoriasService.Agregar(this.categoria)
          .then(response => {
            if(response){
              this.Notificaciones.success("Categoria creada correctamente");
            }else{
              this.Notificaciones.error("No se pudo dar de alta la categoria");
            }
          }).catch(err => {
            console.log(err);
          });

        }else{//Si existe informamos
          this.Notificaciones.info("Ya existe una categoria con el mismo nombre");
        }

      }).catch(err => {
        console.log(err);
      });
  }

  Modificar(){
    this.categoria.nombre =  this.formulario.get('nombre')?.value;
    this.categoria.color =  this.formulario.get('color')?.value;

    this.categoriasService.Modificar(this.categoria)
      .then(response => {
        if(response){
          this.Notificaciones.success("Categoria modificada correctamente");
        }else{
          this.Notificaciones.error("No se pudo modificar la categoria");
        }
      }).catch(err => {
        console.log(err);
      });
  }
}
