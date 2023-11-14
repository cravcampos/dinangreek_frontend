import { Injectable } from '@angular/core';

import{HttpClient}   from "@angular/common/http";
import{Observable} from "rxjs";
import{environment} from "src/environments/environment";
import{ResponseApi} from "../Interfaces/response-api";
import{Login} from "../Interfaces/login";
import{Usuario} from "../Interfaces/usuario";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlAPI: string = environment.endpoint + "Usuario/"

  constructor(private http: HttpClient) { }

  iniciarSesion(request: Login): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}IniciarSesion`, request);
  }

  listaUsuarios():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlAPI}ListaUsuarios`);
  }

  guardarUsuario(request: Usuario): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlAPI}GuardarUsuario`, request);
  }

  editarUsuario(request: Usuario): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlAPI}EditarUsuario`, request);
  }

  eliminarUsuario(id: number): Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlAPI}EliminarUsuario/${id}`);
  }
}
