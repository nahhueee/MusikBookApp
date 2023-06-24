import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-acordes',
  templateUrl: './acordes.component.html',
  styleUrls: ['./acordes.component.scss']
})
export class AcordesComponent {
  constructor(private elementRef: ElementRef) { }

  lineasTexto: string[] = [];

  ngAfterViewInit() {
    const parrafoElement = this.elementRef.nativeElement.querySelector('.mi-parrafo');
    this.lineasTexto = this.obtenerLineasTexto(parrafoElement);
    console.log('Líneas de texto:', this.lineasTexto);
  }

  obtenerLineasTexto(parrafo: string): string[] {
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
