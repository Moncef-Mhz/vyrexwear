export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const COLORS = [
  "Black",
  "White",
  "Red",
  "Green",
  "Blue",
  "Yellow",
  "Purple",
  "Pink",
] as const;

export type ColorName = (typeof COLORS)[number];

export const COLOR_CLASSES: Record<ColorName, string> = {
  Black: "bg-black",
  White: "bg-white",
  Red: "bg-red-500",
  Green: "bg-green-500",
  Blue: "bg-blue-500",
  Yellow: "bg-yellow-400",
  Purple: "bg-purple-500",
  Pink: "bg-pink-500",
};
