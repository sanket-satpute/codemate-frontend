import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning'; // Add 'warning' type here
  title?: string;
  duration?: number; // in milliseconds
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning', title?: string, duration = 3000): void {
    this.toastSubject.next({ message, type, title, duration });
  }

  showSuccess(message: string, title?: string, duration?: number): void {
    this.show(message, 'success', title, duration);
  }

  showError(message: string, title?: string, duration?: number): void {
    this.show(message, 'error', title, duration);
  }

  showInfo(message: string, title?: string, duration?: number): void {
    this.show(message, 'info', title, duration);
  }

  showWarning(message: string, title?: string, duration?: number): void {
    this.show(message, 'warning', title, duration);
  }

  onToast(): Observable<ToastMessage> {
    return this.toastSubject.asObservable();
  }
}
