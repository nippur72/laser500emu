// simplified printer, it prints to console and it is always ready

let printerBuffer = "";
let printerReady = 0x00;

function printerWrite(byte) {
   printerBuffer += String.fromCharCode(byte & 0xFF);
   if(byte == 0x0A) {
      console.log(printerBuffer);
      printerBuffer = "";
   }
}