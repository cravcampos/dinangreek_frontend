import {Component, AfterViewInit, ViewChild, OnInit} from '@angular/core';

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";

import{ModalProductoComponent} from "../../modales/modal-producto/modal-producto.component";
import{Producto} from "../../../../Interfaces/producto";
import{ProductoService} from "../../../../Services/producto.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";
import Swal from 'sweetalert2'
import {ResponseApi} from "../../../../Interfaces/response-api";
import {ModalUsuarioComponent} from "../../modales/modal-usuario/modal-usuario.component";
import {Usuario} from "../../../../Interfaces/usuario";


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit{

  columnasTable: string [] = ["nombre", "categoria", "stock","precio", "estado", "acciones"];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

constructor(
  private dialog: MatDialog,
  private _productoService: ProductoService,
  private _utilidadService: UtilidadService
) {
}

  obtenerProductos(): void {
    this._productoService.listaProductos().subscribe({
      next: (data: ResponseApi): void => {
        if (data.status) {
          this.dataListaProductos.data = data.value;
        } else {
          this._utilidadService.mostrarAlerta("No se encontraron datos", "Oops!")
        }
      },
      error: (e): void => {
      }
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto(): void {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "true") this.obtenerProductos();
    });
  }

  editarProducto(producto: Producto): void {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(result => {
      if (result === "true") this.obtenerProductos();
    });
  }

  eliminarProducto(producto: Producto): void {
    Swal.fire({
      title: 'Desea eliminar el producto?',
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, Eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, Volver"
    }).then((result): void => {
      if (result.isConfirmed) {
        this._productoService.eliminarProducto(producto.idProducto).subscribe({
          next: (data: ResponseApi):void => {
            if (data.status) {
              this._utilidadService.mostrarAlerta("El producto fue eliminado", "Listo!");
              this.obtenerProductos();
            } else {
              this._utilidadService.mostrarAlerta("No se pudo eliminar el producto", "Error");
            }
          },
          error: (e): void => {
          }
        })
      }
    })
  }

}

