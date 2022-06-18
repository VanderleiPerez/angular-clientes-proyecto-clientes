import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2'
//tap
import { tap } from 'rxjs/operators'
//Para la paginación
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  paginador: any;
  clienteSeleccionado?: Cliente;
  //Inyección de Dependencia
  //Al ser private implicitamente hace this.clienteService=clienteService
  constructor(
    private clienteService: ClienteService,
    //Suscribe observar cada vez que cambia parámetro PAGE en la ruta, se actualiza LISTADO CLIENTE
    private activatedRoute: ActivatedRoute,
    //Importación modal.services.ts
    private modalService: ModalService
  ) { }
  ngOnInit() {
    //Se llama una sola vez, al inicializar
    //Al navegar entre paginador (cambiando la ruta)

    /* ---------------- SERVICES: LISTAR CLIENTE ----------------*/
    //Suscribir al cambio de parámetro de cambio de página
    this.activatedRoute.paramMap.subscribe(params => {

      let page = +params.get('page')! || 0; //paginación
      //Suscribir a cliente()
      this.clienteService.getClientes(page)
        .pipe(
          tap((response: any) => { //any para la paginación
            //Función anónima
            //this.clientes = clientes; //Antes estaba en .subscribe()



            //propio del tap
            console.log('cliente.component.ts: ');
            //clientes.forEach(cliente=>{
            (response.content as Cliente[]).forEach(cliente => {
              console.log('tdap3: ' + cliente.nombre);
            })
          })
        )
        .subscribe(response => {
          this.clientes = (response.content as Cliente[]);
          this.paginador = response; //paginacion
        });
    });

    //EVENT EMITTER para el modal (Actualizar foto en el listado)
    this.modalService.notificarUpload.subscribe(cliente=>{
      this.clientes = this.clientes.map(clienteOriginal=>{
        if(cliente.id==clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    })


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
            this.clientes = this.clientes.filter(cli => cli != cliente)
            swal.fire(
              '¡Cliente eliminado!',
              'Cliente ' + cliente.nombre + ' eliminado con éxito.',
              'success'
            )
          }
        )

      }
    })
  }
  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModalService();
  }
}
