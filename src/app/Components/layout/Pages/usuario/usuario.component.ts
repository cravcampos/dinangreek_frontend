import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";

import {ModalUsuarioComponent} from "../../modales/modal-usuario/modal-usuario.component";
import {Usuario} from "../../../../Interfaces/usuario";
import {UsuarioService} from "../../../../Services/usuario.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";
import Swal from 'sweetalert2'
import {ResponseApi} from "../../../../Interfaces/response-api";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTable: string [] = ["nombreCompleto", "correo", "rolDescripcion", "estado", "acciones"];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
  }

  obtenerUsuarios(): void {
    this._usuarioService.listaUsuarios().subscribe({
      next: (data: ResponseApi): void => {
        if (data.status) {
          this.dataListaUsuarios.data = data.value;
        } else {
          this._utilidadService.mostrarAlerta("No se encontraron datos", "Oops!")
        }
      },
      error: (e): void => {
      }
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(): void {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "true") this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: Usuario): void {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "true") this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    Swal.fire({
      title: 'Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, Eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "No, Volver"
    }).then((result): void => {
      if (result.isConfirmed) {
        this._usuarioService.eliminarUsuario(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta("El usuario fue eliminado", "Listo!");
              this.obtenerUsuarios();
            } else {
              this._utilidadService.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error: (e): void => {
          }
        })
      }
    })
  }

}
