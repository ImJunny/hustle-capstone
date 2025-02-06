/*
  Below are configurations for the font and icons sizes used in custom components throughout
  the app. Instead of manually declaring the sizes in custom styles, use these predefined sizes
  instead. Changing a size here will affect that size throughout the rest of the app.
*/

export type TFontSizes = keyof typeof FontSizes;
export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 22,
};

export type TIconSizes = keyof typeof IconSizes;
export const IconSizes = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 28,
  "2xl": 44,
};

export type TIconButtonSizes = keyof typeof IconSizes;
export const IconButtonSizes = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 28,
  xxl: 44,
};
