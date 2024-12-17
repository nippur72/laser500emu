const fs = require('fs');

const charset = fs.readFileSync("software/disks/vt-dos-11.nic");

let s = "const disk_image = new Uint8Array([\n   ";

// normal set
charset.forEach((value, i)=> {      
   const cr = (i % 16 == 15) ? '\n   ' : '';
   s += `${hex(value)},${cr}`;   
});

s+="]);";

console.log(s);

function hex(value) {
   return "0x" + (value<=0xF ? "0":"") + value.toString(16);
}
