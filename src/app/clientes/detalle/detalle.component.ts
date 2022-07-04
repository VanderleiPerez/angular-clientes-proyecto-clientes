import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2'
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { FacturasService } from '../../facturas/services/facturas.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  //ATRIBUTOS
  //Inyección de dependencia - Cliente seleccionado
  @Input() cliente?: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada?: File;
  progreso: number = 0;

  //CONSTRUCTOR
  constructor(
    private clienteService: ClienteService,
    //suscribir cuando cambia parámetro del ID (Con modal ya no se usa)
    //private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    //Roles
    public authService: AuthService,
    public facturaService: FacturasService
  ) { }

  //NGONINIT
  ngOnInit(): void {
    /* //Obtener parámetros id de la ruta de ANGULAR
     this.activatedRoute.paramMap.subscribe(params => {
       let id: number = +params.get('id')! || 0;
       if (id) {
         //buscar cliente en el backend por ID
         this.clienteService.getCliente(id).subscribe(cliente => {
           this.cliente = cliente;
         });
       }
     })*/
  }
  //MÉTODOS PARA detalle.component.html SUBIR FOTO
  seleccionarFoto(event: any) {
    //primera posición de la imagen
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    //Validación para evitar error al cancelar la carga de una imagen, una vez cargado
    if (this.fotoSeleccionada) {
      //VALIDAR que el archivo cargado sea una img | type: tipo de archivo
      //-- indexOf: busca coindicencia con 'image', si encuentra retorna posición
      //---- si no encuentra, retorna -1
      if (this.fotoSeleccionada.type.indexOf('image') < 0) {
        swal.fire('Error al seleccionar imagen', 'Debe seleccionar un archivo del tipo imagen', 'error');
        this.fotoSeleccionada = null!;
        console.log(this.fotoSeleccionada);

      }
    }
  }
  subirFoto() {
    //VALIDAR que se subió una foto con el botó SUBIR
    if (!this.fotoSeleccionada) {
      swal.fire('Error upload', 'Debe seleccionar una foto', 'error');
    } else {
      console.log('entró');
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente!.id)
        .subscribe(event => {
          //UploadProgress:¨Evento de progreso de carga
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total!) * 100);
            //Response: Se recibió la respuesta completa
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            //EVENT EMITTER para el modal (Actualizar foto en el listado)
            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire('La foto se ha subido correctamente!', response.mensaje, 'success');

          }
          //this.cliente = cliente; // cliente con la nueva
        })
    }
  }

  cerrarModal() {
    this.modalService.cerrarModalService();
    this.fotoSeleccionada = null!;
    this.progreso = 0;
  }

    /* ---------------- SERVICES: ELIMINAR FACTURA ----------------*/

  delete(factura:Factura): void{
    swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que desea eliminar la factura ' + factura.descripcion+'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        //eliminar de la lista el cliente
        this.facturaService.delete(factura.id).subscribe(
          ( ) => {
            this.cliente!.facturas = this.cliente!.facturas?.filter(cli => cli != factura)
            swal.fire(
              'Factura eliminada!',
              'Factura ' + factura.descripcion + ' eliminado con éxito.',
              'success'
            )
          }
        )

      }
    })
  }


}
