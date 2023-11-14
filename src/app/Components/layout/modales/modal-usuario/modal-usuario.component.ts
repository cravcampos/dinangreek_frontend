import {Component, Inject, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Rol} from 'src/app/Interfaces/rol'
import {Usuario} from "../../../../Interfaces/usuario";

import {RolService} from "../../../../Services/rol.service";
import {UsuarioService} from "../../../../Services/usuario.service";
import {UtilidadService} from "../../../../Reutilizable/utilidad.service";
import {ResponseApi} from "../../../../Interfaces/response-api";

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });

    if (datosUsuario != null) {
      this.tituloAccion = "Actualizar";
      this.botonAccion = "Actualizar"
    }

    this._rolService.listaRoles().subscribe({
      next: (data: ResponseApi): void => {
        if (data.status) this.listaRoles = data.value
      },
      error: (e): void => {
      }
    });
  }

  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString()
      })
    }
  }

  guardarEditar_Usuario(): void {
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    if (this.datosUsuario == null) {
      this._usuarioService.guardarUsuario(_usuario).subscribe({
        next: (data: ResponseApi): void => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El usuario fue registrado", "Exito");
            this.modalActual.close("true")
          } else
            this._utilidadService.mostrarAlerta("No se pudo Registrar el usuario", "Error")
        },
        error: (e): void => {
        }
      })
    }else{
      this._usuarioService.editarUsuario(_usuario).subscribe({
        next: (data: ResponseApi): void => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("El usuario fue actualizado", "Exito");
            this.modalActual.close("true")
          } else
            this._utilidadService.mostrarAlerta("No se pudo actualizar el usuario", "Error")
        },
        error: (e): void => {
        }
      })
    }
  }


}
