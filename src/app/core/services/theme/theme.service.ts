import { Injectable, signal, effect, Renderer2, inject, RendererFactory2 } from '@angular/core';
import { getSystemTheme } from '../../utils/theme.utils';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  currentTheme = signal<Theme>('light');
  isWiping = signal<boolean>(false); // New signal to control wipe animation

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();

    effect(() => {
      const theme = this.currentTheme();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      // applyTheme is now called directly in initTheme and after wipe animation
    }, { allowSignalWrites: true });
  }

  private initTheme(): void {
    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) {
        this.currentTheme.set(storedTheme);
      } else {
        this.currentTheme.set(getSystemTheme());
      }
    } else {
      this.currentTheme.set('light'); // Default to light if no localStorage
    }
    this.applyTheme(this.currentTheme()); // Apply theme initially
  }

  toggleTheme(): void {
    this.isWiping.set(true); // Start wipe animation (fade-in 200ms)

    // Wait for the wipe-in animation to complete (200ms) + a short hold (50ms)
    setTimeout(() => {
      this.currentTheme.update(current => (current === 'light' ? 'dark' : 'light'));
      this.applyTheme(this.currentTheme()); // Apply new theme while wipe is fully opaque

      // After theme change, allow the wipe-out animation to complete (300ms)
      setTimeout(() => {
        this.isWiping.set(false); // End wipe animation
      }, 300); // Matching the fade-out duration of the wipe animation
    }, 250); // 200ms (wipe-in) + 50ms (hold)
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        this.renderer.addClass(document.body, 'dark-theme');
      } else {
        this.renderer.removeClass(document.body, 'dark-theme');
      }
    }
  }
}
