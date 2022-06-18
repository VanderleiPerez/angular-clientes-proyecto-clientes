import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  //ATRIBUTOS
  modal:boolean=false;
  private _notificarUpload = new EventEmitter(); //@Angular/Core
  //CONSTRUCTOR
  constructor() { }

  //MÉT0DOS
  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  };
  abrirModalService(){
    this.modal=true;
  }
  cerrarModalService(){
    this.modal=false;
  }
}
