import {Component, Inject, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

import {Categoria} from "../../../../Interfaces/categoria";
import {Producto} from "../../../../Interfaces/producto";
import {CategoriaService} from "../../../../Services/categoria.service";
import {ProductoService} from "../../../../Services/producto.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";
import {ResponseApi} from "../../../../Interfaces/response-api";

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ) {

    this.formularioProducto = fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });

    if (datosProducto != null) {
      this.tituloAccion = "Actualizar";
      this.botonAccion = "Actualizar"
    }

    this._categoriaService.listaCategorias().subscribe({
      next: (data: ResponseApi): void => {
        if (data.status) this.listaCategorias = data.value
      },
      error: (e): void => {
      }
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditar_Producto(): void {
    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }

    if (this.datosProducto == null) {
      this._productoService.guardarProducto(_producto).subscribe({
        next: (data: ResponseApi): void => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El producto fue registrado", "Exito");
            this.modalActual.close("true")
          } else
            this._utilidadService.mostrarAlerta("No se pudo Registrar el producto", "Error")
        },
        error: (e): void => {
        }
      })
    } else {
      this._productoService.editarProducto(_producto).subscribe({
        next: (data: ResponseApi): void => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El producto fue actualizado", "Exito");
            this.modalActual.close("true")
          } else
            this._utilidadService.mostrarAlerta("No se pudo actualizar el producto", "Error")
        },
        error: (e): void => {
        }
      })
    }
  }


}
