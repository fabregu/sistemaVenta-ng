import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/Services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '0';
  constructor(
    private _dashboardService: DashboardService
  ) { }

  mostrarGraficoVentas(labelGrafico:any[], dataGrafico: any[]) {
    const chartBarras = new Chart("chartBarras", {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });    
  }

  ngOnInit(): void {
    this._dashboardService.resumen().subscribe({
      next: (data) => {
        if(data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventasUltimaSemana;
          console.log(arrayData);

          const labelTemp: any[] = arrayData.map((item) => item.fecha);
          const dataTemp: any[] = arrayData.map((item) => item.total);
          console.log("label: ", labelTemp, "data: ", dataTemp);
          this.mostrarGraficoVentas(labelTemp, dataTemp);
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del dashboard', error);
      }
    }); 
  }
}