import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-compas',
  templateUrl: './compas.component.html',
  styleUrls: ['./compas.component.scss']
})
export class CompasComponent {
  CompasSeleccionado:number = 0;

  constructor(){}
}
