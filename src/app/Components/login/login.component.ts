import {Component} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Login} from "../../Interfaces/login";
import {UsuarioService} from "../../Services/usuario.service";
import {UtilidadService} from "../../Reutilizable/utilidad.service";
import {ResponseApi} from "../../Interfaces/response-api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb:FormBuilder,
    private router: Router,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  iniciarSesion():void{
    this.mostrarLoading = true;

    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }

    this._usuarioService.iniciarSesion(request).subscribe({
      next: (data:ResponseApi):void => {
        if(data.status){
          this._utilidadService.guardarSesionUsuario(data.value)
          this.router.navigate(["pages"])
        }else {
          this._utilidadService.mostrarAlerta("No se encontrarón coincidencias","Opps!");
        }
      },
      complete: ():void => {
        this.mostrarLoading = false;
      },
      error: ():void => {
        this._utilidadService.mostrarAlerta("Hubo un error","Opps!");
      }
    })
  }

}
