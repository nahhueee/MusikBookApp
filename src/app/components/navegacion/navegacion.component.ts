import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PreferenciasComponent } from '../preferencias/preferencias.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.scss']
})
export class NavegacionComponent {
  dialogConfig = new MatDialogConfig(); //Creamos un modal para las operaciones ABM

  constructor(
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    //Configuraciones básicas de modal
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.height = "auto";
  }

  Preferencias(){
    this.dialogConfig.width = "300px";
    this.dialog.open(PreferenciasComponent, this.dialogConfig)
               .afterClosed();
  }
  
  Navegar(path:string){
    this.router.navigateByUrl("/" + path);
  }
}
