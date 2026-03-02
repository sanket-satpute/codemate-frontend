import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { ProjectService } from '../../../core/services/project/project.service';
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { Subscription } from 'rxjs';

interface PaletteAction {
    id: string;
    icon: string;
    label: string;
    route?: string;
    action?: () => void;
    category: 'navigation' | 'project' | 'action';
}

@Component({
    selector: 'app-command-palette',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './command-palette.component.html',
    styleUrls: ['./command-palette.component.scss']
})
export class CommandPaletteComponent implements OnInit, OnDestroy {
    @Input() isOpen: boolean = false;

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild('palettePanel') palettePanel!: ElementRef;

    searchQuery: string = '';

    /** Static navigation/action items */
    private staticActions: PaletteAction[] = [
        { id: 'projects', icon: 'fa-folder', label: 'Go to Projects', route: '/projects', category: 'navigation' },
        { id: 'dashboard', icon: 'fa-chart-pie', label: 'Go to Dashboard', route: '/dashboard', category: 'navigation' },
        { id: 'notifications', icon: 'fa-bell', label: 'Notifications', route: '/notifications', category: 'navigation' },
        { id: 'settings', icon: 'fa-cog', label: 'Settings', route: '/settings/profile', category: 'navigation' },
        { id: 'help', icon: 'fa-question-circle', label: 'Help Center', route: '/help-center', category: 'navigation' },
        { id: 'theme', icon: 'fa-adjust', label: 'Toggle Dark/Light Mode', action: () => this.themeService.toggleTheme(), category: 'action' },
    ];

    /** Dynamic project items loaded from the backend */
    private projectActions: PaletteAction[] = [];

    /** Combined actions for searching */
    actions: PaletteAction[] = [...this.staticActions];

    filteredActions: PaletteAction[] = [...this.actions];
    selectedIndex: number = 0;
    isLoadingProjects = false;

    private focusTrap: any;
    private projectSub: Subscription | null = null;

    constructor(
        private shortcutService: ShortcutService,
        private themeService: ThemeService,
        private projectService: ProjectService,
        private router: Router,
        private focusTrapFactory: FocusTrapFactory,
        private elementRef: ElementRef
    ) { }

    ngOnInit(): void {
        if (this.isOpen) {
            this.trapFocus();
            this.loadProjects();
        }
    }

    ngOnDestroy(): void {
        this.releaseFocusTrap();
        this.projectSub?.unsubscribe();
    }

    ngOnChanges(): void {
        if (this.isOpen) {
            this.searchQuery = '';
            this.loadProjects();
            this.rebuildActions();
            this.filteredActions = [...this.actions];
            this.selectedIndex = 0;
            this.trapFocus();

            // Auto-focus input
            setTimeout(() => {
                if (this.searchInput) {
                    this.searchInput.nativeElement.focus();
                }
            }, 50);
        } else {
            this.releaseFocusTrap();
        }
    }

    /**
     * Loads real projects from the backend and maps them to palette actions.
     */
    private loadProjects(): void {
        // Use already-loaded projects from the service signal if available
        const cached = this.projectService.projects();
        if (cached && cached.length > 0) {
            this.mapProjectsToActions(cached);
            return;
        }

        this.isLoadingProjects = true;
        this.projectSub = this.projectService.getProjects().subscribe({
            next: (projects) => {
                this.mapProjectsToActions(projects);
                this.isLoadingProjects = false;
            },
            error: () => {
                this.isLoadingProjects = false;
            }
        });
    }

    private mapProjectsToActions(projects: any[]): void {
        this.projectActions = projects.map(p => ({
            id: `project-${p.id}`,
            icon: 'fa-code',
            label: `Open Project: ${p.name}`,
            route: `/project-workspace/${p.id}/overview`,
            category: 'project' as const
        }));
        this.rebuildActions();
        // Re-filter in case the palette is already open with a search query
        this.onSearchChange();
    }

    private rebuildActions(): void {
        this.actions = [...this.staticActions, ...this.projectActions];
    }

    onSearchChange(): void {
        if (!this.searchQuery) {
            this.filteredActions = [...this.actions];
        } else {
            const q = this.searchQuery.toLowerCase();
            this.filteredActions = this.actions.filter(a => a.label.toLowerCase().includes(q));
        }
        this.selectedIndex = 0; // Reset selection
    }

    executeAction(action: PaletteAction): void {
        if (action.route) {
            this.router.navigate([action.route]);
        } else if (action.action) {
            action.action();
        }
        this.closePalette();
    }

    closePalette(): void {
        this.shortcutService.closeCommandPalette();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === this.elementRef.nativeElement.querySelector('.command-palette-overlay')) {
            this.closePalette();
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        if (!this.isOpen) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            this.closePalette();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % this.filteredActions.length;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + this.filteredActions.length) % this.filteredActions.length;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (this.filteredActions.length > 0) {
                this.executeAction(this.filteredActions[this.selectedIndex]);
            }
        }
    }

    private trapFocus(): void {
        if (this.palettePanel && !this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(this.palettePanel.nativeElement);
            this.focusTrap.attach();
        }
    }

    private releaseFocusTrap(): void {
        if (this.focusTrap) {
            this.focusTrap.destroy();
            this.focusTrap = null;
        }
    }
}
