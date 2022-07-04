import { Producto } from './producto';
export class ItemFactura {
    producto!:Producto;
    cantidad: number= 1;
    importe: number = 0;
    
    //Opcional - front o back
    public calcularImporte():number{
        return this.cantidad*this.producto.precio;
    }

}
