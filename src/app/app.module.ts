import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Otros
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

//Angular Material
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';


import { CancionesComponent } from './components/canciones/canciones/canciones.component';
import { SeleccionComponent } from './components/canciones/seleccion/seleccion.component';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { CompasComponent } from './components/canciones/compas/compas.component';
import { CancionDetalleComponent } from './components/canciones/cancion-detalle/cancion-detalle.component';
import { CancionAddmodComponent } from './components/canciones/cancion-addmod/cancion-addmod.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { PreferenciasComponent } from './components/preferencias/preferencias.component';
import { CategoriasComponent } from './components/categorias/categorias/categorias.component';
import { CategoriasAddmodComponent } from './components/categorias/categorias-addmod/categorias-addmod.component';
import { EliminarComponent } from './components/eliminar/eliminar.component';
import { CancionVistaComponent } from './components/canciones/cancion-vista/cancion-vista.component';

@NgModule({
  declarations: [
    AppComponent,
    CancionesComponent,
    SeleccionComponent,
    TextareaAutoresizeDirective,
    CompasComponent,
    CancionDetalleComponent,
    CancionAddmodComponent,
    NavegacionComponent,
    PreferenciasComponent,
    CategoriasComponent,
    CategoriasAddmodComponent,
    EliminarComponent,
    CancionVistaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),

    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatStepperModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
