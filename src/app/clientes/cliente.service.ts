import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
// throwError: Convertir o crear observable
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
// catchError: Objecto de error
import { map, tap, catchError } from 'rxjs/operators';
// swal: alerta
import swal from 'sweetalert2';
// rutas
import { Router } from '@angular/router';
// formatear fechas
import { formatDate, DatePipe, registerLocaleData } from "@angular/common";
import { Region } from './region';

//Decorador: Rol de la clase (Inyección de depencia)
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //ATRIBUTOS
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })

  public errores: string[] = [];
  getErrores(): string[] {
    return this.errores;
  }

  //CONSTRUCTOR
  constructor(private http: HttpClient, private router: Router) { }



  /* ---------------- Metodo LISTAR CLIENTE ----------------*/
  // tipo Cliente se cambió a any para realizar paginación
  getClientes(page: number): Observable<any[]> { //Observable Cliente
    //Convertir Listado de clientes en un Observable (STREAM)
    //-- return of(CLIENTES);
    //INICIO FORMA 1 ----- 
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => { //tap: No cambia el flujo de dato 
        console.log('cliente.service.ts: 1');
        (response.content as Cliente[]).forEach(cliente => { //
          console.log('tap1:' + cliente.nombre);
        })
      }),

      map((response: any) => { //map: cambiar datos del flujo
        (response.content as Cliente[]).map(cliente => { // retorna el map del cliente
          cliente.nombre = cliente.nombre.toUpperCase();

          //Localización i18n - de app.module.ts
          //FINAL: ya usado en la vista cliente.createAt= formatDate(cliente.createAt,'EEEE dd, MMMM yyyy','es');
          //cliente.createAt= formatDate(cliente.createAt,'fullDate','en-US');

          /*NO FUNCIONA BIEN
          let datePipe = new DatePipe('en-US');
          cliente.createAt=datePipe.transform(cliente.createAt,'dd/MM/yyyy');
          */
          return cliente; // retorna el map del flujo, observable
        });//map: cambiar valores internos 
        return response;
      }),
      tap((response: any) => { //tap: No cambia el flujo de dato (es afectado por el map)
        console.log('cliente.service.ts: 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log('tap2:' + cliente.nombre);
        })
      }),

    );
    //FIN FORMA 1 ----- 
    /*OTRA FORMA 2
    //Objeto HTTP y GET retorna un observable
    return this.http.get<Cliente[]>(this.urlEndPoint);
      FIN FORMA 2*/
  }

  /* ---------------- Metodo CREAR CLIENTE ----------------*/
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) { //Manejo distinto por ser 400 - Spring Validation
          this.errores = e.error.errors as string[]; //conversión opcional
          console.error(e.error.errors);
          return throwError(() => { e }); // pasar errores a la plantilla
        }

        swal.fire({
          title: 'Error al crear cliente',
          text: e.error.mensaje,
          icon: 'error'
        })
        // Objeto excepción convertido en un OBSERVABLE
        return throwError(() => { e });
      })
    )
  }

  /* ---------------- Metodo ACTUALIZAR CLIENTE ----------------*/
  //obtener cliente
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      //flujo de error
      catchError(e => {
        if (e.status == 400) { //Manejo distinto por ser 400 - Spring Validation
          return throwError(() => { e }); // pasar errores a la plantilla
        }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire({
          title: 'Error al editar',
          text: e.error.mensaje,
          icon: 'error'
        });
        return throwError(() => { e });
      })
    )
  }
  //actualiza cliente
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (e.status == 400) { //Manejo distinto por ser 400 - Spring Validation
          this.errores = e.error.errors as string[]; //conversión opcional
          console.error(e.error.errors);
          return throwError(() => { e }); // pasar errores a la plantilla
        }
        console.error(e.error.mensaje);
        swal.fire({
          title: 'Error al editar cliente',
          text: e.error.mensaje,
          icon: 'error'
        })
        // Objeto excepción convertido en un OBSERVABLE
        return throwError(() => { e });
      })
    )
  }

  /* ---------------- Metodo ELIMINAR CLIENTE ----------------*/
  delele(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire({
          title: 'Error al eliminar cliente',
          text: e.error.mensaje,
          icon: 'error'
        })
        // Objeto excepción convertido en un OBSERVABLE
        return throwError(() => { e });
      })
    )
  }

  /* ---------------- Metodo SUBIR FOTO ----------------*/
 
  subirFoto(archivo: File, id:number): Observable<HttpEvent<{}>> {
    //Se tiene que enviar utilizando FormData, con soporte multipart/form-data
    let formData = new FormData();
    formData.append("archivo", archivo); //mismo nombre del backend
    formData.append("id", ""+id);
    //--Sin barra de progreso
    /*
    return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
      pipe(
      map(
        //convertir objeto cliente del Json a Cliente
        (response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire({
          title: 'Error al subir foto del cliente',
          text: e.error.mensaje,
          icon: 'error'
        })
        // Objeto excepción convertido en un OBSERVABLE
        return throwError(() => { e });
      })

    );
    */
    //--Con barra de progreso
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
  
      return this.http.request(req);
  }

    /* ---------------- Metodo LISTAR REGIONES ----------------*/
    getRegiones():Observable<Region[]>{
        return this.http.get<Region[]>(this.urlEndPoint+'/regiones')
    }

}
