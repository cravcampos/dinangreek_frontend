import {Component, OnInit} from '@angular/core';

import {Chart, registerables} from "chart.js";
import {DashBoardService} from "../../../../Services/dash-board.service";
import {ResponseApi} from "../../../../Interfaces/response-api";


Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  totalIngresos: string = "0";
  totalPrestamos: string = "0";
  totalProductos: string = "0";

  constructor(
    private _dashboardService: DashBoardService
  ) {
  }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    const chartBarras = new Chart('chartBarras', {
      type: "bar",
      data: {
        labels: labelGrafico,
        datasets: [{
          label: "# de Prestamos",
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashboardService.resumen().subscribe({
      next: (data: ResponseApi): void => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalPrestamos = data.value.totalPrestamos;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.prestamosUltimoMes;

          const labelTemporal: any[] = arrayData.map((value) => value.fecha);
          const dataTemporal: any[] = arrayData.map((value) => value.total);
          console.log(labelTemporal, dataTemporal);

          this.mostrarGrafico(labelTemporal, dataTemporal);
        }
      }, error: (e): void => {
        console.error(e);
      }
    })
  }
}
