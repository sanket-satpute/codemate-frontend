import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @ViewChild('uploadSection') uploadSection!: ElementRef;

  private authService = inject(AuthService);
  private router = inject(Router);

  codeInput = '';
  uploadProgress = 0;

  // Login properties
  email = '';
  password = '';
  loginError: string | null = null;
  selectedFile: File | null = null;

  features: Feature[] = [
    {
      icon: '📤',
      title: 'Upload Code Easily',
      description: 'Drag and drop your files, paste code snippets, or upload entire project archives. We support all major programming languages and frameworks.'
    },
    {
      icon: '🤖',
      title: 'Ask AI Anything',
      description: 'Get instant answers about your code. Ask about bugs, optimizations, best practices, or request explanations for complex logic.'
    },
    {
      icon: '⚡',
      title: 'Get Instant Insights',
      description: 'Receive real-time analysis, performance suggestions, security vulnerabilities, and refactoring recommendations powered by advanced AI.'
    }
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  analyzeCode(): void {
    // Redirect to dashboard — file upload requires a project context
    this.router.navigate(['/dashboard']);
  }

  scrollToUpload(): void {
    if (this.uploadSection) {
      this.uploadSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  onLogin(): void {
    this.loginError = null;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginError = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}
