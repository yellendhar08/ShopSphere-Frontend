import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast$ = new Subject<ToastMessage>();

  success(message: string): void {
    this.toast$.next({ type: 'success', message });
  }

  error(message: string): void {
    this.toast$.next({ type: 'error', message });
  }

  info(message: string): void {
    this.toast$.next({ type: 'info', message });
  }
}
