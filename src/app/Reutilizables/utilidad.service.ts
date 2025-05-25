import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar: MatSnackBar) { }


  mostrarAlerta(mensaje:string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });   
  }

  guardarSesionUsuario(usuarioSession: Session) {
      localStorage.setItem("usuario", JSON.stringify(usuarioSession));
  }

  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem("usuario");
    const usuario = JSON.parse(dataCadena!);
    return usuario;
  }

  eliminarSesionUsuario() {
    localStorage.removeItem("usuario")
  }
}
