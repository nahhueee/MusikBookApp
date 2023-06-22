import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Otros
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


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


import { CancionesComponent } from './components/canciones/canciones/canciones.component';
import { SeleccionComponent } from './components/canciones/seleccion/seleccion.component';
import { CancionesAddmodComponent } from './components/canciones/canciones-addmod/canciones-addmod.component';
import { LetrasComponent } from './components/canciones/letras/letras.component';
import { TextareaAutoresizeDirective } from './textarea-autoresize.directive';
import { CompasComponent } from './components/canciones/compas/compas.component';
import { AcordesComponent } from './components/canciones/acordes/acordes.component';
import { SeccionesCancionComponent } from './components/canciones/secciones-cancion/secciones-cancion.component';

@NgModule({
  declarations: [
    AppComponent,
    CancionesComponent,
    SeleccionComponent,
    CancionesAddmodComponent,
    LetrasComponent,
    TextareaAutoresizeDirective,
    CompasComponent,
    AcordesComponent,
    SeccionesCancionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,

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
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
