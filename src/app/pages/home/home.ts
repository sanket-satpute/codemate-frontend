import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, User } from '../../core/services/api';
import { Upload } from '../../core/services/upload';

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

  codeInput = '';
  uploadProgress = 40;

  // Login properties
  user: User = { email: '', password: '' };
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

  constructor(private api: Api, private router: Router, private uploadService: Upload) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  analyzeCode(): void {
    if (this.selectedFile) {
      this.uploadService.uploadFile(this.selectedFile).subscribe({
        next: (event) => {
          // Handle upload progress and completion
        },
        error: (err) => {
          console.error('Upload error:', err);
        }
      });
    }
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
    this.loginError = null; // Clear previous errors
    this.api.login(this.user).subscribe({
      next: (response) => {
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('user_email', response.email);
        this.router.navigate(['/dashboard']); // Navigate to dashboard on successful login
      },
      error: (err) => {
        this.loginError = err.error?.error || 'Login failed. Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}
