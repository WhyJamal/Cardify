export function darkenHex(hex: string, percent: number) {
    hex = hex.replace(/^#/, "");
    let num = parseInt(hex, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;

    const factor = 1 - percent / 100;
    r = Math.max(0, Math.floor(r * factor * factor));
    g = Math.max(0, Math.floor(g * factor * factor));
    b = Math.max(0, Math.floor(b * factor * factor));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)}`;
  }

export async function getTopPixelAverageColor(imageUrl: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = 10; 
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");

      ctx.drawImage(img, 0, 0, img.width, 10, 0, 0, img.width, 10);
      const imageData = ctx.getImageData(0, 0, img.width, 10);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      const pixels = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      r = Math.floor(r / pixels);
      g = Math.floor(g / pixels);
      b = Math.floor(b / pixels);

      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      resolve(brightness > 155 ? "black" : "white");
    };

    img.onerror = reject;
  });
}

export function getContrastColor(hex: string) {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  const brightness = (r*299 + g*587 + b*114)/1000;
  return brightness > 155 ? "black" : "white";
}