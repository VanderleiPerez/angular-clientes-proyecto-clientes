import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    titleNav:string = 'App Angular'

    constructor(
        public authService: AuthService,
        public router: Router
    ){}

    logout():void{

        swal.fire('Logout',`Hola ${this.authService.usuario.username}, ha cerrado sesión con exito`);
        //colocal segundo, para que se muestre el nombre del usuario
        this.authService.logout();

        this.router.navigate(['/login']);
        console.log("cerrar");
    }
}

