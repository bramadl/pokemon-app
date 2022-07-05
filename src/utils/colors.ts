export function updateColor(hex: string){
  const col: { r: number, g: number, b: number } = hexToRgb(hex)!;
  const sat = 80 / 100;
  const gray = col.r * 0.3086 + col.g * 0.6094 + col.b * 0.0820;

  col.r = Math.round(col.r * sat + gray * (1-sat));
  col.g = Math.round(col.g * sat + gray * (1-sat));
  col.b = Math.round(col.b * sat + gray * (1-sat));

  const out = rgbToHex(col.r,col.g,col.b);
  return out;
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const resultValue = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;

  console.log(resultValue);
  
  return resultValue;
}
