import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {
  //ATRIBUTOS
  //Inyección de dependencia de la clase PADRE(cliente) ->clase HIJA(paginator)
  @Input() paginador: any; //paginaciónd e la clase padre (CLIENTE)
  paginas: number[] = [];
  //manejo de rangos de paginación
  desde: number = 0;
  hasta: number = 0;
  //CONSTRUCTOR
  constructor() { }
  //NGONINIT
  ngOnInit(): void {
    //Primer llamado cuando inicializa la página
    this.initPaginator();
  }
  //NGONCHANGE : Para cambios del objeto paginador y obtener valor que cambió
  /*
  -- al cambiar parámetro de la página, cambia estado del padre y notifica al hijo
  ---- solo sucede cuando hay algún cambio
  */
  ngOnChanges(changes: SimpleChanges): void {
    //a través de los changes, se obtiene el cambio del input del objeto paginador
    let paginadorActualizado = changes['paginador'];
    if (paginadorActualizado.previousValue) {//estado anterior que haya cambiado
      this.initPaginator();
    }
  }


  //MÉTODO PARA EL PAGINADO
  private initPaginator(): void {
    //manejo de rangos de paginación
    this.desde = Math.min(Math.max(1, this.paginador.number - 2), this.paginador.totalPages - 5);
    this.hasta = Math.min(this.paginador.totalPages, this.desde + 5);
    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0)
        .map((_valor, indice) => indice + this.desde);
    }
    //paginador | fill: llenado de arreglo | map: modificar datos
    else {
      this.paginas = new Array(this.paginador.totalPages).fill(0)
        .map((_valor, indice) => indice + 1);
    }
  }
}