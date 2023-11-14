import {DetallePrestamo} from "./detalle-prestamo";

export interface Prestamo {
  idPrestamo?: number,
  numeroOrden?: string,
  tipoPago: string,
  totalTexto:string,
  fechaRegistro?:string,
  detallePrestamo: DetallePrestamo[]
}
