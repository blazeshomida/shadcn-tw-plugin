export type AnyObject = Record<PropertyKey, any>;
export type WithForeground<T extends string> = T | `${T}-foreground`;
export type ShadcnToken =
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
export type ThemeOptions<TKeys extends PropertyKey = string> = Record<
  string,
  Partial<Record<ShadcnToken, string> | Record<TKeys, string>>
>;
export type DefaultColorScheme = "light" | "dark";
