import { mem_read, mem_write } from "./bus";
import { audio, getAverageFrameTime, laser500, oneFrame } from "./emulator";
import { saveAs } from "./save-file";

export function dumpMem(start: number, end: number, rows: number=16) {
   let s="\r\n";
   for(let r=start;r<=end;r+=rows) {
      s+= hex(r, 4) + ": ";
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = mem_read(r+c);
         s+= hex(byte)+" ";
      }
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = mem_read(r+c);
         s+= (byte>32 && byte<127) ? String.fromCharCode(byte) : '.' ;
      }
      s+="\n";
   }
   console.log(s);
}

export function dumpBytes(bytes: number[], start: number, end: number, rows: number=16) {   
   let s="\r\n";
   for(let r=start;r<=end;r+=rows) {
      s+= hex(r, 4) + ": ";
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = bytes[r+c];
         s+= hex(byte)+" ";
      }
      for(let c=0;c<rows && (r+c)<=end;c++) {
         const byte = bytes[r+c];
         s+= (byte>32 && byte<127) ? String.fromCharCode(byte) : '.' ;
      }
      s+="\n";
   }
   console.log(s);
}

export function downloadBytes(fileName: string, buffer: Uint8Array) {
   const blob = new Blob([buffer], {type: "application/octet-stream"});
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
}

export function hexDump(memory: number[], start: number, end: number, rows: number=16) {
   let s="";
   for(let r=start;r<end;r+=rows) {
      s+= hex(r, 4) + ": ";
      for(let c=0;c<rows;c++) {
         const byte = memory[r+c];
         s+= hex(byte)+" ";
      }
      for(let c=0;c<rows;c++) {
         const byte = memory[r+c];
         s+= (byte>32 && byte<127) ? String.fromCharCode(byte) : '.' ;
      }
      s+="\n";
   }
   return s;
}

export function hex(value: number, size: number=2) {   
   const s = "0000" + value.toString(16);
   return s.substr(s.length - size);
}

export function hi(word: number) {
   return (word >> 8) & 0xFF;
}

export function lo(word: number) {
   return word & 0xFF;
}

export function bin(value: number, size: number = 8) {   
   const s = "0000000000000000" + value.toString(2);
   return s.substr(s.length - size);
}

export function mem_write_word(address: number, word: number) {
   mem_write(address + 0, lo(word));
   mem_write(address + 1, hi(word));
}

export function mem_read_word(address: number) {
   const lo = mem_read(address + 0);
   const hi = mem_read(address + 1);
   return lo+hi*256;
}

export function set_bit(value: number, bitn: number) {
   return value | (1<<bitn);
}

export function reset_bit(value: number, bitn: number) {
   return value & ~(1<<bitn);
}

export function set(value: number, bitmask: number) {
   return value | bitmask;
}

export function reset(value: number, bitmask: number) {
   return value & (0xFF ^ bitmask);
}

export function bit(b: number, n: number) {
   return (b & (1<<n))>0 ? 1 : 0;
}

export function not_bit(b: number, n: number) {
   return (b & (1<<n))>0 ? 0 : 1;
}

export function endsWith(s, value) {
   return s.substr(-value.length) === value;
}

export function getFileExtension(fileName) {
   let s = fileName.toLowerCase().split(".");
   if(s.length == 1) return "";
   return "." + s[s.length-1];
}

export function stringToUint8(s: string) {
   let b: number[] = [];
   for(let t=0;t<s.length;t++) {
      b.push(s.charCodeAt(t));
   }
   return new Uint8Array(b);
}

export function uint8ToString(b: Uint8Array) {
   let s = "";
   for(let t=0;t<b.length;t++) {
      s+=String.fromCharCode(b[t]);
   }
   return s;
}

export function areUint8ArraysDifferent(arr1: Uint8Array, arr2: Uint8Array): boolean {
   // Check if lengths are different
   if (arr1.length !== arr2.length) {
       return true; // Arrays are different
   }
   
   // Use every to compare elements
   return !arr1.every((value, index) => value === arr2[index]);
}

/**
 * Downloads a CP/M program loaded into memory at address 0x0100 (0100H).
 * 
 * Usage in console:
 *   downloadCpmProgram()                       // Auto-detects via CP/M FCB at 0x005C, saves as "PROGRAM.COM"
 *   downloadCpmProgram("MYPROG.COM")          // Auto-detects via CP/M FCB at 0x005C, saves as "MYPROG.COM"
 *   downloadCpmProgram(0x0380)                // Downloads up to DDT's NEXT address 0x0380 as "PROGRAM.COM"
 *   downloadCpmProgram("MYPROG.COM", 0x0380)  // Downloads up to DDT's NEXT address 0x0380 as "MYPROG.COM"
 */
export function downloadCpmProgram(
   fileNameOrEndAddress?: string | number,
   explicitEndAddress?: number
) {
   let fileName = "PROGRAM.COM";
   let endAddress: number | undefined = undefined;
   const startAddress = 0x0100;

   if (typeof fileNameOrEndAddress === "string") {
      fileName = fileNameOrEndAddress;
      if (typeof explicitEndAddress === "number") {
         endAddress = explicitEndAddress;
      }
   } else if (typeof fileNameOrEndAddress === "number") {
      endAddress = fileNameOrEndAddress;
   }

   // Normalize endAddress if passed as a length (e.g. 640) rather than an address (0x0380)
   if (endAddress !== undefined && endAddress <= startAddress) {
      endAddress = startAddress + endAddress;
   }

   // If endAddress was not provided, auto-detect using CP/M FCB at 0x005C
   if (endAddress === undefined) {
      const ex = mem_read(0x0068); // Extent count (EX)
      const rc = mem_read(0x006B); // Record count in current extent (RC)
      const totalRecords = ex * 128 + rc;

      if (totalRecords > 0 && totalRecords < 512) {
         const fileLength = totalRecords * 128;
         endAddress = startAddress + fileLength;
      } else {
         // Fallback: search for CP/M EOF marker (0x1A / Ctrl-Z) in memory
         for (let addr = startAddress; addr < 0x8000; addr++) {
            if (mem_read(addr) === 0x1A) {
               endAddress = addr + 1;
               break;
            }
         }
      }
   }

   if (!endAddress || endAddress <= startAddress) {
      console.warn(
         `Could not automatically determine program size. Please specify DDT's NEXT address, e.g.: downloadCpmProgram("${fileName}", 0x0380)`
      );
      return;
   }

   const length = endAddress - startAddress;
   const buffer = new Uint8Array(length);
   for (let i = 0; i < length; i++) {
      buffer[i] = mem_read(startAddress + i);
   }

   downloadBytes(fileName, buffer);
   console.log(
      `Downloaded CP/M program "${fileName}" from ${hex(startAddress, 4)}h to ${hex(endAddress, 4)}h (${length} bytes / ${hex(length, 4)}h)`
   );
}

/**
 * Downloads a portion of RAM to a file.
 * 
 * Usage in console:
 *   downloadRam(0x8000, 0x8FFF)              // Downloads 0x8000 to 0x8FFF as "ram.bin"
 *   downloadRam(0x8000, 0x8FFF, "dump.bin")  // Downloads 0x8000 to 0x8FFF as "dump.bin"
 */
export function downloadRam(
   startAddress: number,
   endAddress: number,
   fileName: string = "ram.bin"
) {
   if (startAddress > endAddress) {
      console.error(
         `downloadRam: startAddress (${hex(startAddress, 4)}h) must be <= endAddress (${hex(endAddress, 4)}h)`
      );
      return;
   }

   const length = endAddress - startAddress + 1;
   const buffer = new Uint8Array(length);
   for (let i = 0; i < length; i++) {
      buffer[i] = mem_read(startAddress + i);
   }

   downloadBytes(fileName, buffer);
   console.log(
      `Downloaded RAM "${fileName}" from ${hex(startAddress, 4)}h to ${hex(endAddress, 4)}h (${length} bytes / ${hex(length, 4)}h)`
   );
}

if (typeof window !== "undefined") {
   (window as any).downloadCpmProgram = downloadCpmProgram;
   (window as any).downloadCPM = downloadCpmProgram;
   (window as any).downloadRam = downloadRam;
   (window as any).dumpMem = dumpMem;
}



