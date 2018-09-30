const fs = require('fs');

const charset = fs.readFileSync("charset.rom");

let s = "const charset = new Uint8Array([\n   ";

charset.forEach( (v, i)=> {
   const value = i<1024 ? charset[i] : 255-charset[i-1024]; // automatically makes reverse fonts
   const comma = (i != charset.length-1) ? ',':'';
   const cr = (i % 16 == 15) ? '\n   ' : '';

   s += `${hex(value)}${comma}${cr}`;   
})

s+="]);";

console.log(s);

function hex(value) {
   return "0x" + (value<=0xF ? "0":"") + value.toString(16);
}

const rom = fs.readFileSync("27-0401-00-00.u6.rom");

s = "\n\n";

rom.forEach( (value, i)=> {
   if(i==0) s+="const rom1 = new Uint8Array([\n   ";
   if(i==16384) s+="const rom2 = new Uint8Array([\n   ";

   const comma = (i == 16383 || i==32767) ? '':',';
   const cr = (i % 16 == 15) ? '\n   ' : '';

   s += `${hex(value)}${comma}${cr}`;   

   if(i == 16383 || i==32767) s+="]);\n\n";
})

console.log(s);
