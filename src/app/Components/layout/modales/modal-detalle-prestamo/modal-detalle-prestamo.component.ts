import {Component, Inject, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DetallePrestamo} from "../../../../Interfaces/detalle-prestamo";
import {Prestamo} from "../../../../Interfaces/prestamo";

@Component({
    selector: 'app-modal-detalle-prestamo',
    templateUrl: './modal-detalle-prestamo.component.html',
    styleUrls: ['./modal-detalle-prestamo.component.css']
})
export class ModalDetallePrestamoComponent implements OnInit {

    fechaRegistro: string = "";
    numeroOrden: string = "";
    tipoPago: string = "";
    total: string = "";
    detallePrestamo: DetallePrestamo[] = [];
    columnasTabla: string[] = ["producto","cantidad","precio","total"]


    constructor(@Inject(MAT_DIALOG_DATA) public _prestamo: Prestamo) {
        this.fechaRegistro = _prestamo.fechaRegistro!;
        this.numeroOrden = _prestamo.numeroOrden!;
        this.tipoPago = _prestamo.tipoPago;
        this.total = _prestamo.totalTexto;
        this.detallePrestamo =_prestamo.detallePrestamo;
    }

    ngOnInit(): void {
    }
}
