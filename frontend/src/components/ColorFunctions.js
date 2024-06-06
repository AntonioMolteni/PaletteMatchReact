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
  var reg = /^#([0-9a-f]{3}){1,2}$/i;
  const isValid = reg.test(hex);
  if (!isValid) {
    throw new Error("Invalid hex");
  }
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function mixColors(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const mixedR = Math.round((rgb1.r + rgb2.r) / 2);
  const mixedG = Math.round((rgb1.g + rgb2.g) / 2);
  const mixedB = Math.round((rgb1.b + rgb2.b) / 2);

  return rgbToHex(mixedR, mixedG, mixedB);
}
