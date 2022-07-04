import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';


import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo:string ='Por favor, identificate'
  usuario:Usuario;

  constructor(
    private authService:AuthService, 
    private router:Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAutheticated()){
      swal.fire('Login',`Hola ${this.authService.usuario.username} ya estás autenticado!`,'info');
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    console.log(this.usuario);
    if(this.usuario.username== null  || this.usuario.password ==null ){
      swal.fire('Error Login','Username o password vácio','error');
      return;
    }

 
    this.authService.login(this.usuario).subscribe(
      response=>{
       //guardar token y usuario
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        console.log(response);
        //atob: convertir a json
        //let objetoPayload = JSON.parse(atob(response.access_token.split(".")[1]));
        //console.log(objetoPayload); //split: " " -> [, , , ,] separar HEADER, PAYLOAD, FIRMA

        let usuario = this.authService.usuario; // método GET usuario
        this.router.navigate(['/clientes'])
        swal.fire('Login',`Hola ${usuario.username}, has iniciado sesión con éxito!`,'success' );
      }, error => {
        if(error.status == 400){
          swal.fire('Error de Inicio de sesión','Usuario o clave incorrecta','error');
        }
      }
    )
  }
}
