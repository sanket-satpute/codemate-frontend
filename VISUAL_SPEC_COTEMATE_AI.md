# CodeMate AI - Visual Specification & Motion Design

This document outlines the visual specifications and motion design for the premium Linear-style navbar of the CodeMate AI developer tool. It includes design tokens, component specifics, motion keyframes, and implementation guidelines for UI designers and frontend developers.

## 1. Design Tokens (CSS Variables)

The following CSS variables should be used for consistent styling across light and dark themes.

```json
{
  "colors": {
    "light": {
      "--primary-50": "#EEEDFD",
      "--primary-100": "#DDDDFB",
      "--primary-200": "#C2C0F7",
      "--primary-300": "#A6A3F3",
      "--primary-400": "#8B86F0",
      "--primary-500": "#6F69EC",
      "--primary-600": "#4F46E5",
      "--primary-700": "#3F37B7",
      "--primary-800": "#2F2889",
      "--primary-900": "#1F1A5B",
      "--primary-950": "#0F0D2E",
      "--accent-50": "#EEFDFD",
      "--accent-100": "#DDFBFB",
      "--accent-200": "#C2F7F7",
      "--accent-300": "#A3F3F3",
      "--accent-400": "#86F0F0",
      "--accent-500": "#69ECEC",
      "--accent-600": "#22D3EE",
      "--accent-700": "#1CB0BF",
      "--accent-800": "#158D91",
      "--accent-900": "#0E6B6B",
      "--accent-950": "#073A3A",
      "--grey-50": "#F8FAFC",
      "--grey-100": "#F1F5F9",
      "--grey-200": "#E2E8F0",
      "--grey-300": "#CBD5E1",
      "--grey-400": "#94A3B8",
      "--grey-500": "#64748B",
      "--grey-600": "#475569",
      "--grey-700": "#334155",
      "--grey-800": "#1E293B",
      "--grey-900": "#0F172A",
      "--grey-950": "#020407",
      "--background": "var(--grey-50)",
      "--surface-default": "var(--white)",
      "--surface-card": "var(--white)",
      "--border-default": "var(--grey-200)",
      "--border-neutral": "var(--grey-300)",
      "--text-primary": "var(--grey-900)",
      "--text-muted": "var(--grey-600)",
      "--text-white": "var(--white)",
      "--text-link": "var(--primary-600)",
      "--error": "#EF4444",
      "--success": "#22C55E",
      "--warning": "#F59E0B"
    },
    "dark": {
      "--primary-50": "#EEEDFD",
      "--primary-100": "#DDDDFB",
      "--primary-200": "#C2C0F7",
      "--primary-300": "#A6A3F3",
      "--primary-400": "#8B86F0",
      "--primary-500": "#6F69EC",
      "--primary-600": "#4F46E5",
      "--primary-700": "#3F37B7",
      "--primary-800": "#2F2889",
      "--primary-900": "#1F1A5B",
      "--primary-950": "#0F0D2E",
      "--accent-50": "#EEFDFD",
      "--accent-100": "#DDFBFB",
      "--accent-200": "#C2F7F7",
      "--accent-300": "#A3F3F3",
      "--accent-400": "#86F0F0",
      "--accent-500": "#69ECEC",
      "--accent-600": "#22D3EE",
      "--accent-700": "#1CB0BF",
      "--accent-800": "#158D91",
      "--accent-900": "#0E6B6B",
      "--accent-950": "#073A3A",
      "--grey-50": "#F8FAFC",
      "--grey-100": "#F1F5F9",
      "--grey-200": "#E2E8F0",
      "--grey-300": "#CBD5E1",
      "--grey-400": "#94A3B8",
      "--grey-500": "#64748B",
      "--grey-600": "#475569",
      "--grey-700": "#334155",
      "--grey-800": "#1E293B",
      "--grey-900": "#0F172A",
      "--grey-950": "#020407",
      "--background": "var(--grey-900)",
      "--surface-default": "var(--grey-950)",
      "--surface-card": "var(--grey-800)",
      "--border-default": "var(--grey-700)",
      "--border-neutral": "var(--grey-600)",
      "--text-primary": "var(--grey-100)",
      "--text-muted": "var(--grey-400)",
      "--text-white": "var(--white)",
      "--text-link": "var(--primary-400)",
      "--error": "#F87171",
      "--success": "#4ADE80",
      "--warning": "#FACC15"
    },
    "shared": {
      "--white": "#FFFFFF"
    }
  },
  "typography": {
    "--font-family-ui": "Inter, sans-serif",
    "--font-family-code": "'JetBrains Mono', monospace",
    "--font-size-h1": "4.5rem",
    "--font-weight-h1": "800",
    "--line-height-h1": "1.1",
    "--letter-spacing-h1": "-0.03em",
    "--font-size-h2": "3.75rem",
    "--font-weight-h2": "800",
    "--line-height-h2": "1.1",
    "--letter-spacing-h2": "-0.025em",
    "--font-size-h3": "3rem",
    "--font-weight-h3": "700",
    "--line-height-h3": "1.2",
    "--letter-spacing-h3": "-0.02em",
    "--font-size-h4": "2.25rem",
    "--font-weight-h4": "700",
    "--line-height-h4": "1.2",
    "--letter-spacing-h4": "-0.015em",
    "--font-size-h5": "1.875rem",
    "--font-weight-h5": "600",
    "--line-height-h5": "1.3",
    "--letter-spacing-h5": "-0.01em",
    "--font-size-h6": "1.5rem",
    "--font-weight-h6": "600",
    "--line-height-h6": "1.4",
    "--letter-spacing-h6": "-0.005em",
    "--font-size-body-lg": "1.125rem",
    "--font-weight-body-lg": "400",
    "--line-height-body-lg": "1.7",
    "--letter-spacing-body-lg": "0",
    "--font-size-body": "1rem",
    "--font-weight-body": "400",
    "--line-height-body": "1.6",
    "--letter-spacing-body": "0",
    "--font-size-body-sm": "0.875rem",
    "--font-weight-body-sm": "400",
    "--line-height-body-sm": "1.5",
    "--letter-spacing-body-sm": "0",
    "--font-size-caption": "0.75rem",
    "--font-weight-caption": "400",
    "--line-height-caption": "1.4",
    "--letter-spacing-caption": "0.02em"
  },
  "spacing": {
    "--spacing-px": "1px",
    "--spacing-0-5": "2px",
    "--spacing-1": "4px",
    "--spacing-1-5": "6px",
    "--spacing-2": "8px",
    "--spacing-2-5": "10px",
    "--spacing-3": "12px",
    "--spacing-3-5": "14px",
    "--spacing-4": "16px",
    "--spacing-5": "20px",
    "--spacing-6": "24px",
    "--spacing-7": "28px",
    "--spacing-8": "32px",
    "--spacing-9": "36px",
    "--spacing-10": "40px",
    "--spacing-11": "44px",
    "--spacing-12": "48px",
    "--spacing-14": "56px",
    "--spacing-16": "64px",
    "--spacing-20": "80px",
    "--spacing-24": "96px",
    "--spacing-32": "128px",
    "--spacing-40": "160px",
    "--spacing-48": "192px",
    "--spacing-56": "224px",
    "--spacing-64": "256px"
  },
  "border-radii": {
    "--border-radius-none": "0px",
    "--border-radius-sm": "4px",
    "--border-radius-md": "8px",
    "--border-radius-lg": "12px",
    "--border-radius-xl": "18px",
    "--border-radius-2xl": "24px",
    "--border-radius-full": "9999px"
  },
  "shadows": {
    "--shadow-xs": "0 1px 1px rgba(0, 0, 0, 0.05)",
    "--shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.07)",
    "--shadow-md": "0 4px 6px rgba(0, 0, 0, 0.1)",
    "--shadow-lg": "0 10px 15px rgba(0, 0, 0, 0.15)",
    "--shadow-xl": "0 20px 25px rgba(0, 0, 0, 0.2)",
    "--shadow-2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
    "--shadow-inner": "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
    "--shadow-navbar": "0 2px 8px rgba(0, 0, 0, 0.2)",
    "--shadow-dialog": "0 8px 30px rgba(0, 0, 0, 0.3)",
    "--shadow-badge": "0 1px 3px rgba(0, 0, 0, 0.1)",
    "--focus-ring-light": "0 0 0 2px var(--primary-600)",
    "--focus-ring-dark": "0 0 0 2px var(--primary-400)"
  },
  "gradients": {
    "--gradient-primary-indigo-cyan": "linear-gradient(90deg, var(--primary-600), var(--accent-600))"
  },
  "motion": {
    "--duration-fast": "100ms",
    "--duration-base": "160ms",
    "--duration-slow": "240ms",
    "--easing-ease-out": "cubic-bezier(0.25, 0.8, 0.25, 1)",
    "--easing-overshoot": "cubic-bezier(.2,.9,.3,1)",
    "--easing-fade-translate": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  }
}
```

## 2. Component Specifics (Visual Spec + Measurements)

### A. Command/Search Bar (Center of Navbar)

*   **Size:** Height 44px.
*   **Border Radius:** 12px (using `--border-radius-lg`).
*   **Inner Padding:** `padding: var(--spacing-2-5) var(--spacing-4);` (10px vertical, 16px horizontal).
*   **Placeholder Style:**
    *   Font: `var(--font-family-ui)`
    *   Size: `var(--font-size-body)`
    *   Color: `var(--text-muted)`
*   **Microcopy:** `"Quick search or ⌘K — Try: 'Open Projects'"`
*   **Icon Sizes:** 20x20px (e.g., search icon on left).
*   **Focus State:**
    *   `background-color`: lighten `var(--surface-card)` by 6% (or adjust if using dark mode specific surface).
    *   `box-shadow`: `var(--focus-ring-dark)` (for dark mode).
    *   `border`: 1px solid `var(--primary-600)`.
*   **States:**
    *   **Empty:** Default style.
    *   **Typing:** Placeholder fades out, input text appears (`var(--text-primary)`).
    *   **Error:** Border changes to `var(--error)`, subtle red outline.
*   **Suggestion List:**
    *   **Item Height:** 56px.
    *   **Avatar/Icon Slot:** 36x36px, `border-radius: var(--border-radius-md)` (8px).
    *   **Text:** Two lines, `var(--text-primary)` for main text, `var(--text-muted)` for secondary.
    *   **Highlighted State:**
        *   `background-color`: `color.mix(var(--surface-card), var(--primary-600), 8%)` (subtle indigo tint).
        *   `box-shadow`: `var(--shadow-sm)`.

### B. Command Palette Modal

*   **Modal Width:**
    *   Desktop: 920px.
    *   Mobile: 92% of viewport width.
*   **Modal Entry Animation:**
    *   Duration: 150ms.
    *   Transition: `fade + translateY(8px)`.
    *   Easing: `var(--easing-overshoot)` (cubic-bezier(.2,.9,.3,1)).
    *   This implies an initial state of `opacity: 0; transform: translateY(8px);` and a final state of `opacity: 1; transform: translateY(0);`.
*   **List Scroll Behavior:** Smooth scrolling with `scroll-behavior: smooth;`.
*   **Keyboard Focus States:** Clear `box-shadow: var(--focus-ring-dark)` (for dark mode) around the focused item.
*   **Empty State Illustration & Copy:**
    *   Illustration: Minimal line art, centered.
    *   Copy: "No results found. Try a different search term or explore our help center." (Style with `var(--text-muted)` and `var(--font-size-body)`).

### C. Notification & Profile Dropdown

*   **Size & Spacing:**
    *   Dropdown panel `width`: 320px.
    *   `padding`: `var(--spacing-4)` (16px) all around.
    *   Item `height`: 64px.
    *   Separators between items: 1px solid `var(--border-default)`.
*   **Badge Design:**
    *   Small, circular `min-width: 8px, height: 8px`.
    *   `background-color`: `var(--error)` for unread, `var(--primary-600)` for new features.
    *   `box-shadow`: `var(--shadow-badge)`.
*   **Transitions:**
    *   Fade in/out for dropdown visibility: `opacity` transition over `var(--duration-fast)` with `var(--easing-ease-out)`.
    *   Item hover: `background-color` transition over `var(--duration-fast)`.
*   **Recommended Microcopy for Empty Notifications:** "You're all caught up! No new notifications to display."
*   **Avatar / Initials Design for Profile:**
    *   Circular avatar: 36x36px.
    *   `background-color`: `var(--primary-600)` (if initials).
    *   Text: `var(--text-white)`, `font-weight: var(--font-weight-medium)`, `font-size: var(--font-size-body-sm)`.
    *   Fallback to SVG icon if no image/initials.

### D. Theme Toggle (Sun -> Moon Morphing)

*   **Precise Animated State:**
    *   Use SVG icons for sun and moon.
    *   **Transition Properties:** `transform` and `opacity`.
    *   **Duration:** `var(--duration-base)` (160ms).
    *   **Easing:** `cubic-bezier(.2,.9,.3,1)`.
    *   **Sun State:** `transform: rotate(0deg); opacity: 1;`
    *   **Moon State:** `transform: rotate(180deg); opacity: 1;` (simulating a spin as it changes).
    *   Intermediate: `opacity: 0; transform: rotate(90deg) scale(0.8);` during the swap.

### E. Micro-interactions

*   **Hover Lift for Buttons:**
    *   `transform: translateY(-2px);` on hover.
    *   Transition: `transform` over `var(--duration-fast)` with `var(--easing-ease-out)`.
*   **Active States (Click/Press):**
    *   `box-shadow: inset 0 0 0 2px var(--primary-600), inset 0 2px 4px rgba(0,0,0,0.1);`
    *   Transition: `box-shadow` over 120ms with `var(--easing-ease-out)`.
*   **Motion Tokens:**
    *   `--duration-fast: 100ms;`
    *   `--duration-base: 160ms;`
    *   `--duration-slow: 240ms;`
    *   `--easing-ease-out: cubic-bezier(0.25, 0.8, 0.25, 1);`
    *   `--easing-overshoot: cubic-bezier(.2,.9,.3,1);`
    *   `--easing-fade-translate: cubic-bezier(0.34, 1.56, 0.64, 1);`

## 3. Accessibility

*   **Color Contrast Ratios:**
    *   Text elements: Aim for AAA (7:1) for `var(--text-primary)` on `var(--background)`. At minimum, ensure AA (4.5:1).
    *   Icons: Aim for AA (3:1) against background.
*   **Focus Ring Specifics:** Use `box-shadow: var(--focus-ring-dark)` for keyboard focus. Ensure it's always visible and clearly distinguishable from hover states.
*   **Keyboard-only Focus Visuals:** Implement distinct focus styles (e.g., thicker outline or slightly different color from hover) that are only applied when navigating via keyboard (using `:focus-visible`).
*   **ARIA Roles:**
    *   Command Palette: `role="dialog"` or `role="menu"` with `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
    *   Dropdowns: `role="menu"` for the list, `role="menuitem"` for individual items. Ensure proper `aria-expanded` and `aria-haspopup` attributes on toggle buttons.

## 4. Deliverables

*   **JSON of CSS tokens:** `design-tokens.json` (already provided).
*   **Figma Page Spec:** (To be created by UI designer based on this document) Component frames for navbar, command palette, notification, profile dropdown, each with dimensions, states, and motion keyframes.
*   **Exportable SVG or Lottie:** For sun/moon micro-animation (to be created by UI designer based on spec).

## 5. Dev Guide for Implementation

1.  **Integrate Design Tokens:** Import `design-tokens.json` into your SCSS preprocessor or convert to global CSS variables for use in `_variables.scss` or `_theme.scss`. Example:
    ```scss
    // _variables.scss
    :root {
      // Colors
      --primary-600: #4F46E5;
      --accent-600: #22D3EE;
      // ... other colors
      
      // Typography
      --font-family-ui: 'Inter', sans-serif;
      // ... other typography
      
      // Spacing
      --spacing-4: 16px;
      // ... other spacing
      
      // Shadows
      --shadow-navbar: 0 2px 8px rgba(0, 0, 0, 0.2);
      // ... other shadows
      
      // Motion
      --duration-base: 160ms;
      --easing-overshoot: cubic-bezier(.2,.9,.3,1);
    }

    // Example dark mode override
    .dark-theme {
      --background: var(--grey-900);
      --surface-card: var(--grey-800);
      // ... dark mode specific variables
    }
    ```
2.  **Apply Spacing & Radii:** Use `var(--spacing-X)` for padding/margin and `var(--border-radius-Y)` for rounded corners.
3.  **Implement Shadows & Borders:** Utilize `var(--shadow-navbar)`, `var(--shadow-dialog)`, etc., for elevation. Use `var(--border-default)` for general borders.
4.  **Component Styling:** Apply specific measurements and styles as defined in "Component Specifics" using the defined design tokens.
5.  **Motion & Transitions:** Apply `transition` properties with `var(--duration-X)` and `var(--easing-X)` for hover effects, active states, and dropdown animations.
    ```css
    /* Example: Button hover lift */
    .btn {
      transition: transform var(--duration-fast) var(--easing-ease-out);
      &:hover {
        transform: translateY(-2px);
      }
      &:active {
        box-shadow: inset 0 0 0 2px var(--primary-600), inset 0 2px 4px rgba(0,0,0,0.1);
        transition: box-shadow 120ms var(--easing-ease-out);
      }
    }
    ```
6.  **Command Palette Animation:** Use `keyframes` for the modal entry animation, leveraging `opacity` and `transform` with the `var(--easing-overshoot)` bezier curve.
    ```css
    @keyframes modal-enter {
      from { opacity: 0; transform: translateY(var(--spacing-2)); } /* 8px */
      to { opacity: 1; transform: translateY(0); }
    }
    .command-palette-modal {
      animation: modal-enter var(--duration-base) var(--easing-overshoot) forwards;
    }
    ```
7.  **Theme Toggle Animation:** Implement SVG animations for the sun-moon morphing, or use CSS transforms and opacity for a transition between two distinct SVG states.
8.  **Accessibility:** Ensure `aria` attributes are correctly implemented, focus rings are visible, and keyboard navigation is fully supported for interactive elements.
