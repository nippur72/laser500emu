function dumpMem(start, end, rows) {
   if(rows==undefined) rows=16;
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

function dumpBytes(bytes, start, end, rows) {
   if(rows==undefined) rows=16;
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

function downloadBytes(fileName, buffer) {
   let blob = new Blob([buffer], {type: "application/octet-stream"});
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
}

function hexDump(memory, start, end, rows) {
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

function hex(value, size) {
   if(size === undefined) size = 2;
   let s = "0000" + value.toString(16);
   return s.substr(s.length - size);
}

function hi(word) {
   return (word >> 8) & 0xFF;
}

function lo(word) {
   return word & 0xFF;
}

function bin(value, size) {
   if(size === undefined) size = 8;
   let s = "0000000000000000" + value.toString(2);
   return s.substr(s.length - size);
}

function mem_write_word(address, word) {
   mem_write(address + 0, lo(word));
   mem_write(address + 1, hi(word));
}

function mem_read_word(address) {
   const lo = mem_read(address + 0);
   const hi = mem_read(address + 1);
   return lo+hi*256;
}

function set_bit(value, bitn) {
   return value | (1<<bitn);
}

function reset_bit(value, bitn) {
   return value & ~(1<<bitn);
}

function set(value, bitmask) {
   return value | bitmask;
}

function reset(value, bitmask) {
   return value & (0xFF ^ bitmask);
}

function bit(b,n) {
   return (b & (1<<n))>0 ? 1 : 0;
}

function not_bit(b,n) {
   return (b & (1<<n))>0 ? 0 : 1;
}

function stop() {
   audio.stop();
   stopped = true;
   console.log("emulation stopped");
}

function go() {
   stopped = false;
   oneFrame();
   console.log("emulation resumed");
}

let show_info = false;
function info() {
   show_info = true;
   const average = averageFrameTime;
   console.log(`frame rate: ${Math.round(average*10,2)/10} ms (${Math.round(1000/average)} Hz) CPU load: ${Math.round(averageLoad*10,2)/10}`);
}

function endsWith(s, value) {
   return s.substr(-value.length) === value;
}

function copyArray(source, dest) {
   source.forEach((e,i)=>dest[i] = e);
}

function wait(time) {
   return new Promise((resolve,reject)=>{
      setTimeout(()=>{
         resolve();
      }, time);
   });
}

function getFileExtension(fileName) {
   let s = fileName.toLowerCase().split(".");
   if(s.length == 1) return "";
   return "." + s[s.length-1];
}

function get_wasm_float32_array(ptr, size) {
   let start = ptr / wasm_instance.HEAPF32.BYTES_PER_ELEMENT;
   let buffer = wasm_instance.HEAPF32.subarray(start,start+size);
   return buffer;
}

function get_wasm_uint8_array(ptr, size) {
   let start = ptr / wasm_instance.HEAPU8.BYTES_PER_ELEMENT;
   let buffer = wasm_instance.HEAPU8.subarray(start,start+size);
   return buffer;
}

function stringToUint8(s) {
   let b = [];
   for(let t=0;t<s.length;t++) {
      b.push(s.charCodeAt(t));
   }
   return new Uint8Array(b);
}

function uint8ToString(b) {
   let s = "";
   for(let t=0;t<b.length;t++) {
      s+=String.fromCharCode(b[t]);
   }
   return s;
}
