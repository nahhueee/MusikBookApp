import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay'
import { PreferenciasService } from 'src/app/services/preferencias.service';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.scss']
})
export class PreferenciasComponent {
  colores = [
    {img: "assets/colores/rojo.png", texto: 'Rojo', value: 'red-theme'},
    {img: "assets/colores/rosa.png", texto: 'Rosa', value: 'pink-theme'},
    {img: "assets/colores/azul.png", texto: 'Azul', value: 'blue-theme'},
    {img: "assets/colores/verde.png", texto: 'Verde', value: 'green-theme'},
  ];

  esDark = false;
  colorSeleccionado = '';

  @HostBinding('class') componentsCssClass:any;

  constructor(public overlayContainer:OverlayContainer, private preferenciasService:PreferenciasService) { }

  ngOnInit(): void {
    this.colorSeleccionado = this.preferenciasService.Tema();
    this.esDark = this.preferenciasService.EsDark()=='true' ? true : false;
  }

  selectColor(color:string){
    this.colorSeleccionado = color;
  }

  //Guarda en LocalStorage el color del tema y si es o no dark
  cambiarTema(){
    if(this.esDark){
      this.esDark = true;
      localStorage.setItem('dark', 'true')
    }else{
      this.esDark = false;
      localStorage.setItem('dark', 'false')
    }
    localStorage.setItem('tema', this.colorSeleccionado)
    window.location.reload();
  }
}
