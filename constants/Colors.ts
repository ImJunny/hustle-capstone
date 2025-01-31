/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export type TColors = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Colors = {
  light: {
    black: "#000000",
    white: "#FFFFFF",
    red: "#E93030",
    green: "#149D2D",
    yellow: "#F1AC16",
    base: "#F0F0F0",
    background: "#FFFFFF",
    "background-variant": "#E9E9E9",
    foreground: "#000000",
    muted: "#6D6D6D",
    border: "#D6D6D6",
  },
  dark: {
    black: "#000000",
    white: "#FFFFFF",
    red: "#E93030",
    green: "#149D2D",
    yellow: "#F1AC16",
    base: "#1C1C1C",
    background: "#000000",
    "background-variant": "#444444",
    foreground: "#FFFFFF",
    muted: "#C2C2C2",
    border: "#272727",
  },
};
