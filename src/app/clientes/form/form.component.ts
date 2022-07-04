import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';


//LIBRERÍA EXTERNA - SWEET ALERT 2
import swal from 'sweetalert2'
import { throwError } from 'rxjs';
import { Region } from '../region';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  //ATRIBUTOS 
  public cliente: Cliente = new Cliente();
  regiones?:Region[];
  public titulo: string = "Crear cliente";
  public errores: string[] = [];
  //CONSTRUCTOR
  constructor(
    //--inyectar clase ClienteService
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    //Clientes
    this.cargarCliente();
    //Regiones
    this.clienteService.getRegiones().subscribe(regiones=>{
      this.regiones = regiones;  
    })
  }


  /* ---------------- Metodo CREAR CLIENTE ----------------*/
  /*El método se conectará a la API y persistir el
  objeto cliente a la API REST*/
  public create(): void {
    console.log(this.cliente);

    this.clienteService.create(this.cliente)
      .subscribe({
        next: (respForm) => {
          this.router.navigate(['/clientes']);
          swal.fire({
            title: 'Nuevo cliente',
            text: 'Cliente ' + this.cliente.nombre + ' creado con exito!',
            icon: 'success'
          })
        },
        error: () => {
          this.errores = this.clienteService.getErrores();  // pasar errores a la plantilla

        }
      })
    console.log("Click!");
    console.log(this.cliente);
  }

  /* ---------------- Metodo ACTUALIZAR CLIENTE ----------------*/
  //buscar cliente
  cargarCliente(): void {
    //Obtener parámetro de la URL (activatedRoute.params)
    this.activatedRoute.params.subscribe((params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => {
          this.cliente = cliente;
        });
      }
    }))
  }
  //actualizar cliente
  update(): void {
    console.log(this.cliente);
    //evitar recursión(no actualizar sus facturas)
    this.cliente.facturas!=null;
    this.clienteService.update(this.cliente).subscribe(
      {
        next: (clienteA) => {
          this.router.navigate(['/clientes']);
          swal.fire({
            title: 'Cliente actualizado',
            text: 'Cliente ' + this.cliente.nombre + ' actualizado con exito!',
            icon: `success`
          })
        },
        error: () => {
          this.errores = this.clienteService.getErrores(); //conversión opcional
        }

      })
  }

  //Comparar - CompareWith
  compararRegion(o1:Region,o2:Region):boolean{//o1: region ngFor, o2: objeto asignado al cliente
    if(o1===undefined && o2===undefined){
      return true;
    }
    //===: mismo tipo y valor
    //ERROR: return o1 === null || o2 === null ? false : o1.id === o2.id;
    //SOLUCIÓN 1 (usar ==): return o1 == null || o2 == null  ? false : o1.id === o2.id;
    //SOLUCIÓN 2 (agregar undefined)
    return o1 === null || o2 == null || o1 === undefined || o2 == undefined  ? false : o1.id === o2.id;

  }
}
