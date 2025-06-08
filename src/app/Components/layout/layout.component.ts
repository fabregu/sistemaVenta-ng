import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';
import { MenuService } from 'src/app/Services/menu.service';
import { UtilidadService } from 'src/app/Reutilizables/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  constructor(
    private menuService: MenuService,
    private utilidadService: UtilidadService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const usuario = this.utilidadService.obtenerSesionUsuario();
    if (usuario) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
    }

    this.menuService.lista(usuario.idUsuario).subscribe({
      next: (data) => {
       if(data.status) this.listaMenus = data.value;
      },
      error: (error) => {
        console.error('Error al cargar los menús:', error);
        this.utilidadService.mostrarAlerta('Error al cargar los menús', error);
      }
    });
  }

  cerrarSesion(): void {
    this.utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
