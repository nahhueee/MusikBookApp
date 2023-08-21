import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay'
import { PreferenciasService } from './services/preferencias.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MusikBookApp';

  esDark = false;
  color = '';

  @HostBinding('class') componentsCssClass:any;

  constructor(public overlayContainer:OverlayContainer, private preferenciasService:PreferenciasService){
    //Comprueba el tema y si es dark al inicio de la aplicación
    this.color = this.preferenciasService.Tema();

    console.log(this.color)
    //Si no existe el parametro en Local Storage procedemos a asignar un color y tema
    if(this.color=='null'){
      this.color = 'green-theme';
      localStorage.setItem('tema', 'green-theme')
      localStorage.setItem('dark', 'false');
    }


    if(this.preferenciasService.EsDark()=='true'){
      this.color += "-dark";
      this.esDark = true;
    }else{
      this.esDark = false;
    }

    this.overlayContainer.getContainerElement().classList.add(this.color);
    this.componentsCssClass = this.color;
  }
}
