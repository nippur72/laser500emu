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
