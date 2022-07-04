import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { FacturasService } from './services/facturas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
  //styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {

  factura?:Factura;
  titulo:string='Factura'

  //Capturar el detalle de factura
  //ActivatedRoute

  constructor(
    private facturasService: FacturasService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      let id = +params.get('id')! || 0;
      this.facturasService.getFactura(id).subscribe(factura=>{
        this.factura = factura;
      });
    })
  }

}
