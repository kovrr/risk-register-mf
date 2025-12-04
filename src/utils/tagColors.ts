/**
 * Generate a random bright/light color suitable for black text overlay.
 * Colors are in the light/bright spectrum, avoiding dark colors.
 *
 * @returns Hex color string (e.g., "#A8E6CF")
 */
export function generateRandomBrightColor(): string {
  // Predefined bright colors that work well with black text
  const brightColors = [
    '#FFE5E5', // Light Red
    '#FFE5F1', // Light Pink
    '#E5F1FF', // Light Blue
    '#E5FFE5', // Light Green
    '#FFF5E5', // Light Orange
    '#F5E5FF', // Light Purple
    '#FFE5F5', // Light Magenta
    '#E5FFF5', // Light Cyan
    '#FFFFE5', // Light Yellow
    '#F0E5FF', // Light Lavender
    '#FFE5CC', // Light Peach
    '#E5FFCC', // Light Lime
    '#CCFFE5', // Light Mint
    '#E5E5FF', // Light Indigo
    '#FFCCE5', // Light Rose
    '#CCE5FF', // Light Sky Blue
    '#FFCCCC', // Light Coral
    '#CCFFCC', // Light Emerald
    '#CCCCFF', // Light Periwinkle
    '#FFFFCC', // Light Cream
    '#E8F5E9', // Light Green (Material)
    '#FFF3E0', // Light Orange (Material)
    '#E1F5FE', // Light Blue (Material)
    '#F3E5F5', // Light Purple (Material)
    '#FCE4EC', // Light Pink (Material)
  ];

  return brightColors[Math.floor(Math.random() * brightColors.length)];
}
