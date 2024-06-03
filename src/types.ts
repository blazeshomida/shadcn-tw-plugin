import type { NAMED_COLORS_ARRAY } from "./constants";

/**
 * Represents any object with any types of values.
 *
 * We use `any` here instead of `unknown` or `never` for the following reasons:
 * - Flexibility and Generalization: This type is designed to represent any object with any types of values.
 *   Using `any` allows the type to handle all possible value types without restrictions.
 * - Type Inference and Compatibility: It ensures broad compatibility with various object structures,
 *   allowing for flexible and generic use without type errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<PropertyKey, any>;

export type ObjectKey<TObj extends AnyObject> = keyof TObj;
export type ObjectValue<TObj extends AnyObject> = TObj[ObjectKey<TObj>];
export type ObjectEntry<TObj extends AnyObject> = [
  ObjectKey<TObj>,
  ObjectValue<TObj>,
];

/**
 * A utility type that represents a string or a string with a `-foreground` suffix.
 *
 * This type is useful for defining theme tokens that have both primary and foreground variants.
 *
 * @example
 * ```typescript
 * type CardToken = WithForeground<"card">;
 * // Results in "card" | "card-foreground"
 * ```
 */
export type WithForeground<T extends string> = T | `${T}-foreground`;

type CSS_COLOR_FN_NAME =
  | "color"
  | "rgb"
  | "hsl"
  | "hwb"
  | "oklab"
  | "oklch"
  | "lab"
  | "lch";

/**
 * Represents the named CSS colors.
 */
type NAMED_COLORS = (typeof NAMED_COLORS_ARRAY)[number];

/**
 * Represents valid CSS color values, including color functions, hex values, and named colors.
 */
type VALID_CSS_COLOR =
  | `${CSS_COLOR_FN_NAME}(${string})`
  | `#${string}`
  | NAMED_COLORS;

/**
 * Represents the tokens used in the `shadcn` component library for theming.
 *
 * These tokens correspond to various parts of the component's appearance and can be customized in themes.
 */
type ShadcnToken =
  | "background"
  | "foreground"
  | WithForeground<"card">
  | WithForeground<"popover">
  | WithForeground<"primary">
  | WithForeground<"secondary">
  | WithForeground<"muted">
  | WithForeground<"accent">
  | WithForeground<"destructive">
  | "border"
  | "input"
  | "ring";

type DistributeRecordKeys<TKeys, TValue> = TKeys extends PropertyKey
  ? Record<TKeys, TValue>
  : never;

type PartialDistributeRecordKeys<TKeys, TValue> = TKeys extends PropertyKey
  ? Partial<Record<TKeys, TValue>>
  : never;

/**
 * Represents a mapping of theme tokens to valid CSS color values.
 *
 * This type allows for flexible definition of theme tokens, supporting both the default `shadcn` tokens
 * and custom tokens that you define.
 *
 * @example
 * ```typescript
 * // Defining a theme with default tokens
 * const lightTheme = {
 *   background: "hsl(0, 0%, 100%)",
 *   foreground: "hsl(0, 0%, 3.9%)",
 * } satisfies TokenMap;
 *
 * // Defining a theme with custom tokens
 * const customTheme = {
 *   background: "hsl(210, 50%, 50%)",
 *   foreground: "hsl(210, 50%, 95%)",
 *   tertiary: "hsl(210, 50%, 70%)",
 *   "tertiary-foreground": "hsl(210, 50%, 90%)",
 * } satisfies TokenMap<WithForeground<"tertiary">>;
 * ```
 */
export type TokenMap<TKey> = PartialDistributeRecordKeys<
  TKey | string,
  VALID_CSS_COLOR
>;

/**
 * Represents an object mapping theme names to their respective color values.
 *
 * The shape of the object is represented by keys which are the names of your themes,
 * and the values which are objects mapping `ShadcnToken` to valid CSS colors.
 *
 * This type allows for flexible definition of themes with shared and custom tokens.
 *
 * The first generic argument `TShared` represents shared tokens used across all themes.
 * The second generic argument `TThemes` represents an optional object defining specific themes and their custom tokens.
 *
 * @example
 * ```typescript
 * // Basic usage with default ShadcnToken
 * const themes = {
 *   light: {
 *     background: "hsl(0, 0%, 100%)",
 *     foreground: "hsl(0, 0%, 3.9%)",
 *     // other tokens...
 *   },
 *   dark: {
 *     background: "hsl(0, 0%, 3.9%)",
 *     foreground: "hsl(0, 0%, 98%)",
 *     // other tokens...
 *   },
 * } satisfies ThemesConfig;
 *
 * // Advanced usage with additional custom tokens
 * const themes = {
 *   light: {
 *     background: "hsl(0, 0%, 100%)",
 *     foreground: "hsl(0, 0%, 3.9%)",
 *     tertiary: "hsl(210, 50%, 70%)",
 *     "tertiary-foreground": "hsl(210, 50%, 90%)",
 *     sun: "hsl(40, 100%, 75%)",
 *     // other tokens...
 *   },
 *   dark: {
 *     background: "hsl(0, 0%, 3.9%)",
 *     foreground: "hsl(0, 0%, 98%)",
 *     tertiary: "hsl(210, 50%, 70%)",
 *     "tertiary-foreground": "hsl(210, 50%, 90%)",
 *     moon: "hsl(200, 100%, 30%)",
 *     // other tokens...
 *   },
 * } satisfies ThemesConfig<
 *   WithForeground<"tertiary">,
 *   {
 *     light: "sun";
 *     dark: "moon";
 *   }
 * >;
 * ```
 */
export type ThemesConfig<
  TShared extends PropertyKey = string,
  TThemes extends Record<string, string> = Record<string, string>,
> =
  TThemes extends Record<infer Theme, infer Key>
    ? DistributeRecordKeys<
        Theme | string,
        TokenMap<TShared | ShadcnToken | (Key & PropertyKey)>
      >
    : never;

/**
 * Represents the default color schemes available.
 */
export type DefaultColorScheme = "light" | "dark";

/**
 * Configuration options for the `shadcnTwPlugin`.
 */
export type ShadcnTwPluginOptions = {
  /**
   * Custom theme definitions. This can override the default `shadcn` light/dark themes or add new ones.
   *
   * @example
   * ```typescript
   * const themes = {
   *   light: {
   *     background: "hsl(0, 0%, 100%)",
   *     foreground: "hsl(0, 0%, 3.9%)",
   *     // other tokens...
   *   },
   *   dark: {
   *     background: "hsl(0, 0%, 3.9%)",
   *     foreground: "hsl(0, 0%, 98%)",
   *     // other tokens...
   *   },
   * } satisfies ThemesConfig;
   * ```
   */
  themes?: ThemesConfig;
  /**
   * The prefix to use for the CSS variables.
   *
   * @default "color"
   * @example
   * ```css
   * :root {
   *  --color-background: 0, 100%, 50%;
   * }
   * ```
   * @remarks `shadcn/ui` typically has no prefix, which can be achieved by passing an empty string.
   * @example
   * ```typescript
   * {
   *  colorPrefix: ""
   * }
   * ```
   * This turns into the following CSS:
   * ```css
   * :root {
   *  --background: 0, 100%, 50%;
   * }
   * ```
   */
  colorPrefix?: string;
  /**
   * Border radius for card, input, and buttons.
   *
   * @default "0.5rem"
   * @example
   * ```typescript
   * {
   *  radius: "0.75rem"
   * }
   * ```
   * This sets the border radius to 0.75rem.
   */
  radius?: string;
  /**
   * Determines which color scheme gets the `:root` selector.
   *
   * @default "light"
   * @example
   * ```typescript
   * {
   *  defaultColorScheme: "dark"
   * }
   * ```
   * This sets the default color scheme to dark.
   */
  defaultColorScheme?: DefaultColorScheme;
};
