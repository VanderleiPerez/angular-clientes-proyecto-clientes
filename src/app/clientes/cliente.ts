import { Region } from "./region";
import { Factura } from '../facturas/models/factura';

export class Cliente {
    id: number=0;
    nombre:string ='';
    apellido:string ='';
    email:string = '';
    createAt:string = '';
    foto:string = '';
    region?:Region;
    facturas?:Array<Factura> = [];
}
