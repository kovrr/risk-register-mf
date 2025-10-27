export const hexToRgb = (hexValue: string): string => {
  const red = parseInt(hexValue.slice(1, 3), 16);
  const green = parseInt(hexValue.slice(3, 5), 16);
  const blue = parseInt(hexValue.slice(5, 7), 16);

  const rgbString = `rgb(${red}, ${green}, ${blue})`;

  return rgbString;
};
