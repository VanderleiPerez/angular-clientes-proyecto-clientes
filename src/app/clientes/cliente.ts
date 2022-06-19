import { Region } from "./region";

export class Cliente {
    id: number=0;
    nombre:string ='';
    apellido:string ='';
    email:string = '';
    createAt:string = '';
    foto:string = '';
    region?:Region;
}
