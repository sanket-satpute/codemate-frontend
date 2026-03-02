import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ShortcutService {
    /**
     * Global signal controlling the visibility of the Command Palette (Cmd+K / Ctrl+K search)
     */
    commandPaletteOpen = signal<boolean>(false);

    constructor() { }

    /**
     * Toggles the command palette open or closed
     */
    toggleCommandPalette(): void {
        this.commandPaletteOpen.update(open => !open);
    }

    /**
     * Explicitly closes the command palette
     */
    closeCommandPalette(): void {
        this.commandPaletteOpen.set(false);
    }

    /**
     * Explicitly opens the command palette
     */
    openCommandPalette(): void {
        this.commandPaletteOpen.set(true);
    }
}
