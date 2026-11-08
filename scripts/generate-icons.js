import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, getPixel) {
  // RGBA 8-bit
  const rowLength = width * 4 + 1; // +1 filter byte (0 = none)
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to make chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const body = Buffer.concat([typeBuf, data]);

    const crcBuf = Buffer.alloc(4);
    const crc = crc32(body);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, body, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Icon drawing function with dark background, cyber purple & cyan dancer glow
function drawIconPixel(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5, cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background deep dark purple
  let r = 7, g = 8, b = 13, a = 255;

  // Outer border squircle
  const cornerDist = Math.max(Math.abs(dx), Math.abs(dy));
  if (cornerDist > 0.44 && cornerDist < 0.47) {
    r = 168; g = 85; b = 247;
  }

  // Center motion ring glow
  if (Math.abs(dist - 0.28) < 0.02) {
    r = 56; g = 189; b = 248;
  }

  // Head
  const headDist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.32) ** 2);
  if (headDist < 0.055) {
    r = 56; g = 189; b = 248;
  }

  // Spine & Torso line
  if (Math.abs(nx - 0.5) < 0.022 && ny >= 0.38 && ny <= 0.65) {
    r = 168; g = 85; b = 247;
  }

  // Dynamic Arms
  const arm1 = Math.abs((ny - 0.42) - (nx - 0.5) * 0.4);
  if (arm1 < 0.022 && nx >= 0.25 && nx <= 0.75) {
    r = 192; g = 132; b = 252;
  }

  // Dynamic Legs
  const leg1 = Math.abs((ny - 0.65) - (nx - 0.5) * 1.2);
  const leg2 = Math.abs((ny - 0.65) + (nx - 0.5) * 1.2);
  if ((leg1 < 0.022 || leg2 < 0.022) && ny >= 0.65 && ny <= 0.85) {
    r = 56; g = 189; b = 248;
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA Icons
const sizes = [
  { name: 'pwa-192x192.png', w: 192, h: 192 },
  { name: 'pwa-512x512.png', w: 512, h: 512 },
  { name: 'pwa-maskable-512x512.png', w: 512, h: 512 },
  { name: 'apple-touch-icon.png', w: 180, h: 180 },
];

sizes.forEach(({ name, w, h }) => {
  const buf = createPng(w, h, drawIconPixel);
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`Generated ${name} (${w}x${h})`);
});
