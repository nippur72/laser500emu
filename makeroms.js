const fs = require('fs');

/*
function writeForMame() {
   const mameRom = new Uint8Array(2048);
   charset.forEach((value, i)=> {
      mameRom[i] = value;
      mameRom[i+1024] = 255-value;
   });         
   fs.writeFileSync("mame.rom", mameRom);
   console.log("rom for MAME generated");
}

writeForMame();
process.exit();
*/

function makeCharsetRom() {
   // the ROM starts from 8192, before it's all 0xFF
   const charset = fs.readFileSync("charset.rom").slice(8192);

   let s = "// data from original charset ROM dumped by Tonino Bisazza 02-nov-2018\r\n\r\n"
   
   s += "const charset = new Uint8Array([\n   ";

   charset.forEach((value, i)=> {   
      const comma = (i != charset.length-1) ? ',':'';
      const cr = (i % 16 == 15) ? '\n   ' : '';
      s += `${hex(value)}${comma}${cr}`;   
   });

   s+="]);";

   console.log(s);
}

/*
// old charset version
function makeCharsetRom() {
   let s = "const charset = new Uint8Array([\n   ";

   // normal set
   charset.forEach((value, i)=> {      
      const cr = (i % 16 == 15) ? '\n   ' : '';
      s += `${hex(value)},${cr}`;   
   });

   // reversed set
   charset.forEach((value, i)=> {   
      const comma = (i != charset.length-1) ? ',':'';
      const cr = (i % 16 == 15) ? '\n   ' : '';
      s += `${hex(255-value)}${comma}${cr}`;   
   });

   s+="]);";

   console.log(s);
}
*/

/*
function makeC64CharsetRom() {
   // the ROM starts from 8192, before it's all 0xFF
   const charset = fs.readFileSync("chargen_c64.rom");

   let s = "// C64 Charset ROM \r\n\r\n"
   
   s += "const charset64 = new Uint8Array([\n   ";

   charset.forEach((value, i)=> {   
      const comma = (i != charset.length-1) ? ',':'';
      const cr = (i % 16 == 15) ? '\n   ' : '';
      s += `${hex(value)}${comma}${cr}`;   
   });

   s+="]);";

   console.log(s);
}
*/

function hex(value) {
   return "0x" + (value<=0xF ? "0":"") + value.toString(16);
}

function makeKernalRom() {
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
}

//makeC64CharsetRom();

makeCharsetRom();
makeKernalRom();

