import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";

import {MAT_DATE_FORMATS} from "@angular/material/core";
import * as moment from 'moment'

import {ModalDetallePrestamoComponent} from "../../modales/modal-detalle-prestamo/modal-detalle-prestamo.component";
import {Prestamo} from "../../../../Interfaces/prestamo";
import {PrestamoService} from "../../../../Services/prestamo.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";
import {ResponseApi} from "../../../../Interfaces/response-api";

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
    selector: 'app-historial-prestamo',
    templateUrl: './historial-prestamo.component.html',
    styleUrls: ['./historial-prestamo.component.css'],
    providers: [
        {provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}
    ]
})
export class HistorialPrestamoComponent implements OnInit, AfterViewInit {

    formularioBusqueda: FormGroup;
    opcionesBusqueda: any[] = [
        {value: "fecha", descripcion: "Por fechas"},
        {value: "numero", descripcion: "Numero prestamo"},
    ]
    columnasTabla: string[] = ["fechaRegistro", "numeroOrden", "tipoPago", "total", "accion"];
    dataInicio: Prestamo[] = [];
    datosListaPrestamo = new MatTableDataSource(this.dataInicio);
    @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private _prestamoService: PrestamoService,
        private _utilidadService: UtilidadService
    ) {
        this.formularioBusqueda = this.fb.group({
            buscarPor: ["fecha"],
            numeroOrden: [""],
            fechaInicio: [""],
            fechaFin: [""],
        })

        this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value => {
            this.formularioBusqueda.patchValue({
                numeroOrden: "",
                fechaInicio: "",
                fechaFin: "",
            })
        })
    }


    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.datosListaPrestamo.paginator = this.paginacionTabla;
    }

    aplicarFiltroTabla(event: Event): void {
        const filterValue: string = (event.target as HTMLInputElement).value;
        this.datosListaPrestamo.filter = filterValue.trim().toLocaleLowerCase();
    }

    buscarPrestamos(): void {
        let _fechaInicio: string = "";
        let _fechaFin: string = "";

        if (this.formularioBusqueda.value.buscarPor === 'fecha') {
            _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
            _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

            if (_fechaInicio === "INVALID date" || _fechaFin === "INVALID date") {
                this._utilidadService.mostrarAlerta("Debe ingresar ambas fechas", "Oops!!!")
                return;
            }
        }

        this._prestamoService.historial(
            this.formularioBusqueda.value.buscarPor,
            this.formularioBusqueda.value.numeroOrden,
            _fechaInicio,
            _fechaFin
        ).subscribe({
            next: (data: ResponseApi): void => {
                if (data.status) {
                    this.datosListaPrestamo = data.value;
                } else {
                    this._utilidadService.mostrarAlerta("No se encontraron datos", "Oops!!!")
                }
            },
            error: (e): void => {
                console.error(e);
            }
        });
    }

    verDetallePrestamo(_prestamo:Prestamo):void{
        this.dialog.open(ModalDetallePrestamoComponent,{
            data: _prestamo,
            disableClose: true,
            width: '800px'
        })

    }

}
