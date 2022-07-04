import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

//Obtener ROL


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    //validar rol para usuarios no autenticados
    if(!this.authService.isAutheticated()){
      this.router.navigate(['/login']);
      return false; 
    }

    //validar rol para admin
      let role = route.data['role'] as string;
      console.log(role);
      if(this.authService.hasRole( role )){
        return true;
      }
      swal.fire('Acceso denegado [guard]',`Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`,'warning');
      this.router.navigate(['/clientes']);
      return false;

      return true;
  }
  
}
