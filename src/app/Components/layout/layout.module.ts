import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { PrestamoComponent } from './Pages/prestamo/prestamo.component';
import { HistorialPrestamoComponent } from './Pages/historial-prestamo/historial-prestamo.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import {SharedModule} from "../../Reutilizable/shared/shared.module";
import { ModalUsuarioComponent } from './modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './modales/modal-producto/modal-producto.component';
import { ModalDetallePrestamoComponent } from './modales/modal-detalle-prestamo/modal-detalle-prestamo.component';


@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    PrestamoComponent,
    HistorialPrestamoComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetallePrestamoComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule { }
