import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {DashBoardComponent} from "./Pages/dash-board/dash-board.component";
import {UsuarioComponent} from "./Pages/usuario/usuario.component";
import {ProductoComponent} from "./Pages/producto/producto.component";
import {PrestamoComponent} from "./Pages/prestamo/prestamo.component";
import {HistorialPrestamoComponent} from "./Pages/historial-prestamo/historial-prestamo.component";
import {ReporteComponent} from "./Pages/reporte/reporte.component";

const routes: Routes = [{
  path:"",
  component:LayoutComponent,
  children: [
    {path:'dashboard', component: DashBoardComponent},
    {path:'usuarios', component: UsuarioComponent},
    {path:'productos', component: ProductoComponent},
    {path:'prestamo', component: PrestamoComponent},
    {path:'historial_prestamo', component: HistorialPrestamoComponent},
    {path:'reporte', component: ReporteComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
