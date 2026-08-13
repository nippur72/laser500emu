#!/usr/bin/env node
// nic2md.mjs
//
// Dumps a Laser 500 .NIC floppy disk image to a Markdown file for human
// inspection. The output shows each track's raw bytes, split into sectors,
// with the sync bytes, the sector address header, the data block and the
// footer on separate indented lines.
//
// NIC image geometry (see docs/floppy.txt):
//   - 40 tracks per side, 8192 bytes per track, 16 sectors per track
//   - single-sided image  : 327680 bytes  (40 x 8192)
//   - double-sided image  : 655360 bytes  (2 x 327680, side 1 after side 0)
//   - the 41-track Chinese CP/M images (fd021_patched style) are also handled:
//     single-sided 335872 bytes, double-sided 671744 bytes
//
// Usage:
//   node tools/nic2md.mjs <input.nic> [output.md]
//   npm run nic2md -- <input.nic> [output.md]
//
// Output format:
//   # DISC <filename>
//
//   ## SIDE 0
//
//   ### TRACK 0
//
//      SECTOR 1:
//         SYNC:   FF FF FF FF FF FF FF FF
//         HEADER: D5 AA 96 EE EF AA AA AA AA EE EF DE AA
//         DATA:   FF FF FF FF FF D5 AA AD AF CF B9 ... DE AA
//         FOOTER: EB
//
//   (## SIDE 1 is emitted only for double-sided images)
//
// The GCR decode routines (4&4 address part, 6&2 data part) are kept below
// for later use; the current output shows raw bytes only.

import { readFileSync, writeFileSync } from "node:fs";

const [inputFile, outputFile] = process.argv.slice(2);

if (!inputFile) {
   console.error("usage: node tools/nic2md.mjs <input.nic> [output.md]");
   process.exit(1);
}

const TRACKS_PER_SIDE = 40;
const SECTORS_PER_TRACK = 16;
const TRACK_SIZE = 8192;
const SIDE_SIZE = TRACKS_PER_SIDE * TRACK_SIZE;
const SECTOR_SIZE = 256;

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function hexBytes(bytes) {
   return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0").toUpperCase())
      .join(" ");
}

// index where the run of 0xFF ending just before `fromIdx` starts
function ffRunStart(track, fromIdx) {
   let i = fromIdx - 1;
   while (i >= 0 && track[i] === 0xff) i--;
   return i + 1;
}

// ---------------------------------------------------------------------------
// track parser: split raw track bytes into sectors, each with its
// sync bytes / address header / data block / footer
// ---------------------------------------------------------------------------
function parseTrack(trackBytes) {
   const sectors = [];

   for (let h = 0; h + 12 < trackBytes.length; h++) {
      // sector address header: D5 AA 96 + 8 bytes (4 x 4&4 pairs) + DE AA
      if (trackBytes[h] !== 0xd5 || trackBytes[h + 1] !== 0xaa || trackBytes[h + 2] !== 0x96) continue;
      if (trackBytes[h + 11] !== 0xde || trackBytes[h + 12] !== 0xaa) continue;

      // sync: the run of 0xFF immediately before the header
      const syncStart = ffRunStart(trackBytes, h);
      const sync = trackBytes.slice(syncStart, h);

      // header (13 bytes) plus optional trailing EB footer byte
      let headerEnd = h + 13;
      if (trackBytes[headerEnd] === 0xeb) headerEnd++;
      const header = trackBytes.slice(h, headerEnd);

      // data block: D5 AA AD + 343 bytes + DE AA (+ optional EB footer byte)
      let dataStart = -1;
      for (let d = headerEnd; d + 2 < trackBytes.length; d++) {
         if (trackBytes[d] === 0xd5 && trackBytes[d + 1] === 0xaa && trackBytes[d + 2] === 0xad) {
            dataStart = d;
            break;
         }
      }

      let data = [];
      let footer = [];
      if (dataStart >= 0) {
         const dataEnd = dataStart + 3 + 343 + 2; // D5 AA AD + payload + DE AA (exclusive)
         data = trackBytes.slice(dataStart, Math.min(dataEnd, trackBytes.length));
         // footer: any bytes right after DE AA that are not 0xFF (usually the EB byte)
         let f = dataEnd;
         while (f < trackBytes.length && trackBytes[f] !== 0xff) f++;
         footer = trackBytes.slice(dataEnd, f);
      }

      sectors.push({ sync, header, data, footer });
   }

   return sectors;
}

// ---------------------------------------------------------------------------
// GCR decode routines - kept for later use, not used by the raw output above
// ---------------------------------------------------------------------------

// 4&4 decode (sector address part)
//   byte = ((b0 << 1) | 1) & b1
function decode44(b0, b1) {
   return ((b0 << 1) | 1) & b1;
}

// 6&2 GCR decode (sector data part)
//   each on-disk byte is looked up in the data GCR table (XLATE_TABLE_2 at
//   $7CE8 in the VTech DOS 1.1 disassembly), then XORed with the previously
//   decoded byte; the first byte is used as-is. The sector is valid when the
//   decoded checksum byte (the last of 343) is 0.
const GCR_DECODE = new Map();
{
   const GCR_ENCODE = [
      0x96, 0x97, 0x9a, 0x9b, 0x9d, 0x9e, 0x9f, 0xa6,
      0xa7, 0xab, 0xac, 0xad, 0xae, 0xaf, 0xb2, 0xb3,
      0xb4, 0xb5, 0xb6, 0xb7, 0xb9, 0xba, 0xbb, 0xbc,
      0xbd, 0xbe, 0xbf, 0xcb, 0xcd, 0xce, 0xcf, 0xd3,
      0xd6, 0xd7, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde,
      0xdf, 0xe5, 0xe6, 0xe7, 0xe9, 0xea, 0xeb, 0xec,
      0xed, 0xee, 0xef, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6,
      0xf7, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff
   ];
   GCR_ENCODE.forEach((gcr, value) => {
      GCR_DECODE.set(gcr, value);
   });
}

function decode62(encoded) {
   const out = [];
   for (let i = 0; i < encoded.length; i++) {
      const value = GCR_DECODE.get(encoded[i]);
      if (value === undefined) {
         throw new Error(`invalid GCR byte 0x${encoded[i].toString(16).padStart(2, "0")}`);
      }
      const decoded = (i === 0) ? value : (value ^ out[i - 1]);
      out.push(decoded & 0xff);
   }
   return out;
}

// ---------------------------------------------------------------------------

let raw;
try {
   raw = readFileSync(inputFile);
} catch (err) {
   console.error(`cannot read "${inputFile}": ${err.message}`);
   process.exit(1);
}
const size = raw.length;

// Special case: "fd021_patched.nic" style Chinese CP/M image with 41 tracks/side.
// (Same handling as the emulator's Drive constructor.)
const TRACKS41 = 335872; // 41 tracks * 8192 * 1 side (single-sided)
const TRACKS41_DS = 2 * TRACKS41;
let tracksPerSide = TRACKS_PER_SIDE;
let sides = size === SIDE_SIZE ? 1 : size === 2 * SIDE_SIZE ? 2 : null;
if (sides === null && size === TRACKS41) {
   tracksPerSide = 41;
   sides = 1;
} else if (sides === null && size === TRACKS41_DS) {
   tracksPerSide = 41;
   sides = 2;
}
if (sides === null) {
   console.error(`unexpected file size ${size} (expected ${SIDE_SIZE} single-sided, ${2 * SIDE_SIZE} double-sided, or ${TRACKS41}/${TRACKS41_DS} for the 41-track Chinese CP/M images)`);
   process.exit(1);
}

const fileName = inputFile.split(/[\\/]/).pop();
const lines = [];
lines.push(`# DISC ${fileName}`);
lines.push("");

const sideSize = tracksPerSide * TRACK_SIZE;
for (let side = 0; side < sides; side++) {
   lines.push(`## SIDE ${side}`);
   lines.push("");

   for (let track = 0; track < tracksPerSide; track++) {
      lines.push(`### TRACK ${track}`);
      lines.push("");

      const start = side * sideSize + track * TRACK_SIZE;
      const trackBytes = raw.slice(start, start + TRACK_SIZE);
      const sectors = parseTrack(trackBytes);

      if (sectors.length === 0) {
         lines.push("   (no sector headers found)");
         lines.push("");
         continue;
      }

      sectors.forEach((s, idx) => {
         lines.push(`   SECTOR ${idx + 1}:`);
         lines.push(`      SYNC:   ${hexBytes(s.sync)}`);
         lines.push(`      HEADER: ${hexBytes(s.header)}`);
         lines.push(`      DATA:   ${hexBytes(s.data)}`);
         lines.push(`      FOOTER: ${hexBytes(s.footer)}`);
         lines.push("");
      });
   }
}

const output = outputFile ?? inputFile.replace(/\.nic$/i, ".md");
writeFileSync(output, lines.join("\n"));
console.log(`wrote ${output}`);
console.log(`  ${size} bytes, ${sides} side(s), ${tracksPerSide} tracks/side, ${SECTORS_PER_TRACK} sectors/track`);
