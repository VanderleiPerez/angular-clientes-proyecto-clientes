import { Component, OnInit } from '@angular/core';
import { startWith, tap, map, mergeMap } from 'rxjs/operators';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
  //styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = "Nueva Factura";
  factura: Factura = new Factura();

  //AngularMaterial
  autoCompleterControl = new FormControl('');
  //productos: string[] = ['Mesa', 'Tablet', 'Tv Sansung'];

  productosFiltrados?: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturasService: FacturasService,
    private router:Router
  ) { }

  ngOnInit(): void {
    //Asignar cliente al objeto factura
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId')! || 0; //appModulo: clienteId
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
      console.log(this.factura.cliente);

    })
    //AngularMaterial
    this.productosFiltrados = this.autoCompleterControl.valueChanges.pipe( //valueChange: retorna un observable | observable immutable en flujo reactivo
      // startWith(''),
      //observable a otro observable 
      map(value => typeof value === 'string' ? value : value.nombre),
      mergeMap(value => value ? this._filter(value || '') : []), //aplanar valores de un observable, dentro de otro
    );

  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturasService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string {
    return producto ? producto.nombre : "";
  }


  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto; //genérico a producto
    console.log(producto);

    //validación existencia de item
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      //nueva linea
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);

    }


    //limpiar auto complete
    this.autoCompleterControl.setValue('');
    console.log(event);
    //quitar focus
    event.option.focus();
    //quitar producto
    event.option.deselect();
  }


  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if(cantidad ==0){
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  //Aumentar la cantidad de una linea de un producto
  existeItem(id: number): boolean {
    let existe = false;
  
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }
  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }


  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura)=> id != item.producto.id) ;
  }

  //crear factura
  create(facturaForm:any):void{
    console.log(this.factura);

    if(this.factura.items.length==0){
      this.autoCompleterControl.setErrors({'invalid':true});
    }

    if(facturaForm.form.valid && this.factura.items.length>0){ //crear cuando sea válido
      this.facturasService.create(this.factura).subscribe(factura=>{
        swal.fire(this.titulo,`Factura ${factura.descripcion} creada con éxito!`,'success');
        this.router.navigate(['/clientes']);
      })
    }
    

    
  }

}
