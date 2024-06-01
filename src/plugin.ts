import plugin from "tailwindcss/plugin";
import type { ShadcnTwPluginOptions, AnyObject } from "./types";
import { deepMerge, mapObject, oklch, round } from "./utils";
import { DEFAULT_THEME_OPTIONS } from "./constants";

/**
 * Formats the prefix for CSS variables.
 *
 * @param prefix - The prefix to format.
 * @returns The formatted prefix string.
 */
function formatColorPrefix(prefix: string | undefined) {
  return `${prefix === undefined ? "color" : prefix}${
    prefix === "" ? "" : "-"
  }`;
}

/**
 * Converts a given color value to the OKLCH color format and returns it as a CSS variable string.
 *
 * @param value - The color value to format.
 * @returns The formatted CSS variable value.
 */
function formatCssTokenValue(value: string) {
  const conversion = oklch(value);
  if (!conversion) return value;
  const { l = 0, c = 0, h = 0 } = conversion;
  return `${round(l * 100)}% ${round(c)} ${round(h)}`;
}

/**
 * Maps a token object to CSS variable definitions using the specified color prefix.
 *
 * @param tokenObj - The token object to map.
 * @param colorPrefix - The prefix for CSS variables.
 * @returns A new object with CSS variable definitions.
 */
function mapTokenObject<TObj extends AnyObject>(
  tokenObj: TObj,
  colorPrefix: string
) {
  return mapObject(tokenObj, {
    key: (tokenObjKey) => `--${colorPrefix}${String(tokenObjKey)}`,
    value: formatCssTokenValue,
  });
}

/**
 * Tailwind CSS plugin for `shadcn` component library theming.
 *
 * This plugin allows you to use CSS variables or Tailwind CSS utility classes for theming your `shadcn` components.
 *
 * @param options - Configuration options for the plugin.
 * @param options.themes - Custom theme definitions. This can override the default `shadcn` light/dark themes or add new ones.
 * @param options.colorPrefix - The prefix to use for the CSS variables. Defaults to "color". If an empty string is provided, no prefix will be used.
 * @param options.radius - Border radius for card, input, and buttons. Defaults to "0.5rem".
 * @param options.defaultColorScheme - Determines which color scheme gets the `:root` selector. Defaults to "light".
 * @returns The Tailwind CSS plugin.
 * @example
 * ```typescript
 * import { shadcnTwPlugin } from 'shadcn-tw-plugin';
 *
 * const config = {
 *   // ...other config options
 *   plugins: [
 *     shadcnTwPlugin({
 *       colorPrefix: 'clr', // Custom prefix for CSS variables
 *       defaultColorScheme: 'dark', // Use the dark theme as the default
 *       radius: '0.75rem', // Custom border radius
 *       themes: {
 *         dark: {
 *           background: 'hsl(0, 0%, 95%)', // Override dark theme background color
 *         },
 *       },
 *     }),
 *   ],
 * };
 * ```
 */
export const shadcnTwPlugin = plugin.withOptions(
  (options?: ShadcnTwPluginOptions) =>
    ({ addBase }) => {
      const themesConfig = deepMerge(
        DEFAULT_THEME_OPTIONS,
        options?.themes || {}
      );
      const colorPrefix = formatColorPrefix(options?.colorPrefix);
      const defaultColorScheme = options?.defaultColorScheme || "light";
      addBase(
        deepMerge(
          // Must be first arg so css cascade generates in correct order
          {
            ":root": {
              "--radius": options?.radius || "0.5rem",
            },
          },
          mapObject(themesConfig, {
            key: (themeKey) =>
              themeKey === defaultColorScheme ? `:root` : `.${themeKey}`,
            value: (tokenObj) => mapTokenObject(tokenObj, colorPrefix),
          })
        )
      );
    },
  (options) => ({
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: Object.values({
          ...DEFAULT_THEME_OPTIONS,
          ...options?.themes,
        }).reduce(
          (acc, tokenObj) => ({
            ...acc,
            ...mapObject(tokenObj, {
              value: (_, key) =>
                `oklch(var(--${formatColorPrefix(
                  options?.colorPrefix
                )}${key}) / <alpha-value>)`,
            }),
          }),
          {}
        ),
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
  })
);
