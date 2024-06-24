import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  confirm(message: string): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    });
  }

  success(message: string): void {
    Swal.fire('Éxito', message, 'success');
  }

  error(message: string): void {
    Swal.fire('Error', message, 'error');
  }
}
