

import { NgModule, Component, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//Componente para la comunicación con el servidor remoto
//-- permite realizar peticiones HTTP
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
// localización
import { registerLocaleData } from '@angular/common';
// localización
import  localeES   from "@angular/common/locales/es";
// Angular material
import {   MatNativeDateModule } from "@angular/material/core";
import {  MatDatepickerModule } from "@angular/material/datepicker";
//import { MatFormFieldModule } from '@angular/material/form-field'; para <map-hint>
import { MatMomentDateModule } from '@angular/material-moment-adapter';
//COMPONENTES
import { PaginatorComponent } from './paginator/paginator.component';
import { FormComponent } from './clientes/form/form.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { Token } from '@angular/compiler';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
//AngularMaterial Autocomplete
import {MatAutocompleteModule} from '@angular/material/autocomplete';
//--Material input
import {MatInputModule} from '@angular/material/input';
//--Material form
import {MatFormFieldModule} from '@angular/material/form-field';

//Localización i18n
registerLocaleData(localeES,'es');

const routes: Routes = [
  //Path '' es HOME
  {path: '',redirectTo:'/clientes',pathMatch:'full'},
  {path: 'directivas', component:DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent,canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_ADMIN'}}, //registrar guard | RoleGuard: Roles
  {path: 'clientes/form/:id', component: FormComponent,canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_ADMIN'}},
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id',component: DetalleFacturaComponent, canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_USER'}},
  {path: 'facturas/form/:clienteId',component: FacturasComponent, canActivate:[AuthGuard,RoleGuard], data:{role:'ROLE_ADMIN'}},

  //Visualizar imagen - sin modal
  //{path: 'clientes/ver/:id', component: DetalleComponent}

];

@NgModule({
  //Se importan los componentes
  declarations: [    
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  //Importar modulos
  imports: [
    BrowserModule,
    HttpClientModule, //Módulo para realizar peticiones HTTP
    FormsModule, // Módulo para realizar formulario
    RouterModule.forRoot(routes), BrowserAnimationsModule,
    MatDatepickerModule, MatNativeDateModule,
    ReactiveFormsModule,//Material - form
    MatAutocompleteModule, //Material - form
    MatInputModule, //Material - form
    MatFormFieldModule, //Material - form
    MatMomentDateModule //-- no implementado (requiere: install npm install --save moment)
    //MatFormFieldModule 
  ],
  //Importar servicios (Inyección de dependencia)
  providers: [
    {provide: LOCALE_ID, useValue: 'es'},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true}, //Interceptor cabeceras
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}, //Interceptor cabeceras

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
