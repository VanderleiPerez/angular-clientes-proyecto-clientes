import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario?: Usuario;
  private _token?: string;

  constructor(private http:HttpClient) { }

  public get usuario():Usuario{
    if(this._usuario!=null){
      return this._usuario;
    } else if(this._usuario==null && sessionStorage.getItem('usuario') !=null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }
  
  public get token(): any {
    if(this._token!=null){
      return this._token;
    } else if(this._token==null && sessionStorage.getItem('token') !=null){
      this._token = sessionStorage.getItem('token')!;
      return this._token;
    }
    return null;
  }

  login(usuario:Usuario):Observable<any>{
    const  urlEndPoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345'); //btoa: convertir a base 64
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization':'Basic '+credenciales});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password); 
    console.log(params.toString);
    return this.http.post<any>(urlEndPoint, params.toString(), {headers: httpHeaders}); //params debe convertir a String 'toString()'
  }

  guardarUsuario(accessToken: string):void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre=payload.nombre;
    this._usuario.apellido=payload.apellido;
    this._usuario.email=payload.email;
    this._usuario.username=payload.user_name;
    this._usuario.roles=payload.authorities;
    //guardar en sessionStorage (tipo String)
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario)); //Objeto a String

  }
  guardarToken(accessToken: string):void{
    this._token = accessToken;
    sessionStorage.setItem('token',accessToken);
  }
  obtenerDatosToken(accessToken: string):any{
    if(accessToken!=null){
      return  JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
  //Para el botón de inicio de sesión en un usuario autenticado
  isAutheticated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length>0){
      return true; //autenticado
    }
      return false;
  }

  hasRole(role:string):boolean{
    if(this.usuario.roles.includes(role)){ //validar si existen elementos
      return true;
    }
      return false;
  }

  logout():void{
    this._token =  null as any;
    this._usuario = null as any;
    //eliminar token de sessionStorage
    //sessionStorage.clear(); //otra forma
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
