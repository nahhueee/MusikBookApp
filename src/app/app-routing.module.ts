import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeleccionComponent } from './components/canciones/seleccion/seleccion.component';
import { CancionesComponent } from './components/canciones/canciones/canciones.component';
import { CancionesAddmodComponent } from './components/canciones/canciones-addmod/canciones-addmod.component';
import { AcordesComponent } from './components/canciones/acordes/acordes.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component:CancionesComponent,
  },
  {
    path: 'addmod',
    component:CancionesAddmodComponent,
  },

  {
    path: 'prueba',
    component:AcordesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
