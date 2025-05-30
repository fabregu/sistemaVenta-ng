import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizables/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  frmUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) { 
      this.frmUsuario = this.fb.group({
        nombreCompleto: ["", Validators.required],
        correo: ["", Validators.required],
        idRol: ["", Validators.required],
        clave: ['', Validators.required],
        esActivo: [1, Validators.required]
      })
      
      if(this.datosUsuario != null) {
        this.tituloAccion = "Editar"
        this.botonAccion = "Actualizar"
      }

      this._rolService.lista().subscribe({  
        next: (data) => {
          if(data.status) this.listaRoles = data.value;
        },
        error: (e) => {}
      })
  }

  ngOnInit(): void {
    if(this.datosUsuario != null) {
      this.frmUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo 
      })
    }
  }

  guardarUsuario() {
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.frmUsuario.value.nombreCompleto,
      correo: this.frmUsuario.value.correo,
      idRol: this.frmUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.frmUsuario.value.clave,
      esActivo: parseInt(this.frmUsuario.value.esActivo)
    }
    if(this.datosUsuario == null) {
      this._usuarioService.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status) {
            this._utilidadService.mostrarAlerta("Usuario Registrado!!", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo registrar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    }else {
       this._usuarioService.editar(_usuario).subscribe({
        next: (data) => {
          if(data.status) {
            this._utilidadService.mostrarAlerta("Usuario Actualizado!!", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo actualizar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    }
  }
}
