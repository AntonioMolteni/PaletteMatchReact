// ColorFunction.js

// Utility functions to generate colors
export function getRandomColor() {
  const letters = "0123456789abcdef";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getPseudoRandomColor() {
  const letters = "0123456789abcdef";
  const colors = [
    "#ff0000",
    "#0000ff",
    "#00ff00",
    "#000000",
    "#ffffff",
    "#00ffff",
    "#ff00ff",
    "#ffff00",
  ];
  const probability = 1 / 3;

  if (Math.random() < probability) {
    return colors[Math.floor(Math.random() * colors.length)];
  } else {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// Utility functions for color manipulation
export function hexToRgb(hex) {
  const reg = /^#([0-9a-f]{3}){1,2}$/i;
  if (!reg.test(hex)) {
    throw new Error("Invalid hex");
  }

  let c = hex.substring(1).split("");
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const bigint = parseInt(c.join(""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}

export function mixColors(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const mixedR = Math.round((rgb1.r + rgb2.r) / 2);
  const mixedG = Math.round((rgb1.g + rgb2.g) / 2);
  const mixedB = Math.round((rgb1.b + rgb2.b) / 2);

  return rgbToHex(mixedR, mixedG, mixedB);
}

// https://en.wikipedia.org/wiki/SRGB#From_sRGB_to_CIE_XYZ
export function rgbToXyz(r, g, b) {
  let _r = r / 255;
  let _g = g / 255;
  let _b = b / 255;

  _r = _r > 0.04045 ? Math.pow((_r + 0.055) / 1.055, 2.4) : _r / 12.92;
  _g = _g > 0.04045 ? Math.pow((_g + 0.055) / 1.055, 2.4) : _g / 12.92;
  _b = _b > 0.04045 ? Math.pow((_b + 0.055) / 1.055, 2.4) : _b / 12.92;

  _r = _r * 100;
  _g = _g * 100;
  _b = _b * 100;

  const x = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
  const y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
  const z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

  return { x, y, z };
}

function xyzToLab(x, y, z) {
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let _x = x / refX;
  let _y = y / refY;
  let _z = z / refZ;

  _x = _x > 0.008856 ? Math.pow(_x, 1 / 3) : 7.787 * _x + 16 / 116;
  _y = _y > 0.008856 ? Math.pow(_y, 1 / 3) : 7.787 * _y + 16 / 116;
  _z = _z > 0.008856 ? Math.pow(_z, 1 / 3) : 7.787 * _z + 16 / 116;

  const L = 116 * _y - 16;
  const a = 500 * (_x - _y);
  const b = 200 * (_y - _z);

  return { L, a, b };
}

export function rgbToLab(r, g, b) {
  const xyz = rgbToXyz(r, g, b);
  return xyzToLab(xyz.x, xyz.y, xyz.z);
}

export function calculateCIE94Difference(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  const deltaL = lab1.L - lab2.L;
  const L = (lab1.L + lab2.L) / 2;
  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const deltaC = C1 - C2;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  const deltaH = Math.sqrt(deltaA * deltaA + deltaB * deltaB - deltaC * deltaC);

  const kL = 1.0;
  const kC = 1.0;
  const kH = 1.0;
  const K1 = 0.045;
  const K2 = 0.015;

  const sL = 1.0;
  const sC = 1.0 + K1 * C1;
  const sH = 1.0 + K2 * C1;

  const deltaE94 = Math.sqrt(
    (deltaL / (kL * sL)) * (deltaL / (kL * sL)) +
      (deltaC / (kC * sC)) * (deltaC / (kC * sC)) +
      (deltaH / (kH * sH)) * (deltaH / (kH * sH))
  );

  return deltaE94;
}

// Must return a number between 0 and 100
export function calculateColorSimilarity(playerColor, goalColor) {
  const difference = calculateCIE94Difference(goalColor, playerColor);
  const percentage = Math.max(0, 100 - difference); // Invert the metric
  return parseFloat(percentage.toFixed(0));
}
