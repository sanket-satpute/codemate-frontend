import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast';
import { Subscription } from 'rxjs';

interface ActiveToast extends ToastMessage {
  id: number;
  dismissing: boolean;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private sub!: Subscription;
  private nextId = 0;

  toasts: ActiveToast[] = [];

  private readonly iconMap: Record<string, string> = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  };

  ngOnInit(): void {
    this.sub = this.toastService.onToast().subscribe((msg) => {
      const toast: ActiveToast = {
        ...msg,
        id: ++this.nextId,
        dismissing: false,
      };
      this.toasts.push(toast);

      // Auto-dismiss after duration
      const duration = msg.duration ?? 3000;
      setTimeout(() => this.dismiss(toast.id), duration);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getIcon(type: string): string {
    return this.iconMap[type] || 'fas fa-info-circle';
  }

  dismiss(id: number): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast && !toast.dismissing) {
      toast.dismissing = true;
      // Wait for exit animation then remove
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
      }, 300);
    }
  }

  trackById(_index: number, toast: ActiveToast): number {
    return toast.id;
  }
}
