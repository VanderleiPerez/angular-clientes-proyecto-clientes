import { Observable } from 'rxjs';
import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/cliente';
export class Factura {
    id:number=0;
    descripcion:string="";
    observacion: string="";
    items:Array<ItemFactura>=[];
    cliente!:Cliente;
    total:number=0;
    createAt:string="";

    calcularGranTotal():number{
        this.total=0;
        this.items.forEach((item:ItemFactura)=>{
            this.total += item.calcularImporte(); //front
        });
        return this.total;
    }
}
