import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2'
//tap
import {tap} from 'rxjs/operators'
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  //Inyección de Dependencia
  //Al ser private implicitamente hace this.clienteService=clienteService
  constructor(private clienteService: ClienteService) {
  }
  ngOnInit(): void {

    /* ---------------- SERVICES: LISTAR CLIENTE ----------------*/
    //Suscribir a cliente()
    this.clienteService.getClientes()
    .pipe(
      tap(clientes=>{
        //Función anónima
        this.clientes = clientes; //Antes estaba en .subscribe()
        //propio del tap
        console.log('cliente.component.ts: ');
        clientes.forEach(cliente=>{
          console.log('tap3: '+cliente.nombre);
        })
      })
    )
    .subscribe();
  }

  /* ---------------- SERVICES: ELIMINAR CLIENTE ----------------*/
  delete(cliente: Cliente): void {
    swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que desea eliminar al cliente ' + cliente.nombre + ' ' + cliente.apellido + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        //eliminar de la lista el cliente
        this.clienteService.delele(cliente.id).subscribe(
          (response) => {
            this.clientes = this.clientes.filter(cli=> cli!=cliente)
            swal.fire(
              '¡Cliente eliminado!',
              'Cliente '+cliente.nombre+' eliminado con éxito.',
              'success'
            )
          }
        )

      }
    })
  }

}
