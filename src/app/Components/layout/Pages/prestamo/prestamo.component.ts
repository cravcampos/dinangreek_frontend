import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";

import {ProductoService} from "../../../../Services/producto.service";
import {PrestamoService} from "../../../../Services/prestamo.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";

import {Producto} from "../../../../Interfaces/producto";
import {Prestamo} from "../../../../Interfaces/prestamo";
import {DetallePrestamo} from "../../../../Interfaces/detalle-prestamo";
import Swal from "sweetalert2";
import {ResponseApi} from "../../../../Interfaces/response-api";

@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.css']
})
export class PrestamoComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosPrestamo: DetallePrestamo[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;

  formularioProductoPrestamo: FormGroup;
  columnasTabla: string[] = ["producto", "cantidad", "precio", "total", "accion"];
  datosDetallePrestamo = new MatTableDataSource(this.listaProductosPrestamo);

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();

    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado))
  }

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _prestamoService: PrestamoService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioProductoPrestamo = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    this._productoService.listaProductos().subscribe({
      next: (data: ResponseApi): void => {
        if (data.status) {
          const listaProductos: Producto[] = data.value as Producto[];
          this.listaProductos = listaProductos.filter(p => p.esActivo == 1 && p.stock > 0)
        }
      },
      error: (e): void => {
        console.error(e)
      }
    });

    this.formularioProductoPrestamo.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });
  }

  ngOnInit(): void {
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaPrestamo(event: any): void {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoPrestamo(): void {
    const _cantidad: number = this.formularioProductoPrestamo.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar += _total;

    this.listaProductosPrestamo.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    })

    this.datosDetallePrestamo = new MatTableDataSource(this.listaProductosPrestamo);
    this.formularioProductoPrestamo.patchValue({
      producto: '',
      cantidad: ''
    })
  }

  eliminarProducto(detalle: DetallePrestamo): void {
    this.totalPagar -= parseFloat(detalle.totalTexto)
    this.listaProductosPrestamo = this.listaProductosPrestamo.filter(p => p.idProducto != detalle.idProducto);

    this.datosDetallePrestamo = new MatTableDataSource(this.listaProductosPrestamo);
  }

  registrarPrestamo(): void {
    if (this.listaProductosPrestamo.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Prestamo = {
        tipoPago: this.tipoPagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detallePrestamo: this.listaProductosPrestamo
      }

      this._prestamoService.guardarPrestamo(request).subscribe({
          next: (response): void => {
            if (response.status) {
              this.totalPagar = 0.00;
              this.listaProductosPrestamo = [];
              this.datosDetallePrestamo = new MatTableDataSource(this.listaProductosPrestamo);

              Swal.fire({
                icon: 'success',
                title: 'Prestamo Registrado!!!',
                text: `Numero de Orden ${response.value.numeroOrden}`
              })
            } else {
              this._utilidadService.mostrarAlerta("No se pudo registrar el prestamo", "Oops!");
            }
          },
          complete: (): void => {
            this.bloquearBotonRegistrar = false;
          },
          error:
            (e): void => {
              console.error(e);
            }
        }
      )
    }
  }

}
