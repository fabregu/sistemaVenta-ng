import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'usuarios', component: UsuarioComponent},
    {path: 'productos', component: ProductoComponent},
    {path: 'venta', component: VentaComponent},
    {path: 'historial_venta', component: HistorialVentaComponent},
    {path: 'reportes', component: ReporteComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
