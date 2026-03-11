import { Injectable, signal, effect, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { getSystemTheme } from '../../utils/theme.utils';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private renderer: Renderer2;
  private systemMediaQuery: MediaQueryList | null = null;
  private systemListener: ((e: MediaQueryListEvent) => void) | null = null;

  /** The user's preference: 'light', 'dark', or 'system' */
  themePreference = signal<ThemePreference>('system');

  /** The resolved (applied) theme: always 'light' or 'dark' */
  currentTheme = signal<Theme>('light');

  isWiping = signal<boolean>(false);

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();

    // Persist preference to localStorage whenever it changes
    effect(() => {
      const pref = this.themePreference();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('themePreference', pref);
      }
    });
  }

  ngOnDestroy(): void {
    this.removeSystemListener();
  }

  private initTheme(): void {
    let preference: ThemePreference = 'system';

    if (typeof localStorage !== 'undefined') {
      // Migrate old 'theme' key to new 'themePreference' if needed
      const storedPref = localStorage.getItem('themePreference') as ThemePreference;
      if (storedPref && ['light', 'dark', 'system'].includes(storedPref)) {
        preference = storedPref;
      } else {
        const legacyTheme = localStorage.getItem('theme') as Theme;
        if (legacyTheme && ['light', 'dark'].includes(legacyTheme)) {
          preference = legacyTheme;
        }
      }
    }

    this.themePreference.set(preference);
    this.resolveAndApply(preference);
  }

  /**
   * Set theme preference — called from settings UI.
   * Accepts 'light', 'dark', or 'system'.
   */
  setTheme(preference: ThemePreference): void {
    this.isWiping.set(true);

    setTimeout(() => {
      this.themePreference.set(preference);
      this.resolveAndApply(preference);

      setTimeout(() => {
        this.isWiping.set(false);
      }, 300);
    }, 250);
  }

  /** Toggle between light ↔ dark (ignores system). Used by navbar toggle button. */
  toggleTheme(): void {
    const next: ThemePreference = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  /** Resolve preference to actual theme and apply to DOM */
  private resolveAndApply(preference: ThemePreference): void {
    this.removeSystemListener();

    let resolved: Theme;

    if (preference === 'system') {
      resolved = getSystemTheme();
      this.listenToSystemChanges();
    } else {
      resolved = preference;
    }

    this.currentTheme.set(resolved);
    this.applyTheme(resolved);
  }

  /** Listen for OS-level theme changes when preference is 'system' */
  private listenToSystemChanges(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    this.systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemListener = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      this.currentTheme.set(newTheme);
      this.applyTheme(newTheme);
    };
    this.systemMediaQuery.addEventListener('change', this.systemListener);
  }

  private removeSystemListener(): void {
    if (this.systemMediaQuery && this.systemListener) {
      this.systemMediaQuery.removeEventListener('change', this.systemListener);
      this.systemMediaQuery = null;
      this.systemListener = null;
    }
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
