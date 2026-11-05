import fs from 'fs';
import zlib from 'zlib';

function createSolidPNG(width, height, r, g, b) {
  // Construct a valid PNG with 8-bit RGBA
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // color type RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Scanlines: for each row, filter byte 0 followed by width * 4 bytes RGBA
  const rawRowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rawRowLen * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rawRowLen;
    rawData[rowOffset] = 0; // Filter type 0
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Add a nice circular lab beaker gradient effect
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let pr = r, pg = g, pb = b;
      if (dist < 0.6) {
        // inner cyan flask
        pr = 6; pg = 182; pb = 212;
      } else if (dist < 0.85) {
        // navy blue body
        pr = 14; pg = 116; pb = 144;
      } else {
        // dark background
        pr = 15; pg = 23; pb = 42;
      }

      rawData[pxOffset] = pr;
      rawData[pxOffset + 1] = pg;
      rawData[pxOffset + 2] = pb;
      rawData[pxOffset + 3] = 255;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = data.length;
  const typeBuf = Buffer.from(type, 'ascii');
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  typeBuf.copy(buf, 4);
  data.copy(buf, 8);

  const crc = crc32(Buffer.concat([typeBuf, data]));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

fs.writeFileSync('public/pwa-192x192.png', createSolidPNG(192, 192, 11, 19, 41));
fs.writeFileSync('public/pwa-512x512.png', createSolidPNG(512, 512, 11, 19, 41));
fs.writeFileSync('public/pwa-maskable-512x512.png', createSolidPNG(512, 512, 11, 19, 41));
fs.writeFileSync('public/apple-touch-icon.png', createSolidPNG(180, 180, 11, 19, 41));
fs.writeFileSync('public/favicon.ico', createSolidPNG(32, 32, 11, 19, 41));

console.log('PWA icons created successfully.');
