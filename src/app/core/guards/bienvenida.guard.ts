// src/app/guards/bienvenida.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BIENVENIDA_VERSION } from 'src/app/constants/app-version';


@Injectable({
  providedIn: 'root'
})
export class BienvenidaGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const bienvenidaGuardada = localStorage.getItem('bienvenidaVersion');
    console.log('Versión de bienvenida guardada:', bienvenidaGuardada);
    // Si la versión coincide, no mostramos bienvenida
    if (bienvenidaGuardada === BIENVENIDA_VERSION) {
      this.router.navigate(['/tabs']); // Ruta principal
      return false;
    }

    // Si es la primera vez o versión distinta, sí mostramos
    return true;
  }
}
