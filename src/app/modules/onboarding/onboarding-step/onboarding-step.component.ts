import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-onboarding-step',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './onboarding-step.component.html',
  styleUrls: ['./onboarding-step.component.scss']
})
export class OnboardingStepComponent implements OnInit {
  // Form input properties for 'create-project' step
  projectName: string = '';
  projectDescription: string = '';
  projectVisibility: 'private' | 'team' | 'public' = 'private'; // Default to private, with literal type

  @Output() projectCreated = new EventEmitter<{ name: string; description: string; visibility: 'private' | 'team' | 'public' }>();

  // For file upload
  @Output() filesUploaded = new EventEmitter<FileList>();

  // For analysis
  @Output() analysisInitiated = new EventEmitter<void>();
  @Input() stepNumber!: number;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() icon!: string;
  @Input() description!: string;
  @Input() actionItems?: string[];
  @Input() tips?: string[];
  @Input() showInteractions?: boolean;

  ngOnInit(): void {
    // Initialization logic if needed
  }

  // Method to get correct viewBox for icons based on their type
  getIconViewBox(): string {
    switch (this.icon) {
      case 'project':
        return '0 0 24 24'; // Default for feather icons
      case 'upload':
        return '0 0 24 24';
      case 'analysis':
        return '0 0 24 24';
      case 'chat':
        return '0 0 24 24';
      case 'results':
        return '0 0 24 24';
      default:
        return '0 0 24 24'; // Fallback
    }
  }

  // Method to get correct viewBox for illustrations based on their type
  getIllustrationViewBox(): string {
    switch (this.icon) {
      case 'project':
        return '0 0 24 24';
      case 'upload':
        return '0 0 24 24';
      case 'analysis':
        return '0 0 24 24';
      case 'chat':
        return '0 0 24 24';
      case 'results':
        return '0 0 24 24';
      default:
        return '0 0 24 24'; // Fallback
    }
  }

  // Handle project creation form submission
  createProject(): void {
    if (this.projectName.trim()) {
      this.projectCreated.emit({
        name: this.projectName,
        description: this.projectDescription,
        visibility: this.projectVisibility
      });
      // Optionally reset form after submission
      this.projectName = '';
      this.projectDescription = '';
      this.projectVisibility = 'private';
      console.log('Project created:', { name: this.projectName, description: this.projectDescription, visibility: this.projectVisibility });
    } else {
      console.warn('Project name is required.');
      // Add visual feedback for required field
    }
  }

  // Handle file selection for upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.filesUploaded.emit(input.files);
      console.log('Files selected for upload:', input.files);
    }
  }

  // Initiate analysis
  startAnalysis(): void {
    this.analysisInitiated.emit();
    console.log('Analysis initiated.');
  }
}
