import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import { ProjectService } from '../../core/services/project/project.service';
import { UploadService } from '../../core/services/upload.service'; // Corrected service name
import { UploadProjectRequest } from '../../core/models/upload.model'; // Import for project creation request
import { Project } from '../../core/models/project.model'; // Import for Project model response
import { JobStatus } from '../../core/models/job.model'; // Import for JobStatus response
import { OnboardingStepComponent } from './onboarding-step/onboarding-step.component'; // Keep import for type checking in onActivate
import { WelcomeOnboardingComponent } from './welcome-onboarding/welcome-onboarding.component'; // Keep import for type checking in onActivate


interface OnboardingStep {
  step: number;
  route: string;
  title: string;
  icon: string;
  subtitle: string;
  description: string;
  actionItems?: string[];
  tips?: string[];
  showInteractions?: boolean;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  onboardingSteps: OnboardingStep[] = [
    {
      step: 1,
      route: 'welcome',
      title: 'Welcome to CodeScope',
      icon: 'welcome', // Custom icon for welcome page if needed
      subtitle: 'The future of AI-Powered Code Analysis',
      description: 'Transform your development workflow with intelligent insights, automated code reviews, and real-time collaboration tools that elevate your code quality to enterprise standards.'
    },
    {
      step: 2,
      route: 'create-project',
      title: 'Start Your First Project',
      icon: 'project',
      subtitle: 'Easily set up a new project in CodeScope.',
      description: 'CodeScope allows you to organize your code analysis efforts by creating dedicated projects. Each project acts as a container for your codebase, analysis reports, and team collaborations. Get started by giving your project a meaningful name and a brief description.',
      actionItems: [
        'Name your project (e.g., "My E-commerce Backend").',
        'Provide a short description of its purpose.',
        'Choose a visibility setting (e.g., Public, Private, Team).'
      ],
      tips: [
        'Project names should be concise and descriptive.',
        'You can change project settings later in the dashboard.',
        'Consider using a consistent naming convention for team projects.'
      ],
      showInteractions: true
    },
    {
      step: 3,
      route: 'upload-files',
      title: 'Upload Your Codebase',
      icon: 'upload',
      subtitle: 'Integrate your project by uploading source code files.',
      description: 'Seamlessly upload your source code files to CodeScope for analysis. You can upload individual files, entire directories, or connect directly to your version control system (e.g., Git). Our platform supports a wide range of programming languages.',
      actionItems: [
        'Drag and drop your project folder or select files.',
        'Ensure sensitive data is excluded from uploads.',
        'Supported file types include common programming languages.'
      ],
      tips: [
        'For best results, upload the root directory of your project.',
        'Use `.gitignore` files to exclude unnecessary folders like `node_modules`.',
        'Large uploads may take a few moments to process.'
      ],
      showInteractions: true
    },
    {
      step: 4,
      route: 'run-analysis',
      title: 'Initiate Code Analysis',
      icon: 'analysis',
      subtitle: 'Uncover insights with our powerful AI analysis engine.',
      description: 'Once your files are uploaded, CodeScope\'s AI engine will perform a deep scan of your codebase. It identifies potential bugs, security vulnerabilities, performance bottlenecks, and adherence to coding standards. This process is fast, comprehensive, and provides actionable recommendations.',
      actionItems: [
        'Click \'Start Analysis\' to begin.',
        'Monitor the progress in real-time.',
        'Review detected issues and suggestions.'
      ],
      tips: [
        'Initial analysis might take longer for larger projects.',
        'You can configure custom analysis rules in project settings.',
        'Our AI learns from your preferences to provide more relevant suggestions.'
      ],
      showInteractions: true
    },
    {
      step: 5,
      route: 'chat-with-ai',
      title: 'Interact with Your AI Assistant',
      icon: 'chat',
      subtitle: 'Get instant help and explanations from our AI.',
      description: 'CodeScope features an integrated AI assistant that can answer your questions about the codebase, explain complex issues, and even suggest code improvements. Think of it as a pair programmer available 24/7, ready to assist you in understanding and refining your code.',
      actionItems: [
        'Ask questions about specific code snippets or issues.',
        'Request explanations for analysis findings.',
        'Get suggestions for refactoring or optimization.'
      ],
      tips: [
        'Be specific with your questions for better responses.',
        'The AI can help generate code examples or fix suggestions.',
        'Your conversations are private and secure.'
      ],
      showInteractions: true
    },
    {
      step: 6,
      route: 'view-results',
      title: 'Review Your Analysis Results',
      icon: 'results',
      subtitle: 'Dive deep into comprehensive reports and actionable insights.',
      description: 'The final step is to review the detailed analysis reports. CodeScope provides an intuitive dashboard summarizing code quality, security posture, and performance metrics. You\'ll find a prioritized list of issues, complete with explanations, severity levels, and direct links to affected code lines.',
      actionItems: [
        'Explore the interactive dashboard.',
        'Filter issues by severity or type.',
        'Track your project\'s code health over time.'
      ],
      tips: [
        'Focus on critical and high-severity issues first.',
        'Use the reporting features to share insights with your team.',
        'Set up notifications for new issues in your project.'
      ],
      showInteractions: true
    }
  ];

  currentStep = signal(1);
  hasCompletedOnboarding = signal(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private projectService: ProjectService,
    private uploadService: UploadService // Corrected service injection
  ) {}

  ngOnInit(): void {
    const storedCompletion = this.localStorageService.getItem('hasCompletedOnboarding');
    this.hasCompletedOnboarding.set(storedCompletion === 'true');

    // Redirect immediately if onboarding has been completed
    if (this.hasCompletedOnboarding()) {
      this.router.navigate(['/dashboard']);
      return; // Stop further execution of ngOnInit
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this._updateCurrentStep());

    this._updateCurrentStep(); // Initial update
  }

  private _updateCurrentStep(): void {
    let currentChildRoute = this.route;
    while (currentChildRoute.firstChild) {
      currentChildRoute = currentChildRoute.firstChild;
    }
    const currentRouteSegment = currentChildRoute.snapshot.url.length > 0 ? currentChildRoute.snapshot.url[0].path : '';

    const foundStep = this.onboardingSteps.find(step => step.route === currentRouteSegment);
    if (foundStep) {
      this.currentStep.set(foundStep.step);
    } else {
      // If the current route is part of onboarding but not recognized (e.g., direct access to a non-existent child),
      // redirect to the first step.
      if (this.router.url.includes('/onboarding/') && currentRouteSegment !== this.onboardingSteps[0].route) {
        this.router.navigate([`./${this.onboardingSteps[0].route}`], { relativeTo: this.route });
      }
    }
  }

  onActivate(componentRef: any): void {
    // onActivate is called after the child component is instantiated and the route is resolved.
    // This is a good place to ensure the current step is correctly set based on the *activated* component.
    this._updateCurrentStep(); // Update current step whenever a child component is activated

    const currentStepData = this.onboardingSteps.find(step => step.step === this.currentStep());
    if (currentStepData) {
      if (componentRef instanceof OnboardingStepComponent) {
        // Assign data to OnboardingStepComponent inputs
        componentRef.stepNumber = currentStepData.step;
        componentRef.title = currentStepData.title;
        componentRef.subtitle = currentStepData.subtitle;
        componentRef.icon = currentStepData.icon;
        componentRef.description = currentStepData.description;
        componentRef.actionItems = currentStepData.actionItems;
        componentRef.tips = currentStepData.tips;
        componentRef.showInteractions = currentStepData.showInteractions;

        // Listen to output events from OnboardingStepComponent
        if (currentStepData.route === 'create-project') {
          componentRef.projectCreated.subscribe(event => this.handleProjectCreation(event.name, event.description, event.visibility));
        } else if (currentStepData.route === 'upload-files') {
          componentRef.filesUploaded.subscribe(files => this.handleFilesUpload(files));
        } else if (currentStepData.route === 'run-analysis') {
          componentRef.analysisInitiated.subscribe(() => this.handleAnalysisInitiation());
        }
      } else if (componentRef instanceof WelcomeOnboardingComponent) {
        // WelcomeOnboardingComponent is designed to be self-contained for content,
        // so no direct @Input assignment is needed here unless its structure changes.
        // If it were to receive dynamic content, it would be handled similarly.
      }
    }
  }

  // Handle project creation
  handleProjectCreation(name: string, description: string, visibility: 'private' | 'team' | 'public'): void {
    console.log('OnboardingComponent received project creation:', { name, description, visibility });
    const projectRequest: UploadProjectRequest = { name, description, visibility };
    // Integrate with actual project service
    this.uploadService.uploadProject(projectRequest).subscribe(
      (response: Project) => { // Explicitly typed response
        console.log('Project created successfully:', response);
        this.nextStep(); // Move to the next step after successful project creation
      },
      (error: any) => { // Explicitly typed error
        console.error('Error creating project:', error);
        // Handle error (e.g., show a toast message)
      }
    );
  }

  // Handle files upload
  handleFilesUpload(files: FileList): void {
    console.log('OnboardingComponent received files for upload:', files);
    // Integrate with actual file upload service - assuming it handles multiple files
    // The current `uploadFile` in `UploadService` takes a single File.
    // For simplicity, let's just upload the first file for now or iterate.
    if (files.length > 0) {
      this.uploadService.uploadFile(files[0]).subscribe(
        (response: number | JobStatus) => { // Explicitly typed response
          if (typeof response === 'number') {
            console.log(`Upload progress: ${response}%`);
          } else {
            console.log('Files uploaded successfully (Job Status):', response);
            this.nextStep(); // Move to the next step after successful upload
          }
        },
        (error: any) => { // Explicitly typed error
          console.error('Error uploading files:', error);
          // Handle error
        }
      );
    } else {
      console.warn('No files selected for upload.');
      // Optionally move to next step or provide feedback
      this.nextStep();
    }
  }

  // Handle analysis initiation
  handleAnalysisInitiation(): void {
    console.log('OnboardingComponent received analysis initiation.');
    // Integrate with actual analysis service (assuming project service can trigger this)
    // this.projectService.initiateAnalysis(this.currentProject.id).subscribe(
    //   response => {
    //     console.log('Analysis initiated successfully:', response);
    //     this.nextStep();
    //   },
    //   error => {
    //     console.error('Error initiating analysis:', error);
    //   }
    // );
    // For now, just move to the next step
    this.nextStep();
  }

  nextStep(): void {
    const nextStepIndex = this.currentStep(); // currentStep is 1-based, so this is already the correct 0-based index for the *next* step
    if (nextStepIndex < this.onboardingSteps.length) {
      this.router.navigate([`./${this.onboardingSteps[nextStepIndex].route}`], { relativeTo: this.route });
    } else {
      this.completeOnboarding();
    }
  }

  prevStep(): void {
    const prevStepIndex = this.currentStep() - 2; // currentStep is 1-based, so for 0-based index it's (currentStep - 1) - 1
    if (prevStepIndex >= 0) {
      this.router.navigate([`./${this.onboardingSteps[prevStepIndex].route}`], { relativeTo: this.route });
    }
  }

  goToStep(stepNumber: number): void {
    const step = this.onboardingSteps.find(s => s.step === stepNumber);
    if (step) {
      this.router.navigate([`./${step.route}`], { relativeTo: this.route });
    }
  }

  skipOnboarding(): void {
    this.completeOnboarding();
  }

  completeOnboarding(): void {
    this.localStorageService.setItem('hasCompletedOnboarding', 'true');
    this.hasCompletedOnboarding.set(true);
    this.router.navigate(['/dashboard']);
  }
}
