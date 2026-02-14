import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogData } from './confirm-dialog.model'; // Define a model for dialog data

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialogSubject = new Subject<boolean>();
  confirmResult$: Observable<boolean> = this.dialogSubject.asObservable();

  dialogData: WritableSignal<ConfirmDialogData | null> = signal(null);

  open(data: ConfirmDialogData): Observable<boolean> {
    this.dialogData.set(data);
    return this.dialogSubject.asObservable();
  }

  close(result: boolean): void {
    this.dialogData.set(null); // Hide dialog
    this.dialogSubject.next(result);
  }
}
