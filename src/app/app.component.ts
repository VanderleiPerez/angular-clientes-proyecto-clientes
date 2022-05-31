import { Component } from '@angular/core';

//Decorador
@Component({
  //etiqueta <app-root></app-root> en index.html (general)
  selector: 'app-root',
  templateUrl: './app.component.html',
  //CSS del componente (particular)
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenido a Angular';
  curso:string = 'Curso Spring 5 con Angular';
  nombre:string = 'Vanderlei Pérez';
}
