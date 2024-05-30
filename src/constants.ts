import type { ThemeOptions } from "./types";

export const DEFAULT_THEME_OPTIONS = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 3.9%)",
    card: "hsl(0, 0%, 100%)",
    "card-foreground": "hsl(0, 0%, 3.9%)",
    popover: "hsl(0, 0%, 100%)",
    "popover-foreground": "hsl(0, 0%, 3.9%)",
    primary: "hsl(0, 0%, 9%)",
    "primary-foreground": "hsl(0, 0%, 98%)",
    secondary: "hsl(0, 0%, 96.1%)",
    "secondary-foreground": "hsl(0, 0%, 9%)",
    muted: "hsl(0, 0%, 96.1%)",
    "muted-foreground": "hsl(0, 0%, 45.1%)",
    accent: "hsl(0, 0%, 96.1%)",
    "accent-foreground": "hsl(0, 0%, 9%)",
    destructive: "hsl(0, 84.2%, 60.2%)",
    "destructive-foreground": "hsl(0, 0%, 98%)",
    border: "hsl(0, 0%, 89.8%)",
    input: "hsl(0, 0%, 89.8%)",
    ring: "hsl(0, 0%, 3.9%)",
  },
  dark: {
    background: "hsl(0, 0%, 3.9%)",
    foreground: "hsl(0, 0%, 98%)",
    card: "hsl(0, 0%, 3.9%)",
    "card-foreground": "hsl(0, 0%, 98%)",
    popover: "hsl(0, 0%, 3.9%)",
    "popover-foreground": "hsl(0, 0%, 98%)",
    primary: "hsl(0, 0%, 98%)",
    "primary-foreground": "hsl(0, 0%, 9%)",
    secondary: "hsl(0, 0%, 14.9%)",
    "secondary-foreground": "hsl(0, 0%, 98%)",
    muted: "hsl(0, 0%, 14.9%)",
    "muted-foreground": "hsl(0, 0%, 63.9%)",
    accent: "hsl(0, 0%, 14.9%)",
    "accent-foreground": "hsl(0, 0%, 98%)",
    destructive: "hsl(0, 62.8%, 30.6%)",
    "destructive-foreground": "hsl(0, 0%, 98%)",
    border: "hsl(0, 0%, 14.9%)",
    input: "hsl(0, 0%, 14.9%)",
    ring: "hsl(0, 0%, 83.1%)",
  },
} satisfies ThemeOptions;
