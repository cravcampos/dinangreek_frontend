import {Injectable} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import {ResponseApi} from "../Interfaces/response-api";
import {Prestamo} from "../Interfaces/prestamo";
import {Producto} from "../Interfaces/producto";

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private urlAPI: string = environment.endpoint + "Prestamo/"

  constructor(private http: HttpClient) {
  }

  guardarPrestamo(request: Prestamo): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlAPI}GuardarPrestamo`, request);
  }

  historial(buscarPor: string, numeroOrden: string, fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}Historial?buscarPor=${buscarPor}&numeroOrden=${numeroOrden}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }


}
