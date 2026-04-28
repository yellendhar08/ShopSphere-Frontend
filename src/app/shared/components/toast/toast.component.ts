import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

interface Toast extends ToastMessage {
  id: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {
  toastService = inject(ToastService);
  toasts: Toast[] = [];
  private toastId = 0;

  ngOnInit() {
    this.toastService.toast$.subscribe(message => {
      const toast: Toast = { ...message, id: this.toastId++ };
      this.toasts.push(toast);
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        this.removeToast(toast.id);
      }, 3000);
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
