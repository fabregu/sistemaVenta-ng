import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as xlsx from 'xlsx';
import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizables/utilidad.service';

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
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
    ]
})
export class ReporteComponent implements OnInit {
  frmFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTablas: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) {
     this.frmFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });

    this.frmFiltro.get("buscarPor")?.valueChanges.subscribe((value) => {      
        this.frmFiltro.patchValue({
          numero: "",
          fechaInicio: "",
          fechaFin: ""
        });
    });
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {    
      const _fechaInicio = moment(this.frmFiltro.value.fechaInicio).format('DD/MM/YYYY');
      const _fechaFin = moment(this.frmFiltro.value.fechaFin).format('DD/MM/YYYY');

      console.log("Fecha Inicio:", _fechaInicio);
      console.log("Fecha Fin:", _fechaFin);

      if (_fechaInicio === "Invalid Date" || _fechaFin === "Invalid Date") {
        this._utilidadService.mostrarAlerta('Debe ingresar ambas fechas.', 'Error');
        return
      }
      this._ventaService.reporte(_fechaInicio, _fechaFin).subscribe({
        next: (data) => {
          console.log('Respuesta del servicio:', data);
          if(data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
          console.log("Ventas obtenidas:", this.listaVentasReporte);
          }else {
            this.listaVentasReporte = [];
            this.dataVentaReporte.data = [];
            this._utilidadService.mostrarAlerta("info", "No se encontraron ventas en el rango de fechas seleccionado");
          }
        },
        error: (error) => {
          this._utilidadService.mostrarAlerta("Error al obtener las ventas", error);
        }
      });
    } 
    
    exportarExcel() {
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(this.listaVentasReporte);

      xlsx.utils.book_append_sheet(wb, ws, 'Reporte');
      //xlsx.writeFile(wb, 'Reporte Ventas.xlsx');

      //Creado por IA a probar como funciona
      const fechaActual = moment().format('DD-MM-YYYY');
      const nombreArchivo = `Reporte Ventas_${fechaActual}.xlsx`;
      xlsx.writeFile(wb, nombreArchivo);
      this._utilidadService.mostrarAlerta('Archivo exportado correctamente', 'Éxito');
    }
}