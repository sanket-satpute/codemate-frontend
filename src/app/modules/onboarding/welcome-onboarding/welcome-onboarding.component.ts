import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgZone } from '@angular/core';
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

@Component({
  selector: 'app-welcome-onboarding',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome-onboarding.component.html',
  styleUrls: ['./welcome-onboarding.component.scss']
})
export class WelcomeOnboardingComponent implements OnInit, OnDestroy {
  particles: Particle[] = [];
  private animationFrameId?: number; // Use number for requestAnimationFrame ID
  private particleCount = 50;

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initializeParticles();
    this.startParticleAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initializeParticles(): void {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }

  private startParticleAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.updateParticles();
        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  private updateParticles(): void {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen edges
      if (particle.x < 0) particle.x = 100;
      if (particle.x > 100) particle.x = 0;
      if (particle.y < 0) particle.y = 100;
      if (particle.y > 100) particle.y = 0;
    });
  }

  showDemo(demoType: string): void {
    console.log('Showing demo:', demoType);
  }

  trackByParticle(index: number, particle: Particle): any {
    return index;
  }
}
