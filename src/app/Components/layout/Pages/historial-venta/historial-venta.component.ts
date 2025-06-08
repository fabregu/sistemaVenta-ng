import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalDetalleVentaComponent } from '../../Modals/modal-detalle-venta/modal-detalle-venta.component';

import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizables/utilidad.service';
import { Venta } from 'src/app/Interfaces/venta';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})

export class HistorialVentaComponent implements OnInit, AfterViewInit {

  frmBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: "fecha", descripcion: "Por Fechas" },
    { value: "numero", descripcion: 'Numero Venta' }
  ];

  columnasTablas: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  datoInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.datoInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService    
  ) {
    this.frmBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });

    this.frmBusqueda.get("buscarPor")?.valueChanges.subscribe((value) => {
      
        this.frmBusqueda.patchValue({
          numero: "",
          fechaInicio: "",
          fechaFin: ""
        });
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas() {
    let _fechaInicio: string = "";
    let _fechaFin: string = "";

    if(this.frmBusqueda.value.buscarPor === "fecha") {
      _fechaInicio = moment(this.frmBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.frmBusqueda.value.fechaFin).format('DD/MM/YYYY');
      
      if (_fechaInicio === "Invalid Date" || _fechaFin === "Invalid Date") {
        this._utilidadService.mostrarAlerta('Debe ingresar ambas fechas.', 'Error');
        return
      }
    }
    this._ventaService.historial(
      this.frmBusqueda.value.buscarPor,
      this.frmBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if (data.status) 
          this.datosListaVenta = data.value;
        else 
          this._utilidadService.mostrarAlerta('No se encontraron resultados.', 'Información');        
      },
      error: (error) => {
        console.error(error);
        this._utilidadService.mostrarAlerta('Error al buscar ventas.', 'Error');
      }
    });    
  }

  verDetalleVenta(_venta: Venta) {
    const dialogRef = this.dialog.open(ModalDetalleVentaComponent, {
      width: '700px',
      data: _venta,
      disableClose: true,
    });
  }
}