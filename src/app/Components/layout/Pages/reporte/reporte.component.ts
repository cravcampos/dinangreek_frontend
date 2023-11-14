import {Component, OnInit, ViewChild} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

import {MAT_DATE_FORMATS} from "@angular/material/core";
import {Reporte} from "../../../../Interfaces/reporte";
import {PrestamoService} from "../../../../Services/prestamo.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";
import * as moment from "moment/moment";
import * as XLSL from 'xlsx';


export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: "MMMM YYYY"
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
  ]
})
export class ReporteComponent implements OnInit {

  formularioFiltro: FormGroup;
  listaPrestamosReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroOrden', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataPrestamoReporte = new MatTableDataSource(this.listaPrestamosReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _prestamoService: PrestamoService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ["", Validators.required],
      fechaFin: ["", Validators.required],
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataPrestamoReporte.paginator = this.paginacionTabla;
  }

  buscarPrestamo(): void {
    const _fechaInicio: string = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin: string = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if (_fechaInicio === "INVALID date" || _fechaFin === "INVALID date") {
      this._utilidadService.mostrarAlerta("Debe ingresar ambas fechas", "Oops!!!")
      return;
    }

    this._prestamoService.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data): void => {
        if (data.status) {
          this.listaPrestamosReporte = data.value;
          this.dataPrestamoReporte.data = data.value;
        } else {
          this.listaPrestamosReporte = [];
          this.dataPrestamoReporte.data = [];
          this._utilidadService.mostrarAlerta("No se encontraron datos", "Oops!!!")
        }
      },
      error: (e): void => {
        console.error(e);
      }
    });
  }

  exportarExcel(): void {
    const wb: XLSL.WorkBook = XLSL.utils.book_new();
    const ws: XLSL.WorkSheet = XLSL.utils.json_to_sheet(this.listaPrestamosReporte);
    const fecha : string = new Date().toLocaleString();
    console.log(fecha);
    XLSL.utils.book_append_sheet(wb, ws, "Reporte")
    XLSL.writeFile(wb, "Reporte Prestamos " + fecha + ".xlsx")
  }

}
