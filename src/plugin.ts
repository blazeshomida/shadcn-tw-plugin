import plugin from "tailwindcss/plugin";
import type { AnyObject, DefaultColorScheme, ThemeOptions } from "./types";
import { deepMerge, formatColorPrefix, mapObject } from "./utils";
import { DEFAULT_THEME_OPTIONS } from "./constants";

function mapTokenObject<TObj extends AnyObject>(
  tokenObj: TObj,
  colorPrefix: string
) {
  return mapObject(tokenObj, {
    key: (tokenObjKey) => `--${colorPrefix}${String(tokenObjKey)}`,
    value: (value) => value,
  });
}

export const shadcnPlugin = plugin.withOptions(
  (options?: {
      themes?: ThemeOptions;
      colorPrefix?: string;
      radius?: string;
      defaultColorScheme?: DefaultColorScheme;
    }) =>
    ({ addBase }) => {
      const themeOptions = deepMerge(
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
          mapObject(themeOptions, {
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
                `hsl(var(--${formatColorPrefix(
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
