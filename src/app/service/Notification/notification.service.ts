// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  success(message: string) {
    Swal.fire(
      'Thành công!',
      message,
      'success'
    );
  }

  error(message: string) {
    Swal.fire(
      'Lỗi!',
      message,
      'error'
    );
  }
}