import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancionesComponent } from './components/canciones/canciones/canciones.component';
import { CancionAddmodComponent } from './components/canciones/cancion-addmod/cancion-addmod.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/canciones',
    pathMatch: 'full'
  },
  {
    path: 'canciones',
    component:CancionesComponent,
  },
  {
    path: 'canciones/:tipo/:cancion',
    component:CancionAddmodComponent,
  },
  {
    path: '**',
    redirectTo: '/canciones',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
