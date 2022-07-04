import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService:AuthService,
    private router:Router
  ){}

  //Interface
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //Validar autenticación
      if(this.authService.isAutheticated()){
        if(this.isTokenExpirado()){ //token
          this.authService.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true; //autenticación
      }
      this.router.navigate(['/login']);
    return false;
  }

  isTokenExpirado():boolean{
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime()/1000; //fecha en segundos 
    if(payload.exp < now){
      return true;
    }
      return false;
  }
  
}
