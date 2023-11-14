import {Injectable} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "src/environments/environment";
import {ResponseApi} from "../Interfaces/response-api";
import {Producto} from "../Interfaces/producto";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlAPI: string = environment.endpoint + "Producto/"

  constructor(private http: HttpClient) {
  }

  listaProductos(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlAPI}ListaProductos`);
  }

  guardarProducto(request: Producto): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlAPI}GuardarProducto`, request);
  }

  editarProducto(request: Producto): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlAPI}EditarProducto`, request);
  }

  eliminarProducto(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlAPI}EliminarProducto/${id}`);
  }
}
