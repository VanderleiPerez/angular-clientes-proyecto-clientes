

import { NgModule, Component, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//Componente para la comunicación con el servidor remoto
//-- permite realizar peticiones HTTP
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './clientes/form/form.component';

import { FormsModule } from '@angular/forms';
// localización
import { registerLocaleData } from '@angular/common';
// localización
import  localeES   from "@angular/common/locales/es";

//Localización i18n
registerLocaleData(localeES,'es');

const routes: Routes = [
  //Path '' es HOME
  {path: '',redirectTo:'/clientes',pathMatch:'full'},
  {path: 'directivas', component:DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent},
  {path: 'clientes/form/:id', component: FormComponent}
];

@NgModule({
  //Se importan los componentes
  declarations: [    
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent
  ],
  //Importar modulos
  imports: [
    BrowserModule,
    HttpClientModule, //Módulo para realizar peticiones HTTP
    FormsModule, // Módulo para realizar formulario
    RouterModule.forRoot(routes)
  ],
  //Importar servicios (Inyección de dependencia)
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
