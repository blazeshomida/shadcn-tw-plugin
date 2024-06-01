# shadcn-tw-plugin

`shadcn-tw-plugin` is a Tailwind CSS plugin designed to provide an easy and flexible way to customize themes for the `shadcn` component library. It allows you to define your colors using CSS color syntax such as HSL, RGB, HEX, or even the `color()` function. The plugin automatically converts your colors to the OKLCH color space, enabling alpha transparency and a wider color gamut. It generates the necessary CSS variables and utility classes for Tailwind CSS, providing autocomplete support when using the VSCode Tailwind IntelliSense extension.

**Note: This package has no relation to shadcn. It is a personal project.**

**Note: This package is currently experimental.** While it should be feature complete, I aim to fix any reported bugs and gather feedback to improve the package. Future releases will address known issues and any new bugs discovered.

- [shadcn-tw-plugin](#shadcn-tw-plugin)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
      - [Inline Plugin Options](#inline-plugin-options)
      - [Extracting Themes with `ThemesConfig`](#extracting-themes-with-themesconfig)
      - [Adding Custom Tokens with Generics](#adding-custom-tokens-with-generics)
      - [Using Specific Tokens Inline](#using-specific-tokens-inline)
      - [Separating Everything](#separating-everything)
    - [Combining with Other Plugins](#combining-with-other-plugins)
  - [Options](#options)
  - [FAQ](#faq)
  - [License](#license)

## Features

- **🎨 Easy Theme Customization**: Define and customize themes for your `shadcn` components effortlessly.
- **💻 TypeScript Support**: Enjoy strong type-checking and autocompletion when defining themes and custom tokens.
- **🔧 Flexible Configuration**: Customize the plugin with options like `colorPrefix`, `defaultColorScheme`, `radius`, and custom themes.
- **🌈 CSS Variables and Utility Classes**: Automatically generates CSS variables and Tailwind CSS utility classes for your themes.
- **🛠️ Support for Custom Tokens**: Easily add and manage custom tokens with the `WithForeground` utility type.
- **🔌 Integration with Other Plugins**: Seamlessly combine with other Tailwind CSS plugins for extended functionality.

## Installation

Install the plugin using your preferred package manager. For example, with `pnpm`:

```sh
pnpm add -D shadcn-tw-plugin tailwindcss-animate
```

**Note**: For some animations to work, you need to install the `tailwindcss-animate` plugin.

## Usage

To use the `shadcn-tw-plugin` in your Tailwind CSS configuration, import the plugin and add it to the `plugins` array. You can customize the plugin using the available options.

### Basic Usage

Here is an example of a basic setup:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin } from "shadcn-tw-plugin";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {},
  plugins: [require("tailwindcss-animate"), shadcnTwPlugin],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

### Advanced Usage

#### Inline Plugin Options

The most basic way to customize themes is to inline the plugin options directly within the Tailwind CSS configuration. This is ideal for simple customizations where you do not need to extract themes into separate objects.

**Note**: Light and dark are special theme keys that, when provided values, still allow you to access all the other defaults from `shadcn`. This means your overrides are merged with the `shadcn` defaults.

**Example:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin } from "shadcn-tw-plugin";

const config = {
  // ...other config options
  plugins: [
    require("tailwindcss-animate"),
    shadcnTwPlugin({
      colorPrefix: "clr",
      defaultColorScheme: "dark",
      radius: "0.75rem",
      themes: {
        // The final theme will include the other default tokens such as `destructive`, `primary`, etc.
        light: {
          background: "hsl(0, 0%, 100%)",
          foreground: "hsl(0, 0%, 3.9%)",
        },
        dark: {
          background: "hsl(0, 0%, 3.9%)",
          foreground: "hsl(0, 0%, 98%)",
        },
      },
    }),
  ],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

#### Extracting Themes with `ThemesConfig`

If you want to extract themes to their own object, you can utilize the `ThemesConfig` type. This approach helps keep your Tailwind CSS configuration cleaner and more maintainable, especially when dealing with multiple themes.

**Example:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin, ThemesConfig } from "shadcn-tw-plugin";

const themes = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 3.9%)",
    // other tokens...
  },
  dark: {
    background: "hsl(0, 0%, 3.9%)",
    foreground: "hsl(0, 0%, 98%)",
    // other tokens...
  },
} satisfies ThemesConfig;

const config = {
  // ...other config options
  plugins: [
    require("tailwindcss-animate"),
    shadcnTwPlugin({
      themes,
    }),
  ],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

#### Adding Custom Tokens with Generics

If you need to add custom tokens to your themes, you can pass a generic to `ThemesConfig`. Additionally, you can use the `WithForeground` type to define tokens that have both primary and foreground variants. This method provides strong type-checking and autocompletion support.

**Example:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin, ThemesConfig, WithForeground } from "shadcn-tw-plugin";

const customThemes = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 3.9%)",
    tertiary: "hsl(210, 50%, 70%)",
    "tertiary-foreground": "hsl(210, 50%, 90%)",
  },
  dark: {
    background: "hsl(0, 0%, 3.9%)",
    foreground: "hsl(0, 0%, 98%)",
    tertiary: "hsl(210, 50%, 70%)",
    "tertiary-foreground": "hsl(210, 50%, 90%)",
  },
} satisfies ThemesConfig<WithForeground<"tertiary">>;

const config = {
  // ...other config options
  plugins: [
    require("tailwindcss-animate"),
    shadcnTwPlugin({
      themes: customThemes,
    }),
  ],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

#### Using Specific Tokens Inline

If you have specific tokens that you want to inline into your themes object, you can do so. The `ThemesConfig` type allows you to define shared tokens and specific tokens within the themes object, providing both flexibility and type safety.

**Note**: Typing each token/theme is not necessary since the `ThemesConfig` type allows you to add any custom tokens without constraint. Passing types just helps enable autocomplete for the things you want to type.

**Example:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin, ThemesConfig, WithForeground } from "shadcn-tw-plugin";

const themes = {
  light: {
    background: "hsl(0, 0%, 100%)",
    foreground: "hsl(0, 0%, 3.9%)",
    tertiary: "hsl(210, 50%, 70%)",
    "tertiary-foreground": "hsl(210, 50%, 90%)",
    sun: "hsl(40, 100%, 75%)",
    // other tokens...
  },
  dark: {
    background: "hsl(0, 0%, 3.9%)",
    foreground: "hsl(0, 0%, 98%)",
    tertiary: "hsl(210, 50%, 70%)",
    "tertiary-foreground": "hsl(210, 50%, 90%)",
    moon: "hsl(200, 100%, 30%)",
    // other tokens...
  },
}

 satisfies ThemesConfig<
  WithForeground<"tertiary">,
  {
    light: "sun";
    dark: "moon";
  }
>;

const config = {
  // ...other config options
  plugins: [
    require("tailwindcss-animate"),
    shadcnTwPlugin({
      themes,
    }),
  ],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

#### Separating Everything

If you prefer to separate everything into individual objects, you can do so with the `TokenMap` type. This method is the most modular and allows for the greatest flexibility, though it may be more complex to manage.

**Example:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import {
  shadcnTwPlugin,
  ThemesConfig,
  TokenMap,
  WithForeground,
} from "shadcn-tw-plugin";

type SharedTokens = WithForeground<"tertiary">;

const lightTheme = {
  background: "hsl(0, 0%, 100%)",
  foreground: "hsl(0, 0%, 3.9%)",
  tertiary: "hsl(210, 50%, 50%)",
  "tertiary-foreground": "hsl(210, 50%, 90%)",
  sun: "hsl(40, 100%, 75%)",
} satisfies TokenMap<SharedTokens | "sun">;

const darkTheme = {
  background: "hsl(0, 0%, 3.9%)",
  foreground: "hsl(0, 0%, 98%)",
  tertiary: "hsl(210, 50%, 50%)",
  "tertiary-foreground": "hsl(210, 50%, 90%)",
  moon: "hsl(200, 100%, 30%)",
} satisfies TokenMap<SharedTokens | "moon">;

const themes = {
  light: lightTheme,
  dark: darkTheme,
} satisfies ThemesConfig;

const config = {
  // ...other config options
  plugins: [
    require("tailwindcss-animate"),
    shadcnTwPlugin({
      colorPrefix: "clr", // Custom prefix for CSS variables
      defaultColorScheme: "dark", // Use the dark theme as the default
      radius: "0.75rem", // Custom border radius
      themes, // Custom theme definitions
    }),
  ],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

### Combining with Other Plugins

The `shadcnTwPlugin` can be combined with other Tailwind CSS plugins for extended functionality. Here's an example:

**Example:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin } from "shadcn-tw-plugin";

const config = {
  // ...other config options
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    shadcnTwPlugin,
  ],
} satisfies Config;

export default config;
```

[Back To Top](#shadcn-tw-plugin)

## Options

<details>
<summary><strong>themes</strong></summary>

- **Type**: `ThemesConfig`
- **Description**: Custom theme definitions. This can override the default `shadcn` light/dark themes or add new ones.
- **Example**:
  ```typescript
  const themes = {
    light: {
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(0, 0%, 3.9%)",
      // other tokens...
    },
    dark: {
      background: "hsl(0, 0%, 3.9%)",
      foreground: "hsl(0, 0%, 98%)",
      // other tokens...
    },
  } satisfies ThemesConfig;
  ```

</details>

<details>
<summary><strong>colorPrefix</strong></summary>

- **Type**: `string`
- **Default**: `"color"`
- **Description**: The prefix to use for the CSS variables.
- **Example**:

  ```typescript
  {
    colorPrefix: "clr";
  }
  ```

</details>

<details>
<summary><strong>radius</strong></summary>

- **Type**: `string`
- **Default**: `"0.5rem"`
- **Description**: Border radius for card, input, and buttons.
- **Example**:
  ```typescript
  {
    radius: "0.75rem";
  }
  ```

</details>

<details>
<summary><strong>defaultColorScheme</strong></summary>

- **Type**: `"light" | "dark"`
- **Default**: `"light"`
- **Description**: Determines which color scheme gets the `:root` selector.
- **Example**:
  ```typescript
  {
    defaultColorScheme: "dark";
  }
  ```

</details>

[Back To Top](#shadcn-tw-plugin)

## FAQ

<details>
<summary><strong>What's the <code>colorPrefix</code> option for?</strong></summary>

The `colorPrefix` option is used to generate CSS variables for your tokens. When you pass `"clr"`, it generates CSS variables like this:

```css
:root {
  --clr-background: 0, 0%, 100%;
  --clr-foreground: 0, 0%, 3.9%;
  /* and so on... */
}
```

Shadcn by default doesn’t use any prefix, which can be achieved by passing an empty string `""`. This produces CSS variables like this:

```css
:root {
  --background: 0, 0%, 100%;
  --foreground: 0, 0%, 3.9%;
  /* and so on... */
}
```

</details>

<details>
<summary><strong>What's the <code>defaultColorScheme</code> option for?</strong></summary>

When generating the CSS variables, the `defaultColorScheme` option determines which color scheme gets the `:root` selector. If you decide not to use theming but still want customization, you don’t have to modify any classes or color-scheme media queries. Your customizations to that theme's variables get applied directly to the `:root`.

</details>

<details>
<summary><strong>Do I need to type each token/theme?</strong></summary>

No, typing each token/theme is not necessary. The `ThemesConfig` type allows you to add any custom tokens without constraint. Passing types helps enable autocomplete for the tokens you want to type, providing better developer experience and type safety.

</details>

<details>
<summary><strong>How do the <code>themes</code> definitions work with default tokens?</strong></summary>

Light and dark are special theme keys that, when provided values, still allow you to access all the other defaults from `shadcn`. This means your overrides are merged with the `shadcn` defaults. For example:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin } from "shadcn-tw-plugin";

const config = {
  plugins: [
    shadcnTwPlugin({
      themes: {
        light: {
          background: "hsl(0, 0%, 100%)",
          foreground: "hsl(0, 0%, 3.9%)",
        },
        dark: {
          background: "hsl(0, 0%, 3.9%)",
          foreground: "hsl(0, 0%, 98%)",
        },
      },
    }),
  ],
} satisfies Config;

export default config;
```

In this example, the light and dark themes will still include the default tokens like `primary`, `secondary`, `destructive`, etc., alongside your custom tokens.

</details>

<details>
<summary><strong>What is the benefit of using <code>WithForeground</code>?</strong></summary>

The `WithForeground` utility type helps define theme tokens that have both primary and foreground variants. For example, `WithForeground<"card">` results in `"card"` and `"card-foreground"`, ensuring consistent naming conventions and type safety across your themes.

</details>

<details>
<summary><strong>Can I combine the <code>shadcnTwPlugin</code> with other Tailwind CSS plugins?</strong></summary>

Yes, the `shadcnTwPlugin` can be combined with other Tailwind CSS plugins for extended functionality. Here’s an example:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { shadcnTwPlugin } from "shadcn-tw-plugin";

const config = {
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    shadcnTwPlugin,
  ],
} satisfies Config;

export default config;
```

</details>

[Back To Top](#shadcn-tw-plugin)

## License

[MIT](./LICENSE)
