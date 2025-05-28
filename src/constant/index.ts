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

export const borderColorClasses: Record<ColorName, string> = {
  Black: "border-black",
  White: "border-white",
  Red: "border-red-500",
  Green: "border-green-500",
  Blue: "border-blue-500",
  Yellow: "border-yellow-400",
  Purple: "border-purple-500",
  Pink: "border-pink-500",
};

export const outlineColorClasses: Record<ColorName, string> = {
  Black: "outline-black",
  White: "outline-white",
  Red: "outline-red-500",
  Green: "outline-green-500",
  Blue: "outline-blue-500",
  Yellow: "outline-yellow-400",
  Purple: "outline-purple-500",
  Pink: "outline-pink-500",
};
