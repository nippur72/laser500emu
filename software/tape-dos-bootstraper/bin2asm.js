const fs = require("fs");

const fileName = "VT-DOS.v11.21-05-1986.bin";
const outName = "vtdos.db.asm";

const buffer = fs.readFileSync(fileName);

const bytes = new Uint8Array(buffer);

let out = "; file generated automatically, do not edit\r\n";

bytes.forEach(b=>out+=` defb 0x${b.toString(16)}\r\n`);

fs.writeFileSync(outName,out);

console.log(`file '${outName}' generated`);
