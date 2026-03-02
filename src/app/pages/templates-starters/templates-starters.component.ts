import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Template {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  category: string;
  rating: number;
  uses: string;
  featured: boolean;
  features?: string[];
}

@Component({
  selector: 'app-templates-starters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './templates-starters.component.html',
  styleUrls: ['./templates-starters.component.scss']
})
export class TemplatesStartersComponent {
  selectedCategory = 'All';
  searchTerm = '';
  selectedTemplate: Template | null = null;

  categories = [
    'All', 'Frontend', 'Backend', 'Full-Stack', 'Mobile Apps',
    'DevOps', 'AI / ML', 'Microservices', 'APIs', 'Desktop Apps'
  ];

  templates: Template[] = [
    // Featured
    {
      name: 'Next.js SaaS Starter',
      description: 'A production-ready SaaS boilerplate with authentication, billing, and dashboard.',
      icon: 'fas fa-rocket',
      tags: ['Next.js', 'React', 'TypeScript'],
      category: 'Full-Stack',
      rating: 4.9,
      uses: '28,450',
      featured: true,
      features: ['Authentication', 'Stripe Billing', 'Admin Dashboard', 'Dark Mode']
    },
    {
      name: 'Angular Admin Dashboard',
      description: 'A feature-rich admin panel with charts, tables, and user management.',
      icon: 'fab fa-angular',
      tags: ['Angular', 'TypeScript', 'Dashboard'],
      category: 'Frontend',
      rating: 4.8,
      uses: '22,100',
      featured: true,
      features: ['Responsive Design', 'NgRx State', 'Lazy Loading', 'Chart.js']
    },
    {
      name: 'Spring Boot REST API',
      description: 'Enterprise-grade REST API with JWT auth, Swagger docs, and layered architecture.',
      icon: 'fas fa-leaf',
      tags: ['Java', 'Spring Boot', 'REST API'],
      category: 'Backend',
      rating: 4.7,
      uses: '19,800',
      featured: true,
      features: ['JWT Authentication', 'Swagger/OpenAPI', 'JPA/Hibernate', 'Docker Ready']
    },
    {
      name: 'Node.js + MongoDB Boilerplate',
      description: 'Full-stack JavaScript stack with Express, Mongoose, and Passport authentication.',
      icon: 'fab fa-node-js',
      tags: ['Node.js', 'Express.js', 'MongoDB'],
      category: 'Backend',
      rating: 4.6,
      uses: '16,500',
      featured: true,
      features: ['Passport Auth', 'Mongoose ODM', 'Socket.io', 'Rate Limiting']
    },
    {
      name: 'Flutter Finance App',
      description: 'Beautiful mobile finance app UI with charts, transactions, and wallet screens.',
      icon: 'fas fa-mobile-alt',
      tags: ['Flutter', 'Dart', 'Mobile UI'],
      category: 'Mobile Apps',
      rating: 4.8,
      uses: '14,200',
      featured: true,
      features: ['Custom Charts', 'Wallet UI', 'Transaction History', 'Biometric Auth']
    },
    // Regular templates
    {
      name: 'Angular Blog Starter',
      description: 'A responsive blog starter built with Angular and a clean design.',
      icon: 'fas fa-blog',
      tags: ['Angular', 'Frontend', 'TypeScript'],
      category: 'Frontend',
      rating: 4.8,
      uses: '12,340',
      featured: false,
      features: ['Responsive Design', 'Markdown Support', 'SEO Optimized', 'PWA Ready']
    },
    {
      name: 'FastAPI Microservice',
      description: 'A robust template for building high-performance microservices with FastAPI.',
      icon: 'fas fa-bolt',
      tags: ['Python', 'FastAPI', 'Microservices'],
      category: 'Microservices',
      rating: 4.7,
      uses: '8,910',
      featured: false,
      features: ['Async Support', 'Auto API Docs', 'Docker Compose', 'Redis Caching']
    },
    {
      name: 'React E-Commerce',
      description: 'Complete e-commerce storefront with cart, checkout, and payment integration.',
      icon: 'fab fa-react',
      tags: ['React', 'Redux', 'Stripe'],
      category: 'Full-Stack',
      rating: 4.6,
      uses: '15,320',
      featured: false,
      features: ['Shopping Cart', 'Stripe Payments', 'Product Search', 'Order Tracking']
    },
    {
      name: 'Django REST Framework',
      description: 'Python-powered REST API with DRF, PostgreSQL, and Celery task queues.',
      icon: 'fab fa-python',
      tags: ['Python', 'Django', 'REST API'],
      category: 'Backend',
      rating: 4.5,
      uses: '11,200',
      featured: false,
      features: ['Token Auth', 'Celery Tasks', 'PostgreSQL', 'API Throttling']
    },
    {
      name: 'Vue.js Dashboard',
      description: 'Modern admin dashboard with Vue 3, Pinia, and Tailwind CSS.',
      icon: 'fab fa-vuejs',
      tags: ['Vue.js', 'Pinia', 'Tailwind'],
      category: 'Frontend',
      rating: 4.7,
      uses: '9,800',
      featured: false,
      features: ['Vue 3 Composition', 'Pinia Store', 'Dark Mode', 'i18n Support']
    },
    {
      name: 'Kubernetes Deployment',
      description: 'Production-ready K8s manifests with Helm charts, monitoring, and auto-scaling.',
      icon: 'fas fa-dharmachakra',
      tags: ['Kubernetes', 'Helm', 'DevOps'],
      category: 'DevOps',
      rating: 4.4,
      uses: '6,700',
      featured: false,
      features: ['Helm Charts', 'Prometheus', 'HPA Scaling', 'Ingress Config']
    },
    {
      name: 'TensorFlow ML Pipeline',
      description: 'End-to-end ML pipeline with data preprocessing, training, and serving.',
      icon: 'fas fa-brain',
      tags: ['Python', 'TensorFlow', 'ML'],
      category: 'AI / ML',
      rating: 4.6,
      uses: '7,500',
      featured: false,
      features: ['Data Pipeline', 'Model Training', 'TF Serving', 'MLflow Tracking']
    },
    {
      name: 'Electron Desktop App',
      description: 'Cross-platform desktop application with Electron, React, and auto-updates.',
      icon: 'fas fa-desktop',
      tags: ['Electron', 'React', 'Desktop'],
      category: 'Desktop Apps',
      rating: 4.3,
      uses: '5,400',
      featured: false,
      features: ['Auto Updates', 'System Tray', 'Native Menus', 'IPC Communication']
    },
    {
      name: 'GraphQL API Gateway',
      description: 'Federated GraphQL gateway with Apollo Server and schema stitching.',
      icon: 'fas fa-project-diagram',
      tags: ['GraphQL', 'Apollo', 'Node.js'],
      category: 'APIs',
      rating: 4.5,
      uses: '8,200',
      featured: false,
      features: ['Schema Federation', 'Subscriptions', 'Rate Limiting', 'Caching']
    },
  ];

  get featuredTemplates(): Template[] {
    return this.templates.filter(t => t.featured);
  }

  get filteredTemplates(): Template[] {
    return this.templates.filter(t => {
      const matchesCategory = this.selectedCategory === 'All' || t.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm ||
        t.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch && !t.featured;
    });
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
  }

  openPreview(template: Template): void {
    this.selectedTemplate = template;
  }

  closePreview(): void {
    this.selectedTemplate = null;
  }

  useTemplate(template: Template): void {
    console.log('Using template:', template.name);
  }
}
