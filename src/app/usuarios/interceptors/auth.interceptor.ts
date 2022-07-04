
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService:AuthService,
    private router: Router,
  ){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<any> {
     //Validar códigos HTTP  (response)
    return next.handle(req).pipe( //pipe: para usar catchError
      catchError(error=>{
        if(error.status==401){
          //token expirado
          if(this.authService.isAutheticated()){
            this.authService.logout();
          }
          this.router.navigate(['/login'])
          //
        }
        if(error.status==403){
          swal.fire('Acceso denegado',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso! [interceptor]`,'warning');
          this.router.navigate(['/clientes'])
        }
        return throwError(() => { error });

      })
    )
  }
}