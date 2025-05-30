import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizables/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];

  listaProductoParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoPagoXDefecto: string = "Efectivo";
  totalPagar: number = 0;

  frmProdVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductoParaVenta);

  retornarProductosXFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase(): busqueda.nombre.toLocaleLowerCase();
    
    return this.listaProductos.filter(item =>  item.nombre.toLocaleLowerCase().includes(valorBuscado));

  }

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) { 
    this.frmProdVenta = this.fb.group({
      producto: ["", Validators.required],
      cantidad: ["", Validators.required]
    })

    
    this._productoService.lista().subscribe({
      next: (data) => {
        if(data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error:(err) => {}
    })

    this.frmProdVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosXFiltro(value);
    })  
  
  }

  ngOnInit(): void {
  }

  mostrarProducto(producto: Producto):string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta() {
    const _cantidad: number = this.frmProdVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;

    //this.totalPagar = this.totalPagar + _total;
    this.totalPagar += _total; //factorizado

    this.listaProductoParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    });
    this.datosDetalleVenta= new MatTableDataSource(this.listaProductoParaVenta);
    this.frmProdVenta.patchValue({
      producto: "",
      cantidad: ""
    });
  }
  
  eliminarProducto(detalle: DetalleVenta) { 
    this.totalPagar -= parseFloat(detalle.totalTexto);
    //this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto); sin factorizar
    this.listaProductoParaVenta = this.listaProductoParaVenta.filter(p => p.idProducto != detalle.idProducto);

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductoParaVenta);
  }

  registrarVenta() {  
    if(this.listaProductoParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipoPagoXDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductoParaVenta
      }

      this._ventaService.registrar(request).subscribe({
        next: (response) => {
          if(response.status) {
            this.totalPagar = 0.00;
            this.listaProductoParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductoParaVenta)

            Swal.fire({
              title: 'Venta Registrada!',
              text: `Número de Venta: ${response.value.numeroDocumento}`,
              icon: 'success'
            })
          } else {
            this._utilidadService.mostrarAlerta("No se pudo registrar la venta", "Error");
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (err) => {
          this._utilidadService.mostrarAlerta("Error al registrar la venta", "Error");
          this.bloquearBotonRegistrar = false;
          console.error(err);
        }
      })
    }   
  } 
}