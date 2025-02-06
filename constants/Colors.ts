/*
  Below are configurations for the colors used in the app for both light and dark
  mode. All/most colors used in the app should trace back to this file. Changing 
  a color here will affect that color throughout the rest of the app.
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
    transparent: "transparent",
    "muted-dark": "#C2C2C2",
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
    transparent: "transparent",
    "muted-dark": "#C2C2C2",
  },
};
